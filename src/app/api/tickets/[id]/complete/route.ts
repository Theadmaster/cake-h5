import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';

/* AI 处理结果人工审阅闭环（POST /api/tickets/[id]/complete）
 * 工单处于「待审阅」时由人工确认：
 * - approve：通过 → 已完成
 * - reject：不通过 → 打回「待处理」（附打回说明，可补充技术背景后重新审阅/AI 处理）
 * Body: { action: 'approve' | 'reject', note?, operator? } */
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
    if (ticket.status !== '待审阅') {
      return NextResponse.json(
        { code: -1, message: `当前状态「${ticket.status}」不需要审阅确认` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const action = body.action === 'reject' ? 'reject' : body.action === 'approve' ? 'approve' : null;
    if (!action) {
      return NextResponse.json({ code: -1, message: 'action 必须为 approve 或 reject' }, { status: 400 });
    }
    const operator = body.operator ? String(body.operator).slice(0, 50) : '管理员';
    const note = body.note ? String(body.note).slice(0, 2000) : null;

    if (action === 'approve') {
      await execute(
        `UPDATE tickets SET status = '已完成', finished_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [id]
      );
      await execute(
        `INSERT INTO ticket_events (id, ticket_id, step, title, detail, operator)
         VALUES (?, ?, '完成', '审阅通过，工单完成', ?, ?)`,
        [randomUUID(), id, note, operator]
      );
    } else {
      await execute(`UPDATE tickets SET status = '待处理' WHERE id = ?`, [id]);
      await execute(
        `INSERT INTO ticket_events (id, ticket_id, step, title, detail, operator)
         VALUES (?, ?, '驳回', 'AI 结果审阅未通过，已打回待处理', ?, ?)`,
        [randomUUID(), id, note || '未填写打回说明', operator]
      );
    }

    return NextResponse.json({ code: 0, data: { message: action === 'approve' ? '工单已完成' : '已打回待处理' } });
  } catch (error) {
    console.error('工单审阅确认失败:', error);
    return NextResponse.json({ code: -1, message: '工单审阅确认失败' }, { status: 500 });
  }
}
