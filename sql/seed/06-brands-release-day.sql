-- ============================================================
-- 更新品牌库存释放日期
-- 根据各品牌的 release_stock_time 和运营特点设置
-- ============================================================

USE `omc-db`;
SET NAMES utf8mb4;

-- 每天释放库存（有固定释放时间的品牌）
UPDATE brands SET release_stock_day = '每天' WHERE slug = 'ita-cake';          -- 00:00:00 每日限量
UPDATE brands SET release_stock_day = '每天' WHERE slug = 'wakuwaku';          -- 15:00:00
UPDATE brands SET release_stock_day = '每天' WHERE slug = 'pournil';           -- 10:30:00
UPDATE brands SET release_stock_day = '每天' WHERE slug = 'toris';             -- 00:00:00
UPDATE brands SET release_stock_day = '每天' WHERE slug = 'haku';              -- 11:00:00
UPDATE brands SET release_stock_day = '每天' WHERE slug = 'tangsuo';           -- 10:00:00
UPDATE brands SET release_stock_day = '每天' WHERE slug = 'apple-picker';      -- 11:00:00
UPDATE brands SET release_stock_day = '每天' WHERE slug = 'see-thee';          -- 11:00:00
UPDATE brands SET release_stock_day = '每天' WHERE slug = 'connie-he';         -- 10:00:00

-- 特定日期释放
UPDATE brands SET release_stock_day = '周日' WHERE slug = 'tinyroll';           -- 每周日1点开抢

-- 随机释放
UPDATE brands SET release_stock_day = '随机' WHERE slug = 'hutuan';             -- 无固定时间
UPDATE brands SET release_stock_day = '随机' WHERE slug = 'xiangye';            -- 无固定规律
UPDATE brands SET release_stock_day = '随机' WHERE slug = 'sillage';            -- 无固定规律
