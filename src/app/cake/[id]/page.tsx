"use client";

/* 商详页：轮播 + 基本信息 + 基础味觉画像 + 味觉量化评分（可提交我的评分）+ 香气层次 + 口感层次拆解 + 原料核查 + 口碑聚合 + 预订与购买 + 评论区 */

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useRef, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { CakeSilhouette, IconClock, IconPin, IconStar } from "@/components/icons";
import type { IconProps } from "@/components/icons";
import { cakes } from "@/data/cakes";
import type { AromaTone } from "@/data/cakes";

/* ---------------- 图标（内联 SVG，Lucide 风格） ---------------- */

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

function IconHeart({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function IconBadgeCheck({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconShieldCheck({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconCheck({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconAlert({ className }: IconProps) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function IconMinus({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function IconPlus({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

/* ---------------- 小组件 ---------------- */

/* 香气层次三段配色（前调/中调/后调） */
const AROMA_TONE_CLASS: Record<AromaTone, string> = {
  green: "bg-[#e3f4e9] text-[#3e5c48]",
  yellow: "bg-[#faf0cf] text-[#6b5a2e]",
  purple: "bg-[#eae3f8] text-[#4e4370]",
};

function tagChipClass(kind: "good" | "note" | "plain"): string {
  switch (kind) {
    case "good":
      return "bg-matcha-soft text-matcha";
    case "note":
      return "bg-accent-soft text-[#7a5a35]";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function ScoreBar({ score }: { score: number }) {
  return (
    <span
      aria-hidden="true"
      className="h-1 w-full overflow-hidden rounded-full bg-muted"
    >
      <span
        className="block h-full rounded-full bg-accent"
        style={{ width: `${(score / 5) * 100}%` }}
      />
    </span>
  );
}

type Comment = { id: number; name: string; tone: string; time: string; text: string };

/* 预置评论者：取商品好评点前几条转为评论示例 */
const REVIEWERS = [
  { name: "糕友小K", tone: "bg-accent-soft text-[#7a5a35]", time: "3 天前" },
  { name: "甜品侦探M", tone: "bg-matcha-soft text-matcha", time: "1 周前" },
  { name: "栗子同学", tone: "bg-rose-soft text-rose", time: "2 周前" },
];

/* ---------------- 页面 ---------------- */

export default function CakeDetailPage() {
  const params = useParams<{ id: string }>();
  const cake = cakes.find((c) => c.id === params.id);
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [fav, setFav] = useState(false);
  const [wants, setWants] = useState(cake?.detail.wants ?? 0);
  const [userDims, setUserDims] = useState<number[] | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftDims, setDraftDims] = useState<number[]>([]);
  const [draft, setDraft] = useState("");
  const [comments, setComments] = useState<Comment[]>(() =>
    (cake?.detail.goodReviews ?? []).slice(0, 3).map((text, i) => ({
      id: i + 1,
      ...REVIEWERS[i % REVIEWERS.length],
      text,
    })),
  );

  if (!cake) notFound();
  const d = cake.detail;

  function onTrackScroll() {
    const el = trackRef.current;
    if (!el) return;
    setPage(Math.min(2, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
  }

  function toggleFav() {
    const next = !fav;
    setFav(next);
    setWants((w) => (next ? w + 1 : w - 1));
  }

  function startEdit() {
    setDraftDims(d.dims.map((x) => x.score));
    setEditing(true);
  }

  function stepDim(i: number, delta: number) {
    setDraftDims((prev) =>
      prev.map((v, j) =>
        j === i ? Math.min(5, Math.max(0, Math.round((v + delta) * 2) / 2)) : v,
      ),
    );
  }

  function submitDims() {
    setUserDims(draftDims);
    setEditing(false);
  }

  function submitComment() {
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [
      {
        id: (prev[0]?.id ?? 0) + 1,
        name: "我",
        tone: "bg-primary text-primary-foreground",
        time: "刚刚",
        text,
      },
      ...prev,
    ]);
    setDraft("");
  }

  const userAvg =
    userDims
      ? userDims.reduce((a, b) => a + b, 0) / userDims.length
      : null;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-background pb-10">
      {/* 轮播图 */}
      <section className="relative" aria-label="商品图">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="no-scrollbar flex h-[300px] snap-x snap-mandatory overflow-x-auto"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`relative flex w-full shrink-0 snap-center items-center justify-center ${cake.art}`}
            >
              <CakeSilhouette
                className={`${
                  i === 1 ? "h-24 w-24 translate-x-8 -translate-y-6 opacity-80" : i === 2 ? "h-32 w-32 -translate-x-6 translate-y-4" : "h-28 w-28"
                } ${cake.silhouetteColor}`}
              />
            </div>
          ))}
        </div>
        <span className="absolute bottom-3 right-4 rounded-full bg-black/30 px-2.5 py-0.5 text-[11px] text-white backdrop-blur-sm">
          {page + 1}/3
        </span>
        {/* 返回 */}
        <Link
          href="/list"
          aria-label="返回"
          className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition active:scale-95"
        >
          <IconChevronLeft className="h-5 w-5" />
        </Link>
      </section>

      {/* 基本信息 */}
      <section className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="font-serif text-[24px] font-semibold text-primary">
              <span className="text-[14px] font-normal">¥</span>
              {cake.price}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              / {d.sizePeople}
            </span>
          </div>
          <button
            type="button"
            aria-pressed={fav}
            onClick={toggleFav}
            className={`flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-[12.5px] transition active:scale-95 ${
              fav
                ? "border-rose/50 bg-rose-soft text-rose"
                : "border-border bg-card text-foreground hover:border-rose/40"
            }`}
          >
            <IconHeart className="h-4 w-4" filled={fav} />
            {fav ? "已想要" : "想要"}
            <span
              className={`text-[11px] tabular-nums ${
                fav ? "text-rose/80" : "text-muted-foreground"
              }`}
            >
              {wants}
            </span>
          </button>
        </div>
        <h1 className="mt-2 text-[17px] font-semibold leading-snug text-foreground">
          {cake.brand} {cake.name}
        </h1>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium leading-relaxed text-white ${cake.heatClass}`}
          >
            {cake.heatTag}
          </span>
          <span>{d.sold}</span>
          <span className="flex items-center gap-1">
            <IconStar className="h-3.5 w-3.5 text-accent" />
            {cake.rating.toFixed(1)}
            <span className="text-[10px]">({cake.reviews}人评)</span>
          </span>
          <span className="flex items-center gap-1">
            <IconPin className="h-3.5 w-3.5" />
            {d.addr}
          </span>
        </div>
      </section>

      {/* 1. 基础味觉画像 */}
      <section className="px-4 pt-7">
        <SectionTitle>基础味觉画像</SectionTitle>
        <div className="mt-3.5 rounded-2xl bg-accent-soft/60 p-4">
          <p className="font-serif text-[14.5px] leading-relaxed text-[#5a422c]">
            {d.profile}
          </p>
        </div>
      </section>

      {/* 2. 多维味觉量化评分 */}
      <section className="px-4 pt-7">
        <div className="flex items-center justify-between gap-2">
          <SectionTitle>味觉量化评分</SectionTitle>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-matcha-soft px-2.5 py-1 text-[10px] font-medium text-matcha">
            <IconBadgeCheck className="h-3.5 w-3.5" />
            3 位糕点师盲测均分
          </span>
        </div>

        <div className="mt-3.5 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="font-serif text-[36px] font-semibold leading-none text-primary">
                {d.overall.score.toFixed(1)}
              </div>
              <div className="mt-1.5 text-[10px] text-muted-foreground">
                综合均分
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-1.5 text-xs text-foreground">
                超过 {d.overall.overPercent}% 同类蛋糕
                {userAvg !== null && (
                  <span className="rounded-full bg-rose-soft px-2 py-0.5 text-[10px] font-medium text-rose">
                    我的 {userAvg.toFixed(1)}
                  </span>
                )}
              </p>
              <div className="mt-2 space-y-1.5">
                {(
                  [
                    ["味道", d.overall.taste],
                    ["原料", d.overall.ingredient],
                    ["性价比", d.overall.value],
                  ] as const
                ).map(([label, v]) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-[11px] text-muted-foreground"
                  >
                    <span className="w-10 shrink-0">{label}</span>
                    <ScoreBar score={v} />
                    <span className="w-6 shrink-0 text-right tabular-nums">
                      {v.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {editing ? (
            /* 评分编辑模式 */
            <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
              <p className="text-[11px] text-muted-foreground">
                按 0-5 分为各维度打你的分（0.5 步长），提交后与盲测均分对照
              </p>
              {d.dims.map((dim, i) => (
                <div key={dim.name} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 text-[12.5px] text-foreground">
                    {dim.name}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`降低${dim.name}评分`}
                      onClick={() => stepDim(i, -0.5)}
                      disabled={draftDims[i] <= 0}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition active:scale-90 disabled:opacity-30"
                    >
                      <IconMinus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-[12.5px] font-medium text-accent tabular-nums">
                      {draftDims[i].toFixed(1)}
                    </span>
                    <button
                      type="button"
                      aria-label={`提高${dim.name}评分`}
                      onClick={() => stepDim(i, 0.5)}
                      disabled={draftDims[i] >= 5}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition active:scale-90 disabled:opacity-30"
                    >
                      <IconPlus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="h-9 flex-1 cursor-pointer rounded-full border border-border bg-card text-[12.5px] text-muted-foreground transition active:scale-[0.98]"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={submitDims}
                  className="h-9 flex-[2] cursor-pointer rounded-full bg-primary text-[12.5px] font-medium text-primary-foreground shadow-[0_4px_14px_rgba(107,74,51,0.2)] transition hover:opacity-95 active:scale-[0.98]"
                >
                  提交我的评分
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 均分展示模式 */}
              <div className="mt-4 space-y-3.5 border-t border-border/60 pt-4">
                {d.dims.map((dim, i) => (
                  <div key={dim.name}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="text-foreground">{dim.name}</span>
                      <span className="flex items-center gap-2">
                        {userDims && (
                          <span className="text-[10.5px] text-rose">
                            我的 {userDims[i].toFixed(1)}
                          </span>
                        )}
                        <span className="font-medium text-accent tabular-nums">
                          {dim.score.toFixed(1)}
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <ScoreBar score={dim.score} />
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {dim.desc}
                    </p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={startEdit}
                className="mt-4 flex h-9 w-full cursor-pointer items-center justify-center rounded-full border border-accent/50 bg-accent-soft/50 text-[12.5px] font-medium text-[#7a5a35] transition hover:bg-accent-soft active:scale-[0.98]"
              >
                {userDims ? "修改我的评分" : "我要评分"}
              </button>
            </>
          )}
        </div>
      </section>

      {/* 3. 香气层次（蛋糕式堆叠） */}
      <section className="px-4 pt-7">
        <div className="flex items-center justify-between">
          <SectionTitle>香气层次</SectionTitle>
          <span className="text-[11px] text-muted-foreground">
            前调 → 中调 → 后调
          </span>
        </div>
        <div className="mt-4 flex flex-col items-center">
          {d.aroma.map((a, i) => (
            <div
              key={a.stage}
              style={{ width: `${86 + i * 7}%`, zIndex: 3 - i }}
              className={`relative rounded-2xl px-5 py-4 text-center shadow-[0_1px_4px_rgba(107,74,51,0.06)] ${AROMA_TONE_CLASS[a.tone]} ${
                i > 0 ? "-mt-3.5" : ""
              }`}
            >
              <h3 className="text-[13px] font-semibold">
                {a.stage}
                <span className="ml-1.5 font-normal opacity-75">{a.timing}</span>
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed opacity-90">
                {a.desc}
              </p>
              <p className="mt-1.5 text-[11px] italic opacity-70">{a.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 口感层次拆解 */}
      <section className="px-4 pt-7">
        <SectionTitle>口感层次拆解</SectionTitle>
        <div className="mt-3.5">
          {d.textureLayers.map((t, i) => (
            <div key={t.name} className="relative flex gap-3 pb-3.5 last:pb-0">
              {i < d.textureLayers.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[11px] top-7 h-[calc(100%-20px)] w-px bg-border"
                />
              )}
              <span
                aria-hidden="true"
                className="z-10 mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-[#7a5a35]"
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 rounded-2xl border border-border bg-card p-3.5">
                <h3 className="text-[12.5px] font-medium text-foreground">
                  {t.name}
                </h3>
                <p className="mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                  <span className="shrink-0 rounded bg-accent-soft px-1 py-0.5 text-[10px] text-[#7a5a35]">
                    味
                  </span>
                  {t.taste}
                </p>
                <p className="mt-1 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                  <span className="shrink-0 rounded bg-matcha-soft px-1 py-0.5 text-[10px] text-matcha">
                    感
                  </span>
                  {t.mouthfeel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 原料透明度核查 */}
      <section className="px-4 pt-7">
        <SectionTitle>原料透明度核查</SectionTitle>
        <div className="mt-3.5 rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap gap-2">
            {d.ingredients.labels.map((t) => (
              <span
                key={t.label}
                className={`rounded-full px-2.5 py-1 text-[11px] leading-relaxed ${tagChipClass(t.kind)}`}
              >
                {t.label}
              </span>
            ))}
          </div>
          <dl className="mt-4 space-y-2.5 text-[12px]">
            {(
              [
                ["奶油类型", d.ingredients.cream],
                ["糖量等级", d.ingredients.sugar],
                ["添加剂", d.ingredients.additives],
                ["过敏原提示", d.ingredients.allergens],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <dt className="w-16 shrink-0 text-muted-foreground">{label}</dt>
                <dd className="min-w-0 flex-1 leading-relaxed text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 flex items-center gap-1.5 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
            <IconShieldCheck className="h-3.5 w-3.5 shrink-0 text-matcha" />
            核查来源：{d.ingredients.source}
          </p>
        </div>
      </section>

      {/* 6. 真实口碑聚合 */}
      <section className="px-4 pt-7">
        <SectionTitle>真实口碑聚合</SectionTitle>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <IconClock className="h-3.5 w-3.5" />
          来源：{d.source}
        </p>

        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <h3 className="text-[12.5px] font-medium text-foreground">好的地方</h3>
          <ul className="mt-2.5 space-y-2">
            {d.goodReviews.map((r) => (
              <li key={r} className="flex gap-2 text-[12px] leading-relaxed">
                <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-matcha" />
                <span className="min-w-0 text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <h3 className="text-[12.5px] font-medium text-foreground">需要注意</h3>
          <ul className="mt-2.5 space-y-2">
            {d.badReviews.map((r) => (
              <li key={r.text} className="flex gap-2 text-[12px] leading-relaxed">
                <IconAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose" />
                <span className="min-w-0 flex-1 text-muted-foreground">
                  {r.text}
                  <span className="ml-1.5 whitespace-nowrap text-[10px]">
                    {r.count} 人反馈
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. 预订与购买 */}
      <section className="px-4 pt-7">
        <SectionTitle>预订与购买</SectionTitle>
        <dl className="mt-3.5 space-y-2.5 rounded-2xl border border-border bg-card p-4 text-[12px]">
          {(
            [
              ["预订渠道", d.purchase.channel],
              ["预订周期", d.purchase.cycle],
              ["门店地址", d.purchase.address],
              ["定制服务", d.purchase.custom],
              ["保存建议", d.purchase.storage],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex gap-3">
              <dt className="w-16 shrink-0 text-muted-foreground">{label}</dt>
              <dd className="min-w-0 flex-1 leading-relaxed text-foreground">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 8. 评论区 */}
      <section className="px-4 pt-7">
        <div className="flex items-center justify-between">
          <SectionTitle>评论</SectionTitle>
          <span className="text-[11px] text-muted-foreground">
            {comments.length} 条
          </span>
        </div>

        <div className="mt-3.5 rounded-2xl border border-border bg-card p-3.5">
          <label className="sr-only" htmlFor="comment-input">
            写评论
          </label>
          <textarea
            id="comment-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="吃过这款？说说你的真实体验…"
            rows={2}
            maxLength={200}
            className="block w-full resize-none bg-transparent text-[12.5px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {draft.length}/200
            </span>
            <button
              type="button"
              onClick={submitComment}
              disabled={!draft.trim()}
              className="h-9 cursor-pointer rounded-full bg-primary px-5 text-[12.5px] font-medium text-primary-foreground transition hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:active:scale-100"
            >
              发布
            </button>
          </div>
        </div>

        <ul className="mt-3 space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-border bg-card p-3.5"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-medium ${c.tone}`}
                >
                  {c.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-medium text-foreground">
                    {c.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{c.time}</p>
                </div>
              </div>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-foreground/90">
                {c.text}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
