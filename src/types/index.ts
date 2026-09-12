/* 数据库查询结果类型定义 */

export type TagKind = "good" | "note" | "plain";
export type AromaTone = "green" | "yellow" | "purple";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  selling_point: string | null;
  description: string | null;
  purchase_channels: string[] | null;
  pickup_methods: string[] | null;
  rush_difficulty: '秒无' | '热门' | '有货';
  advance_booking_text: string | null;
  advance_days: number | null;
  release_stock_time: string | null;
  release_stock_day: '周一' | '周二' | '周三' | '周四' | '周五' | '周六' | '周日' | '每天' | '随机' | null;
  limit_rules: string | null;
  purchase_notes: string | null;
  other_services: string[] | null;
  contact_info: string | null;
}

export interface Store {
  id: string;
  brand_id: string;
  name: string | null;
  address: string;
  area: string | null;
  phone: string | null;
  business_hours: string | null;
  delivery_range: string | null;
  delivery_fee: number | null;
  is_main: boolean;
}

export interface Product {
  id: string;
  brand_id: string;
  title: string;
  category: string | null;
  cake_base: string | null;
  ingredient_text: string | null;
  production_time: string | null;
  accessories: string[] | null;
  notes: string | null;
  heat_score: number;
  rating: number | null;
  rating_count: number;
  wants_count: number;
  popularity_tag: string | null;
  status: '在架' | '下架' | '缺货';
}

export interface ProductSku {
  id: string;
  product_id: string;
  size_label: string;
  size_detail: string | null;
  people_range: string | null;
  price: number;
  status: string;
}

export interface TasteScore {
  id: string;
  product_id: string;
  sweetness: number | null;
  sweetness_desc: string | null;
  sourness: number | null;
  sourness_desc: string | null;
  bitterness: number | null;
  bitterness_desc: string | null;
  saltiness: number | null;
  saltiness_desc: string | null;
  umami: number | null;
  umami_desc: string | null;
}

export interface AromaNote {
  id: string;
  product_id: string;
  stage: '前调' | '中调' | '后调';
  stage_label: string | null;
  summary: string | null;
  detail: string | null;
}

export interface FlavorConclusion {
  id: string;
  product_id: string;
  summary: string | null;
  content: string | null;
}

export interface ProductLayer {
  id: string;
  product_id: string;
  layer_type: '顶层' | '中层' | '夹层' | '底层' | '装饰';
  layer_name: string | null;
  ingredients: string | null;
  mouthfeel: string | null;
  highlight: string | null;
}

export interface ProductReview {
  id: string;
  product_id: string;
  review_type: '好评' | '差评';
  content: string;
  feedback_count: number;
}

/* API 响应格式 - 对齐前端 cakes.ts */

export interface CakeListItem {
  id: string;
  name: string;
  brand: string;
  size: string;
  addr: string;
  price: number;
  rating: number;
  reviews: number;
  heatTag: string;
  heatClass: string;
  art: string;
  silhouetteColor: string;
  booking: string;
  bookingGroup: string;
  tags: { label: string; kind: TagKind }[];
  flavors: string[];
}

export interface CakeDetail {
  sizePeople: string;
  addr: string;
  sold: string;
  wants: number;
  profile: string;
  overall: {
    score: number;
    overPercent: number;
    taste: number;
    ingredient: number;
    value: number;
  };
  dims: { name: string; score: number; desc: string }[];
  aroma: { stage: string; timing: string; desc: string; summary: string; tone: AromaTone }[];
  textureLayers: { name: string; taste: string; mouthfeel: string }[];
  purchase: {
    channel: string;
    cycle: string;
    address: string;
    custom: string;
    storage: string;
  };
  ingredients: {
    labels: { label: string; kind: TagKind }[];
    cream: string;
    sugar: string;
    additives: string;
    allergens: string;
    source: string;
  };
  source: string;
  goodReviews: string[];
  badReviews: { text: string; count: number }[];
}

export interface Cake extends CakeListItem {
  status: string;
  detail: CakeDetail;
  skus: { id: string; size: string; sizeDetail: string | null; people: string | null; price: number; status: string }[];
}

export interface User {
  id: string;
  username: string | null;
  password_hash: string | null;
  openid: string;
  union_id: string | null;
  nickname: string | null;
  avatar_url: string | null;
  phone: string | null;
  user_type: 'buyer' | 'seller' | 'operator' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Buyer {
  id: string;
  user_id: string;
  level: number;
  points: number;
  total_orders: number;
  total_spent: number;
  favorite_areas: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Seller {
  id: string;
  user_id: string;
  brand_id: string;
  store_id: string | null;
  position: string | null;
  permissions: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Operator {
  id: string;
  user_id: string;
  real_name: string | null;
  department: string | null;
  role_name: string | null;
  permissions: string[] | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WikiEntry {
  id: string;
  entry_name: string;
  category: '蛋糕胚' | '奶油' | '品类' | '风味' | '原料' | '保存' | '尺寸' | '术语';
  summary: string | null;
  content: string | null;
  view_count: number;
  favorite_count: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  tag_group: '属性' | '风味' | '场景' | '人群';
  created_at: string;
}
