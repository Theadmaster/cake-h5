import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { User, Buyer, Seller, Operator } from '@/types';

// 获取用户详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const users = await query<User>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { code: -1, message: '用户不存在' },
        { status: 404 }
      );
    }

    const user = users[0];
    let businessInfo: Buyer | Seller | Operator | null = null;

    // 根据用户类型查询业务信息
    if (user.user_type === 'buyer') {
      const buyers = await query<Buyer>(
        'SELECT * FROM buyers WHERE user_id = ?',
        [id]
      );
      businessInfo = buyers[0] || null;
    } else if (user.user_type === 'seller') {
      const sellers = await query<Seller>(
        'SELECT * FROM sellers WHERE user_id = ?',
        [id]
      );
      businessInfo = sellers[0] || null;
    } else if (user.user_type === 'operator') {
      const operators = await query<Operator>(
        'SELECT * FROM operators WHERE user_id = ?',
        [id]
      );
      businessInfo = operators[0] || null;
    }

    return NextResponse.json({
      code: 0,
      data: {
        ...user,
        business_info: businessInfo,
      },
    });
  } catch (error) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取用户详情失败' },
      { status: 500 }
    );
  }
}

// 更新用户
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nickname, avatar_url, phone, user_type } = body;

    await query(
      `UPDATE users SET nickname = ?, avatar_url = ?, phone = ?, user_type = ? WHERE id = ?`,
      [nickname, avatar_url, phone, user_type, id]
    );

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json(
      { code: -1, message: '更新用户失败' },
      { status: 500 }
    );
  }
}
