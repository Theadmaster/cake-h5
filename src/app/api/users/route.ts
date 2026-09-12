import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { User } from '@/types';

// 获取用户列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword');
    const userType = searchParams.get('user_type');
    const offset = (page - 1) * pageSize;

    let where = ['1=1'];
    const params: unknown[] = [];

    if (keyword) {
      where.push('(u.nickname LIKE ? OR u.phone LIKE ? OR u.username LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (userType) {
      where.push('u.user_type = ?');
      params.push(userType);
    }

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM users u WHERE ${where.join(' AND ')}`;
    const [{ total }] = await query<{ total: number }>(countSql, params);

    // 根据用户类型查询不同的SQL
    let sql = '';
    if (userType === 'operator') {
      // 运营人员：关联operators表
      sql = `
        SELECT u.id, u.username, u.nickname, u.avatar_url, u.phone, u.user_type, u.is_active, u.created_at,
               o.real_name, o.department, o.role_name, o.last_login_at
        FROM users u
        LEFT JOIN operators o ON u.id = o.user_id
        WHERE ${where.join(' AND ')}
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
      `;
    } else if (userType === 'seller') {
      // 卖家：关联sellers和brands表
      sql = `
        SELECT u.id, u.username, u.nickname, u.avatar_url, u.phone, u.user_type, u.is_active, u.created_at,
               s.brand_id, s.position,
               b.name as brand_name
        FROM users u
        LEFT JOIN sellers s ON u.id = s.user_id
        LEFT JOIN brands b ON s.brand_id = b.id
        WHERE ${where.join(' AND ')}
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
      `;
    } else if (userType === 'buyer') {
      // 买家：关联buyers表
      sql = `
        SELECT u.id, u.username, u.nickname, u.avatar_url, u.phone, u.user_type, u.is_active, u.created_at,
               b.level, b.points, b.total_orders, b.total_spent
        FROM users u
        LEFT JOIN buyers b ON u.id = b.user_id
        WHERE ${where.join(' AND ')}
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
      `;
    } else {
      // 默认查询
      sql = `SELECT * FROM users u WHERE ${where.join(' AND ')} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    }

    const users = await query(sql, [...params, pageSize, offset]);

    return NextResponse.json({
      code: 0,
      data: {
        list: users,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取用户列表失败' },
      { status: 500 }
    );
  }
}

// 创建用户
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, nickname, phone, user_type } = body;

    if (!username || !password) {
      return NextResponse.json(
        { code: -1, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    const existing = await query<User>(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { code: -1, message: '用户名已存在' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    
    // 创建用户
    await query(
      `INSERT INTO users (id, username, password_hash, nickname, phone, user_type, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, username, password, nickname || username, phone || null, user_type || 'buyer', 1]
    );

    // 如果是运营，创建运营记录
    if (user_type === 'operator') {
      await query(
        `INSERT INTO operators (id, user_id, real_name, department, role_name)
         VALUES (?, ?, ?, ?, ?)`,
        [crypto.randomUUID(), id, body.real_name || null, body.department || null, body.role_name || null]
      );
    }

    // 如果是卖家，创建卖家记录
    if (user_type === 'seller' && body.brand_id) {
      await query(
        `INSERT INTO sellers (id, user_id, brand_id, position)
         VALUES (?, ?, ?, ?)`,
        [crypto.randomUUID(), id, body.brand_id, body.position || null]
      );
    }

    // 如果是买家，创建买家记录
    if (user_type === 'buyer') {
      await query(
        `INSERT INTO buyers (id, user_id)
         VALUES (?, ?)`,
        [crypto.randomUUID(), id]
      );
    }

    return NextResponse.json({
      code: 0,
      data: { id, username, nickname, user_type },
    });
  } catch (error) {
    console.error('创建用户失败:', error);
    return NextResponse.json(
      { code: -1, message: '创建用户失败' },
      { status: 500 }
    );
  }
}
