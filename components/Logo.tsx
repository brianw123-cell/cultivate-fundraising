import React from "react";

export function CultivateMark({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="#1B4332" />
      {/* stem */}
      <path
        d="M16 25.5 C16 21 16 18 16 14.5"
        stroke="#FAF8F3"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* right leaf (gold) */}
      <path
        d="M16 15.5 C18.2 10.8 23.8 10 26 9.2 C25.4 14 20.8 16.6 16 15.5 Z"
        fill="#D4A017"
      />
      {/* left leaf (sage) */}
      <path
        d="M16 19.5 C14.1 15.4 9.2 14.9 7 14.2 C7.6 18.4 11.6 20.8 16 19.5 Z"
        fill="#74C69D"
      />
    </svg>
  );
}

export function Logo({
  variant = "dark",
  showWord = true,
  size = 30,
  className = "",
}: {
  variant?: "dark" | "light";
  showWord?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <CultivateMark size={size} />
      {showWord && (
        <span
          className={`font-display font-semibold tracking-tight ${
            variant === "light" ? "text-cream" : "text-forest-900"
          }`}
          style={{ fontSize: Math.round(size * 0.72) }}
        >
          Cultivate
        </span>
      )}
    </span>
  );
}
