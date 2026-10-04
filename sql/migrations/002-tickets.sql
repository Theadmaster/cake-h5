-- ============================================================
-- 迁移脚本 002：工单管理模块
-- 1) 新增工单表 tickets（运营反馈页面问题/功能优化需求）
-- 2) 新增工单事件表 ticket_events（操作/AI 处理时间线）
-- 适用：已按 init.sql 初始化过的库；新库直接用最新 init.sql
-- 执行：mysql -h127.0.0.1 -uomc -p -D omc-db < sql/migrations/002-tickets.sql
-- ============================================================

USE `omc-db`;

-- 1. 工单表
CREATE TABLE IF NOT EXISTS tickets (
    id             VARCHAR(36) PRIMARY KEY,
    ticket_no      INT NOT NULL AUTO_INCREMENT UNIQUE COMMENT '工单号（自增展示用）',
    title          VARCHAR(200) NOT NULL COMMENT '工单标题',
    type           ENUM('bug','优化') NOT NULL DEFAULT 'bug' COMMENT '类型：bug-页面问题 / 优化-功能优化需求',
    page_path      VARCHAR(300) COMMENT '相关页面/路由（如 /cake/[id]）',
    description    TEXT NOT NULL COMMENT '问题描述（运营视角原始描述）',
    tech_notes     TEXT COMMENT '二次审阅补充：技术背景说明/改写后的技术性描述',
    priority       ENUM('低','中','高','紧急') NOT NULL DEFAULT '中' COMMENT '优先级',
    status         VARCHAR(20) NOT NULL DEFAULT '待处理' COMMENT '待处理/审阅中/AI处理中/待审阅/已完成/已驳回/处理失败',
    created_by     VARCHAR(50) COMMENT '提交人（运营人员）',
    reviewed_by    VARCHAR(50) COMMENT '二次审阅人',
    ai_summary     VARCHAR(1000) COMMENT 'AI 处理结果摘要',
    ai_result      JSON COMMENT 'AI 处理明细 {steps:[{name,status,detail,durationMs}],commit,branch,deployUrl,simulate}',
    failure_reason VARCHAR(1000) COMMENT 'AI 处理失败原因',
    finished_at    TIMESTAMP NULL COMMENT '完成时间',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_status (status),
    INDEX idx_created (created_at DESC)
) COMMENT '工单表';

-- 2. 工单事件表（时间线）
CREATE TABLE IF NOT EXISTS ticket_events (
    id         VARCHAR(36) PRIMARY KEY,
    ticket_id  VARCHAR(36) NOT NULL COMMENT '关联工单ID',
    seq        BIGINT NOT NULL AUTO_INCREMENT UNIQUE COMMENT '插入序号（时间线稳定排序，created_at 秒级精度不足以区分同秒事件）',
    step       VARCHAR(20) NOT NULL COMMENT '事件类型：创建/审阅/AI处理/步骤/完成/驳回/失败',
    title      VARCHAR(200) NOT NULL COMMENT '事件标题',
    detail     TEXT COMMENT '事件详情',
    operator   VARCHAR(50) NOT NULL DEFAULT '系统' COMMENT '操作人（人名/AI/系统）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    INDEX idx_ticket_time (ticket_id, created_at)
) COMMENT '工单事件表';
