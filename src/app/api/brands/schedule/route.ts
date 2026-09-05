import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/* 放号日程：每天放号 + 按周几放号（排除随机） */

interface ScheduleRow {
  release_stock_day: string;
  release_stock_time: string | null;
  brand_name: string;
  brand_slug: string;
}

export type ScheduleItem = { time: string | null; brand: string; slug: string };

const DAY_ORDER: Record<string, number> = {
  '周一': 1, '周二': 2, '周三': 3, '周四': 4,
  '周五': 5, '周六': 6, '周日': 7,
};

export async function GET() {
  try {
    const rows = await query<ScheduleRow>(
      `SELECT release_stock_day, release_stock_time, name AS brand_name, slug AS brand_slug
       FROM brands
       WHERE is_active = 1
         AND release_stock_day IN ('每天','周一','周二','周三','周四','周五','周六','周日')
       ORDER BY FIELD(release_stock_day, '每天','周一','周二','周三','周四','周五','周六','周日'),
                release_stock_time`
    );

    // 分离"每天"和按周几的品牌
    const daily: ScheduleItem[] = [];
    const grouped: Record<string, ScheduleItem[]> = {};

    for (const r of rows) {
      const item: ScheduleItem = {
        time: r.release_stock_time ? r.release_stock_time.slice(0, 5) : null,
        brand: r.brand_name,
        slug: r.brand_slug,
      };
      if (r.release_stock_day === '每天') {
        daily.push(item);
      } else {
        if (!grouped[r.release_stock_day]) grouped[r.release_stock_day] = [];
        grouped[r.release_stock_day].push(item);
      }
    }

    const schedule = Object.entries(grouped)
      .sort(([a], [b]) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99))
      .map(([day, items]) => ({ day, items }));

    return NextResponse.json({ code: 0, data: { daily, schedule } });
  } catch (error) {
    console.error('获取放号日程失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取放号日程失败' },
      { status: 500 }
    );
  }
}
