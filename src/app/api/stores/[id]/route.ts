import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Store } from '@/types';

// 获取门店详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stores = await query<Store>(
      'SELECT * FROM stores WHERE id = ?',
      [id]
    );

    if (stores.length === 0) {
      return NextResponse.json(
        { code: -1, message: '门店不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 0,
      data: stores[0],
    });
  } catch (error) {
    console.error('获取门店详情失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取门店详情失败' },
      { status: 500 }
    );
  }
}

// 更新门店
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      brand_id, name, address, area, lat, lng,
      phone, business_hours, delivery_range, delivery_fee, is_main, is_active
    } = body;

    await query(
      `UPDATE stores SET 
        brand_id = ?, name = ?, address = ?, area = ?, lat = ?, lng = ?,
        phone = ?, business_hours = ?, delivery_range = ?, delivery_fee = ?,
        is_main = ?, is_active = ?
       WHERE id = ?`,
      [brand_id, name, address, area, lat, lng,
       phone, business_hours, delivery_range, delivery_fee,
       is_main ? 1 : 0, is_active ? 1 : 0, id]
    );

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('更新门店失败:', error);
    return NextResponse.json(
      { code: -1, message: '更新门店失败' },
      { status: 500 }
    );
  }
}

// 删除门店
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM stores WHERE id = ?', [id]);

    return NextResponse.json({
      code: 0,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除门店失败:', error);
    return NextResponse.json(
      { code: -1, message: '删除门店失败' },
      { status: 500 }
    );
  }
}
