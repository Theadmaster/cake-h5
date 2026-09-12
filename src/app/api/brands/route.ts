import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Brand } from '@/types';

// 获取品牌列表
export async function GET() {
  try {
    const brands = await query<Brand>(
      `SELECT id, name, slug, logo_url, selling_point, description,
              purchase_channels, pickup_methods, rush_difficulty,
              advance_booking_text, advance_days, release_stock_time,
              release_stock_day, limit_rules, purchase_notes, other_services, contact_info,
              is_active, created_at, updated_at
       FROM brands
       ORDER BY name`
    );

    return NextResponse.json({
      code: 0,
      data: brands,
    });
  } catch (error) {
    console.error('获取品牌列表失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取品牌列表失败' },
      { status: 500 }
    );
  }
}

// 创建品牌
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, slug, logo_url, selling_point, description,
      purchase_channels, pickup_methods, rush_difficulty,
      advance_booking_text, advance_days, release_stock_time,
      release_stock_day, limit_rules, purchase_notes, other_services, contact_info
    } = body;

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO brands (id, name, slug, logo_url, selling_point, description,
        purchase_channels, pickup_methods, rush_difficulty,
        advance_booking_text, advance_days, release_stock_time,
        release_stock_day, limit_rules, purchase_notes, other_services, contact_info)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, slug, logo_url || null, selling_point || null, description || null,
       purchase_channels ? JSON.stringify(purchase_channels) : null,
       pickup_methods ? JSON.stringify(pickup_methods) : null,
       rush_difficulty || null,
       advance_booking_text || null, advance_days || null, release_stock_time || null,
       release_stock_day || null, limit_rules || null, purchase_notes || null,
       other_services ? JSON.stringify(other_services) : null,
       contact_info || null]
    );

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('创建品牌失败:', error);
    return NextResponse.json(
      { code: -1, message: '创建品牌失败' },
      { status: 500 }
    );
  }
}
