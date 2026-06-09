import { describe, it, expect } from "vitest";
import { getPledgesPageData } from "@/lib/data";

// Runs against the live Supabase project (read-only).
describe("pledges (integration, live DB)", () => {
  it("returns seeded pledges with computed balances and stats", async () => {
    const { rows, stats, attention } = await getPledgesPageData();
    expect(rows.length).toBeGreaterThanOrEqual(18);
    expect(stats.totalPledged).toBeGreaterThan(0);
    expect(stats.outstanding).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(attention)).toBe(true);
    for (const r of rows) {
      expect(typeof r.donorName).toBe("string");
      expect(r.total).toBeGreaterThan(0);
      expect(r.paid).toBeGreaterThanOrEqual(0);
      expect(r.outstanding).toBeGreaterThanOrEqual(0);
    }
  });
});
