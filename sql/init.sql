-- ============================================================
-- 糕研所 Cake H5 数据库初始化脚本
-- 字符集: utf8mb4 | 排序规则: utf8mb4_unicode_ci
-- 按照外键依赖顺序排列，可直接执行
-- ============================================================

CREATE DATABASE IF NOT EXISTS `omc-db`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `omc-db`;

-- ============================================================
-- 1. 品牌表
-- ============================================================
CREATE TABLE brands (
    id                  VARCHAR(36) PRIMARY KEY,
    name                VARCHAR(100) NOT NULL COMMENT '品牌名称',
    logo_url            VARCHAR(500) COMMENT '品牌logo',
    slug                VARCHAR(100) UNIQUE COMMENT '英文标识(用于URL)',
    selling_point       VARCHAR(500) COMMENT '一句话卖点',
    description         TEXT COMMENT '品牌卖点描述',
    purchase_channels   JSON COMMENT '购买渠道 ["微信","小程序","美团"]',
    pickup_methods      JSON COMMENT '取货方式 ["到店自提","同城配送"]',
    rush_difficulty     ENUM('秒无','热门','有货') DEFAULT '有货' COMMENT '抢购难度',
    advance_booking_text VARCHAR(100) COMMENT '预订时间文案',
    advance_days        INT COMMENT '建议提前天数',
    release_stock_time  TIME COMMENT '库存释放时间',
    limit_rules         TEXT COMMENT '限购规则',
    purchase_notes      TEXT COMMENT '购买须知',
    other_services      JSON COMMENT '其他服务',
    contact_info        VARCHAR(200) COMMENT '品牌级联系方式',
    is_active           TINYINT(1) DEFAULT 1,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_slug (slug),
    INDEX idx_rush (rush_difficulty)
) COMMENT '品牌表';


-- ============================================================
-- 2. 门店表 (依赖 brands)
-- ============================================================
CREATE TABLE stores (
    id              VARCHAR(36) PRIMARY KEY,
    brand_id        VARCHAR(36) NOT NULL,
    name            VARCHAR(100) COMMENT '门店名称',
    address         VARCHAR(500) NOT NULL COMMENT '门店地址',
    area            VARCHAR(50) COMMENT '所属区域',
    lat             DECIMAL(10,7) COMMENT '纬度',
    lng             DECIMAL(10,7) COMMENT '经度',
    phone           VARCHAR(50) COMMENT '门店电话',
    business_hours  VARCHAR(100) COMMENT '营业时间',
    delivery_range  VARCHAR(100) COMMENT '配送范围',
    delivery_fee    DECIMAL(10,2) COMMENT '配送费',
    is_main         TINYINT(1) DEFAULT 0 COMMENT '是否主门店',
    is_active       TINYINT(1) DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
    INDEX idx_brand (brand_id),
    INDEX idx_area (area)
) COMMENT '门店表';


-- ============================================================
-- 3. 商品表 (依赖 brands)
-- ============================================================
CREATE TABLE products (
    id                  VARCHAR(36) PRIMARY KEY,
    brand_id            VARCHAR(36) NOT NULL,
    title               VARCHAR(200) NOT NULL COMMENT '商品标题',
    category            VARCHAR(50) COMMENT '品类: 蛋糕/千层/慕斯/挞',
    cover_image_url     VARCHAR(500) COMMENT '封面图',
    image_urls          JSON COMMENT '商品图片列表',
    cake_base           VARCHAR(100) COMMENT '蛋糕胚类型',
    ingredient_text     TEXT COMMENT '配料文字描述',
    production_time     VARCHAR(100) COMMENT '出糕时间',
    accessories         JSON COMMENT '配件',
    notes               TEXT COMMENT '注意项',
    heat_score          INT DEFAULT 0 COMMENT '热度分',
    rating              DECIMAL(3,1) COMMENT '综合评分',
    rating_count        INT DEFAULT 0 COMMENT '评价人数',
    wants_count         INT DEFAULT 0 COMMENT '想要人数',
    popularity_tag      VARCHAR(50) COMMENT '人气标签',
    status              ENUM('在架','下架','缺货') DEFAULT '在架',
    is_active           TINYINT(1) DEFAULT 1,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
    INDEX idx_brand (brand_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_rating (rating),
    INDEX idx_heat (heat_score)
) COMMENT '商品表';


-- ============================================================
-- 4. 商品规格表 (依赖 products)
-- ============================================================
CREATE TABLE product_skus (
    id              VARCHAR(36) PRIMARY KEY,
    product_id      VARCHAR(36) NOT NULL,
    size_label      VARCHAR(50) NOT NULL COMMENT '尺寸 如"6寸"',
    size_detail     VARCHAR(50) COMMENT '尺寸+人数 如"6寸（4-6人）"',
    people_range    VARCHAR(30) COMMENT '建议人数',
    price           DECIMAL(10,2) NOT NULL COMMENT '价格',
    status          ENUM('在架','下架','缺货') DEFAULT '在架',
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    UNIQUE KEY uk_product_size (product_id, size_label)
) COMMENT '商品规格表';


-- ============================================================
-- 5. 口味评分表 (依赖 products)
-- ============================================================
CREATE TABLE taste_scores (
    id              VARCHAR(36) PRIMARY KEY,
    product_id      VARCHAR(36) NOT NULL UNIQUE,
    sweetness       DECIMAL(3,1) COMMENT '甜度 0-5',
    sweetness_desc  TEXT,
    sourness        DECIMAL(3,1) COMMENT '酸度 0-5',
    sourness_desc   TEXT,
    bitterness      DECIMAL(3,1) COMMENT '苦度 0-5',
    bitterness_desc TEXT,
    saltiness       DECIMAL(3,1) COMMENT '咸度 0-5',
    saltiness_desc  TEXT,
    umami           DECIMAL(3,1) COMMENT '鲜味 0-5',
    umami_desc      TEXT,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) COMMENT '口味评分表';


-- ============================================================
-- 6. 香气阶段表 (依赖 products)
-- ============================================================
CREATE TABLE aroma_notes (
    id              VARCHAR(36) PRIMARY KEY,
    product_id      VARCHAR(36) NOT NULL,
    stage           ENUM('前调','中调','后调') NOT NULL,
    stage_label     VARCHAR(50) COMMENT '阶段描述',
    summary         VARCHAR(200) COMMENT '文案',
    detail          TEXT COMMENT '说明',
    sort_order      INT DEFAULT 0,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_stage (product_id, stage)
) COMMENT '香气阶段表';


-- ============================================================
-- 7. 风味平衡结论 (依赖 products)
-- ============================================================
CREATE TABLE flavor_conclusions (
    id              VARCHAR(36) PRIMARY KEY,
    product_id      VARCHAR(36) NOT NULL UNIQUE,
    summary         VARCHAR(200) COMMENT '总结',
    content         TEXT COMMENT '详细内容',

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) COMMENT '风味平衡结论';


-- ============================================================
-- 8. 配料层次表 (依赖 products)
-- ============================================================
CREATE TABLE product_layers (
    id              VARCHAR(36) PRIMARY KEY,
    product_id      VARCHAR(36) NOT NULL,
    layer_type      ENUM('顶层','中层','夹层','底层','装饰') NOT NULL,
    layer_name      VARCHAR(100) COMMENT '层次名称',
    ingredients     TEXT COMMENT '配料',
    mouthfeel       TEXT COMMENT '口感描述',
    highlight       TEXT COMMENT '亮点',
    sort_order      INT DEFAULT 0,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_layer (product_id, layer_type)
) COMMENT '配料层次表';


-- ============================================================
-- 9. 商品香气标签 (依赖 products)
-- ============================================================
CREATE TABLE product_aroma_tags (
    id              VARCHAR(36) PRIMARY KEY,
    product_id      VARCHAR(36) NOT NULL,
    tag_name        VARCHAR(50) NOT NULL,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) COMMENT '商品香气标签';


-- ============================================================
-- 10. 口碑聚合表 (依赖 products)
-- ============================================================
CREATE TABLE product_reviews (
    id              VARCHAR(36) PRIMARY KEY,
    product_id      VARCHAR(36) NOT NULL,
    review_type     ENUM('好评','差评') NOT NULL,
    content         TEXT NOT NULL,
    feedback_count  INT DEFAULT 1 COMMENT '反馈人数',
    sort_order      INT DEFAULT 0,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_type (product_id, review_type)
) COMMENT '口碑聚合表';


-- ============================================================
-- 11. 标签主表
-- ============================================================
CREATE TABLE tags (
    id              VARCHAR(36) PRIMARY KEY,
    name            VARCHAR(50) NOT NULL,
    tag_group       ENUM('属性','风味','场景','人群') NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_name_group (name, tag_group)
) COMMENT '标签主表';


-- ============================================================
-- 12. 商品标签关联 (依赖 products, tags)
-- ============================================================
CREATE TABLE product_tags (
    product_id      VARCHAR(36) NOT NULL,
    tag_id          VARCHAR(36) NOT NULL,

    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) COMMENT '商品标签关联';


-- ============================================================
-- 13. 用户表
-- ============================================================
CREATE TABLE users (
    id              VARCHAR(36) PRIMARY KEY,
    openid          VARCHAR(100) UNIQUE COMMENT '微信openid',
    union_id        VARCHAR(100) COMMENT '微信union_id',
    nickname        VARCHAR(100),
    avatar_url      VARCHAR(500),
    phone           VARCHAR(20),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT '用户表';


-- ============================================================
-- 14. 用户想要/收藏 (依赖 users, products)
-- ============================================================
CREATE TABLE user_wants (
    user_id         VARCHAR(36) NOT NULL,
    product_id      VARCHAR(36) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) COMMENT '用户想要/收藏';


-- ============================================================
-- 15. 用户评论 (依赖 users, products)
-- ============================================================
CREATE TABLE user_comments (
    id              VARCHAR(36) PRIMARY KEY,
    user_id         VARCHAR(36) NOT NULL,
    product_id      VARCHAR(36) NOT NULL,
    content         VARCHAR(500) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_time (product_id, created_at DESC)
) COMMENT '用户评论';


-- ============================================================
-- 16. 百科词条
-- ============================================================
CREATE TABLE wiki_entries (
    id              VARCHAR(36) PRIMARY KEY,
    entry_name      VARCHAR(100) NOT NULL COMMENT '词条名称',
    category        ENUM('蛋糕胚','奶油','品类','风味','原料','保存','尺寸','术语'),
    summary         VARCHAR(500) COMMENT '一句话简介',
    content         TEXT COMMENT '详细内容',
    view_count      INT DEFAULT 0,
    favorite_count  INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_name (entry_name),
    INDEX idx_category (category)
) COMMENT '百科词条';
