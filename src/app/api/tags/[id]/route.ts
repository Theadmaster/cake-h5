import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Tag } from '@/types';

// 获取标签详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tags = await query<Tag>(
      'SELECT * FROM tags WHERE id = ?',
      [id]
    );

    if (tags.length === 0) {
      return NextResponse.json(
        { code: -1, message: '标签不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 0,
      data: tags[0],
    });
  } catch (error) {
    console.error('获取标签详情失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取标签详情失败' },
      { status: 500 }
    );
  }
}

// 更新标签
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, tag_group } = body;

    await query(
      'UPDATE tags SET name = ?, tag_group = ? WHERE id = ?',
      [name, tag_group, id]
    );

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('更新标签失败:', error);
    return NextResponse.json(
      { code: -1, message: '更新标签失败' },
      { status: 500 }
    );
  }
}

// 删除标签
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM tags WHERE id = ?', [id]);

    return NextResponse.json({
      code: 0,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除标签失败:', error);
    return NextResponse.json(
      { code: -1, message: '删除标签失败' },
      { status: 500 }
    );
  }
}
