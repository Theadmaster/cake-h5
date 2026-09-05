import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

export default pool;

/**
 * 执行SQL查询
 * @example
 * const [rows] = await query('SELECT * FROM brands WHERE id = ?', [brandId]);
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

/**
 * 执行单条INSERT/UPDATE/DELETE
 * @example
 * const result = await execute('INSERT INTO brands (id, name) VALUES (?, ?)', [uuid, name]);
 */
export async function execute(sql: string, params?: any[]) {
  const [result] = await pool.execute(sql, params);
  return result;
}
