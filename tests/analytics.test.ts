import { describe, it, expect } from "vitest";
import {
  yearOf,
  sumAmount,
  givingByYear,
  donorRetention,
  lybuntSybunt,
  monthlyTrend,
  giftSizeBrackets,
  byPaymentMethod,
  recurringMonthlyEquivalent,
  campaignTotals,
  appealMetrics,
  classifyDonors,
  prospectGap,
  pledgeSummary,
  installmentDueDates,
} from "@/lib/analytics";

const gifts: any[] = [
  { donor_id: "a", amount: 100, gift_date: "2024-03-01", payment_method: "card", fmv_amount: 0 },
  { donor_id: "a", amount: 200, gift_date: "2025-03-01", payment_method: "card" },
  { donor_id: "a", amount: 50, gift_date: "2026-02-01", payment_method: "cash" },
  { donor_id: "b", amount: 300, gift_date: "2024-06-01", payment_method: "card" },
  { donor_id: "b", amount: 300, gift_date: "2025-07-01", payment_method: "ach" },
  { donor_id: "c", amount: 25, gift_date: "2025-01-01", payment_method: "check" },
  { donor_id: "d", amount: 5000, gift_date: "2026-01-15", payment_method: "card" },
];

describe("yearOf / sumAmount", () => {
  it("parses year", () => expect(yearOf("2026-02-01")).toBe(2026));
  it("sums string and number amounts", () =>
    expect(sumAmount([{ amount: "10" }, { amount: 5 }])).toBe(15));
});

describe("givingByYear", () => {
  it("aggregates amount/gifts/donors per year, ascending", () => {
    const y = givingByYear(gifts);
    expect(y).toEqual([
      { year: 2024, amount: 400, gifts: 2, donors: 2 },
      { year: 2025, amount: 525, gifts: 3, donors: 3 },
      { year: 2026, amount: 5050, gifts: 2, donors: 2 },
    ]);
  });
});

describe("donorRetention", () => {
  it("computes retained share of base-year donors", () => {
    expect(donorRetention(gifts, 2024, 2025)).toEqual({ rate: 100, retained: 2, base: 2 });
  });
  it("handles empty base", () => {
    expect(donorRetention([], 2024, 2025)).toEqual({ rate: 0, retained: 0, base: 0 });
  });
});

describe("lybuntSybunt", () => {
  it("counts lapsed prior-year and any-prior-year donors", () => {
    expect(lybuntSybunt(gifts, 2026, 2025)).toEqual({ lybunt: 2, sybunt: 2 });
  });
});

describe("monthlyTrend", () => {
  it("buckets by month since a key, labels Jan with year suffix", () => {
    expect(monthlyTrend(gifts, "2025-01")).toEqual([
      { month: "Jan 25", amount: 25 },
      { month: "Mar", amount: 200 },
      { month: "Jul", amount: 300 },
      { month: "Jan 26", amount: 5000 },
      { month: "Feb", amount: 50 },
    ]);
  });
});

describe("giftSizeBrackets", () => {
  it("buckets amounts into IRS-relevant brackets", () => {
    const b = giftSizeBrackets(gifts);
    expect(b).toEqual([
      { label: "$1 – $99", count: 2, amount: 75 },
      { label: "$100 – $249", count: 2, amount: 300 },
      { label: "$250 – $999", count: 2, amount: 600 },
      { label: "$1,000 – $4,999", count: 0, amount: 0 },
      { label: "$5,000+", count: 1, amount: 5000 },
    ]);
  });
});

describe("byPaymentMethod", () => {
  it("totals per method, descending", () => {
    expect(byPaymentMethod(gifts)).toEqual([
      { method: "card", amount: 5600, count: 4 },
      { method: "ach", amount: 300, count: 1 },
      { method: "cash", amount: 50, count: 1 },
      { method: "check", amount: 25, count: 1 },
    ]);
  });
});

describe("recurringMonthlyEquivalent", () => {
  it("normalizes frequencies to monthly and ignores inactive", () => {
    const plans: any[] = [
      { amount: 10, frequency: "monthly", status: "active" },
      { amount: 30, frequency: "quarterly", status: "active" },
      { amount: 120, frequency: "annually", status: "active" },
      { amount: 5, frequency: "weekly", status: "active" },
      { amount: 100, frequency: "monthly", status: "canceled" },
    ];
    expect(recurringMonthlyEquivalent(plans)).toBeCloseTo(51.65, 2);
  });
});

describe("campaignTotals", () => {
  it("rolls up raised/donors/gifts per campaign", () => {
    const cg: any[] = [
      { campaign_id: "x", amount: 100, donor_id: "a" },
      { campaign_id: "x", amount: 200, donor_id: "b" },
      { campaign_id: "y", amount: 50, donor_id: "a" },
      { campaign_id: null, amount: 999, donor_id: "c" },
    ];
    const camps: any[] = [
      { id: "x", name: "X", slug: "x", goal_amount: 1000, status: "active", accent: "#111" },
      { id: "y", name: "Y", slug: "y", goal_amount: 500, status: "completed", accent: null },
    ];
    const t = campaignTotals(cg, camps);
    expect(t[0]).toMatchObject({ id: "x", raised: 300, donors: 2, gifts: 2, goal: 1000 });
    expect(t[1]).toMatchObject({ id: "y", raised: 50, donors: 1, gifts: 1, goal: 500 });
  });
});

describe("appealMetrics", () => {
  it("computes responses, rate, ROI; sorts by sent desc", () => {
    const appeals: any[] = [
      { id: "p1", name: "P1", channel: "Email", audience_size: 1000, cost: 500, sent_date: "2025-01-01" },
      { id: "p2", name: "P2", channel: "Mail", audience_size: 200, cost: 0, sent_date: "2025-06-01" },
    ];
    const g: any[] = [
      { appeal_id: "p1", amount: 100 },
      { appeal_id: "p1", amount: 300 },
      { appeal_id: "p2", amount: 50 },
      { appeal_id: null, amount: 999 },
    ];
    const m = appealMetrics(appeals, g);
    expect(m.rows[0].id).toBe("p2"); // most recent first
    const p1 = m.rows.find((r) => r.id === "p1")!;
    expect(p1).toMatchObject({ revenue: 400, responses: 2, cost: 500 });
    expect(p1.responseRate).toBeCloseTo(0.2, 5);
    expect(p1.avgGift).toBeCloseTo(200, 5);
    expect(p1.roi).toBeCloseTo(0.8, 5);
    expect(m.totalRev).toBe(450);
    expect(m.totalCost).toBe(500);
    expect(m.blendedRoi).toBeCloseTo(0.9, 5);
    expect(m.totalResponses).toBe(3);
  });
});

describe("classifyDonors", () => {
  it("assigns segment membership from giving history", () => {
    const donors: any[] = [
      { id: "a", type: "individual", first_name: "A", last_name: "One", tags: [] },
      { id: "b", type: "individual", first_name: "B", last_name: "Two", tags: ["major"] },
      { id: "c", type: "individual", first_name: "C", last_name: "Three", tags: [] },
    ];
    const g: any[] = [
      { donor_id: "a", amount: 6000, gift_date: "2026-02-01" },
      { donor_id: "b", amount: 100, gift_date: "2025-05-01" },
      { donor_id: "c", amount: 50, gift_date: "2026-03-01" },
    ];
    const plans: any[] = [{ donor_id: "a", status: "active" }];
    const out = classifyDonors(donors, g, plans);
    const byId = Object.fromEntries(out.map((d) => [d.id, d]));
    expect(byId.a.segKeys.sort()).toEqual(["leadership", "major", "new2026", "sustainer"]);
    expect(byId.b.segKeys.sort()).toEqual(["lybunt", "major"]);
    expect(byId.c.segKeys).toEqual(["new2026"]);
    expect(byId.a.lifetime).toBe(6000);
  });
});

describe("prospectGap", () => {
  it("flags under-giving relative to capacity", () => {
    expect(prospectGap(50000, 5000)).toEqual({ gap: 45000, underutilized: true });
    expect(prospectGap(10000, 9000)).toEqual({ gap: 1000, underutilized: false });
    expect(prospectGap(0, 0)).toEqual({ gap: 0, underutilized: false });
  });
});

describe("pledgeSummary", () => {
  it("computes burn-down, overdue, and next due", () => {
    const installments = [
      { amount: 100, status: "paid", due_date: "2026-01-01" },
      { amount: 100, status: "paid", due_date: "2026-02-01" },
      { amount: 100, status: "overdue", due_date: "2026-03-01" },
      { amount: 100, status: "pending", due_date: "2026-07-01" },
      { amount: 100, status: "pending", due_date: "2026-08-01" },
    ];
    const s = pledgeSummary(installments, 500);
    expect(s.paid).toBe(200);
    expect(s.outstanding).toBe(300);
    expect(s.overdueCount).toBe(1);
    expect(s.overdueAmount).toBe(100);
    expect(s.nextDue).toBe("2026-03-01");
    expect(s.pctPaid).toBe(40);
  });

  it("handles written-off installments", () => {
    const s = pledgeSummary(
      [
        { amount: 100, status: "paid", due_date: "2026-01-01" },
        { amount: 400, status: "written_off", due_date: "2026-02-01" },
      ],
      500
    );
    expect(s.paid).toBe(100);
    expect(s.outstanding).toBe(0);
    expect(s.writtenOff).toBe(400);
    expect(s.pctPaid).toBe(20);
  });
});

describe("installmentDueDates", () => {
  it("spaces monthly installments", () => {
    expect(installmentDueDates("2026-01-15", "monthly", 3)).toEqual([
      "2026-01-15",
      "2026-02-15",
      "2026-03-15",
    ]);
  });
  it("spaces quarterly and clamps end-of-month", () => {
    expect(installmentDueDates("2026-01-31", "quarterly", 2)).toEqual(["2026-01-31", "2026-04-30"]);
  });
  it("spaces annual installments", () => {
    expect(installmentDueDates("2024-06-01", "annually", 3)).toEqual([
      "2024-06-01",
      "2025-06-01",
      "2026-06-01",
    ]);
  });
});
