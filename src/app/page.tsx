/* 首页 · 糕研所（PRD 4.1） */

/* ---------------- 图标（内联 SVG，Lucide 风格） ---------------- */

type IconProps = { className?: string };

function IconBell({ className }: IconProps) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function IconSearch({ className }: IconProps) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconSparkle({ className }: IconProps) {
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
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />
    </svg>
  );
}

function IconArrowRight({ className }: IconProps) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconStar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.5l2.94 5.95 6.57.96-4.76 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.49 9.41l6.57-.96z" />
    </svg>
  );
}

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

/* 品牌标：简约双层蛋糕 */
function LogoMark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M7 15.5h18v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 7 24.5z"
        fill="#6b4a33"
      />
      <path
        d="M10.5 9.5h11v6h-11z"
        fill="#b0824f"
      />
      <path
        d="M16 4.5v2M11 6.5v2M21 6.5v2"
        stroke="#c48f8a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="3.5" r="1" fill="#c48f8a" />
    </svg>
  );
}

/* 商品图占位：蛋糕轮廓 */
function CakeSilhouette({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M10 32h28v7a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path d="M15 22h18v10H15z" fill="currentColor" fillOpacity="0.55" />
      <path
        d="M24 12v3M17 14v3M31 14v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 32c3 0 3-2.5 6-2.5s3 2.5 6 2.5 3-2.5 6-2.5 3 2.5 6 2.5"
        stroke="#faf7f1"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ---------------- 数据（PRD 示例） ---------------- */

const brands = [
  "全部",
  "ITA Cake",
  "Sillage",
  "POURNIL",
  "Tinyroll",
  "Haku",
  "FineART",
];

type Featured = {
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  rating: number;
  reviews: number;
  tag: string;
  tagClass: string;
  art: string;
  silhouetteColor: string;
};

const featuredCakes: Featured[] = [
  {
    id: "c1",
    name: "咸法酪玫瑰草莓千层",
    brand: "Sillage",
    size: "6寸",
    price: 238,
    rating: 4.2,
    reviews: 128,
    tag: "顶流",
    tagClass: "bg-rose text-white",
    art: "bg-gradient-to-br from-[#f6e4e1] to-[#e5beb8]",
    silhouetteColor: "text-[#c48f8a]",
  },
  {
    id: "c2",
    name: "焙茶生巧慕斯",
    brand: "POURNIL",
    size: "5寸",
    price: 198,
    rating: 4.5,
    reviews: 96,
    tag: "秒罄",
    tagClass: "bg-primary text-white",
    art: "bg-gradient-to-br from-[#e7efe4] to-[#c7d8bd]",
    silhouetteColor: "text-[#5f7d5c]",
  },
  {
    id: "c3",
    name: "经典原味瑞士卷",
    brand: "Tinyroll",
    size: "切块",
    price: 42,
    rating: 4.3,
    reviews: 210,
    tag: "热门",
    tagClass: "bg-accent text-white",
    art: "bg-gradient-to-br from-[#f7ebd3] to-[#ecd8ab]",
    silhouetteColor: "text-[#b0824f]",
  },
  {
    id: "c4",
    name: "茉莉青提千层",
    brand: "Haku",
    size: "6寸",
    price: 218,
    rating: 4.4,
    reviews: 87,
    tag: "高颜值",
    tagClass: "bg-matcha text-white",
    art: "bg-gradient-to-br from-[#e4ebe3] to-[#cfe0d2]",
    silhouetteColor: "text-[#6e8b6b]",
  },
  {
    id: "c5",
    name: "70% 黑巧海盐戚风",
    brand: "FineART",
    size: "6寸",
    price: 168,
    rating: 4.1,
    reviews: 65,
    tag: "纯元",
    tagClass: "bg-[#4a3320] text-white",
    art: "bg-gradient-to-br from-[#e5d5c5] to-[#d1b79c]",
    silhouetteColor: "text-[#6b4a33]",
  },
];

const lessons = [
  {
    id: "l1",
    title: "动物奶油辨真假",
    desc: "3 句话辨真假，别再被“牛乳奶油”忽悠",
    theme: "bg-matcha-soft",
    iconBg: "bg-matcha/10",
    iconColor: "text-matcha",
  },
  {
    id: "l2",
    title: "尺寸人数对照表",
    desc: "4 寸 / 6 寸 / 8 寸，到底该买多大？",
    theme: "bg-accent-soft",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
];

const navTabs = [
  { label: "首页", active: true, icon: IconHome },
  { label: "选购", active: false, icon: IconGrid },
  { label: "百科", active: false, icon: IconBook },
  { label: "我的", active: false, icon: IconUser },
];

/* ---------------- 通用小组件 ---------------- */

function SectionTitle({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <div className="flex items-center gap-2 px-4">
      <span aria-hidden="true" className="h-4 w-[3px] rounded-full bg-accent" />
      <h2
        id={id}
        className="font-serif text-[17px] font-semibold tracking-wide text-foreground"
      >
        {children}
      </h2>
    </div>
  );
}

/* ---------------- 页面 ---------------- */

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-background">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <h1 className="font-serif text-lg font-semibold tracking-[0.08em] text-foreground">
              糕研所
            </h1>
            <span className="ml-1 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] leading-none text-muted-foreground">
              私房蛋糕严选
            </span>
          </div>
          <button
            type="button"
            aria-label="消息通知"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-foreground transition hover:bg-muted active:scale-95"
          >
            <IconBell className="h-[22px] w-[22px]" />
            <span
              aria-hidden="true"
              className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose ring-2 ring-background"
            />
          </button>
        </div>
      </header>

      <main className="flex-1 pb-28">
        {/* 搜索栏 */}
        <div className="px-4 pt-4">
          <button
            type="button"
            aria-label="搜索蛋糕、品牌、口味"
            className="flex h-12 w-full cursor-pointer items-center gap-2.5 rounded-full border border-border bg-card px-4 text-left shadow-[0_1px_4px_rgba(107,74,51,0.06)] transition hover:border-accent/50 active:scale-[0.99]"
          >
            <IconSearch className="h-[18px] w-[18px] text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              搜蛋糕、品牌、口味…
            </span>
          </button>
        </div>

        {/* AI 口味匹配入口 */}
        <section className="px-4 pt-4" aria-labelledby="ai-match-title">
          <button
            type="button"
            className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent-soft via-rose-soft to-matcha-soft p-5 text-left transition hover:shadow-[0_4px_16px_rgba(176,130,79,0.18)] active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <IconSparkle className="h-[18px] w-[18px] text-accent" />
                  <h2
                    id="ai-match-title"
                    className="font-serif text-[17px] font-semibold tracking-wide text-primary"
                  >
                    AI 口味匹配
                  </h2>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  告诉我你的口味偏好和场景
                  <br />
                  30 秒帮你找到最适合的蛋糕，告别盲选踩雷
                </p>
                <span className="mt-3.5 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition group-hover:gap-2.5">
                  开始匹配
                  <IconArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <CakeSilhouette className="h-20 w-20 shrink-0 text-primary/15" />
            </div>
          </button>
        </section>

        {/* 热门品牌 */}
        <section className="pt-7" aria-labelledby="brands-title">
          <SectionTitle id="brands-title">热门品牌</SectionTitle>
          <div className="no-scrollbar flex snap-x gap-2.5 overflow-x-auto px-4 pt-3">
            {brands.map((brand, i) => (
              <button
                key={brand}
                type="button"
                aria-pressed={i === 0}
                className={`h-11 shrink-0 snap-start cursor-pointer rounded-full border px-4 text-[13px] font-medium transition active:scale-95 ${
                  i === 0
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-accent/50"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </section>

        {/* 编辑精选 */}
        <section className="pt-7" aria-labelledby="featured-title">
          <SectionTitle id="featured-title">编辑精选</SectionTitle>
          <div className="no-scrollbar flex snap-x gap-3.5 overflow-x-auto px-4 pt-3.5">
            {featuredCakes.map((cake) => (
              <button
                key={cake.id}
                type="button"
                className="w-[176px] shrink-0 snap-start cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_4px_rgba(107,74,51,0.05)] transition hover:shadow-[0_4px_14px_rgba(107,74,51,0.1)] active:scale-[0.98]"
              >
                <div
                  className={`relative flex aspect-square items-center justify-center ${cake.art}`}
                >
                  <CakeSilhouette className={`h-20 w-20 ${cake.silhouetteColor}`} />
                  <span
                    className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-medium leading-relaxed ${cake.tagClass}`}
                  >
                    {cake.tag}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="truncate text-[13.5px] font-medium text-foreground">
                    {cake.name}
                  </h3>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">
                    {cake.brand} · {cake.size}
                  </p>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-serif text-[15px] font-semibold text-primary">
                      <span className="text-[11px] font-normal">¥</span>
                      {cake.price}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <IconStar className="h-3 w-3 text-accent" />
                      {cake.rating.toFixed(1)}
                      <span className="text-[10px]">({cake.reviews})</span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 买糕必修课 */}
        <section className="pt-7" aria-labelledby="lessons-title">
          <SectionTitle id="lessons-title">买糕必修课</SectionTitle>
          <div className="no-scrollbar flex snap-x gap-3.5 overflow-x-auto px-4 pt-3.5">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                className={`flex w-[240px] shrink-0 snap-start cursor-pointer flex-col rounded-2xl border border-border p-4 text-left transition hover:shadow-[0_4px_14px_rgba(107,74,51,0.08)] active:scale-[0.98] ${lesson.theme}`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${lesson.iconBg}`}
                >
                  <IconBook className={`h-5 w-5 ${lesson.iconColor}`} />
                </span>
                <h3 className="mt-3 font-serif text-[15px] font-semibold text-foreground">
                  {lesson.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {lesson.desc}
                </p>
                <span
                  className={`mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-medium ${lesson.iconColor}`}
                >
                  去学习
                  <IconArrowRight className="h-3 w-3" />
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* 底部导航 */}
      <nav
        aria-label="主导航"
        className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      >
        <div className="grid h-16 grid-cols-4">
          {navTabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              aria-current={tab.active ? "page" : undefined}
              className={`flex cursor-pointer flex-col items-center justify-center gap-1 transition active:scale-95 ${
                tab.active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-[22px] w-[22px]" />
              <span className="text-[10px] leading-none">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
