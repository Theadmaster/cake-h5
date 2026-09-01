"use client";

/* 选糕列表（平铺筛选 + 排序 + 商品卡片）· 首页与选购页共用 */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { cakes } from "@/data/cakes";
import type { TagKind } from "@/data/cakes";
import { CakeSilhouette, IconClock, IconSearch, IconStar } from "@/components/icons";
import type { IconProps } from "@/components/icons";

function IconArrowUp({ className }: IconProps) {
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
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

/* ---------------- 筛选与排序 ---------------- */

const FILTERS = [
  {
    key: "brand",
    label: "品牌",
    options: ["ITA Cake", "Sillage", "POURNIL", "Tinyroll", "Haku", "FineART"],
  },
  {
    key: "size",
    label: "尺寸",
    options: ["4寸", "5寸", "6寸", "8寸", "10寸", "切块"],
  },
  {
    key: "booking",
    label: "日期",
    options: ["提前1天", "提前2天", "提前3天以上", "预约制/抢购", "当日可取"],
  },
  {
    key: "flavor",
    label: "口味",
    options: [
      "酸甜果味",
      "茶味清苦",
      "芝士咸香",
      "巧克力浓郁",
      "花香调",
      "椰香热带",
      "奶茶风味",
      "咸甜口",
    ],
  },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];
type Selection = Record<FilterKey, string[]>;

const emptySelection: Selection = {
  brand: [],
  size: [],
  booking: [],
  flavor: [],
};

const SORTS = ["综合排序", "评分最高", "价格最低", "销量最高"];

function tagChipClass(kind: TagKind): string {
  switch (kind) {
    case "good":
      return "bg-matcha-soft text-matcha";
    case "note":
      return "bg-accent-soft text-[#7a5a35]";
    default:
      return "bg-muted text-muted-foreground";
  }
}

/* ---------------- 组件 ---------------- */

export default function CakeBrowser({
  stickyTopClass = "top-0",
}: {
  stickyTopClass?: string;
}) {
  const [selected, setSelected] = useState<Selection>(emptySelection);
  const [sortBy, setSortBy] = useState(0);
  const [query, setQuery] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* 哨兵滚出吸顶线时，视为已吸顶 */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const offset = stickyTopClass === "top-14" ? 56 : 0;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stickyTopClass]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = cakes.filter((c) => {
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.brand.toLowerCase().includes(q) &&
        !c.flavors.some((f) => f.toLowerCase().includes(q))
      )
        return false;
      if (selected.brand.length && !selected.brand.includes(c.brand))
        return false;
      if (selected.size.length && !selected.size.includes(c.size))
        return false;
      if (
        selected.flavor.length &&
        !c.flavors.some((f) => selected.flavor.includes(f))
      )
        return false;
      if (selected.booking.length && !selected.booking.includes(c.bookingGroup))
        return false;
      return true;
    });
    const sorted = [...filtered];
    if (sortBy === 1) sorted.sort((a, b) => b.rating - a.rating);
    if (sortBy === 2) sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 3) sorted.sort((a, b) => b.reviews - a.reviews);
    return sorted;
  }, [selected, sortBy, query]);

  function toggleSelection(key: FilterKey, opt: string) {
    setSelected((prev) => {
      const cur = prev[key];
      return {
        ...prev,
        [key]: cur.includes(opt)
          ? cur.filter((o) => o !== opt)
          : [...cur, opt],
      };
    });
  }

  function clearDimension(key: FilterKey) {
    setSelected((prev) => ({ ...prev, [key]: [] }));
  }

  return (
    <>
      {/* 吸顶哨兵 */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* 筛选（吸顶，搜索框仅吸顶时出现） */}
      <div
        className={`sticky ${stickyTopClass} z-30 border-b border-border/70 bg-background px-4 pb-3.5 pt-3`}
      >
        {stuck && (
          <div className="mb-3 flex h-11 items-center gap-2.5 rounded-full border border-border bg-card px-4 shadow-[0_1px_4px_rgba(107,74,51,0.06)]">
            <IconSearch className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜蛋糕、品牌、口味…"
              aria-label="搜索蛋糕、品牌、口味"
              className="h-full w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        )}

        {/* 筛选（平铺单行横滑） */}
        <div className="space-y-3">
          {FILTERS.map((f) => (
            <div key={f.key} className="flex gap-2.5">
              <span className="w-8 shrink-0 pt-[10px] text-[11px] text-muted-foreground">
                {f.label}
              </span>
              <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto py-0.5">
                <button
                  type="button"
                  aria-pressed={selected[f.key].length === 0}
                  onClick={() => clearDimension(f.key)}
                  className={`h-9 shrink-0 cursor-pointer rounded-full border px-3 text-[12px] transition active:scale-95 ${
                    selected[f.key].length === 0
                      ? "border-accent bg-accent-soft font-medium text-[#7a5a35]"
                      : "border-border bg-card text-foreground hover:border-accent/50"
                  }`}
                >
                  全部
                </button>
                {f.options.map((opt) => {
                  const on = selected[f.key].includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleSelection(f.key, opt)}
                      className={`h-9 shrink-0 cursor-pointer rounded-full border px-3 text-[12px] transition active:scale-95 ${
                        on
                          ? "border-accent bg-accent-soft font-medium text-[#7a5a35]"
                          : "border-border bg-card text-foreground hover:border-accent/50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 排序栏 */}
      <div className="flex items-center gap-5 border-b border-border/70 bg-background px-4">
        {SORTS.map((s, i) => (
          <button
            key={s}
            type="button"
            aria-pressed={sortBy === i}
            onClick={() => setSortBy(i)}
            className={`relative flex h-10 cursor-pointer items-center text-[12.5px] transition ${
              sortBy === i
                ? "font-semibold text-primary"
                : "text-muted-foreground"
            }`}
          >
            {s}
            {sortBy === i && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-accent"
              />
            )}
          </button>
        ))}
      </div>

      {/* 商品列表 */}
      <div className="flex-1 px-4 pt-3.5 pb-28" aria-label="蛋糕列表">
        {list.length > 0 ? (
          <ul className="space-y-3">
            {list.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/cake/${c.id}`}
                  className="flex w-full cursor-pointer gap-3.5 rounded-2xl border border-border bg-card p-3 text-left shadow-[0_1px_4px_rgba(107,74,51,0.05)] transition hover:shadow-[0_4px_14px_rgba(107,74,51,0.1)] active:scale-[0.99]"
                >
                  <div
                    className={`relative flex h-[108px] w-[108px] shrink-0 items-center justify-center overflow-hidden rounded-xl ${c.art}`}
                  >
                    <CakeSilhouette
                      className={`h-14 w-14 ${c.silhouetteColor}`}
                    />
                    <span
                      className={`absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium leading-relaxed ${c.heatClass}`}
                    >
                      {c.heatTag}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                    <div className="min-w-0">
                      <h2 className="truncate text-[13.5px] font-medium text-foreground">
                        {c.name}
                      </h2>
                      <p className="mt-1 truncate text-[11px] text-muted-foreground">
                        {c.brand} · {c.size} · {c.addr}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {c.tags.slice(0, 3).map((t) => (
                          <span
                            key={t.label}
                            className={`rounded-full px-1.5 py-0.5 text-[10px] leading-relaxed ${tagChipClass(t.kind)}`}
                          >
                            {t.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <IconStar className="h-3 w-3 text-accent" />
                        <span className="font-medium text-foreground">
                          {c.rating.toFixed(1)}
                        </span>
                        <span
                          aria-hidden="true"
                          className="h-1 w-9 overflow-hidden rounded-full bg-muted"
                        >
                          <span
                            className="block h-full rounded-full bg-accent"
                            style={{ width: `${(c.rating / 5) * 100}%` }}
                          />
                        </span>
                        <span className="sr-only">
                          评分进度条 {Math.round((c.rating / 5) * 100)}%
                        </span>
                        {c.reviews}人评
                      </div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="font-serif text-[16px] font-semibold text-primary">
                          <span className="text-[11px] font-normal">¥</span>
                          {c.price}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <IconClock className="h-3.5 w-3.5 text-accent" />
                          {c.booking}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-2.5 py-16 text-center">
            <CakeSilhouette className="h-12 w-12 text-border" />
            <p className="text-sm text-muted-foreground">
              没有符合条件的蛋糕，试试放宽筛选
            </p>
            <button
              type="button"
              onClick={() => setSelected(emptySelection)}
              className="cursor-pointer text-xs text-accent underline underline-offset-4"
            >
              清空全部筛选
            </button>
          </div>
        )}

        {list.length > 0 && (
          <p className="py-6 text-center text-[11px] text-muted-foreground/70">
            —— 已经到底啦 ——
          </p>
        )}
      </div>

      {/* 返回顶部 */}
      {showTop && (
        <button
          type="button"
          aria-label="返回顶部"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-4 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(107,74,51,0.28)] transition hover:opacity-95 active:scale-95"
        >
          <IconArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
