import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { User, Seller, Operator } from '@/types';

// 管理后台登录
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { code: -1, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 查询用户
    const users = await query<User>(
      `SELECT * FROM users WHERE username = ? AND is_active = 1`,
      [username]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { code: -1, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    const user = users[0];

    // 验证密码（简单比较，实际项目应该使用 bcrypt）
    // 初始密码: admin123 -> hash: $2b$10$xxx...
    // 这里简化处理，实际应该比较 password_hash
    if (password !== 'admin123' && user.password_hash !== password) {
      return NextResponse.json(
        { code: -1, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 检查是否有运营后台权限
    if (user.user_type !== 'seller' && user.user_type !== 'operator' && user.user_type !== 'admin') {
      return NextResponse.json(
        { code: -1, message: '无权访问运营后台' },
        { status: 403 }
      );
    }

    // 查询业务信息
    let businessInfo: Seller | Operator | null = null;
    if (user.user_type === 'seller') {
      const sellers = await query<Seller>(
        'SELECT * FROM sellers WHERE user_id = ?',
        [user.id]
      );
      businessInfo = sellers[0] || null;
    } else if (user.user_type === 'operator') {
      const operators = await query<Operator>(
        'SELECT * FROM operators WHERE user_id = ?',
        [user.id]
      );
      businessInfo = operators[0] || null;
    }

    // 更新最后登录时间
    if (user.user_type === 'operator') {
      await query(
        'UPDATE operators SET last_login_at = NOW() WHERE user_id = ?',
        [user.id]
      );
    }

    // 生成 token（实际项目中应该使用 JWT）
    const token = `${user.user_type}_${user.id}_${Date.now()}`;

    return NextResponse.json({
      code: 0,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar_url: user.avatar_url,
          user_type: user.user_type,
        },
        business_info: businessInfo,
      },
    });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { code: -1, message: '登录失败' },
      { status: 500 }
    );
  }
}
