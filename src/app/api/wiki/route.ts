import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { WikiEntry } from '@/types';

// 获取百科列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const category = searchParams.get('category');
    const keyword = searchParams.get('keyword');
    const offset = (page - 1) * pageSize;

    let where = ['1=1'];
    const params: unknown[] = [];

    if (category) {
      where.push('category = ?');
      params.push(category);
    }

    if (keyword) {
      where.push('(entry_name LIKE ? OR summary LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM wiki_entries WHERE ${where.join(' AND ')}`;
    const [{ total }] = await query<{ total: number }>(countSql, params);

    // 查询列表
    const sql = `SELECT * FROM wiki_entries WHERE ${where.join(' AND ')} ORDER BY entry_name LIMIT ? OFFSET ?`;
    const entries = await query<WikiEntry>(sql, [...params, pageSize, offset]);

    return NextResponse.json({
      code: 0,
      data: {
        list: entries,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取百科列表失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取百科列表失败' },
      { status: 500 }
    );
  }
}

// 创建百科
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { entry_name, category, summary, content } = body;

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO wiki_entries (id, entry_name, category, summary, content)
       VALUES (?, ?, ?, ?, ?)`,
      [id, entry_name, category, summary, content]
    );

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('创建百科失败:', error);
    return NextResponse.json(
      { code: -1, message: '创建百科失败' },
      { status: 500 }
    );
  }
}
