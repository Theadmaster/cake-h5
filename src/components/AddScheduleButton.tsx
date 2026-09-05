"use client";

/* 「即将开抢」添加到手机日历：生成 .ics 下载（iOS Safari 弹出添加到日历，Android 由日历应用导入） */

import { useState } from "react";
import type { IconProps } from "@/components/icons";

function IconCalendarPlus({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 2v4M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M12 14v4M10 16h4" />
    </svg>
  );
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/* ics 浮动本地时间：YYYYMMDDTHHMMSS */
function icsTime(d: Date): string {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

/* 下一个周日 13:00（今天周日则取下周日） */
function nextSunday13(): Date {
  const d = new Date();
  const diff = (7 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + diff);
  d.setHours(13, 0, 0, 0);
  return d;
}

function buildIcs(summary: string, description: string): string {
  const start = nextSunday13();
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  /* 文本保持简短，避免超出 RFC 5545 单行 75 字节需折行的场景 */
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Oh My Cake//Drop Reminder//CN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:drop-${start.getTime()}@ohmycake`,
    `DTSTART:${icsTime(start)}`,
    `DTEND:${icsTime(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:开抢前 15 分钟提醒",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export default function AddScheduleButton({
  summary,
  description,
  className = "",
}: {
  summary: string;
  description: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  function handleClick() {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      window.alert(
        "微信内无法添加日程，请点右上角「…」选「在浏览器打开」后再试",
      );
      return;
    }
    const blob = new Blob([buildIcs(summary, description)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "开抢提醒.ics";
    a.click();
    URL.revokeObjectURL(url);
    setDone(true);
    window.setTimeout(() => setDone(false), 2000);
  }

  return (
    <button
      type="button"
      aria-label="把开抢时间添加到手机日历"
      onClick={handleClick}
      className={`flex h-7 cursor-pointer items-center justify-center gap-1 rounded-full border border-accent/50 bg-card px-2.5 text-[10px] font-medium text-[#7a5a35] transition active:scale-95 ${className}`}
    >
      <IconCalendarPlus className="h-3 w-3" />
      {done ? "已生成日程" : "添加日程"}
    </button>
  );
}
