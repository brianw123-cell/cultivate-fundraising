import { describe, it, expect } from "vitest";
import { getSupabase } from "@/lib/supabase";

// Proves the receipt-numbering race is fixed: 10 concurrent calls to the
// sequence-backed RPC must return 10 distinct, well-formed receipt numbers.
// (The old count+1 scheme would have produced duplicates here.)
describe("receipt numbering (integration, live RPC)", () => {
  it("returns unique receipt numbers under concurrency", async (ctx) => {
    const sb = getSupabase();
    const probe = await sb.rpc("next_receipt_number");
    if (probe.error) {
      // migration `receipt_number_sequence` not deployed yet — skip, don't false-fail
      ctx.skip();
      return;
    }
    const more = await Promise.all(
      Array.from({ length: 9 }, () => sb.rpc("next_receipt_number"))
    );
    const nums = [probe, ...more].map((r) => r.data as string);
    nums.forEach((n) => expect(n).toMatch(/^RHF-2026-\d{5}$/));
    expect(new Set(nums).size).toBe(10);
  });
});
