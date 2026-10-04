import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';

/* 工单管理：列表（GET /api/tickets?page=&pageSize=&status=&type=&keyword=） */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20') || 20));
    const offset = (page - 1) * pageSize;

    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const keyword = searchParams.get('keyword');

    const where: string[] = [];
    const params: string[] = [];
    if (status) {
      where.push('status = ?');
      params.push(status);
    }
    if (type) {
      where.push('type = ?');
      params.push(type);
    }
    if (keyword) {
      where.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const countRows = await query<{ total: number }>(
      `SELECT COUNT(*) as total FROM tickets ${whereSql}`,
      params
    );
    const total = countRows.length > 0 ? countRows[0].total : 0;

    // 列表不返回 ai_result 明细（较大），详情接口单独取
    const rows = await query(
      `SELECT id, ticket_no, title, type, page_path, description, tech_notes, priority,
              status, created_by, reviewed_by, ai_summary, failure_reason, finished_at,
              created_at, updated_at
       FROM tickets ${whereSql}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    return NextResponse.json({
      code: 0,
      data: {
        list: rows,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('查询工单列表失败:', error);
    return NextResponse.json(
      { code: -1, message: '查询工单列表失败' },
      { status: 500 }
    );
  }
}

/* 工单提交（POST /api/tickets） */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();
    const type = body.type === '优化' ? '优化' : 'bug';
    const priority = ['低', '中', '高', '紧急'].includes(body.priority) ? body.priority : '中';
    const pagePath = body.page_path ? String(body.page_path).trim().slice(0, 300) : null;
    const createdBy = body.created_by ? String(body.created_by).trim().slice(0, 50) : null;

    if (!title || !description) {
      return NextResponse.json(
        { code: -1, message: '标题和问题描述不能为空' },
        { status: 400 }
      );
    }

    const id = randomUUID();
    await execute(
      `INSERT INTO tickets (id, title, type, page_path, description, priority, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, '待处理', ?)`,
      [id, title, type, pagePath, description, priority, createdBy]
    );
    await execute(
      `INSERT INTO ticket_events (id, ticket_id, step, title, detail, operator)
       VALUES (?, ?, '创建', ?, ?, ?)`,
      [
        randomUUID(),
        id,
        '提交工单',
        `类型：${type === 'bug' ? '页面问题' : '功能优化'}；优先级：${priority}${
          pagePath ? `；相关页面：${pagePath}` : ''
        }`,
        createdBy || '运营人员',
      ]
    );

    const rows = await query('SELECT * FROM tickets WHERE id = ?', [id]);
    return NextResponse.json({ code: 0, data: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('创建工单失败:', error);
    return NextResponse.json({ code: -1, message: '创建工单失败' }, { status: 500 });
  }
}
