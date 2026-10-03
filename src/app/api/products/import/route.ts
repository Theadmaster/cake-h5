import { NextRequest, NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';
import { startImportTask } from '@/lib/import-worker';

// 创建商品批量导入任务（POST /api/products/import）
// body: { fileKey: string, fileName?: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fileKey = String(body.fileKey ?? '').trim();
    const fileName = String(body.fileName ?? fileKey).trim();

    if (!fileKey) {
      return NextResponse.json(
        { code: -1, message: '缺少 fileKey' },
        { status: 400 }
      );
    }
    if (!/^import\/[\w\-.]+\.(xlsx|xls)$/.test(fileKey)) {
      return NextResponse.json(
        { code: -1, message: 'fileKey 非法：必须位于 import/ 目录且为 xlsx/xls 文件' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    await execute(
      `INSERT INTO import_tasks (id, type, name, file_key, file_name, status)
       VALUES (?, 'import', ?, ?, ?, '排队中')`,
      [id, `商品导入：${fileName}`, fileKey, fileName]
    );

    // 异步处理：立即返回任务 ID，前端在任务中心轮询进度
    startImportTask(id, fileKey);

    return NextResponse.json({
      code: 0,
      data: { taskId: id, status: '排队中' },
    });
  } catch (error) {
    console.error('创建导入任务失败:', error);
    return NextResponse.json(
      { code: -1, message: '创建导入任务失败' },
      { status: 500 }
    );
  }
}

// 查询导入任务列表（复用任务中心列表，便于商品页跳转）
export async function GET() {
  try {
    const rows = await query(
      'SELECT * FROM import_tasks WHERE type = ? ORDER BY created_at DESC LIMIT 50',
      ['import']
    );
    return NextResponse.json({ code: 0, data: rows });
  } catch (error) {
    console.error('查询导入任务失败:', error);
    return NextResponse.json(
      { code: -1, message: '查询导入任务失败' },
      { status: 500 }
    );
  }
}
