import { describe, it, expect, afterAll } from "vitest";
import { getSupabase } from "@/lib/supabase";
import { getPledgeDetail } from "@/lib/data";
import { installmentDueDates } from "@/lib/analytics";

// Full write→read round-trip against the live DB, mirroring createPledge's SQL
// shapes (the server action itself can't run outside a Next request context).
// Creates a pledge + schedule, verifies computed balances, records a payment,
// re-verifies, then deletes everything it created.
const sb = getSupabase();
let pledgeId: string | null = null;

afterAll(async () => {
  if (pledgeId) {
    await sb.from("pledge_installments").delete().eq("pledge_id", pledgeId);
    await sb.from("pledges").delete().eq("id", pledgeId);
  }
});

describe("pledge write round-trip (integration, live DB)", () => {
  it("creates a pledge + schedule, computes balances, applies a payment", async () => {
    const { data: org } = await sb.from("organizations").select("id").limit(1).single();
    const { data: donor } = await sb.from("donors").select("id").limit(1).single();
    const { data: campaign } = await sb
      .from("campaigns")
      .select("id")
      .eq("status", "active")
      .limit(1)
      .single();
    expect(org && donor && campaign).toBeTruthy();

    // create (same shape as the createPledge action)
    const { data: pledge, error } = await sb
      .from("pledges")
      .insert({
        org_id: org!.id,
        donor_id: donor!.id,
        campaign_id: campaign!.id,
        total_amount: 1200,
        frequency: "monthly",
        installment_count: 12,
        installment_amount: 100,
        start_date: "2026-07-01",
        status: "active",
      })
      .select("id")
      .single();
    expect(error).toBeNull();
    pledgeId = pledge!.id;

    const dues = installmentDueDates("2026-07-01", "monthly", 12);
    expect(dues).toHaveLength(12);
    expect(dues[11]).toBe("2027-06-01");
    await sb.from("pledge_installments").insert(
      dues.map((due, i) => ({
        pledge_id: pledgeId,
        org_id: org!.id,
        seq: i + 1,
        due_date: due,
        amount: 100,
        status: "pending",
      }))
    );

    // read back through the real data layer
    let d = await getPledgeDetail(pledgeId!);
    expect(d).not.toBeNull();
    expect(d!.pledge.total).toBe(1200);
    expect(d!.installments).toHaveLength(12);
    expect(d!.summary.paid).toBe(0);
    expect(d!.summary.outstanding).toBe(1200);
    expect(d!.summary.nextDue).toBe("2026-07-01");

    // record a payment on the first installment (what recordPledgePayment does)
    await sb
      .from("pledge_installments")
      .update({ status: "paid", paid_date: "2026-07-01" })
      .eq("pledge_id", pledgeId!)
      .eq("seq", 1);

    d = await getPledgeDetail(pledgeId!);
    expect(d!.summary.paid).toBe(100);
    expect(d!.summary.outstanding).toBe(1100);
    expect(d!.summary.pctPaid).toBe(8); // 100/1200
    expect(d!.summary.nextDue).toBe("2026-08-01");
  });
});
