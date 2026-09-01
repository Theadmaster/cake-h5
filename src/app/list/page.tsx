/* 选购列表页 · 糕研所（PRD 4.2） */

import Link from "next/link";
import CakeBrowser from "@/components/CakeBrowser";
import BottomNav from "@/components/BottomNav";
import { IconSearch } from "@/components/icons";
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

export default function ListPage() {
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
            全部蛋糕
          </h1>
          <button
            type="button"
            aria-label="搜索"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-foreground transition hover:bg-muted active:scale-95"
          >
            <IconSearch className="h-[19px] w-[19px]" />
          </button>
        </div>
      </header>

      <CakeBrowser stickyTopClass="top-14" />

      <BottomNav active="list" />
    </div>
  );
}
