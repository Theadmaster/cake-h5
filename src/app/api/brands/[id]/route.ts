import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Brand } from '@/types';

// 获取品牌详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brands = await query<Brand>(
      `SELECT * FROM brands WHERE id = ?`,
      [id]
    );

    if (brands.length === 0) {
      return NextResponse.json(
        { code: -1, message: '品牌不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 0,
      data: brands[0],
    });
  } catch (error) {
    console.error('获取品牌详情失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取品牌详情失败' },
      { status: 500 }
    );
  }
}

// 更新品牌
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name, slug, logo_url, selling_point, description,
      purchase_channels, pickup_methods, rush_difficulty,
      advance_booking_text, advance_days, release_stock_time,
      release_stock_day, limit_rules, purchase_notes, other_services, contact_info, is_active
    } = body;

    // undefined 不能作为 SQL 绑定参数，统一转为 null（表字段均可为 NULL）
    const toNull = (v: unknown) => (v === undefined ? null : v);
    const toJson = (v: unknown) =>
      v === undefined || v === null ? null : JSON.stringify(v);

    // is_active 未传时不改动原值，避免误将品牌下架
    let isActiveValue: number | null = null;
    let needUpdateActive = false;
    if (is_active === undefined) {
      const rows = await query<{ is_active: number }>(
        `SELECT is_active FROM brands WHERE id = ?`,
        [id]
      );
      if (rows.length === 0) {
        return NextResponse.json(
          { code: -1, message: '品牌不存在' },
          { status: 404 }
        );
      }
      isActiveValue = rows[0].is_active;
    } else {
      needUpdateActive = true;
      isActiveValue = is_active ? 1 : 0;
    }

    await query(
      `UPDATE brands SET 
        name = ?, slug = ?, logo_url = ?, selling_point = ?, description = ?,
        purchase_channels = ?, pickup_methods = ?, rush_difficulty = ?,
        advance_booking_text = ?, advance_days = ?, release_stock_time = ?,
        release_stock_day = ?, limit_rules = ?, purchase_notes = ?, 
        other_services = ?, contact_info = ?, is_active = ?
       WHERE id = ?`,
      [toNull(name), toNull(slug), toNull(logo_url), toNull(selling_point), toNull(description),
       toJson(purchase_channels), toJson(pickup_methods), toNull(rush_difficulty),
       toNull(advance_booking_text), toNull(advance_days), toNull(release_stock_time),
       toNull(release_stock_day), toNull(limit_rules), toNull(purchase_notes),
       toJson(other_services), toNull(contact_info), isActiveValue, id]
    );

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('更新品牌失败:', error);
    return NextResponse.json(
      { code: -1, message: '更新品牌失败' },
      { status: 500 }
    );
  }
}

// 删除品牌
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM brands WHERE id = ?', [id]);

    return NextResponse.json({
      code: 0,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除品牌失败:', error);
    return NextResponse.json(
      { code: -1, message: '删除品牌失败' },
      { status: 500 }
    );
  }
}
