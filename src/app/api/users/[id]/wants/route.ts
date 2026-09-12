import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// 获取用户收藏
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wants = await query(
      `SELECT uw.*, p.title as product_title, p.heat_score, p.rating
       FROM user_wants uw
       JOIN products p ON uw.product_id = p.id
       JOIN buyers b ON uw.buyer_id = b.id
       WHERE b.user_id = ?
       ORDER BY uw.created_at DESC`,
      [id]
    );

    return NextResponse.json({
      code: 0,
      data: wants,
    });
  } catch (error) {
    console.error('获取用户收藏失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取用户收藏失败' },
      { status: 500 }
    );
  }
}
