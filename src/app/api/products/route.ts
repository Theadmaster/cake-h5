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

    // 分页参数（带边界检查）
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20') || 20));
    const offset = (page - 1) * pageSize;

    // 筛选参数
    const brand = searchParams.get('brand');
    const brandId = searchParams.get('brand_id');
    const size = searchParams.get('size');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'heat';
    const keyword = searchParams.get('keyword');

    // 构建查询条件
    const where: string[] = ['p.is_active = 1'];
    const params: any[] = [];

    // 品牌筛选（支持brand_id或brand名称）
    if (brandId) {
      where.push('p.brand_id = ?');
      params.push(brandId);
    } else if (brand) {
      const brands = brand.split(',').filter(Boolean);
      if (brands.length > 0) {
        where.push(`b.name IN (${brands.map(() => '?').join(',')})`);
        params.push(...brands);
      }
    }

    // 状态筛选
    if (status) {
      where.push('p.status = ?');
      params.push(status);
    }

    if (size) {
      const sizes = size.split(',').filter(Boolean);
      if (sizes.length > 0) {
        where.push(`EXISTS (SELECT 1 FROM product_skus ps WHERE ps.product_id = p.id AND ps.size_label IN (${sizes.map(() => '?').join(',')}))`);
        params.push(...sizes);
      }
    }

    if (keyword) {
      where.push(`(p.title LIKE ? OR b.name LIKE ?)`);
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 排序
    const orderByMap: Record<string, string> = {
      'heat': 'p.heat_score DESC',
      'rating': 'p.rating DESC',
      'price': 'min_price ASC',
      'sales': 'p.heat_score DESC',
    };
    const orderBy = orderByMap[sort] || orderByMap['heat'];

    // 查询总数
    const countSql = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      WHERE ${where.join(' AND ')}
    `;
    const countResult = await query<{ total: number }>(countSql, params);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // 查询商品列表
    const sql = `
      SELECT
        p.id, p.title, b.name as brand_name, b.slug as brand_slug,
        b.rush_difficulty, b.advance_days, b.advance_booking_text,
        p.rating, p.rating_count, p.heat_score, p.popularity_tag,
        p.cake_base, p.notes, p.cover_image_url, p.image_urls,
        MIN(ps.price) as min_price,
        GROUP_CONCAT(DISTINCT ps.size_label) as sizes
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_skus ps ON p.id = ps.product_id AND ps.status != '下架'
      WHERE ${where.join(' AND ')}
      GROUP BY p.id, p.title, b.name, b.slug, b.rush_difficulty, b.advance_days, b.advance_booking_text,
               p.rating, p.rating_count, p.heat_score, p.popularity_tag, p.cake_base, p.notes, p.cover_image_url, p.image_urls
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
      cover_image_url: string | null;
      image_urls: string | null;
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
        price: p.min_price || 0,
        rating: p.rating ? parseFloat(p.rating) : 0,
        reviews: p.rating_count || 0,
        heatTag,
        heatClass: heatTagClassMap[heatTag] || 'bg-muted text-muted-foreground',
        booking: p.advance_booking_text || '随时可订',
        bookingGroup,
        cover_image_url: p.cover_image_url,
        image_urls: Array.isArray(p.image_urls) ? p.image_urls : (p.image_urls ? JSON.parse(p.image_urls) : []),
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
      { code: -1, message: '获取商品列表失败', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// 创建商品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      brand_id, title, category, cake_base, ingredient_text,
      production_time, accessories, notes, heat_score,
      rating, rating_count, wants_count, popularity_tag, status,
      cover_image_url, image_urls, skus
    } = body;

    // 验证必填字段
    if (!brand_id || !title) {
      return NextResponse.json(
        { code: -1, message: '品牌和标题为必填项' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO products (id, brand_id, title, category, cake_base, ingredient_text,
        production_time, accessories, notes, heat_score,
        rating, rating_count, wants_count, popularity_tag, status,
        cover_image_url, image_urls)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, brand_id, title, category ?? null, cake_base ?? null, ingredient_text ?? null,
       production_time ?? null, accessories ? JSON.stringify(accessories) : null, notes ?? null, heat_score ?? 0,
       rating ?? null, rating_count ?? 0, wants_count ?? 0, popularity_tag ?? null, status ?? '在架',
       cover_image_url ?? null, image_urls ? JSON.stringify(image_urls) : null]
    );

    // 创建SKU
    if (skus && Array.isArray(skus)) {
      for (const sku of skus) {
        await query(
          `INSERT INTO product_skus (id, product_id, size_label, size_detail, people_range, price, status, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [sku.id || crypto.randomUUID(), id, sku.size_label ?? sku.size ?? '', sku.size_detail ?? sku.sizeDetail ?? null, 
           sku.people_range ?? sku.people ?? null, sku.price ?? 0, sku.status ?? '在架', sku.sort_order ?? 0]
        );
      }
    }

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('创建商品失败:', error);
    return NextResponse.json(
      { code: -1, message: '创建商品失败', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
