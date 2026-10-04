import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';
import { enqueueTicketAi } from '@/lib/ticket-ai-worker';

/* 二次审阅（POST /api/tickets/[id]/review）
 * AI 自动处理前的人工把关：可改写问题描述为技术性表述、补充项目技术侧背景，
 * 提交后立即进入 AI 自动处理队列（修改代码 → 测试 → 提交 → 部署）。
 * Body: { description?, tech_notes?, reviewed_by? } */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await query('SELECT id, status FROM tickets WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ code: -1, message: '工单不存在' }, { status: 404 });
    }
    const ticket = rows[0] as { id: string; status: string };
    if (!['待处理', '审阅中', '处理失败', '已驳回'].includes(ticket.status)) {
      return NextResponse.json(
        { code: -1, message: `当前状态「${ticket.status}」不允许二次审阅` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const reviewedBy = body.reviewed_by ? String(body.reviewed_by).slice(0, 50) : '管理员';
    const techNotes = body.tech_notes ? String(body.tech_notes).slice(0, 5000) : null;
    const description = body.description ? String(body.description).slice(0, 5000) : null;
    if (!techNotes && !description) {
      return NextResponse.json(
        { code: -1, message: '请至少填写技术背景说明或改写后的问题描述' },
        { status: 400 }
      );
    }

    const updates: string[] = ['tech_notes = ?', 'reviewed_by = ?'];
    const values: unknown[] = [techNotes, reviewedBy];
    if (description) {
      updates.push('description = ?');
      values.push(description);
    }
    await execute(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`, [...values, id]);

    await execute(
      `INSERT INTO ticket_events (id, ticket_id, step, title, detail, operator)
       VALUES (?, ?, '审阅', '二次审阅完成，已转入 AI 处理队列', ?, ?)`,
      [
        randomUUID(),
        id,
        [
          description ? '改写问题描述：已更新' : null,
          techNotes ? `技术背景：\n${techNotes}` : null,
        ]
          .filter(Boolean)
          .join('\n'),
        reviewedBy,
      ]
    );

    /* 进入 AI 自动处理队列（异步执行，接口立即返回） */
    enqueueTicketAi(id);

    return NextResponse.json({ code: 0, data: { message: '审阅完成，AI 处理已启动' } });
  } catch (error) {
    console.error('工单二次审阅失败:', error);
    return NextResponse.json({ code: -1, message: '工单二次审阅失败' }, { status: 500 });
  }
}
