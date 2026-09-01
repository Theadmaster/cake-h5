/* KV 插画：俯拍柠檬奶油挞（与站点 SVG 插画风格一致） */

export default function KvArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <radialGradient id="kv-bg" cx="50%" cy="30%" r="90%">
          <stop offset="0%" stopColor="#fdfaf4" />
          <stop offset="100%" stopColor="#f4ede1" />
        </radialGradient>
        <radialGradient id="kv-cream" cx="42%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#fffefa" />
          <stop offset="100%" stopColor="#f7efe0" />
        </radialGradient>
      </defs>

      <rect width="480" height="520" fill="url(#kv-bg)" />

      {/* 挞的柔和投影 */}
      <ellipse cx="248" cy="268" rx="232" ry="216" fill="#e3d5bd" opacity="0.55" />

      {/* 挞皮 */}
      <circle cx="240" cy="150" r="230" fill="#e6c488" />
      <circle cx="240" cy="150" r="230" fill="none" stroke="#d9b170" strokeWidth="3" />
      {/* 挞皮颗粒边 */}
      <circle
        cx="240"
        cy="150"
        r="218"
        fill="none"
        stroke="#d9b170"
        strokeWidth="10"
        strokeDasharray="2 9"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* 内层挞皮 */}
      <circle cx="240" cy="150" r="200" fill="#f0d9a6" />

      {/* 奶油 */}
      <circle cx="240" cy="150" r="182" fill="url(#kv-cream)" />
      <path
        d="M110 150c0-72 58-130 130-130s130 58 130 130-58 130-130 130-130-58-130-130Z"
        fill="#fffdf7"
      />
      {/* 奶油漩涡 */}
      <path
        d="M240 66c46 0 84 38 84 84s-38 84-84 84-84-38-84-84 38-84 84-84Z"
        fill="none"
        stroke="#efe4cd"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M240 100c28 0 50 22 50 50s-22 50-50 50-50-22-50-50 22-50 50-50Z"
        fill="none"
        stroke="#f3ebd9"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* 柠檬片 */}
      <g transform="translate(196 118) rotate(-18)">
        <circle r="46" fill="#f2cf5e" />
        <circle r="39" fill="#f8e59a" />
        <path
          d="M0-39v78M-39 0h78M-28-28 28 28M-28 28 28-28"
          stroke="#fdf4cf"
          strokeWidth="7"
        />
        <circle r="39" fill="none" stroke="#fdf4cf" strokeWidth="4" />
      </g>
      <g transform="translate(282 186) rotate(24)">
        <circle r="40" fill="#f2cf5e" />
        <circle r="34" fill="#f8e59a" />
        <path
          d="M0-34v68M-34 0h68M-24-24 24 24M-24 24 24-24"
          stroke="#fdf4cf"
          strokeWidth="6"
        />
        <circle r="34" fill="none" stroke="#fdf4cf" strokeWidth="4" />
      </g>

      {/* 蓝莓 */}
      <g transform="translate(300 96)">
        <circle r="17" fill="#565a88" />
        <circle r="17" fill="none" stroke="#494d7a" strokeWidth="2" />
        <circle cx="-5" cy="-6" r="5" fill="#8d92bd" opacity="0.85" />
        <circle cx="6" cy="2" r="1.6" fill="#3c4066" />
      </g>
      <g transform="translate(322 128)">
        <circle r="13" fill="#5f6392" />
        <circle cx="-4" cy="-4" r="4" fill="#9398c4" opacity="0.85" />
      </g>
      <g transform="translate(330 232)">
        <circle r="15" fill="#565a88" />
        <circle cx="-5" cy="-5" r="4.5" fill="#8d92bd" opacity="0.85" />
      </g>
      <g transform="translate(352 262)">
        <circle r="11" fill="#5f6392" />
        <circle cx="-3" cy="-3" r="3.4" fill="#9398c4" opacity="0.85" />
      </g>
      <g transform="translate(168 244)">
        <circle r="12" fill="#565a88" />
        <circle cx="-4" cy="-4" r="3.8" fill="#8d92bd" opacity="0.85" />
      </g>

      {/* 薄荷叶 */}
      <g transform="translate(258 226) rotate(-32)">
        <ellipse cx="0" cy="0" rx="12" ry="24" fill="#7d9b6a" />
        <path d="M0-20v40" stroke="#5f7d52" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g transform="translate(368 210) rotate(40)">
        <ellipse cx="0" cy="0" rx="9" ry="18" fill="#8aa878" />
        <path d="M0-15v30" stroke="#6d8a5c" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
