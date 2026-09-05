import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// 热度标签样式映射
const heatTagClassMap: Record<string, string> = {
  '糕圈纯元': 'bg-[#4a3320] text-white',
  '双高爆款': 'bg-rose text-white',
  '小众之选': 'bg-matcha text-white',
  '新品观察': 'bg-accent text-white',
  '冷门好物': 'bg-muted text-muted-foreground',
};

// 预订分组映射
function getBookingGroup(days: number | null, rush: string): string {
  if (rush === '秒无') return '预约制/抢购';
  if (!days) return '当日可取';
  if (days <= 1) return '提前1天';
  if (days <= 2) return '提前2天';
  return '提前3天以上';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 分页参数
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const offset = (page - 1) * pageSize;

    // 筛选参数
    const brand = searchParams.get('brand');
    const size = searchParams.get('size');
    const booking = searchParams.get('booking');
    const flavor = searchParams.get('flavor');
    const sort = searchParams.get('sort') || 'heat'; // heat | rating | price | sales
    const keyword = searchParams.get('keyword');

    // 构建查询
    let where = ['p.is_active = 1'];
    let params: any[] = [];

    if (brand) {
      const brands = brand.split(',');
      where.push(`b.name IN (${brands.map(() => '?').join(',')})`);
      params.push(...brands);
    }

    if (size) {
      const sizes = size.split(',');
      where.push(`EXISTS (SELECT 1 FROM product_skus ps WHERE ps.product_id = p.id AND ps.size_label IN (${sizes.map(() => '?').join(',')}))`);
      params.push(...sizes);
    }

    if (keyword) {
      where.push(`(p.title LIKE ? OR b.name LIKE ?)`);
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 排序
    let orderBy = 'p.heat_score DESC';
    switch (sort) {
      case 'rating':
        orderBy = 'p.rating DESC';
        break;
      case 'price':
        orderBy = 'min_price ASC';
        break;
      case 'sales':
        orderBy = 'p.heat_score DESC'; // 暂用热度代替
        break;
    }

    // 查询总数
    const countSql = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      WHERE ${where.join(' AND ')}
    `;
    const [{ total }] = await query<{ total: number }>(countSql, params);

    // 查询商品列表
    const sql = `
      SELECT
        p.id, p.title, b.name as brand_name, b.slug as brand_slug,
        b.rush_difficulty, b.advance_days, b.advance_booking_text,
        p.rating, p.rating_count, p.heat_score, p.popularity_tag,
        p.cake_base, p.notes,
        MIN(ps.price) as min_price,
        GROUP_CONCAT(DISTINCT ps.size_label) as sizes
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_skus ps ON p.id = ps.product_id AND ps.status != '下架'
      WHERE ${where.join(' AND ')}
      GROUP BY p.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    interface ProductRow {
      id: string;
      title: string;
      brand_name: string;
      brand_slug: string;
      rush_difficulty: string;
      advance_days: number | null;
      advance_booking_text: string | null;
      rating: string | null;
      rating_count: number;
      heat_score: number;
      popularity_tag: string | null;
      cake_base: string | null;
      notes: string | null;
      min_price: number;
      sizes: string | null;
    }

    const products = await query<ProductRow>(sql, [...params, pageSize, offset]);

    // 转换为前端格式
    const list = products.map(p => {
      const heatTag = p.popularity_tag || '冷门好物';
      const bookingGroup = getBookingGroup(p.advance_days, p.rush_difficulty);
      const sizes = p.sizes ? p.sizes.split(',') : [];
      const size = sizes[0] || '';

      return {
        id: p.id,
        name: p.title,
        brand: p.brand_name,
        size,
        addr: '', // 需要从门店查询
        price: p.min_price || 0,
        rating: p.rating ? parseFloat(p.rating) : 0,
        reviews: p.rating_count || 0,
        heatTag,
        heatClass: heatTagClassMap[heatTag] || 'bg-muted text-muted-foreground',
        art: 'bg-gradient-to-br from-[#f6e4e1] to-[#e5beb8]', // 默认渐变
        silhouetteColor: 'text-[#c48f8a]',
        booking: p.advance_booking_text || '随时可订',
        bookingGroup,
        tags: [],
        flavors: [],
      };
    });

    return NextResponse.json({
      code: 0,
      data: {
        list,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取商品列表失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取商品列表失败' },
      { status: 500 }
    );
  }
}
