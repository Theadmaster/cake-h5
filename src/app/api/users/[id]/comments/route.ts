import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// 获取用户评论
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await query(
      `SELECT uc.*, p.title as product_title
       FROM user_comments uc
       JOIN products p ON uc.product_id = p.id
       JOIN buyers b ON uc.buyer_id = b.id
       WHERE b.user_id = ?
       ORDER BY uc.created_at DESC`,
      [id]
    );

    return NextResponse.json({
      code: 0,
      data: comments,
    });
  } catch (error) {
    console.error('获取用户评论失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取用户评论失败' },
      { status: 500 }
    );
  }
}
