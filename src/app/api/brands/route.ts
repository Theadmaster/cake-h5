import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Brand } from '@/types';

export async function GET() {
  try {
    const brands = await query<Brand>(
      `SELECT id, name, slug, logo_url, selling_point, description,
              purchase_channels, pickup_methods, rush_difficulty,
              advance_booking_text, advance_days, release_stock_time,
              limit_rules, purchase_notes, other_services, contact_info
       FROM brands
       WHERE is_active = 1
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
