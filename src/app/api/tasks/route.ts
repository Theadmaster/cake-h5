import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// 任务中心：异步任务分页列表（GET /api/tasks?page=&pageSize=&type=&status=）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20') || 20));
    const offset = (page - 1) * pageSize;

    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: string[] = [];
    const params: string[] = [];
    if (type) {
      where.push('type = ?');
      params.push(type);
    }
    if (status) {
      where.push('status = ?');
      params.push(status);
    }
    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const countRows = await query<{ total: number }>(
      `SELECT COUNT(*) as total FROM import_tasks ${whereSql}`,
      params
    );
    const total = countRows.length > 0 ? countRows[0].total : 0;

    // 列表不返回 errors 明细（可能很大），详情接口单独取
    const rows = await query(
      `SELECT id, type, name, file_name, status, total_rows, processed_rows,
              success_rows, fail_rows, new_products, new_skus, message,
              created_at, updated_at
       FROM import_tasks ${whereSql}
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
    console.error('查询任务列表失败:', error);
    return NextResponse.json(
      { code: -1, message: '查询任务列表失败' },
      { status: 500 }
    );
  }
}
