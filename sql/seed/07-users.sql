-- ============================================================
-- 默认管理员账号
-- ============================================================

-- 创建默认管理员用户
INSERT INTO users (id, username, password_hash, nickname, user_type, is_active)
VALUES (
    'admin-001',
    'admin',
    'admin123',
    '系统管理员',
    'admin',
    1
);

-- 创建默认运营人员
INSERT INTO users (id, username, password_hash, nickname, user_type, is_active)
VALUES (
    'operator-001',
    'tongyt',
    '123456',
    '亦途',
    'operator',
    1
);

INSERT INTO operators (id, user_id, real_name, department, role_name)
VALUES (
    'op-001',
    'operator-001',
    '童亦途',
    '运营部',
    '运营主管'
);
