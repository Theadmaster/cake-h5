/* 商品批量导入模板生成（xlsx）：
 * Sheet1 填写说明  —— 使用规则 + 示例数据
 * Sheet2 导入数据  —— 仅表头，用户从第 2 行开始填写，解析器读取此表
 */
import * as XLSX from 'xlsx';

/* 导入数据表的列定义（表头顺序即解析顺序，请勿调整） */
export const IMPORT_HEADERS = [
  '商品名称*',
  '品牌*',
  '类目*',
  '尺寸规格*',
  '价格(元)*',
  'SKU编码',
  '尺寸说明',
  '建议人数',
  '库存',
  'SKU状态',
  '商品状态',
  '商品说明',
  '封面图URL',
] as const;

/* 字段说明（与 IMPORT_HEADERS 一一对应，用于「填写说明」sheet） */
const FIELD_DOCS: [string, string][] = [
  ['商品名称*', '必填。同一商品的多个 SKU 填写相同的商品名称（商品名称+品牌一致视为同一商品）'],
  ['品牌*', '必填。必须是系统已存在的品牌名称（不区分大小写），如：Sillage、Tinyroll'],
  ['类目*', '必填。如：蛋糕、千层、切块'],
  ['尺寸规格*', '必填。SKU 尺寸标识，如：4寸、5寸、6寸、切块；同一商品内不可重复'],
  ['价格(元)*', '必填。大于 0 的数字，最多两位小数'],
  ['SKU编码', '选填。全局唯一，如 SKU-001；留空则不生成编码'],
  ['尺寸说明', '选填。如：4寸（1-2人）'],
  ['建议人数', '选填。如：1-2人'],
  ['库存', '选填。大于等于 0 的整数，默认 0'],
  ['SKU状态', '选填。在架 / 下架 / 缺货，默认在架'],
  ['商品状态', '选填。在架 / 下架 / 缺货，默认在架；同一商品多行时以第一行为准'],
  ['商品说明', '选填。商品备注说明'],
  ['封面图URL', '选填。完整图片地址 https:// 开头；同一商品多行时以第一行为准'],
];

/* 示例数据（展示在「填写说明」sheet 下方） */
const SAMPLE_ROWS: string[][] = [
  ['提拉米苏千层', 'Sillage', '千层', '6寸', '468', 'SKU-001', '6寸（4-6人）', '4-6人', '20', '在架', '在架', '经典意式提拉米苏', 'https://example.com/tiramisu.jpg'],
  ['提拉米苏千层', 'Sillage', '千层', '8寸', '568', 'SKU-002', '8寸（6-10人）', '6-10人', '10', '在架', '', '', ''],
  ['巴斯克芝士切块', 'POURNIL', '切块', '切块', '68', 'SKU-003', '单块装', '1人', '50', '缺货', '在架', '冷藏口感更佳', ''],
];

export function buildImportWorkbook(): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  /* Sheet1：填写说明（规则文字 + 字段说明表 + 示例数据） */
  const guide: (string | number)[][] = [
    ['商品批量导入模板 · 填写说明'],
    [],
    ['使用步骤'],
    ['1. 切换到「导入数据」sheet，从第 2 行开始逐行填写，每行一个 SKU；'],
    ['2. 同一商品的多个 SKU：商品名称、品牌、类目等商品级字段填写相同值；'],
    ['3. 填写完成后保存为 .xlsx 文件，在管理后台「商品管理 → 批量导入」上传；'],
    ['4. 上传后可在「任务中心」查看解析进度与失败原因。'],
    [],
    ['校验规则'],
    ['· 带 * 的字段为必填；'],
    ['· 品牌必须已存在（名称不区分大小写）；'],
    ['· 价格必须为大于 0 的数字，最多两位小数；'],
    ['· SKU编码全局唯一，不可与系统中已有编码重复；'],
    ['· 同一商品下「尺寸规格」不可重复（文件内或系统中重复均视为冲突）；'],
    ['· 状态字段仅允许：在架 / 下架 / 缺货。'],
    [],
    ['字段说明'],
    ...FIELD_DOCS.map(([f, d]) => [f, d]),
    [],
    ['示例数据（仅供参考，无需复制到导入数据表）'],
    IMPORT_HEADERS as unknown as string[],
    ...SAMPLE_ROWS,
  ];
  const wsGuide = XLSX.utils.aoa_to_sheet(guide);
  wsGuide['!cols'] = [{ wch: 14 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, wsGuide, '填写说明');

  /* Sheet2：导入数据（仅表头） */
  const wsData = XLSX.utils.aoa_to_sheet([IMPORT_HEADERS as unknown as string[]]);
  wsData['!cols'] = IMPORT_HEADERS.map(() => ({ wch: 18 }));
  wsData['!freeze'] = { xSplit: 0, ySplit: 1 };
  XLSX.utils.book_append_sheet(wb, wsData, '导入数据');

  return wb;
}

export function buildImportTemplateBuffer(): Buffer {
  const wb = buildImportWorkbook();
  const out = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  return out;
}
