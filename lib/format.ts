import { format, parseISO } from "date-fns";

export const num = (x: unknown): number => Number(x ?? 0);

export function money(x: unknown, withCents = false): string {
  const n = num(x);
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  });
}

export function compactMoney(x: unknown): string {
  const n = num(x);
  if (n >= 1000000) return "$" + (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return "$" + (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return money(n);
}

export function dateLabel(d?: string | null, fmt = "MMM d, yyyy"): string {
  if (!d) return "—";
  try {
    return format(parseISO(d), fmt);
  } catch {
    return d;
  }
}

export function relativeMonths(d?: string | null): string {
  if (!d) return "—";
  return dateLabel(d, "MMM yyyy");
}

export function donorName(donor: {
  type?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  org_name?: string | null;
} | null | undefined): string {
  if (!donor) return "Unknown donor";
  if (donor.type !== "individual" && donor.org_name) return donor.org_name;
  return [donor.first_name, donor.last_name].filter(Boolean).join(" ") || "Unknown donor";
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function titleCase(s?: string | null): string {
  if (!s) return "";
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function pct(part: number, whole: number): number {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function capacityTier(high: number): { tier: string; label: string } {
  if (high >= 250000) return { tier: "$$$$$", label: "$250K+" };
  if (high >= 50000) return { tier: "$$$$", label: "$50K–$250K" };
  if (high >= 10000) return { tier: "$$$", label: "$10K–$50K" };
  if (high >= 2000) return { tier: "$$", label: "$2K–$10K" };
  return { tier: "$", label: "Under $2K" };
}

export function affinityLabel(score: number): string {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}
