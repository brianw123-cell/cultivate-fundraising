// Pure fundraising analytics. No database, no I/O — just data in, numbers out.
// Everything here is deterministic and unit-tested (see tests/analytics.test.ts).

import { num, donorName } from "./format";
import { CURRENT_YEAR, PRIOR_YEAR, PRIOR_YEAR_2, LAPSED_CUTOFF_DATE } from "./config";
import type { GiftRow, DonorRow, CampaignRow, RecurringPlanRow, AppealRow } from "./types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const yearOf = (d: string): number => Number((d || "").slice(0, 4));
export const monthKeyOf = (d: string): string => (d || "").slice(0, 7);

export function sumAmount(gifts: Pick<GiftRow, "amount">[]): number {
  return gifts.reduce((s, g) => s + num(g.amount), 0);
}

export function givingByYear(gifts: Pick<GiftRow, "amount" | "gift_date" | "donor_id">[]) {
  const byYear = new Map<number, { amount: number; gifts: number; donors: Set<string> }>();
  for (const g of gifts) {
    const y = yearOf(g.gift_date);
    const e = byYear.get(y) || { amount: 0, gifts: 0, donors: new Set<string>() };
    e.amount += num(g.amount);
    e.gifts += 1;
    e.donors.add(g.donor_id);
    byYear.set(y, e);
  }
  return Array.from(byYear.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, e]) => ({ year, amount: Math.round(e.amount), gifts: e.gifts, donors: e.donors.size }));
}

/** Of donors who gave in `baseYear`, what fraction also gave in `nextYear`. */
export function donorRetention(
  gifts: Pick<GiftRow, "gift_date" | "donor_id">[],
  baseYear = PRIOR_YEAR_2,
  nextYear = PRIOR_YEAR
): { rate: number; retained: number; base: number } {
  const baseSet = new Set(gifts.filter((g) => yearOf(g.gift_date) === baseYear).map((g) => g.donor_id));
  const nextSet = new Set(gifts.filter((g) => yearOf(g.gift_date) === nextYear).map((g) => g.donor_id));
  let retained = 0;
  baseSet.forEach((d) => nextSet.has(d) && retained++);
  return { rate: baseSet.size ? Math.round((retained / baseSet.size) * 100) : 0, retained, base: baseSet.size };
}

export function lybuntSybunt(
  gifts: Pick<GiftRow, "gift_date" | "donor_id">[],
  currentYear = CURRENT_YEAR,
  priorYear = PRIOR_YEAR
): { lybunt: number; sybunt: number } {
  const current = new Set(gifts.filter((g) => yearOf(g.gift_date) === currentYear).map((g) => g.donor_id));
  const prior = new Set(gifts.filter((g) => yearOf(g.gift_date) === priorYear).map((g) => g.donor_id));
  const anyPrior = new Set(gifts.filter((g) => yearOf(g.gift_date) < currentYear).map((g) => g.donor_id));
  let lybunt = 0;
  prior.forEach((d) => !current.has(d) && lybunt++);
  let sybunt = 0;
  anyPrior.forEach((d) => !current.has(d) && sybunt++);
  return { lybunt, sybunt };
}

export function monthlyTrend(
  gifts: Pick<GiftRow, "amount" | "gift_date">[],
  sinceKey: string
): { month: string; amount: number }[] {
  const m = new Map<string, number>();
  for (const g of gifts) {
    const k = monthKeyOf(g.gift_date);
    if (k >= sinceKey) m.set(k, (m.get(k) || 0) + num(g.amount));
  }
  return Array.from(m.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => {
      const [y, mm] = k.split("-");
      const label = MONTHS[Number(mm) - 1] + (mm === "01" ? " " + y.slice(2) : "");
      return { month: label, amount: Math.round(v) };
    });
}

const BRACKETS = [
  { label: "$1 – $99", min: 0, max: 99 },
  { label: "$100 – $249", min: 100, max: 249 },
  { label: "$250 – $999", min: 250, max: 999 },
  { label: "$1,000 – $4,999", min: 1000, max: 4999 },
  { label: "$5,000+", min: 5000, max: Infinity },
];

export function giftSizeBrackets(gifts: Pick<GiftRow, "amount">[]) {
  return BRACKETS.map((b) => {
    const inB = gifts.filter((g) => num(g.amount) >= b.min && num(g.amount) <= b.max);
    return { label: b.label, count: inB.length, amount: Math.round(sumAmount(inB)) };
  });
}

export function byPaymentMethod(gifts: Pick<GiftRow, "amount" | "payment_method">[]) {
  const m = new Map<string, { amount: number; count: number }>();
  for (const g of gifts) {
    const e = m.get(g.payment_method) || { amount: 0, count: 0 };
    e.amount += num(g.amount);
    e.count += 1;
    m.set(g.payment_method, e);
  }
  return Array.from(m.entries())
    .map(([method, e]) => ({ method, amount: Math.round(e.amount), count: e.count }))
    .sort((a, b) => b.amount - a.amount);
}

/** Normalize a set of active recurring plans to monthly-equivalent revenue. */
export function recurringMonthlyEquivalent(
  plans: Pick<RecurringPlanRow, "amount" | "frequency" | "status">[]
): number {
  const active = plans.filter((p) => p.status === "active");
  return active.reduce((s, p) => {
    const a = num(p.amount);
    switch (p.frequency) {
      case "monthly":
        return s + a;
      case "quarterly":
        return s + a / 3;
      case "annually":
        return s + a / 12;
      case "weekly":
        return s + a * 4.33;
      default:
        return s + a;
    }
  }, 0);
}

export function campaignTotals(
  gifts: Pick<GiftRow, "amount" | "campaign_id" | "donor_id">[],
  campaigns: CampaignRow[]
) {
  return campaigns.map((c) => {
    const cg = gifts.filter((g) => g.campaign_id === c.id);
    return {
      ...c,
      goal: num(c.goal_amount),
      raised: Math.round(sumAmount(cg)),
      donors: new Set(cg.map((g) => g.donor_id)).size,
      gifts: cg.length,
    };
  });
}

export function appealMetrics(
  appeals: AppealRow[],
  gifts: Pick<GiftRow, "amount" | "appeal_id">[]
) {
  const byAppeal = new Map<string, { rev: number; resp: number }>();
  for (const g of gifts) {
    if (!g.appeal_id) continue;
    const e = byAppeal.get(g.appeal_id) || { rev: 0, resp: 0 };
    e.rev += num(g.amount);
    e.resp += 1;
    byAppeal.set(g.appeal_id, e);
  }
  const rows = appeals
    .map((a) => {
      const e = byAppeal.get(a.id) || { rev: 0, resp: 0 };
      const cost = num(a.cost);
      const audience = a.audience_size || 0;
      return {
        id: a.id,
        name: a.name,
        channel: a.channel,
        sent: a.sent_date,
        audience,
        responses: e.resp,
        revenue: Math.round(e.rev),
        cost,
        responseRate: audience ? (e.resp / audience) * 100 : 0,
        avgGift: e.resp ? e.rev / e.resp : 0,
        roi: cost ? e.rev / cost : 0,
      };
    })
    .sort((a, b) => ((a.sent || "") < (b.sent || "") ? 1 : -1));
  const totalRev = rows.reduce((s, r) => s + r.revenue, 0);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  return {
    rows,
    totalRev,
    totalCost,
    blendedRoi: totalCost ? totalRev / totalCost : 0,
    totalResponses: rows.reduce((s, r) => s + r.responses, 0),
  };
}

export const SEGMENT_DEFS = [
  { key: "major", label: "Major donors", desc: "$5,000+ lifetime giving" },
  { key: "sustainer", label: "Monthly sustainers", desc: "Active recurring gift" },
  { key: "leadership", label: "2026 Leadership", desc: "$1,000+ given this year" },
  { key: "new2026", label: "New in 2026", desc: "First gift this year" },
  { key: "lybunt", label: "LYBUNT", desc: "Gave in 2025, not yet in 2026" },
  { key: "lapsed", label: "Lapsed", desc: "No gift in 18+ months" },
];

/** Enrich donors with lifetime/recency aggregates and segment membership. */
export function classifyDonors(
  donors: DonorRow[],
  gifts: Pick<GiftRow, "amount" | "gift_date" | "donor_id">[],
  plans: Pick<RecurringPlanRow, "donor_id" | "status">[]
) {
  const activePlan = new Set(plans.filter((p) => p.status === "active").map((p) => p.donor_id));
  const agg = new Map<string, { lifetime: number; last: string; sumCurrent: number; firstYear: number; gavePrior: boolean; gaveCurrent: boolean; count: number }>();
  for (const g of gifts) {
    const y = yearOf(g.gift_date);
    const e = agg.get(g.donor_id) || { lifetime: 0, last: "", sumCurrent: 0, firstYear: 9999, gavePrior: false, gaveCurrent: false, count: 0 };
    e.lifetime += num(g.amount);
    e.count++;
    if (g.gift_date > e.last) e.last = g.gift_date;
    if (y === CURRENT_YEAR) {
      e.sumCurrent += num(g.amount);
      e.gaveCurrent = true;
    }
    if (y === PRIOR_YEAR) e.gavePrior = true;
    if (y < e.firstYear) e.firstYear = y;
    agg.set(g.donor_id, e);
  }
  return donors.map((d) => {
    const e = agg.get(d.id) || { lifetime: 0, last: "", sumCurrent: 0, firstYear: 9999, gavePrior: false, gaveCurrent: false, count: 0 };
    const keys: string[] = [];
    if (e.lifetime >= 5000 || (d.tags || []).includes("major")) keys.push("major");
    if (activePlan.has(d.id)) keys.push("sustainer");
    if (e.sumCurrent >= 1000) keys.push("leadership");
    if (e.firstYear === CURRENT_YEAR) keys.push("new2026");
    if (e.gavePrior && !e.gaveCurrent) keys.push("lybunt");
    if (e.last && e.last < LAPSED_CUTOFF_DATE) keys.push("lapsed");
    return {
      ...d,
      name: donorName(d),
      lifetime: e.lifetime,
      lastGift: e.last || null,
      sum2026: e.sumCurrent,
      giftCount: e.count,
      segKeys: keys,
    };
  });
}

export function prospectGap(capacityHigh: number, lifetime: number) {
  return { gap: Math.max(0, capacityHigh - lifetime), underutilized: capacityHigh > 0 && lifetime < capacityHigh * 0.2 };
}
