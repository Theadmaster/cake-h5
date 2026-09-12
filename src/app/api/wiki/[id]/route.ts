import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { WikiEntry } from '@/types';

// 获取百科详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entries = await query<WikiEntry>(
      'SELECT * FROM wiki_entries WHERE id = ?',
      [id]
    );

    if (entries.length === 0) {
      return NextResponse.json(
        { code: -1, message: '词条不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 0,
      data: entries[0],
    });
  } catch (error) {
    console.error('获取百科详情失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取百科详情失败' },
      { status: 500 }
    );
  }
}

// 更新百科
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { entry_name, category, summary, content } = body;

    await query(
      `UPDATE wiki_entries SET entry_name = ?, category = ?, summary = ?, content = ? WHERE id = ?`,
      [entry_name, category, summary, content, id]
    );

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('更新百科失败:', error);
    return NextResponse.json(
      { code: -1, message: '更新百科失败' },
      { status: 500 }
    );
  }
}

// 删除百科
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM wiki_entries WHERE id = ?', [id]);

    return NextResponse.json({
      code: 0,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除百科失败:', error);
    return NextResponse.json(
      { code: -1, message: '删除百科失败' },
      { status: 500 }
    );
  }
}
