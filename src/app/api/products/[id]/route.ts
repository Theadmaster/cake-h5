import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type {
  Product,
  ProductSku,
  TasteScore,
  AromaNote,
  FlavorConclusion,
  ProductLayer,
  ProductReview,
  Brand,
  Store,
  CakeDetail,
  AromaTone,
  TagKind,
} from '@/types';

// 热度标签样式映射
const heatTagClassMap: Record<string, string> = {
  '糕圈纯元': 'bg-[#4a3320] text-white',
  '双高爆款': 'bg-rose text-white',
  '小众之选': 'bg-matcha text-white',
  '新品观察': 'bg-accent text-white',
  '冷门好物': 'bg-muted text-muted-foreground',
};

// 热度等级映射到百分比
const heatPercentMap: Record<string, number> = {
  '糕圈纯元': 98,
  '双高爆款': 85,
  '小众之选': 55,
  '新品观察': 35,
  '冷门好物': 15,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 查询商品基本信息
    const products = await query(
      `SELECT p.*, b.name as brand_name, b.slug as brand_slug,
              b.purchase_channels, b.pickup_methods, b.advance_booking_text,
              b.advance_days, b.rush_difficulty, b.purchase_notes, b.limit_rules,
              b.selling_point
       FROM products p
       JOIN brands b ON p.brand_id = b.id
       WHERE p.id = ?`,
      [id]
    ) as any[];

    if (products.length === 0) {
      return NextResponse.json(
        { code: -1, message: '商品不存在' },
        { status: 404 }
      );
    }

    const product = products[0];

    // 并行查询关联数据
    const [skus, tasteScores, aromaNotes, flavorConclusions, layers, reviews, stores] = await Promise.all([
      query('SELECT * FROM product_skus WHERE product_id = ? ORDER BY price', [id]) as Promise<ProductSku[]>,
      query('SELECT * FROM taste_scores WHERE product_id = ?', [id]) as Promise<TasteScore[]>,
      query('SELECT * FROM aroma_notes WHERE product_id = ? ORDER BY stage', [id]) as Promise<AromaNote[]>,
      query('SELECT * FROM flavor_conclusions WHERE product_id = ?', [id]) as Promise<FlavorConclusion[]>,
      query('SELECT * FROM product_layers WHERE product_id = ? ORDER BY layer_type', [id]) as Promise<ProductLayer[]>,
      query('SELECT * FROM product_reviews WHERE product_id = ?', [id]) as Promise<ProductReview[]>,
      query('SELECT address FROM stores WHERE brand_id = ? LIMIT 1', [product.brand_id]) as Promise<Store[]>,
    ]);

    // 构建口味维度
    const dims: { name: string; score: number; desc: string }[] = [];
    if (tasteScores.length > 0) {
      const ts = tasteScores[0];
      if (ts.sweetness !== null) dims.push({ name: '甜度', score: parseFloat(String(ts.sweetness)) || 0, desc: ts.sweetness_desc || '' });
      if (ts.sourness !== null) dims.push({ name: '酸度', score: parseFloat(String(ts.sourness)) || 0, desc: ts.sourness_desc || '' });
      if (ts.bitterness !== null) dims.push({ name: '苦度', score: parseFloat(String(ts.bitterness)) || 0, desc: ts.bitterness_desc || '' });
      if (ts.saltiness !== null) dims.push({ name: '咸度', score: parseFloat(String(ts.saltiness)) || 0, desc: ts.saltiness_desc || '' });
      if (ts.umami !== null) dims.push({ name: '鲜味', score: parseFloat(String(ts.umami)) || 0, desc: ts.umami_desc || '' });
    }

    // 构建香气数据
    const aromaToneMap: Record<string, AromaTone> = {
      '前调': 'green',
      '中调': 'yellow',
      '后调': 'purple',
    };

    const aroma = aromaNotes.map(a => ({
      stage: a.stage,
      timing: a.stage_label || a.stage,
      desc: a.detail || '',
      summary: a.summary || '',
      tone: aromaToneMap[a.stage] || 'green',
    }));

    // 构建口感层次
    const textureLayers = layers.map(l => ({
      name: l.layer_name || l.layer_type,
      taste: l.ingredients || '',
      mouthfeel: l.mouthfeel || '',
    }));

    // 分离好评差评
    const goodReviews = reviews.filter(r => r.review_type === '好评').map(r => r.content);
    const badReviews = reviews.filter(r => r.review_type === '差评').map(r => ({
      text: r.content,
      count: r.feedback_count,
    }));

    // 构建 tags
    const tags: { label: string; kind: TagKind }[] = [];
    if (product.cake_base) {
      tags.push({ label: product.cake_base, kind: 'good' });
    }
    if (product.notes) {
      tags.push({ label: product.notes, kind: 'note' });
    }

    // 构建详情
    const heatTag = product.popularity_tag || '冷门好物';
    const overPercent = heatPercentMap[heatTag] || 50;
    const addr = stores.length > 0 ? stores[0].address : '';

    const detail: CakeDetail = {
      sizePeople: skus.length > 0 ? skus[0].size_detail || skus[0].size_label : '',
      addr,
      sold: product.heat_score > 80 ? '已售 1k+' : product.heat_score > 50 ? '已售 500+' : '已售 100+',
      wants: product.wants_count || 0,
      profile: flavorConclusions.length > 0 ? flavorConclusions[0].content || '' : '',
      overall: {
        score: parseFloat(product.rating) || 0,
        overPercent,
        taste: dims.length > 0 ? dims[0].score : 0,
        ingredient: dims.length > 1 ? dims[1].score : 0,
        value: product.rating ? parseFloat(product.rating) * 0.95 : 0,
      },
      dims,
      aroma,
      textureLayers,
      purchase: {
        channel: (() => {
          try {
            return product.purchase_channels ? JSON.parse(product.purchase_channels).join(' / ') : '';
          } catch {
            return product.purchase_channels || '';
          }
        })(),
        cycle: product.advance_booking_text || '随时可订',
        address: addr,
        custom: product.limit_rules || '无',
        storage: product.notes || '冷藏保存',
      },
      ingredients: {
        labels: tags,
        cream: product.cake_base || '未知',
        sugar: '待确认',
        additives: '无',
        allergens: '待确认',
        source: '待确认',
      },
      source: product.selling_point || '',
      goodReviews,
      badReviews,
    };

    return NextResponse.json({
      code: 0,
      data: {
        id: product.id,
        name: product.title,
        brand: product.brand_name,
        size: skus.length > 0 ? skus[0].size_label : '',
        addr,
        price: skus.length > 0 ? parseFloat(String(skus[0].price)) : 0,
        status: product.status,
        rating: parseFloat(product.rating) || 0,
        reviews: product.rating_count || 0,
        heatTag,
        heatClass: heatTagClassMap[heatTag] || 'bg-muted text-muted-foreground',
        art: 'bg-gradient-to-br from-[#f6e4e1] to-[#e5beb8]',
        silhouetteColor: 'text-[#c48f8a]',
        booking: product.advance_booking_text || '随时可订',
        bookingGroup: product.rush_difficulty === '秒无' ? '预约制/抢购' : `提前${product.advance_days || 1}天`,
        tags,
        flavors: [],
        detail,
        skus: skus.map(s => ({
          id: s.id,
          size: s.size_label,
          sizeDetail: s.size_detail,
          people: s.people_range,
          price: parseFloat(String(s.price)) || 0,
          status: s.status,
        })),
      },
    });
  } catch (error) {
    console.error('获取商品详情失败:', error);
    return NextResponse.json(
      { code: -1, message: '获取商品详情失败' },
      { status: 500 }
    );
  }
}

// 更新商品
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      brand_id, title, category, cake_base, ingredient_text,
      production_time, accessories, notes, heat_score,
      rating, rating_count, wants_count, popularity_tag, status
    } = body;

    await query(
      `UPDATE products SET 
        brand_id = ?, title = ?, category = ?, cake_base = ?, ingredient_text = ?,
        production_time = ?, accessories = ?, notes = ?, heat_score = ?,
        rating = ?, rating_count = ?, wants_count = ?, popularity_tag = ?, status = ?
       WHERE id = ?`,
      [brand_id, title, category, cake_base, ingredient_text,
       production_time, JSON.stringify(accessories), notes, heat_score,
       rating, rating_count, wants_count, popularity_tag, status, id]
    );

    return NextResponse.json({
      code: 0,
      data: { id, ...body },
    });
  } catch (error) {
    console.error('更新商品失败:', error);
    return NextResponse.json(
      { code: -1, message: '更新商品失败' },
      { status: 500 }
    );
  }
}

// 删除商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({
      code: 0,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除商品失败:', error);
    return NextResponse.json(
      { code: -1, message: '删除商品失败' },
      { status: 500 }
    );
  }
}
