import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Tag } from '@/types';

// 获取标签列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagGroup = searchParams.get('tag_group');
    const keyword = searchParams.get('keyword');

    let where = ['1=1'];
    const params: unknown[] = [];

    if (tagGroup) {
      where.push('tag_group = ?');
      params.push(tagGroup);
    }

    if (keyword) {
      where.push('name LIKE ?');
      params.push(`%${keyword}%`);
    }

    const sql = `SELECT * FROM tags WHERE ${where.join(' AND ')} ORDER BY tag_group, name`;
    const tags = await query<Tag>(sql, params);

    return NextResponse.json({
      code: 0,
      data: tags,
    });
  } catch (error) {
    console.error('获取标签列表失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取标签列表失败' },
      { status: 500 }
    );
  }
}

// 创建标签
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, tag_group } = body;

    const id = crypto.randomUUID();
    await query(
      'INSERT INTO tags (id, name, tag_group) VALUES (?, ?, ?)',
      [id, name, tag_group]
    );

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('创建标签失败:', error);
    return NextResponse.json(
      { code: -1, message: '创建标签失败' },
      { status: 500 }
    );
  }
}
