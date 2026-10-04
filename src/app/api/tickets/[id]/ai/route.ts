import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';
import { enqueueTicketAi } from '@/lib/ticket-ai-worker';

/* 启动 AI 自动处理（POST /api/tickets/[id]/ai）
 * 跳过二次审阅直接启动（或失败重跑）。仅运营快速反馈场景使用；
 * 常规路径请走 /review（二次审阅后自动启动）。
 * Body: { operator? } */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await query('SELECT id, status, title FROM tickets WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ code: -1, message: '工单不存在' }, { status: 404 });
    }
    const ticket = rows[0] as { id: string; status: string; title: string };
    if (ticket.status === 'AI处理中') {
      return NextResponse.json({ code: -1, message: 'AI 正在处理中' }, { status: 400 });
    }
    if (['待审阅', '已完成'].includes(ticket.status)) {
      return NextResponse.json(
        { code: -1, message: `当前状态「${ticket.status}」无需启动 AI 处理` },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const operator = body?.operator ? String(body.operator).slice(0, 50) : '管理员';

    await execute(
      `INSERT INTO ticket_events (id, ticket_id, step, title, detail, operator)
       VALUES (?, ?, 'AI处理', '已启动 AI 自动处理', NULL, ?)`,
      [randomUUID(), id, operator]
    );

    /* 异步执行，接口立即返回；进度见详情时间线 */
    enqueueTicketAi(id);

    return NextResponse.json({ code: 0, data: { message: 'AI 处理已启动' } });
  } catch (error) {
    console.error('启动工单 AI 处理失败:', error);
    return NextResponse.json({ code: -1, message: '启动工单 AI 处理失败' }, { status: 500 });
  }
}
