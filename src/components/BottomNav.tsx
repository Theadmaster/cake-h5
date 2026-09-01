/* 底部导航（首页 / 选购 / 百科 / 我的） */

import type { IconProps } from "./icons";

function IconHome({ className }: IconProps) {
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
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
    </svg>
  );
}

function IconGrid({ className }: IconProps) {
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
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

function IconBook({ className }: IconProps) {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </svg>
  );
}

function IconUser({ className }: IconProps) {
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-3.5 4-5.5 8-5.5s7.2 2 8 5.5" />
    </svg>
  );
}

const tabs = [
  { key: "home", label: "首页", icon: IconHome },
  { key: "list", label: "选购", icon: IconGrid },
  { key: "wiki", label: "百科", icon: IconBook },
  { key: "me", label: "我的", icon: IconUser },
] as const;

export type NavKey = (typeof tabs)[number]["key"];

export default function BottomNav({ active }: { active: NavKey }) {
  return (
    <nav
      aria-label="主导航"
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <div className="grid h-16 grid-cols-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            aria-current={tab.key === active ? "page" : undefined}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 transition active:scale-95 ${
              tab.key === active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="h-[22px] w-[22px]" />
            <span className="text-[10px] leading-none">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
