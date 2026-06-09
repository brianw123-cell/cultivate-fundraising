import React from "react";
import Link from "next/link";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-forest-900/8 bg-white shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-forest-900">{title}</h2>
        {subtitle && <p className="text-sm text-ink/55 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const badgeColors: Record<string, string> = {
  green: "bg-forest-100 text-forest-800",
  gold: "bg-gold-100 text-gold-800",
  gray: "bg-ink/8 text-ink/70",
  sage: "bg-forest-50 text-forest-700",
  red: "bg-red-100 text-red-700",
};

export function Badge({
  children,
  color = "gray",
  className = "",
}: {
  children: React.ReactNode;
  color?: keyof typeof badgeColors;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColors[color]} ${className}`}
    >
      {children}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  sub,
  trend,
  icon,
  accent = "#2D6A4F",
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: { value: number; label?: string };
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-ink/55">{label}</span>
        {icon && (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: accent + "1A", color: accent }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold text-forest-900 tracking-tight">
        {value}
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.value >= 0 ? "text-forest-600" : "text-red-600"
            }`}
          >
            {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
        )}
        {sub && <span className="text-xs text-ink/50">{sub}</span>}
      </div>
    </Card>
  );
}

export function ProgressBar({
  value,
  max,
  accent = "#2D6A4F",
  className = "",
}: {
  value: number;
  max: number;
  accent?: string;
  className?: string;
}) {
  const p = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`h-2 w-full rounded-full bg-ink/8 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${p}%`, backgroundColor: accent }}
      />
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-forest-900/15 bg-white/50 p-10 text-center text-sm text-ink/50">
      {children}
    </div>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
}) {
  const styles = {
    primary: "bg-forest-800 text-cream hover:bg-forest-900",
    outline: "border border-forest-800/20 text-forest-800 hover:bg-forest-50",
    ghost: "text-forest-700 hover:bg-forest-50",
  }[variant];
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}

export function avatarColor(seed: string): string {
  const palette = ["#2D6A4F", "#40916C", "#D4A017", "#B0830F", "#52B788", "#86640C"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}
