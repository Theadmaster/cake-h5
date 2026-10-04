import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';

/* 工单状态流转规则：
 * - 人工可设置：待处理 / 审阅中 / 已完成 / 已驳回 / 处理失败→待处理（重开）
 * - AI处理中 / 待审阅 由 AI worker 控制，人工只能通过专用接口触发
 */
const MANUAL_STATUSES = new Set(['待处理', '审阅中', '已完成', '已驳回']);

/* 工单详情（GET /api/tickets/[id]，含事件时间线） */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM tickets WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ code: -1, message: '工单不存在' }, { status: 404 });
    }

    const ticket = rows[0] as Record<string, unknown>;
    // ai_result 存储为 JSON 字符串，统一解析后返回
    let aiResult: unknown = null;
    if (ticket.ai_result) {
      try {
        aiResult =
          typeof ticket.ai_result === 'string' ? JSON.parse(ticket.ai_result) : ticket.ai_result;
      } catch {
        aiResult = null;
      }
    }

    const events = await query(
      `SELECT id, step, title, detail, operator, created_at
       FROM ticket_events WHERE ticket_id = ?
       ORDER BY seq ASC`,
      [id]
    );

    return NextResponse.json({
      code: 0,
      data: { ...ticket, ai_result: aiResult, events },
    });
  } catch (error) {
    console.error('查询工单详情失败:', error);
    return NextResponse.json({ code: -1, message: '查询工单详情失败' }, { status: 500 });
  }
}

/* 工单更新（PATCH /api/tickets/[id]）
 * 支持字段编辑（title/description/priority/page_path）与人工状态流转（status） */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await query('SELECT id, status FROM tickets WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ code: -1, message: '工单不存在' }, { status: 404 });
    }
    const current = rows[0] as { id: string; status: string };

    const body = await request.json();
    const operator = body.operator ? String(body.operator).slice(0, 50) : '管理员';
    const updates: string[] = [];
    const values: unknown[] = [];
    const eventTitles: string[] = [];

    /* 字段编辑 */
    for (const field of ['title', 'description', 'page_path'] as const) {
      if (body[field] !== undefined) {
        const v = String(body[field]).trim();
        if (!v && field !== 'page_path') {
          return NextResponse.json({ code: -1, message: `${field} 不能为空` }, { status: 400 });
        }
        updates.push(`${field} = ?`);
        values.push(v || null);
      }
    }
    if (body.priority !== undefined) {
      if (!['低', '中', '高', '紧急'].includes(body.priority)) {
        return NextResponse.json({ code: -1, message: '无效的优先级' }, { status: 400 });
      }
      updates.push('priority = ?');
      values.push(body.priority);
    }
    if (updates.length > 0) eventTitles.push('更新了工单内容');

    /* 人工状态流转 */
    let statusEvent = '';
    if (body.status !== undefined && body.status !== current.status) {
      const target = String(body.status);
      if (!MANUAL_STATUSES.has(target)) {
        return NextResponse.json(
          { code: -1, message: `不允许手动将状态设置为「${target}」` },
          { status: 400 }
        );
      }
      if (current.status === 'AI处理中') {
        return NextResponse.json(
          { code: -1, message: 'AI 正在处理中，暂不能手动变更状态' },
          { status: 400 }
        );
      }
      updates.push('status = ?');
      values.push(target);
      if (target === '已完成') {
        updates.push('finished_at = CURRENT_TIMESTAMP');
      }
      statusEvent = `状态由「${current.status}」变更为「${target}」`;
    }

    if (updates.length === 0) {
      return NextResponse.json({ code: -1, message: '没有需要更新的内容' }, { status: 400 });
    }

    await execute(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`, [...values, id]);
    await execute(
      `INSERT INTO ticket_events (id, ticket_id, step, title, detail, operator)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(),
        id,
        body.status ? '状态' : '更新',
        statusEvent || '更新了工单内容',
        body.note ? String(body.note).slice(0, 2000) : null,
        operator,
      ]
    );

    const after = await query('SELECT * FROM tickets WHERE id = ?', [id]);
    return NextResponse.json({ code: 0, data: after[0] });
  } catch (error) {
    console.error('更新工单失败:', error);
    return NextResponse.json({ code: -1, message: '更新工单失败' }, { status: 500 });
  }
}
