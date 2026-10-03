import { NextResponse } from 'next/server';
import { buildImportTemplateBuffer } from '@/lib/import-template';

// 商品批量导入模板下载（GET /api/products/import/template）
export async function GET() {
  try {
    const buf = buildImportTemplateBuffer();
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="product-import-template.xlsx"; filename*=UTF-8''${encodeURIComponent('商品批量导入模板.xlsx')}`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('生成导入模板失败:', error);
    return NextResponse.json(
      { code: -1, message: '生成导入模板失败' },
      { status: 500 }
    );
  }
}
