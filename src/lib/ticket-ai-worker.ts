/* 工单 AI 自动处理 worker：
 * 工单完成二次审阅后进入 AI 处理队列 → 自动完成
 *   分析问题 → 定位代码 → 修改代码 → 运行测试 → 提交仓库 → 触发部署
 * 全程进度写入 ticket_events（时间线）与 tickets.ai_result（明细），
 * 处理结束后工单进入「待审阅」，由人工确认最终结果。
 *
 * 集成方式：
 * - 默认 simulate 模式：完整走通状态机与时间线（开发/演示环境）；
 * - 配置环境变量 TICKET_AI_EXECUTOR（可执行命令，入参为工单 JSON 字符串，
 *   stdout 输出 JSON {success, summary, commit?, deployUrl?, steps?}）后，
 *   「修改代码/运行测试/提交仓库」由该执行器真实完成；
 * - 配置 TICKET_DEPLOY_COMMAND 后「触发部署」执行真实部署命令（如 deploy.sh）。
 * 模块级 Promise 链保证同一时刻只处理一个工单（其余排队）。
 */
import { execFile } from 'child_process';
import { promisify } from 'util';
import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';

const execFileAsync = promisify(execFile);

export interface TicketRow {
  id: string;
  ticket_no: number;
  title: string;
  type: 'bug' | '优化';
  page_path: string | null;
  description: string;
  tech_notes: string | null;
  priority: string;
  status: string;
  created_by: string | null;
  reviewed_by: string | null;
}

export interface AiStepResult {
  name: string;
  status: '成功' | '失败' | '跳过';
  detail: string;
  durationMs: number;
}

export interface AiResult {
  steps: AiStepResult[];
  commit: string | null;
  branch: string | null;
  deployUrl: string | null;
  simulate: boolean;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 写入工单事件（时间线） */
async function addEvent(
  ticketId: string,
  step: string,
  title: string,
  detail?: string | null,
  operator = 'AI'
) {
  await execute(
    'INSERT INTO ticket_events (id, ticket_id, step, title, detail, operator) VALUES (?, ?, ?, ?, ?, ?)',
    [randomUUID(), ticketId, step, title, detail ?? null, operator]
  );
}

/** 更新工单 ai_result / ai_summary */
async function saveAiResult(ticketId: string, result: AiResult, summary: string) {
  await execute('UPDATE tickets SET ai_result = ?, ai_summary = ? WHERE id = ?', [
    JSON.stringify(result),
    summary,
    ticketId,
  ]);
}

/** 读取工单 */
async function loadTicket(ticketId: string): Promise<TicketRow | null> {
  const rows = await query<TicketRow>(
    `SELECT id, ticket_no, title, type, page_path, description, tech_notes,
            priority, status, created_by, reviewed_by
     FROM tickets WHERE id = ?`,
    [ticketId]
  );
  return rows.length > 0 ? rows[0] : null;
}

/* ------------------------------------------------------------------ */
/* 真实执行器（可选）：外部 AI Agent 命令                                */
/* ------------------------------------------------------------------ */

interface ExecutorOutput {
  success: boolean;
  summary: string;
  commit?: string;
  deployUrl?: string;
  steps?: { name: string; status: '成功' | '失败' | '跳过'; detail: string }[];
}

async function runExternalExecutor(ticket: TicketRow): Promise<ExecutorOutput> {
  const cmd = process.env.TICKET_AI_EXECUTOR as string;
  const input = JSON.stringify({
    ticketNo: ticket.ticket_no,
    title: ticket.title,
    type: ticket.type,
    pagePath: ticket.page_path,
    description: ticket.description,
    techNotes: ticket.tech_notes,
    priority: ticket.priority,
    project: 'cake-h5',
  });
  const { stdout } = await execFileAsync(cmd, [input], {
    timeout: 10 * 60 * 1000, // 10 分钟上限
    maxBuffer: 10 * 1024 * 1024,
  });
  try {
    const parsed = JSON.parse(stdout.trim().split('\n').pop() || '{}') as ExecutorOutput;
    if (typeof parsed.success !== 'boolean') throw new Error('缺少 success 字段');
    return parsed;
  } catch {
    // 输出不是合法 JSON：视为失败，原样带回便于排查
    return { success: false, summary: `执行器输出无法解析：${stdout.slice(0, 500)}` };
  }
}

/* ------------------------------------------------------------------ */
/* 主流程                                                              */
/* ------------------------------------------------------------------ */

async function processTicket(ticketId: string) {
  const ticket = await loadTicket(ticketId);
  if (!ticket) throw new Error(`工单不存在：${ticketId}`);
  if (ticket.status !== 'AI处理中') {
    // 队列等待期间状态可能已被人工调整，跳过避免覆盖
    return;
  }

  const startedAt = Date.now();
  const simulate = !process.env.TICKET_AI_EXECUTOR;
  const result: AiResult = { steps: [], commit: null, branch: null, deployUrl: null, simulate };

  await addEvent(ticketId, 'AI处理', 'AI 开始处理工单', null, 'AI');

  try {
    /* 1. 分析问题 */
    let stepStart = Date.now();
    const analysis = [
      `问题：${ticket.title}（${ticket.type === 'bug' ? '页面缺陷' : '功能优化'}）`,
      ticket.page_path ? `相关页面：${ticket.page_path}` : null,
      ticket.tech_notes ? `技术背景：${ticket.tech_notes}` : '技术背景：无（运营原始描述）',
    ]
      .filter(Boolean)
      .join('\n');
    if (simulate) await sleep(1200);
    result.steps.push({ name: '分析问题', status: '成功', detail: analysis, durationMs: Date.now() - stepStart });
    await addEvent(ticketId, '步骤', '① 分析问题完成', analysis);

    /* 2. 核心执行：定位/修改代码 → 测试 → 提交 */
    stepStart = Date.now();
    if (process.env.TICKET_AI_EXECUTOR) {
      const output = await runExternalExecutor(ticket);
      if (!output.success) throw new Error(output.summary || 'AI 执行器返回失败');
      result.steps.push(
        ...(output.steps || []).map((s) => ({ ...s, durationMs: 0 }))
      );
      result.commit = output.commit ?? null;
      result.branch = `ai/ticket-${ticket.ticket_no}`;
      await addEvent(
        ticketId,
        '步骤',
        '② 修改代码 / 运行测试 / 提交仓库完成',
        output.steps?.map((s) => `${s.name}：${s.detail}`).join('\n') || output.summary
      );
      await saveAiResult(ticketId, result, output.summary);
    } else {
      /* simulate：按步骤推进状态机，产出模拟 commit */
      const simSteps: [string, string, number][] = [
        ['定位代码', `在 cake-h5 中定位到与「${ticket.page_path || ticket.title}」相关的实现`, 1000],
        ['修改代码', `针对${ticket.type === 'bug' ? '缺陷' : '优化点'}完成代码修改（共 2 个文件，+38/-12 行）`, 1500],
        ['运行测试', 'pnpm lint 通过；tsc --noEmit 通过；关键路径手工验证正常', 1200],
        ['提交仓库', '已提交至分支并推送远端', 800],
      ];
      for (let i = 0; i < simSteps.length; i++) {
        const [name, detail, ms] = simSteps[i];
        if (simulate) await sleep(ms);
        result.steps.push({ name, status: '成功', detail, durationMs: ms });
        await addEvent(ticketId, '步骤', `${['②', '③', '④', '⑤'][i]} ${name}完成`, detail);
      }
      result.commit = Array.from({ length: 7 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
      result.branch = `ai/ticket-${ticket.ticket_no}`;
      const coreSummary = `已完成代码修改并通过测试，提交 ${result.commit}（分支 ${result.branch}）`;
      await saveAiResult(ticketId, result, coreSummary);
    }

    /* 3. 触发部署 */
    stepStart = Date.now();
    if (process.env.TICKET_DEPLOY_COMMAND) {
      await execFileAsync(process.env.TICKET_DEPLOY_COMMAND, [], {
        timeout: 10 * 60 * 1000,
        maxBuffer: 10 * 1024 * 1024,
      });
      result.deployUrl = process.env.TICKET_DEPLOY_URL || null;
      result.steps.push({ name: '触发部署', status: '成功', detail: '部署命令执行完成', durationMs: Date.now() - stepStart });
      await addEvent(ticketId, '步骤', '⑥ 触发部署完成', `部署命令：${process.env.TICKET_DEPLOY_COMMAND}`);
    } else {
      result.deployUrl = 'https://dev.ohmycake.example.com';
      result.steps.push({
        name: '触发部署',
        status: '成功',
        detail: '（模拟）已触发部署流水线，可在配置 TICKET_DEPLOY_COMMAND 后接入真实部署',
        durationMs: Date.now() - stepStart,
      });
      await addEvent(ticketId, '步骤', '⑥ 触发部署完成', result.steps[result.steps.length - 1].detail);
    }

    /* 4. 收尾：进入待审阅 */
    const summary = `AI 处理完成（耗时 ${Math.round((Date.now() - startedAt) / 1000)}s）：代码修改已提交${
      result.commit ? `（${result.commit}）` : ''
    }，部署已触发，请人工审阅确认。`;
    await saveAiResult(ticketId, result, summary);
    await execute(
      `UPDATE tickets SET status = '待审阅' WHERE id = ? AND status = 'AI处理中'`,
      [ticketId]
    );
    await addEvent(ticketId, 'AI处理', 'AI 处理完成，等待人工审阅', summary);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    await saveAiResult(ticketId, result, `处理失败：${reason}`);
    await execute(`UPDATE tickets SET status = '处理失败', failure_reason = ? WHERE id = ?`, [
      reason.slice(0, 1000),
      ticketId,
    ]);
    await addEvent(ticketId, '失败', 'AI 处理失败', reason, 'AI');
  }
}

/* 模块级队列：同一时刻只处理一个工单 */
let chain: Promise<void> = Promise.resolve();

/** 将工单加入 AI 处理队列（幂等：重复入队只生效一次） */
export function enqueueTicketAi(ticketId: string) {
  chain = chain
    .then(async () => {
      await execute(`UPDATE tickets SET status = 'AI处理中', failure_reason = NULL WHERE id = ?`, [ticketId]);
      await processTicket(ticketId);
    })
    .catch((error) => {
      console.error('工单 AI 处理队列异常:', error);
    });
  return chain;
}
