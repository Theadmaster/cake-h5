"use client";

/* 百科页（PRD 4.5）：搜索 + 风味轮盘 + 胚体对比 + 品类差异 + 尺寸对照 + 奶油辨真假 + 术语词典 */

import Link from "next/link";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import SectionTitle from "@/components/SectionTitle";
import { IconSearch, IconStar } from "@/components/icons";
import type { IconProps } from "@/components/icons";

/* ---------------- 图标 ---------------- */

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

/* ---------------- 数据 ---------------- */

/* 黄金风味搭配（六类，轮盘联动） */
const FLAVORS = [
  {
    key: "酸甜平衡",
    short: "酸甜",
    tagline: "解腻首选",
    emoji: "🍓",
    color: "#f7e3e6",
    text: "#8a4a56",
    combos:
      "草莓+咸芝士 · 柚子+抹茶 · 树莓+白巧 · 芒果+椰香 · 柠檬+马斯卡彭 · 百香果+芝士 · 青提+茉莉 · 山楂+奶油",
  },
  {
    key: "咸甜交织",
    short: "咸甜",
    tagline: "高级感来源",
    emoji: "🧂",
    color: "#f6eccf",
    text: "#7a6432",
    combos:
      "海盐+焦糖 · 咸芝士+草莓 · 培根+枫糖 · 酱油+蜂蜜(日式) · 黑松露+芝士 · 橄榄+佛卡夏 · 火腿+蜜瓜奶油",
  },
  {
    key: "苦甜平衡",
    short: "苦甜",
    tagline: "醇厚挂",
    emoji: "🍫",
    color: "#e3eedd",
    text: "#4e6b45",
    combos:
      "70%黑巧+淡奶油 · 抹茶+白巧 · 深烘咖啡+焦糖 · 红茶+柠檬 · 焙茶+玄米 · 可可+海盐 · 乌龙+桃子",
  },
  {
    key: "茶香搭配",
    short: "茶香",
    tagline: "清新挂",
    emoji: "🍵",
    color: "#dfe9f4",
    text: "#44618a",
    combos:
      "抹茶+红豆/栗子 · 红茶+草莓/柠檬 · 泰茶+芒果/布丁 · 伯爵茶+青提/玫瑰 · 茉莉+荔枝/白桃 · 桂花+栗子/糯米 · 焙茶+麻薯",
  },
  {
    key: "花香搭配",
    short: "花香",
    tagline: "浪漫挂",
    emoji: "🌸",
    color: "#ece2f6",
    text: "#6a5390",
    combos:
      "玫瑰+草莓/荔枝 · 茉莉+青提/白桃 · 桂花+栗子/糯米 · 薰衣草+柠檬/蜂蜜 · 橙花+覆盆子 · 樱花+草莓/白巧",
  },
  {
    key: "坚果搭配",
    short: "坚果",
    tagline: "香浓挂",
    emoji: "🌰",
    color: "#f6e6cd",
    text: "#8a6232",
    combos:
      "榛子+巧克力 · 核桃+焦糖/香蕉 · 开心果+覆盆子/玫瑰 · 杏仁+橙子/樱桃 · 花生+焦糖/香蕉 · 芝麻+红豆/麻薯 · 腰果+椰香",
  },
];

/* 蛋糕胚口感对比（6 胚体） */
const SCAFFOLDS = [
  { name: "糯米胚", texture: "Q弹有嚼劲，类似硬挺糯米糍", crumb: "细密紧实", spring: 5, rep: "ITA Cake" },
  { name: "戚风胚", texture: "松软轻盈，入口即化", crumb: "粗大均匀", spring: 3, rep: "最常见" },
  { name: "海绵胚", texture: "扎实有弹性，蛋香浓", crumb: "细密", spring: 4, rep: "传统裱花" },
  { name: "磅蛋糕", texture: "浓郁扎实，黄油香厚", crumb: "几乎无气孔", spring: 1, rep: "配茶/咖啡" },
  { name: "巴斯克", texture: "焦香外皮，半熟流心", crumb: "绵密", spring: 2, rep: "芝士专用" },
  { name: "玛德琳", texture: "边缘焦脆，内部松软", crumb: "蜂窝状", spring: 3, rep: "贝壳伴手礼" },
];

/* 蛋糕品类差异（6 品类） */
const CATEGORIES = [
  { name: "千层", texture: "多层薄饼皮+奶油，层次分明", cream: "高", brands: "Sillage、Lady M" },
  { name: "慕斯", texture: "冷藏凝固，轻盈细腻如云朵", cream: "中", brands: "POURNIL、法甜店" },
  { name: "重芝士", texture: "浓郁绵密，芝士香厚重", cream: "高(芝士)", brands: "各类蛋糕店" },
  { name: "巴斯克", texture: "焦香表皮，半熟流心内馅", cream: "高(芝士)", brands: "网红款普遍" },
  { name: "挞类", texture: "酥脆挞皮+顺滑馅料，外酥内嫩", cream: "低", brands: "POURNIL、法甜店" },
  { name: "蛋糕卷", texture: "戚风胚卷奶油，松软绵密", cream: "中", brands: "Tinyroll、瑞士卷" },
];

/* 本周热门词条（关联在售蛋糕） */
const HOT_WORDS = [
  {
    emoji: "🍡",
    name: "糯米胚",
    desc: "ITA 带火的 Q 弹胚体，和戚风有什么区别？",
    href: "/cake/c6",
    linkLabel: "看在售款",
  },
  {
    emoji: "🥛",
    name: "动物奶油",
    desc: "3 句话辨真假，别再被「牛乳奶油」忽悠",
    anchor: "#cream-truth",
    linkLabel: "看口诀",
  },
  {
    emoji: "🍫",
    name: "黑巧分级",
    desc: "55%/70%/85% 怎么选？苦度对照表",
  },
  {
    emoji: "🍵",
    name: "抹茶等级",
    desc: "宇治/若竹/青岚，颜色苦度差在哪",
  },
];

/* 尺寸与人数对照（买糕必修课落地） */
const SIZES = [
  { size: "4寸", people: "1-2人", note: "一人食" },
  { size: "5寸", people: "2-3人", note: "小聚" },
  { size: "6寸", people: "2-4人", note: "最常见" },
  { size: "8寸", people: "4-6人", note: "生日会" },
  { size: "10寸", people: "6-10人", note: "派对" },
];

/* 动物奶油辨真假（3 句口诀） */
const CREAM_TRUTH = [
  { title: "看配料表", text: "只写「稀奶油 / 淡奶油」是动物奶油；出现「植物油、乳化剂」就是植物奶油" },
  { title: "看状态", text: "动物奶油冷藏 2 小时左右开始塌软；植物奶油久放挺立不化" },
  { title: "尝口感", text: "动物奶油入口即化、奶香自然；植物奶油偏甜发腻、有一点蜡感" },
];

/* 术语小词典 */
const TERMS = [
  { name: "卡仕达", desc: "牛奶+蛋黄+糖+淀粉熬制的顺滑蛋奶酱，常用作内馅" },
  { name: "甘纳许", desc: "巧克力+淡奶油乳化而成的丝滑馅料/淋面" },
  { name: "外交官奶油", desc: "卡仕达+吉利丁+打发淡奶油的轻盈馅料" },
  { name: "°Brix", desc: "糖度单位，表示可溶性固形物的百分比" },
  { name: "糯米胚", desc: "以糯米粉为原料的 Q 弹蛋糕胚" },
  { name: "巴斯克", desc: "源自西班牙巴斯克地区的焦皮半熟芝士蛋糕" },
];

/* 搜索索引（全站知识扁平化） */
const KNOWLEDGE = [
  ...HOT_WORDS.map((w) => ({ name: w.name, desc: w.desc, tag: "热门词条", href: w.href, anchor: w.anchor })),
  ...TERMS.map((t) => ({ name: t.name, desc: t.desc, tag: "术语", href: undefined, anchor: undefined })),
  ...SCAFFOLDS.map((s) => ({ name: s.name, desc: s.texture, tag: "蛋糕胚", href: undefined, anchor: undefined })),
  ...CATEGORIES.map((c) => ({ name: c.name, desc: c.texture, tag: "品类", href: undefined, anchor: undefined })),
  ...FLAVORS.map((f) => ({ name: f.key, desc: f.tagline + "搭配：" + f.combos, tag: "风味搭配", href: undefined, anchor: undefined })),
  { name: "尺寸人数", desc: "4寸 1-2人 · 5寸 2-3人 · 6寸 2-4人 · 8寸 4-6人 · 10寸 6-10人", tag: "选购", href: undefined, anchor: undefined },
];

/* ---------------- 小组件 ---------------- */

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`弹性 ${n} 星（满分 5 星）`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar
          key={i}
          className={`h-3 w-3 ${i <= n ? "text-accent" : "text-border"}`}
        />
      ))}
    </span>
  );
}

function creamToneClass(cream: string): string {
  if (cream.startsWith("高")) return "text-rose";
  if (cream === "中") return "text-accent";
  return "text-matcha";
}

/* 风味轮盘：SVG 六段圆环（圆心 110,110） */
const RO = 96;
const RI = 62;

function pt(r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [110 + r * Math.cos(rad), 110 + r * Math.sin(rad)];
}

function arcPath(rO: number, rI: number, a0: number, a1: number): string {
  const [x1, y1] = pt(rO, a0);
  const [x2, y2] = pt(rO, a1);
  const [x3, y3] = pt(rI, a1);
  const [x4, y4] = pt(rI, a0);
  const f = (n: number) => n.toFixed(2);
  return `M ${f(x1)} ${f(y1)} A ${rO} ${rO} 0 0 1 ${f(x2)} ${f(y2)} L ${f(x3)} ${f(y3)} A ${rI} ${rI} 0 0 0 ${f(x4)} ${f(y4)} Z`;
}

function FlavorWheel({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (i: number) => void;
}) {
  const gap = 2.5;
  return (
    <div className="relative mx-auto w-[220px]">
      <svg viewBox="0 0 220 220" className="block h-auto w-full" role="group" aria-label="风味轮盘">
        {FLAVORS.map((f, i) => {
          const a0 = i * 60 + gap;
          const a1 = (i + 1) * 60 - gap;
          const on = i === selected;
          const [lx, ly] = pt((RO + RI) / 2, (a0 + a1) / 2);
          return (
            <g key={f.key}>
              <path
                d={arcPath(on ? RO + 5 : RO, on ? RI - 3 : RI, a0, a1)}
                fill={f.color}
                stroke={on ? "#b0824f" : "transparent"}
                strokeWidth={on ? 1.5 : 0}
                className="cursor-pointer transition-all"
                onClick={() => onSelect(i)}
                aria-label={`${f.key}（${f.tagline}）`}
                role="button"
                aria-pressed={on}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                fill={on ? f.text : "#8a7a6a"}
                fontWeight={on ? 600 : 400}
                className="pointer-events-none"
              >
                {f.short}
              </text>
            </g>
          );
        })}
      </svg>
      {/* 中心：当前选中风味 */}
      <div className="pointer-events-none absolute inset-0 m-auto flex h-[96px] w-[96px] flex-col items-center justify-center rounded-full border border-border bg-card text-center">
        <span className="text-[16px] leading-none">{FLAVORS[selected].emoji}</span>
        <span className="mt-1 text-[11px] font-medium text-foreground">
          {FLAVORS[selected].key}
        </span>
      </div>
    </div>
  );
}

/* ---------------- 页面 ---------------- */

export default function WikiPage() {
  const [query, setQuery] = useState("");
  const [wheel, setWheel] = useState(0);

  const q = query.trim().toLowerCase();
  const hits = q
    ? KNOWLEDGE.filter(
        (k) =>
          k.name.toLowerCase().includes(q) || k.desc.toLowerCase().includes(q),
      )
    : [];
  const flavor = FLAVORS[wheel];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-background pb-24">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur">
        <Link
          href="/"
          aria-label="返回"
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition active:scale-95"
        >
          <IconChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-serif text-[17px] font-semibold text-foreground">
          选糕百科
        </h1>
      </header>

      {/* 搜索栏 */}
      <div className="px-4 pt-3.5">
        <div className="flex h-11 items-center gap-2.5 rounded-full border border-border bg-card px-4 shadow-[0_1px_4px_rgba(107,74,51,0.06)]">
          <IconSearch className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜词条：戚风胚、动物奶油、°Brix…"
            aria-label="搜索百科词条"
            className="h-full w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      {q ? (
        /* 搜索结果 */
        <section className="px-4 pt-4" aria-label="搜索结果">
          <p className="text-[11px] text-muted-foreground">
            找到 {hits.length} 条与「{query.trim()}」相关的知识
          </p>
          {hits.length > 0 ? (
            <ul className="mt-3 space-y-2.5">
              {hits.map((k) => {
                const inner = (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-foreground">
                        {k.name}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {k.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
                      {k.desc}
                    </p>
                  </>
                );
                return (
                  <li key={k.name + k.tag}>
                    {k.href ? (
                      <Link
                        href={k.href}
                        className="block rounded-2xl border border-border bg-card p-3.5 transition active:scale-[0.99]"
                      >
                        {inner}
                        <span className="mt-1.5 inline-block text-[10.5px] text-accent underline underline-offset-4">
                          {HOT_WORDS.find((w) => w.name === k.name)?.linkLabel ?? "查看详情"} →
                        </span>
                      </Link>
                    ) : k.anchor ? (
                      <a
                        href={k.anchor}
                        className="block rounded-2xl border border-border bg-card p-3.5 transition active:scale-[0.99]"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="rounded-2xl border border-border bg-card p-3.5">
                        {inner}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground">
                没有找到相关词条，试试「奶油」或「糯米」
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* 本周热门词条 */}
          <section className="pt-5" aria-label="本周热门词条">
            <div className="px-4">
              <SectionTitle>本周热门词条</SectionTitle>
            </div>
            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
              {HOT_WORDS.map((w) => {
                const inner = (
                  <>
                    <span className="text-[16px]">{w.emoji}</span>
                    <span className="text-[12.5px] font-medium text-foreground">
                      {w.name}
                    </span>
                    <span className="line-clamp-2 text-[10.5px] leading-relaxed text-muted-foreground">
                      {w.desc}
                    </span>
                    {w.linkLabel && (
                      <span className="mt-auto text-[10px] text-accent underline underline-offset-4">
                        {w.linkLabel} →
                      </span>
                    )}
                  </>
                );
                const cls =
                  "flex w-[150px] shrink-0 flex-col gap-1 rounded-2xl border border-border bg-card p-3 transition active:scale-[0.98]";
                return w.href ? (
                  <Link key={w.name} href={w.href} className={cls}>
                    {inner}
                  </Link>
                ) : w.anchor ? (
                  <a key={w.name} href={w.anchor} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <div key={w.name} className={cls}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 风味轮盘 */}
          <section className="px-4 pt-7" aria-label="风味轮盘">
            <div className="flex items-center justify-between">
              <SectionTitle>风味轮盘</SectionTitle>
              <span className="text-[11px] text-muted-foreground">
                点一下，看搭配
              </span>
            </div>
            <div className="mt-4">
              <FlavorWheel selected={wheel} onSelect={setWheel} />
            </div>
            <div
              className="mt-4 rounded-2xl p-4 transition-colors"
              style={{ backgroundColor: flavor.color, color: flavor.text }}
            >
              <h3 className="text-[13px] font-semibold">
                {flavor.emoji} {flavor.key}（{flavor.tagline}）
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed">{flavor.combos}</p>
              <p className="mt-2 text-[10.5px] opacity-75">
                共 {flavor.combos.split(" · ").length} 组搭配 · 点轮盘切换风味
              </p>
            </div>
          </section>

          {/* 蛋糕胚口感对比 */}
          <section className="px-4 pt-7" aria-label="蛋糕胚口感对比">
            <SectionTitle>🍰 蛋糕胚口感对比</SectionTitle>
            <div className="no-scrollbar mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[480px] text-left text-[11.5px]">
                <thead>
                  <tr className="bg-rose-soft/60 text-[#8a4a56]">
                    <th className="sticky left-0 z-10 bg-[#f7e3e6] px-3 py-2.5 font-medium">
                      胚体
                    </th>
                    <th className="px-3 py-2.5 font-medium">口感</th>
                    <th className="px-3 py-2.5 font-medium">气孔</th>
                    <th className="px-3 py-2.5 font-medium">弹性</th>
                    <th className="px-3 py-2.5 font-medium">代表</th>
                  </tr>
                </thead>
                <tbody>
                  {SCAFFOLDS.map((s) => (
                    <tr key={s.name} className="border-t border-border/60">
                      <td className="sticky left-0 z-10 bg-card px-3 py-2.5 font-medium text-foreground">
                        {s.name}
                      </td>
                      <td className="px-3 py-2.5 leading-relaxed text-muted-foreground">
                        {s.texture}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {s.crumb}
                      </td>
                      <td className="px-3 py-2.5">
                        <Stars n={s.spring} />
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {s.rep}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-muted-foreground">
              弹性为 1-5 星主观评测均值，表格可左右滑动
            </p>
          </section>

          {/* 蛋糕品类差异 */}
          <section className="px-4 pt-7" aria-label="蛋糕品类差异">
            <SectionTitle>🎂 蛋糕品类差异</SectionTitle>
            <div className="no-scrollbar mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[480px] text-left text-[11.5px]">
                <thead>
                  <tr className="text-[#5c4a78]">
                    <th className="sticky left-0 z-10 bg-[#ece2f6] px-3 py-2.5 font-medium">
                      品类
                    </th>
                    <th className="px-3 py-2.5 font-medium">口感特点</th>
                    <th className="px-3 py-2.5 font-medium">奶油占比</th>
                    <th className="px-3 py-2.5 font-medium">代表品牌</th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((c) => (
                    <tr key={c.name} className="border-t border-border/60">
                      <td className="sticky left-0 z-10 bg-card px-3 py-2.5 font-medium text-foreground">
                        {c.name}
                      </td>
                      <td className="px-3 py-2.5 leading-relaxed text-muted-foreground">
                        {c.texture}
                      </td>
                      <td
                        className={`px-3 py-2.5 font-medium ${creamToneClass(c.cream)}`}
                      >
                        {c.cream}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {c.brands}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 尺寸与人数对照 */}
          <section className="px-4 pt-7" aria-label="尺寸与人数对照">
            <SectionTitle>📏 尺寸与人数对照</SectionTitle>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {SIZES.map((s) => (
                <div
                  key={s.size}
                  className="flex flex-col items-center gap-0.5 rounded-xl border border-border bg-card px-1 py-2.5 text-center"
                >
                  <span className="text-[13px] font-semibold text-primary">
                    {s.size}
                  </span>
                  <span className="text-[10.5px] text-foreground">{s.people}</span>
                  <span className="text-[9.5px] text-muted-foreground">
                    {s.note}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 动物奶油辨真假 */}
          <section className="scroll-mt-16 px-4 pt-7" aria-label="动物奶油辨真假" id="cream-truth">
            <SectionTitle>🥛 动物奶油辨真假</SectionTitle>
            <div className="mt-3 space-y-2.5 rounded-2xl border border-border bg-card p-4">
              {CREAM_TRUTH.map((t, i) => (
                <div key={t.title} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-[#7a5a35]"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-medium text-foreground">
                      {t.title}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
                      {t.text}
                    </p>
                  </div>
                </div>
              ))}
              <p className="rounded-xl bg-rose-soft/60 p-2.5 text-[11px] leading-relaxed text-[#8a4a56]">
                提示：菜单上写「牛乳奶油」≠ 动物奶油，认准配料表最稳
              </p>
            </div>
          </section>

          {/* 术语小词典 */}
          <section className="px-4 pt-7" aria-label="术语小词典">
            <SectionTitle>📖 术语小词典</SectionTitle>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {TERMS.map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl border border-border bg-card p-3"
                >
                  <p className="text-[12.5px] font-medium text-foreground">
                    {t.name}
                  </p>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <p className="py-8 text-center text-[11px] text-muted-foreground/70">
            —— 已经到底啦 ——
          </p>
        </>
      )}

      <BottomNav active="wiki" />
    </div>
  );
}
