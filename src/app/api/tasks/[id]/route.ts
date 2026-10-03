import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// 任务中心：任务详情（含错误明细）（GET /api/tasks/[id]）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM import_tasks WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json(
        { code: -1, message: '任务不存在' },
        { status: 404 }
      );
    }

    const task = rows[0] as Record<string, unknown>;
    // errors 存储为 JSON 字符串，统一解析后返回
    let errors: unknown = [];
    if (task.errors) {
      try {
        errors = typeof task.errors === 'string' ? JSON.parse(task.errors) : task.errors;
      } catch {
        errors = [];
      }
    }

    return NextResponse.json({
      code: 0,
      data: { ...task, errors },
    });
  } catch (error) {
    console.error('查询任务详情失败:', error);
    return NextResponse.json(
      { code: -1, message: '查询任务详情失败' },
      { status: 500 }
    );
  }
}
