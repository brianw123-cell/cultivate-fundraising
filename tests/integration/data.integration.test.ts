import { describe, it, expect } from "vitest";
import { getReportsData, getDashboardData, getProspects, getSegmentsLite } from "@/lib/data";

// These run against the live Supabase project (read-only).
describe("data layer (integration, live DB)", () => {
  it("reports: stable historical retention + valid structure", async () => {
    const r = await getReportsData();
    // retention is 2025-vs-2024, immune to any new 2026 test gifts → stable anchor
    expect(r.retention).toBe(88);
    expect(r.years.map((y) => y.year)).toEqual(expect.arrayContaining([2024, 2025, 2026]));
    expect(r.brackets).toHaveLength(5);
    expect(r.byMethod.length).toBeGreaterThan(0);
    expect(r.totalGifts).toBeGreaterThan(1000);
    expect(r.lybunt).toBeGreaterThan(0);
  });

  it("dashboard: shapes and totals", async () => {
    const d = await getDashboardData();
    expect(d.byCampaign.length).toBe(6);
    expect(d.totalDonors).toBeGreaterThanOrEqual(140);
    expect(d.trend.length).toBeGreaterThan(0);
    expect(d.monthlyRecurring).toBeGreaterThan(0);
  });

  it("prospects: ranked by capacity descending", async () => {
    const p = await getProspects();
    expect(p.rows.length).toBeGreaterThanOrEqual(140);
    expect(p.rows[0].capacityHigh).toBeGreaterThanOrEqual(p.rows[p.rows.length - 1].capacityHigh);
    expect(Array.isArray(p.highPotential)).toBe(true);
  });

  it("segments: six smart lists with expected keys", async () => {
    const s = await getSegmentsLite();
    expect(s.map((x) => x.key).sort()).toEqual(
      ["lapsed", "leadership", "lybunt", "major", "new2026", "sustainer"].sort()
    );
  });
});
