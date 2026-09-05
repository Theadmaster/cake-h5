/* 首页 · 哦买糕的 Oh My Cake!（原型图布局：KV + 平台名 + 三卡片 + CTA + 选糕列表） */

import Link from "next/link";
import CakeBrowser from "@/components/CakeBrowser";
import KvArt from "@/components/KvArt";
import UpcomingCard from "@/components/UpcomingCard";

/* 平台亮点（静态两张） */
const highlights = [
  {
    title: "预订攻略",
    main: "6 大私房品牌",
    sub: "Tinyroll、Sillage 等",
    href: "/guide",
  },
  {
    title: "选糕百科",
    main: "动物奶油辨真假",
    sub: "买糕必修课",
    href: "/wiki",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-background">
      {/* KV 主图 */}
      <section className="relative" aria-label="主视觉">
        <KvArt className="block aspect-[480/520] w-full" />
        {/* 右上角悬浮入口 */}
        <div className="absolute right-4 top-4 flex gap-2.5">
          <Link
            href="/list"
            className="flex h-11 cursor-pointer items-center rounded-full border border-border bg-card/90 px-4 text-xs text-foreground shadow-sm backdrop-blur transition hover:bg-card active:scale-95"
          >
            搜索
          </Link>
          <Link
            href="/me"
            className="flex h-11 cursor-pointer items-center rounded-full border border-border bg-card/90 px-4 text-xs text-foreground shadow-sm backdrop-blur transition hover:bg-card active:scale-95"
          >
            我的
          </Link>
        </div>
      </section>

      {/* 平台名称 */}
      <section className="px-6 pt-5 text-center">
        <h1 className="font-serif text-[26px] font-semibold tracking-[0.06em] text-foreground">
          哦买糕的
        </h1>
        <p className="mt-1 font-serif text-[19px] font-medium tracking-[0.05em] text-foreground">
          Oh My Cake!
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          认真研究每一块蛋糕，帮你选对糕、也订上糕
        </p>
      </section>

      {/* 平台亮点三卡片 */}
      <section
        className="grid grid-cols-3 gap-3 px-4 pt-5"
        aria-label="平台亮点"
      >
        {highlights.map((h) => (
          <Link
            key={h.title}
            href={h.href}
            className="flex min-h-[128px] flex-col items-center justify-center rounded-2xl bg-muted/70 p-3 text-center transition hover:bg-muted active:scale-[0.98]"
          >
            <span className="text-[10px] text-muted-foreground">{h.title}</span>
            <span className="text-[12.5px] font-medium leading-snug text-foreground">
              {h.main}
            </span>
            <span className="text-[10px] leading-snug text-muted-foreground">
              {h.sub}
            </span>
          </Link>
        ))}
        <UpcomingCard />
      </section>

      {/* CTA */}
      <div className="px-4 pt-5">
        <Link
          href="/list"
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-primary text-[15px] font-medium text-primary-foreground shadow-[0_4px_14px_rgba(107,74,51,0.16)] transition hover:opacity-95 active:scale-[0.99]"
        >
          去选糕
        </Link>
      </div>

      {/* 选糕列表（与选购页一致） */}
      <div className="pt-4">
        <CakeBrowser />
      </div>
    </div>
  );
}
