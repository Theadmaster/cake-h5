/* 商品批量导入异步 worker：
 * 从七牛云拉取 Excel → 解析校验（必填/格式/重复 SKU）→ 分组录入 products + product_skus
 * 任务进度实时写入 import_tasks 表；模块级 Promise 链保证同一时刻只跑一个任务（其余排队）
 */
import { query, execute } from '@/lib/db';
import * as XLSX from 'xlsx';

const QINIU_DOMAIN = 'kodo-omc.etootech.com';

/* 仅允许从导入目录拉取 xlsx，防 SSRF */
function assertSafeFileKey(fileKey: string) {
  if (!/^import\/[\w\-.]+\.(xlsx|xls)$/.test(fileKey)) {
    throw new Error(`非法的文件 Key：${fileKey}`);
  }
}

interface ImportRowError {
  row: number;
  field: string;
  message: string;
  raw: string;
}

interface ParsedSkuRow {
  row: number;
  brand: string;
  title: string;
  category: string;
  sizeLabel: string;
  price: number;
  skuCode: string | null;
  sizeDetail: string | null;
  peopleRange: string | null;
  stock: number;
  skuStatus: string;
  productStatus: string;
  notes: string | null;
  coverImageUrl: string | null;
}

const STATUS_SET = new Set(['在架', '下架', '缺货']);

function normalizeStatus(v: unknown, fallback: string): string | null {
  if (v === null || v === undefined || String(v).trim() === '') return fallback;
  const s = String(v).trim();
  return STATUS_SET.has(s) ? s : null;
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || String(v).trim() === '') return null;
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
}

/* 简单串行队列：多个导入任务依次执行 */
let queue: Promise<void> = Promise.resolve();

function enqueue(taskId: string, fileKey: string) {
  queue = queue
    .then(() => runImportTask(taskId, fileKey))
    .catch((e) => console.error(`导入任务 ${taskId} 异常:`, e));
}

async function updateTask(id: string, fields: Record<string, unknown>) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return;
  const setSql = keys.map((k) => `${k} = ?`).join(', ');
  await execute(`UPDATE import_tasks SET ${setSql} WHERE id = ?`, [
    ...keys.map((k) => fields[k]),
    id,
  ]);
}

async function runImportTask(taskId: string, fileKey: string) {
  const errors: ImportRowError[] = [];
  let rows: ParsedSkuRow[] = [];

  try {
    await updateTask(taskId, { status: '处理中' });

    /* 1. 从七牛云拉取文件 */
    assertSafeFileKey(fileKey);
    const url = `https://${QINIU_DOMAIN}/${fileKey}`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!resp.ok) {
      throw new Error(`从七牛云拉取文件失败：HTTP ${resp.status}`);
    }
    const buf = Buffer.from(await resp.arrayBuffer());

    /* 2. 解析 Excel */
    const wb = XLSX.read(buf, { type: 'buffer' });
    const sheetName =
      wb.SheetNames.find((n) => n.trim() === '导入数据') || wb.SheetNames[0];
    if (!sheetName) throw new Error('导入文件中没有任何工作表');
    const sheet = wb.Sheets[sheetName];
    const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });
    if (matrix.length < 2) {
      throw new Error('导入数据表为空：请从第 2 行开始填写数据');
    }
    const headers = (matrix[0] as unknown[]).map((h) => String(h).trim());

    /* 3. 逐行初校验并结构化 */
    const HEADER_MAP: Record<string, string> = {
      '商品名称*': 'title',
      '品牌*': 'brand',
      '类目*': 'category',
      '尺寸规格*': 'sizeLabel',
      '价格(元)*': 'price',
      SKU编码: 'skuCode',
      尺寸说明: 'sizeDetail',
      建议人数: 'peopleRange',
      库存: 'stock',
      SKU状态: 'skuStatus',
      商品状态: 'productStatus',
      商品说明: 'notes',
      封面图URL: 'coverImageUrl',
    };
    const missingCols = Object.keys(HEADER_MAP).filter((h) => !headers.includes(h));
    if (missingCols.length > 0) {
      throw new Error(`表头不匹配，缺少列：${missingCols.join('、')}。请使用最新导入模板`);
    }

    const rawRows: { row: number; cells: Record<string, string> }[] = [];
    for (let i = 1; i < matrix.length; i++) {
      const arr = matrix[i];
      if (!arr || arr.every((c) => String(c).trim() === '')) continue;
      const cells: Record<string, string> = {};
      headers.forEach((h, idx) => {
        cells[h] = String(arr[idx] ?? '').trim();
      });
      rawRows.push({ row: i + 1, cells });
    }

    await updateTask(taskId, { total_rows: rawRows.length });
    if (rawRows.length === 0) {
      await updateTask(taskId, {
        status: '失败',
        message: '没有可导入的数据行',
      });
      return;
    }

    /* 行级校验 */
    const inFileSkuSeen = new Map<string, number>(); // brand|title|sizeLabel -> row
    const inFileCodeSeen = new Map<string, number>();
    const titleStatus = new Map<string, string>();

    for (const { row, cells } of rawRows) {
      const title = cells['商品名称*'];
      const brand = cells['品牌*'];
      const category = cells['类目*'];
      const sizeLabel = cells['尺寸规格*'];
      const priceNum = num(cells['价格(元)*']);

      if (!title) errors.push({ row, field: '商品名称', message: '必填项缺失', raw: title });
      if (!brand) errors.push({ row, field: '品牌', message: '必填项缺失', raw: brand });
      if (!category) errors.push({ row, field: '类目', message: '必填项缺失', raw: category });
      if (!sizeLabel)
        errors.push({ row, field: '尺寸规格', message: '必填项缺失', raw: sizeLabel });
      if (priceNum === null)
        errors.push({ row, field: '价格', message: '必须为数字', raw: cells['价格(元)*'] });
      else if (priceNum <= 0)
        errors.push({ row, field: '价格', message: '必须大于 0', raw: cells['价格(元)*'] });
      else if (Math.round(priceNum * 100) !== priceNum * 100)
        errors.push({ row, field: '价格', message: '最多两位小数', raw: cells['价格(元)*'] });

      const skuStatus = normalizeStatus(cells['SKU状态'], '在架');
      if (skuStatus === null)
        errors.push({ row, field: 'SKU状态', message: '仅允许 在架/下架/缺货', raw: cells['SKU状态'] });

      const productStatus = normalizeStatus(cells['商品状态'], '在架');
      if (productStatus === null)
        errors.push({ row, field: '商品状态', message: '仅允许 在架/下架/缺货', raw: cells['商品状态'] });

      const stock = num(cells['库存']);
      if (stock !== null && (stock < 0 || !Number.isInteger(stock)))
        errors.push({ row, field: '库存', message: '必须为不小于 0 的整数', raw: cells['库存'] });

      const cover = cells['封面图URL'];
      if (cover && !/^https?:\/\//.test(cover))
        errors.push({ row, field: '封面图URL', message: '必须以 http(s):// 开头', raw: cover });

      /* 文件内重复检测 */
      if (title && brand && sizeLabel) {
        const key = `${brand}|${title}|${sizeLabel}`;
        if (inFileSkuSeen.has(key)) {
          errors.push({
            row,
            field: '尺寸规格',
            message: `与第 ${inFileSkuSeen.get(key)} 行重复（同商品同尺寸规格）`,
            raw: sizeLabel,
          });
        } else {
          inFileSkuSeen.set(key, row);
        }
      }
      const code = cells['SKU编码'];
      if (code) {
        if (inFileCodeSeen.has(code)) {
          errors.push({
            row,
            field: 'SKU编码',
            message: `与第 ${inFileCodeSeen.get(code)} 行重复`,
            raw: code,
          });
        } else {
          inFileCodeSeen.set(code, row);
        }
      }

      if (!errors.some((e) => e.row === row) && title && brand) {
        const pk = `${brand}|${title}`;
        if (!titleStatus.has(pk) && productStatus) titleStatus.set(pk, productStatus);
      }

      rows.push({
        row,
        brand,
        title,
        category,
        sizeLabel,
        price: priceNum ?? 0,
        skuCode: code || null,
        sizeDetail: cells['尺寸说明'] || null,
        peopleRange: cells['建议人数'] || null,
        stock: stock !== null && stock >= 0 ? Math.floor(stock) : 0,
        skuStatus: skuStatus ?? '在架',
        productStatus: productStatus ?? '在架',
        notes: cells['商品说明'] || null,
        coverImageUrl: cover || null,
      });
    }

    const validRows = rows.filter((r) => !errors.some((e) => e.row === r.row));

    /* 4. 依赖数据预检：品牌存在性（大小写不敏感）、SKU 编码冲突、库内同商品同尺寸冲突 */
    if (validRows.length > 0) {
      const brandRows = await query<{ id: string; name: string }>(
        'SELECT id, name FROM brands'
      );
      /* key 统一小写去空格，兼容 "Sillage" / "sillage" 等填写差异 */
      const brandMap = new Map(
        brandRows.map((b) => [b.name.trim().toLowerCase(), b.id] as const)
      );
      const knownBrands = [...brandMap.keys()];
      for (const r of validRows) {
        if (!brandMap.has(r.brand.trim().toLowerCase())) {
          errors.push({
            row: r.row,
            field: '品牌',
            message: `品牌不存在，请先在品牌管理中创建（现有品牌：${knownBrands.slice(0, 8).join('、')}${knownBrands.length > 8 ? '…' : ''}）`,
            raw: r.brand,
          });
        }
      }

      const codes = validRows.map((r) => r.skuCode).filter((c): c is string => !!c);
      if (codes.length > 0) {
        const dup = await query<{ sku_code: string }>(
          `SELECT sku_code FROM product_skus WHERE sku_code IN (${codes.map(() => '?').join(',')})`,
          codes
        );
        const dupSet = new Set(dup.map((d) => d.sku_code));
        for (const r of validRows) {
          if (r.skuCode && dupSet.has(r.skuCode)) {
            errors.push({
              row: r.row,
              field: 'SKU编码',
              message: '系统中已存在该编码',
              raw: r.skuCode,
            });
          }
        }
      }

      /* 查找已存在的商品（同品牌下标题大小写不敏感） */
      const brandIds = [...new Set(brandMap.values())];
      const existingProducts =
        brandIds.length > 0
          ? await query<{ id: string; title: string; brand_id: string }>(
              `SELECT id, title, brand_id FROM products WHERE brand_id IN (${brandIds
                .map(() => '?')
                .join(',')})`,
              brandIds
            )
          : [];
      /* key: brand_id|lower(title) → id */
      const existProductMap = new Map<string, string>(
        existingProducts.map(
          (p) => [`${p.brand_id}|${p.title.trim().toLowerCase()}`, p.id] as const
        )
      );
      const existingProductIds = [...new Set(existingProducts.map((p) => p.id))];
      const existingSkus = existingProductIds.length
        ? await query<{ product_id: string; size_label: string }>(
            `SELECT product_id, size_label FROM product_skus WHERE product_id IN (${existingProductIds
              .map(() => '?')
              .join(',')})`,
            existingProductIds
          )
        : [];
      const existSkuKey = new Set(existingSkus.map((s) => `${s.product_id}|${s.size_label.trim()}`));

      let processed = 0;
      let success = 0;
      let fail = 0;
      let newProducts = 0;
      let newSkus = 0;

      /* 5. 分组录入：brand+title 相同的行为同一商品 */
      const groups = new Map<string, ParsedSkuRow[]>();
      for (const r of validRows) {
        const pk = `${r.brand}|${r.title}`;
        if (!groups.has(pk)) groups.set(pk, []);
        groups.get(pk)!.push(r);
      }

      for (const [pk, group] of groups) {
        const [brandName, title] = pk.split('|');
        const brandId = brandMap.get(brandName.trim().toLowerCase());
        if (!brandId) {
          processed += group.length;
          fail += group.length;
          continue;
        }

        /* 查找或创建商品（同品牌下标题大小写不敏感匹配） */
        const existKey = `${brandId}|${title.trim().toLowerCase()}`;
        let productId: string | null = existProductMap.get(existKey) ?? null;
        if (!productId) {
          productId = crypto.randomUUID();
          try {
            await execute(
              `INSERT INTO products (id, brand_id, title, category, cover_image_url, notes, status, is_active)
               VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
              [
                productId,
                brandId,
                title,
                group[0].category || null,
                group.find((g) => g.coverImageUrl)?.coverImageUrl ?? null,
                group.find((g) => g.notes)?.notes ?? null,
                titleStatus.get(pk) || '在架',
              ]
            );
            newProducts++;
            existProductMap.set(existKey, productId);
          } catch (e) {
            console.error('创建商品失败:', e);
            for (const r of group) {
              errors.push({
                row: r.row,
                field: '商品名称',
                message: '商品创建失败（数据库异常）',
                raw: title,
              });
            }
            processed += group.length;
            fail += group.length;
            continue;
          }
        }

        for (const r of group) {
          processed++;
          try {
            if (existSkuKey.has(`${productId}|${r.sizeLabel}`)) {
              errors.push({
                row: r.row,
                field: '尺寸规格',
                message: '该商品下已存在同尺寸规格的 SKU',
                raw: r.sizeLabel,
              });
              fail++;
              continue;
            }
            await execute(
              `INSERT INTO product_skus (id, product_id, size_label, size_detail, people_range, price, stock, sku_code, status, sort_order)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                crypto.randomUUID(),
                productId,
                r.sizeLabel,
                r.sizeDetail,
                r.peopleRange,
                r.price,
                r.stock,
                r.skuCode,
                r.skuStatus,
                processed,
              ]
            );
            existSkuKey.add(`${productId}|${r.sizeLabel}`);
            success++;
            newSkus++;
          } catch (e) {
            console.error('插入 SKU 失败:', e);
            const msg = e instanceof Error && e.message.includes('uk_sku_code')
              ? 'SKU编码与系统重复'
              : 'SKU 写入失败（数据库异常）';
            errors.push({ row: r.row, field: 'SKU编码', message: msg, raw: r.skuCode ?? r.sizeLabel });
            fail++;
          }
        }

        await updateTask(taskId, {
          processed_rows: processed,
          success_rows: success,
          fail_rows: fail,
          new_products: newProducts,
          new_skus: newSkus,
          errors: errors.length > 0 ? JSON.stringify(errors) : null,
        });
      }

      const status = fail === 0 ? '成功' : success === 0 ? '失败' : '部分成功';
      await updateTask(taskId, {
        status,
        processed_rows: processed,
        success_rows: success,
        fail_rows: fail,
        new_products: newProducts,
        new_skus: newSkus,
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
        message:
          fail === 0
            ? `导入完成：新增 ${newProducts} 个商品、${newSkus} 个 SKU`
            : `导入完成：成功 ${success} 行、失败 ${fail} 行（新增 ${newProducts} 个商品、${newSkus} 个 SKU）`,
      });
      return;
    }

    /* 全部行校验失败 */
    await updateTask(taskId, {
      status: '失败',
      total_rows: rows.length,
      processed_rows: rows.length,
      fail_rows: rows.length,
      errors: JSON.stringify(errors),
      message: `全部 ${rows.length} 行校验失败，未导入任何数据`,
    });
  } catch (e) {
    console.error(`导入任务 ${taskId} 失败:`, e);
    await updateTask(taskId, {
      status: '失败',
      message: e instanceof Error ? e.message : String(e),
      errors: errors.length > 0 ? JSON.stringify(errors) : null,
    }).catch(() => {});
  }
}

export function startImportTask(taskId: string, fileKey: string) {
  enqueue(taskId, fileKey);
}
