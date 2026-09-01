"use client";

/* 预订攻略页（原型：品牌抢购时间表 + 品牌介绍） */

import Link from "next/link";
import { useState } from "react";
import type { IconProps } from "@/components/icons";

function IconChevronLeft({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/* ---------------- 数据（PRD / 原型示例） ---------------- */

const schedule = [
  {
    brand: "ITA Cake",
    status: "秒无",
    statusClass: "bg-rose",
    time: "每天 0:00 放号",
    channel: "小程序",
  },
  {
    brand: "Tinyroll",
    status: "秒无",
    statusClass: "bg-rose",
    time: "每周日 13:00",
    channel: "小程序",
  },
  {
    brand: "胡团",
    status: "有货",
    statusClass: "bg-matcha",
    time: "随时可订",
    channel: "小程序",
  },
  {
    brand: "Sillage",
    status: "有货",
    statusClass: "bg-matcha",
    time: "提前 2 天订 · 16:00 截单",
    channel: "小程序",
  },
  {
    brand: "Haku",
    status: "热门",
    statusClass: "bg-accent",
    time: "提前 2 天订",
    channel: "小程序",
  },
];

const brandIntros = [
  {
    name: "ITA Cake",
    paras: [
      "Ita Cake 是上海顶流私房蛋糕，被网友称作“糕圈纯元”，每日限量发售，属于出了名的“难抢款”。主打自研糯米蛋糕胚，搭配斑斓、焙茶、黑芝麻等东方食材，全系列低甜配方，手工打发奶油，不使用工业香精。",
      "吃过的食客普遍好评，糯米胚糯韧有嚼劲，和普通戚风口感完全不同，层次丰富不齁腻。注意只在线上小程序和客服微信预约售卖，无线下门店，热门款经常秒没，想入手建议卡点蹲库存。",
    ],
  },
  {
    name: "Tinyroll",
    paras: [
      "Tinyroll 主打瑞士卷单品，经典原味卷常年霸榜。胚体松软、动物奶油轻盈不糊口，切块定价对一人食和解馋场景都很友好。",
      "每周日 13:00 小程序准时放号，热门口味几分钟内售罄，属于典型的“秒无”品牌，建议提前注册好账号、卡点下单。",
    ],
  },
  {
    name: "胡团",
    paras: [
      "胡团走家常私房路线，款式稳定、常年有货，适合不想蹲点抢购的用户。奶油使用纯动物稀奶油，甜度适中，适合家庭聚餐与日常下午茶。",
      "通过小程序下单，通常提前 1 天预订即可，当日可取，是几家中入手门槛最低的。",
    ],
  },
  {
    name: "Sillage",
    paras: [
      "Sillage 是静安区的口碑私房，招牌咸法酪玫瑰草莓千层把咸甜平衡做得恰到好处，玫瑰花香自然不齁。纯动物奶油、低糖配方，千层饼皮薄而均匀。",
      "门店位于静安区陕西北路，支持市区冷链配送与到店自提。提前 2 天预订，当日 16:00 截单，热门款节假日配额紧张，建议尽早锁定。",
    ],
  },
];

/* ---------------- 小组件 ---------------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="h-4 w-[3px] rounded-full bg-accent" />
      <h2 className="font-serif text-[17px] font-semibold tracking-wide text-foreground">
        {children}
      </h2>
    </div>
  );
}

/* ---------------- 页面 ---------------- */

export default function GuidePage() {
  const [active, setActive] = useState(0);
  const intro = brandIntros[active];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-background">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="flex h-14 items-center px-2">
          <Link
            href="/"
            aria-label="返回"
            className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition hover:bg-muted active:scale-95"
          >
            <IconChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center font-serif text-[17px] font-semibold tracking-wide text-foreground">
            预订攻略
          </h1>
          <span aria-hidden="true" className="h-11 w-11" />
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-16">
        {/* 品牌抢购时间表 */}
        <section aria-labelledby="schedule-title">
          <SectionTitle>
            <span id="schedule-title">品牌抢购时间表</span>
          </SectionTitle>
          <div className="mt-3.5 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-[11px] text-muted-foreground">
                  <th scope="col" className="px-3.5 py-2.5 font-normal">
                    品牌
                  </th>
                  <th scope="col" className="px-2 py-2.5 font-normal">
                    状态
                  </th>
                  <th scope="col" className="px-2 py-2.5 font-normal">
                    抢购时间
                  </th>
                  <th scope="col" className="px-3.5 py-2.5 text-right font-normal">
                    渠道
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((r) => (
                  <tr
                    key={r.brand}
                    className="border-b border-border/60 last:border-0"
                  >
                    <th
                      scope="row"
                      className="px-3.5 py-3.5 font-medium text-foreground"
                    >
                      {r.brand}
                    </th>
                    <td className="px-2 py-3.5">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium leading-relaxed text-white ${r.statusClass}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-2 py-3.5 text-muted-foreground">
                      {r.time}
                    </td>
                    <td className="px-3.5 py-3.5 text-right text-muted-foreground">
                      {r.channel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 品牌介绍 */}
        <section className="mt-8" aria-labelledby="intro-title">
          <SectionTitle>
            <span id="intro-title">品牌介绍</span>
          </SectionTitle>

          {/* 品牌 Tab（单行横滑） */}
          <div
            role="tablist"
            aria-label="品牌"
            className="no-scrollbar mt-3.5 flex gap-2.5 overflow-x-auto py-0.5"
          >
            {brandIntros.map((b, i) => (
              <button
                key={b.name}
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={`h-11 shrink-0 cursor-pointer rounded-xl border px-4 text-[13px] transition active:scale-95 ${
                  active === i
                    ? "border-foreground bg-card font-medium text-foreground"
                    : "border-transparent bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* 介绍卡片 */}
          <div
            key={intro.name}
            className="mt-3.5 space-y-3 rounded-2xl border border-border bg-card p-4"
          >
            {intro.paras.map((p) => (
              <p
                key={p.slice(0, 12)}
                className="text-[12.5px] leading-relaxed text-muted-foreground"
              >
                {p}
              </p>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
