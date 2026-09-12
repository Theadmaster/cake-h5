import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Store } from '@/types';

// 获取门店列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brand_id');

    let sql = 'SELECT * FROM stores WHERE is_active = 1';
    const params: string[] = [];

    if (brandId) {
      sql += ' AND brand_id = ?';
      params.push(brandId);
    }

    sql += ' ORDER BY name';

    const stores = await query<Store>(sql, params);

    return NextResponse.json({
      code: 0,
      data: stores,
    });
  } catch (error) {
    console.error('获取门店列表失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取门店列表失败' },
      { status: 500 }
    );
  }
}

// 创建门店
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      brand_id, name, address, area, lat, lng,
      phone, business_hours, delivery_range, delivery_fee, is_main
    } = body;

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO stores (id, brand_id, name, address, area, lat, lng,
        phone, business_hours, delivery_range, delivery_fee, is_main)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, brand_id, name, address, area, lat || null, lng || null,
       phone, business_hours, delivery_range || null, delivery_fee || null, is_main ? 1 : 0]
    );

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('创建门店失败:', error);
    return NextResponse.json(
      { code: -1, message: '创建门店失败' },
      { status: 500 }
    );
  }
}
