import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// 获取统计数据
export async function GET() {
  try {
    // 并行查询各项统计
    const [
      brandCount,
      productCount,
      storeCount,
      userCount,
      sellerCount,
      buyerCount,
      operatorCount,
    ] = await Promise.all([
      query<{ count: number }>('SELECT COUNT(*) as count FROM brands'),
      query<{ count: number }>('SELECT COUNT(*) as count FROM products'),
      query<{ count: number }>('SELECT COUNT(*) as count FROM stores'),
      query<{ count: number }>('SELECT COUNT(*) as count FROM users'),
      query<{ count: number }>('SELECT COUNT(*) as count FROM sellers'),
      query<{ count: number }>('SELECT COUNT(*) as count FROM buyers'),
      query<{ count: number }>('SELECT COUNT(*) as count FROM operators'),
    ]);

    return NextResponse.json({
      code: 0,
      data: {
        brands: brandCount[0]?.count || 0,
        products: productCount[0]?.count || 0,
        stores: storeCount[0]?.count || 0,
        users: userCount[0]?.count || 0,
        sellers: sellerCount[0]?.count || 0,
        buyers: buyerCount[0]?.count || 0,
        operators: operatorCount[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
