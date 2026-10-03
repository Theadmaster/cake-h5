-- ============================================================
-- 迁移脚本 001：商品批量导入支持
-- 1) product_skus 增加 sku_code（SKU编码，唯一）、stock（库存）
-- 2) 新增异步任务表 import_tasks（任务中心）
-- 适用：已按 init.sql 初始化过的库；新库直接用最新 init.sql
-- 执行：mysql -h127.0.0.1 -u<user> -p -D omc-db < sql/migrations/001-import-tasks.sql
-- ============================================================

USE `omc-db`;

-- 1. SKU 表补充编码与库存（均为可空/带默认值，不影响存量数据与现有接口）
ALTER TABLE product_skus
    ADD COLUMN sku_code VARCHAR(64) NULL COMMENT 'SKU编码（唯一）' AFTER people_range,
    ADD COLUMN stock INT NULL DEFAULT 0 COMMENT '库存' AFTER price,
    ADD UNIQUE KEY uk_sku_code (sku_code);

-- 2. 异步任务表（任务中心：导入/导出等）
CREATE TABLE IF NOT EXISTS import_tasks (
    id             VARCHAR(36) PRIMARY KEY,
    type           VARCHAR(20) NOT NULL DEFAULT 'import' COMMENT '任务类型 import/export',
    name           VARCHAR(200) COMMENT '任务名称',
    file_key       VARCHAR(500) COMMENT '七牛云文件 Key',
    file_name      VARCHAR(255) COMMENT '原始文件名',
    status         VARCHAR(20) NOT NULL DEFAULT '排队中' COMMENT '排队中/处理中/成功/部分成功/失败',
    total_rows     INT DEFAULT 0 COMMENT '总行数',
    processed_rows INT DEFAULT 0 COMMENT '已处理行数',
    success_rows   INT DEFAULT 0 COMMENT '成功行数',
    fail_rows      INT DEFAULT 0 COMMENT '失败行数',
    new_products   INT DEFAULT 0 COMMENT '新增商品数',
    new_skus       INT DEFAULT 0 COMMENT '新增SKU数',
    errors         JSON COMMENT '错误明细 [{row,field,message,raw}]',
    message        VARCHAR(500) COMMENT '结果摘要/失败原因',
    created_by     VARCHAR(36) COMMENT '创建人',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT '异步任务表';
