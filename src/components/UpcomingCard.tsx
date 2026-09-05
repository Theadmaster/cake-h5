"use client";

/* 即将开抢卡片：展示今天（或最近）的放号品牌，多品牌时自动滚动 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AddScheduleButton from "@/components/AddScheduleButton";

interface ScheduleItem {
  time: string | null;
  brand: string;
  slug: string;
}

interface ScheduleDay {
  day: string;
  items: ScheduleItem[];
}

interface ScheduleData {
  daily: ScheduleItem[];
  schedule: ScheduleDay[];
}

const DAY_LABELS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

/** 获取今天是周几（1=周一 ... 7=周日） */
function todayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 7 : d;
}

/** 合并"每天"品牌和当天/最近的品牌 */
function resolveItems(data: ScheduleData): { items: ScheduleItem[]; label: string } {
  const today = todayIndex();
  const todayLabel = DAY_LABELS[today - 1];

  // 今天按周几放号的品牌 + 每天都放号的品牌
  const dayMatch = data.schedule.find((s) => s.day === todayLabel);
  const todayItems = [...data.daily, ...(dayMatch?.items ?? [])];

  if (todayItems.length > 0) {
    return { items: todayItems, label: "今日开抢" };
  }

  // 今天没有，找最近的下一天（每天的品牌也带上）
  const after = data.schedule.filter((s) => DAY_LABELS.indexOf(s.day) > today - 1);
  const nearest = after.length > 0 ? after[0] : data.schedule[0];

  if (nearest) {
    return { items: [...data.daily, ...nearest.items], label: `${nearest.day}开抢` };
  }

  // 只有每天的品牌
  if (data.daily.length > 0) {
    return { items: data.daily, label: "每日放号" };
  }

  return { items: [], label: "" };
}

export default function UpcomingCard() {
  const [data, setData] = useState<ScheduleData>({ daily: [], schedule: [] });
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    fetch("/api/brands/schedule")
      .then((r) => r.json())
      .then((json) => {
        if (json.code === 0) setData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const { items, label } = resolveItems(data);

  /* 多品牌时每 3s 滚动一条 */
  useEffect(() => {
    if (items.length <= 1) return;
    timerRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const itemH = 36;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const next = el.scrollTop + itemH;
      el.scrollTo({ top: next >= maxScroll ? 0 : next, behavior: "smooth" });
    }, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length]);

  if (loading) {
    return (
      <div className="flex min-h-[128px] flex-col items-center justify-center rounded-2xl bg-muted/70 p-3 text-center">
        <span className="text-[10px] text-muted-foreground">即将开抢</span>
        <span className="mt-2 text-[11px] text-muted-foreground">加载中...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[128px] flex-col items-center justify-center rounded-2xl bg-muted/70 p-3 text-center">
        <span className="text-[10px] text-muted-foreground">即将开抢</span>
        <span className="mt-1.5 text-[12.5px] font-medium leading-snug text-foreground">
          暂无放号安排
        </span>
      </div>
    );
  }

  const first = items[0];

  return (
    <div className="flex min-h-[128px] flex-col rounded-2xl bg-muted/70 p-3 text-center transition hover:bg-muted">
      <Link
        href="/list"
        className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 active:scale-[0.98]"
      >
        <span className="text-[10px] text-muted-foreground">{label}</span>
        {items.length === 1 ? (
          <>
            <span className="text-[12.5px] font-medium leading-snug text-foreground">
              {first.brand}
            </span>
            <span className="text-[10px] leading-snug text-muted-foreground">
              {first.time ? `${first.time} 放号` : "放号"}
            </span>
          </>
        ) : (
          /* 多品牌滚动区域 */
          <div
            ref={scrollRef}
            className="w-full overflow-hidden"
            style={{ maxHeight: 36 }}
          >
            {items.map((item) => (
              <div
                key={item.slug}
                className="flex h-9 flex-col items-center justify-center"
              >
                <span className="text-[12.5px] font-medium leading-snug text-foreground">
                  {item.brand}
                </span>
                <span className="text-[10px] leading-snug text-muted-foreground">
                  {item.time ? `${item.time} 放号` : "放号"}
                </span>
              </div>
            ))}
          </div>
        )}
      </Link>
      <AddScheduleButton
        className="mt-2 w-full"
        summary={`开抢提醒：${first.brand}`}
        description={`${first.brand} ${label}${first.time ? " " + first.time : ""} 放号，提前蹲点`}
      />
    </div>
  );
}
