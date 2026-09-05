"use client";

/* 我的页面（PRD 4.6）：头像、名称、性别、手机、生日、地址（本地态，暂无后端） */

import { useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import type { IconProps } from "@/components/icons";

/* 默认头像：奶油底 + 蛋糕线稿 */
function DefaultAvatar({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 21h16" />
      <path d="M5 21v-4a7 7 0 0 1 14 0v4" />
      <path d="M12 10V7" />
      <path d="M12 4.5v.01" />
    </svg>
  );
}

const GENDERS = ["女", "男", "保密"] as const;
type Gender = (typeof GENDERS)[number];

/* 11 位手机号掩码：138****1234 */
function maskedPhone(p: string): string {
  return /^1\d{10}$/.test(p) ? `${p.slice(0, 3)}****${p.slice(7)}` : p || "未填写";
}

export default function MePage() {
  const [name, setName] = useState("糕友小K");
  const [gender, setGender] = useState<Gender>("保密");
  const [phone, setPhone] = useState("13800001234");
  const [birthday, setBirthday] = useState("1998-06-01");
  const [address, setAddress] = useState("上海市静安区安义路 100 号");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function pickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function save() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  const fieldCls =
    "h-full w-full bg-transparent text-right text-[13px] text-foreground focus:outline-none";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-background pb-24">
      {/* 用户卡片 */}
      <section
        className="mx-4 mt-5 flex items-center gap-4 rounded-3xl bg-gradient-to-br from-accent-soft via-[#f3e6d8] to-rose-soft/60 p-5"
        aria-label="用户信息"
      >
        <button
          type="button"
          aria-label="更换头像"
          onClick={() => fileRef.current?.click()}
          className="h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-card bg-card shadow-sm transition active:scale-95"
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="头像" className="h-full w-full object-cover" />
          ) : (
            <DefaultAvatar className="h-9 w-9 text-accent" />
          )}
        </button>
        <div className="min-w-0">
          <p className="truncate font-serif text-[18px] font-semibold text-foreground">
            {name || "未命名糕友"}
          </p>
          <p className="mt-1 text-[11.5px] tabular-nums text-muted-foreground">
            {maskedPhone(phone)} · {gender}
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={pickAvatar}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </section>

      {/* 基本资料 */}
      <section className="mx-4 mt-4 rounded-2xl border border-border bg-card" aria-label="基本资料">
        <h2 className="px-4 pt-4 text-[13px] font-semibold text-foreground">
          基本资料
        </h2>
        <div className="mt-1">
          {/* 头像 */}
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-12 shrink-0 text-[12px] text-muted-foreground">头像</span>
            <button
              type="button"
              aria-label="更换头像"
              onClick={() => fileRef.current?.click()}
              className="ml-auto flex cursor-pointer items-center gap-2 transition active:scale-95"
            >
              <span className="text-[11px] text-muted-foreground">点击更换</span>
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-accent-soft">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="头像" className="h-full w-full object-cover" />
                ) : (
                  <DefaultAvatar className="h-6 w-6 text-accent" />
                )}
              </span>
            </button>
          </div>
          {/* 名称 */}
          <label className="flex items-center gap-3 border-t border-border/50 px-4 py-3.5">
            <span className="w-12 shrink-0 text-[12px] text-muted-foreground">名称</span>
            <input
              type="text"
              value={name}
              maxLength={16}
              onChange={(e) => setName(e.target.value)}
              placeholder="怎么称呼你"
              className={`${fieldCls} ml-auto`}
            />
          </label>
          {/* 性别 */}
          <div className="flex items-center gap-3 border-t border-border/50 px-4 py-3">
            <span className="w-12 shrink-0 text-[12px] text-muted-foreground">性别</span>
            <div className="ml-auto flex gap-1.5" role="radiogroup" aria-label="性别">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={gender === g}
                  onClick={() => setGender(g)}
                  className={`h-7 cursor-pointer rounded-full border px-3 text-[11px] transition active:scale-95 ${
                    gender === g
                      ? "border-primary/40 bg-primary/10 font-medium text-primary"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          {/* 手机 */}
          <label className="flex items-center gap-3 border-t border-border/50 px-4 py-3.5">
            <span className="w-12 shrink-0 text-[12px] text-muted-foreground">手机</span>
            <input
              type="tel"
              value={phone}
              maxLength={11}
              inputMode="numeric"
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="11 位手机号"
              className={`${fieldCls} ml-auto tabular-nums`}
            />
          </label>
          {/* 生日 */}
          <label className="flex items-center gap-3 border-t border-border/50 px-4 py-3.5">
            <span className="w-12 shrink-0 text-[12px] text-muted-foreground">生日</span>
            <input
              type="date"
              value={birthday}
              max="2026-12-31"
              onChange={(e) => setBirthday(e.target.value)}
              className={`${fieldCls} ml-auto tabular-nums`}
            />
          </label>
          {/* 地址 */}
          <label className="flex items-center gap-3 border-t border-border/50 px-4 py-3.5">
            <span className="w-12 shrink-0 text-[12px] text-muted-foreground">地址</span>
            <input
              type="text"
              value={address}
              maxLength={40}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="收货地址"
              className={`${fieldCls} ml-auto`}
            />
          </label>
        </div>
      </section>

      {/* 保存 */}
      <div className="mx-4 mt-5">
        <button
          type="button"
          onClick={save}
          className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl text-[15px] font-medium shadow-[0_4px_14px_rgba(107,74,51,0.16)] transition active:scale-[0.99] ${
            saved ? "bg-matcha text-card" : "bg-primary text-primary-foreground hover:opacity-95"
          }`}
        >
          {saved ? "已保存" : "保存资料"}
        </button>
      </div>

      <BottomNav active="me" />
    </div>
  );
}
