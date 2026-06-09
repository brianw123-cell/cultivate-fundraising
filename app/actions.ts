"use server";

import { z } from "zod";
import { addMonths, addYears, format, parseISO } from "date-fns";
import { getSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { CURRENT_YEAR, DEMO_TODAY, RECEIPT_PREFIX, processingFee } from "@/lib/config";

// ---- validation schemas ------------------------------------------------

const DonationSchema = z.object({
  amount: z.number().positive().max(1_000_000),
  frequency: z.enum(["one-time", "monthly"]),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  campaignId: z.string().uuid(),
  coverFee: z.boolean(),
  tributeName: z.string().max(200).optional(),
  tributeType: z.string().max(40).optional(),
  cardLast4: z.string().max(4).optional(),
  cardBrand: z.string().max(40).optional(),
});

const ManualGiftSchema = z.object({
  donorId: z.string().uuid(),
  amount: z.number().positive().max(1_000_000),
  campaignId: z.string().uuid(),
  method: z.enum(["cash", "check", "card"]),
  giftDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().max(500).optional(),
});

export type DonationInput = z.infer<typeof DonationSchema>;
export type ManualGiftInput = z.infer<typeof ManualGiftSchema>;

const uuid = z.string().uuid();

export async function writeOffPledge(pledgeId: string) {
  if (!uuid.safeParse(pledgeId).success) return { ok: false as const, error: "Invalid pledge id." };
  const sb = getSupabase();
  await sb.from("pledges").update({ status: "written_off" }).eq("id", pledgeId);
  await sb
    .from("pledge_installments")
    .update({ status: "written_off" })
    .eq("pledge_id", pledgeId)
    .in("status", ["pending", "overdue"]);
  revalidatePath("/pledges");
  revalidatePath(`/pledges/${pledgeId}`);
  return { ok: true as const };
}

const PledgeSchema = z.object({
  donorId: z.string().uuid(),
  campaignId: z.string().uuid(),
  total: z.number().positive().max(10_000_000),
  frequency: z.enum(["monthly", "quarterly", "annually"]),
  installments: z.number().int().min(1).max(120),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type PledgeInput = z.infer<typeof PledgeSchema>;

function installmentDueDate(start: Date, frequency: string, index: number): string {
  const d =
    frequency === "annually"
      ? addYears(start, index)
      : addMonths(start, index * (frequency === "quarterly" ? 3 : 1));
  return format(d, "yyyy-MM-dd");
}

export async function createPledge(raw: PledgeInput) {
  const parsed = PledgeSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: "Invalid pledge details." };
  const input = parsed.data;

  const sb = getSupabase();
  const { data: org } = await sb.from("organizations").select("id").limit(1).single();
  if (!org) return { ok: false as const, error: "No organization configured." };

  const installmentAmount = Math.round((input.total / input.installments) * 100) / 100;

  const { data: pledge, error: pErr } = await sb
    .from("pledges")
    .insert({
      org_id: org.id,
      donor_id: input.donorId,
      campaign_id: input.campaignId,
      total_amount: input.total,
      frequency: input.frequency,
      installment_count: input.installments,
      installment_amount: installmentAmount,
      start_date: input.startDate,
      status: "active",
    })
    .select("id")
    .single();
  if (pErr || !pledge) {
    return { ok: false as const, error: "Could not save pledge (is the pledges table set up?)." };
  }

  const start = parseISO(input.startDate);
  const rows = Array.from({ length: input.installments }, (_, i) => {
    const due = installmentDueDate(start, input.frequency, i);
    return {
      pledge_id: pledge.id,
      org_id: org.id,
      seq: i + 1,
      due_date: due,
      amount: installmentAmount,
      status: due <= DEMO_TODAY ? "overdue" : "pending",
    };
  });
  await sb.from("pledge_installments").insert(rows);

  revalidatePath("/pledges");
  revalidatePath(`/pledges/${pledge.id}`);
  return { ok: true as const, pledgeId: pledge.id };
}

export async function recordPledgePayment(pledgeId: string) {
  if (!uuid.safeParse(pledgeId).success) return { ok: false as const, error: "Invalid pledge id." };
  const sb = getSupabase();
  const { data: next } = await sb
    .from("pledge_installments")
    .select("id")
    .eq("pledge_id", pledgeId)
    .in("status", ["overdue", "pending"])
    .order("due_date", { ascending: true })
    .limit(1);
  if (!next || next.length === 0) return { ok: false as const, error: "No remaining installments." };

  await sb.from("pledge_installments").update({ status: "paid", paid_date: DEMO_TODAY }).eq("id", next[0].id);

  const { count } = await sb
    .from("pledge_installments")
    .select("*", { count: "exact", head: true })
    .eq("pledge_id", pledgeId)
    .in("status", ["overdue", "pending"]);
  if ((count || 0) === 0) await sb.from("pledges").update({ status: "completed" }).eq("id", pledgeId);

  revalidatePath("/pledges");
  revalidatePath(`/pledges/${pledgeId}`);
  return { ok: true as const };
}

// ---- helpers -----------------------------------------------------------

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0] || "Friend", last: "" };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}

async function nextReceiptNumber(sb: ReturnType<typeof getSupabase>): Promise<string> {
  // Primary: atomic, race-free sequence (migration: receipt_number_sequence).
  const { data, error } = await sb.rpc("next_receipt_number");
  if (!error && typeof data === "string") return data;
  // Fallback only if the RPC is unavailable: count-based (NOT concurrency-safe).
  const { count } = await sb
    .from("gifts")
    .select("*", { count: "exact", head: true })
    .like("receipt_number", `${RECEIPT_PREFIX}-${CURRENT_YEAR}-%`);
  const n = (count || 0) + 1;
  return `${RECEIPT_PREFIX}-${CURRENT_YEAR}-${String(n).padStart(5, "0")}`;
}

// ---- actions -----------------------------------------------------------

export async function processDonation(raw: DonationInput) {
  const parsed = DonationSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: "Invalid donation details." };
  const input = parsed.data;

  const sb = getSupabase();
  const { data: org } = await sb.from("organizations").select("id").limit(1).single();
  if (!org) return { ok: false as const, error: "No organization configured." };

  // match or create donor by email
  let donorId: string | null = null;
  const { data: existing } = await sb
    .from("donors")
    .select("id")
    .eq("email", input.email.toLowerCase())
    .limit(1)
    .maybeSingle();

  if (existing) {
    donorId = existing.id;
  } else {
    const { first, last } = splitName(input.name);
    const { data: nd } = await sb
      .from("donors")
      .insert({
        org_id: org.id,
        type: "individual",
        first_name: first,
        last_name: last,
        email: input.email.toLowerCase(),
        donor_since: DEMO_TODAY,
        tags: ["online"],
      })
      .select("id")
      .single();
    donorId = nd?.id ?? null;
  }
  if (!donorId) return { ok: false as const, error: "Could not create donor record." };

  const amount = input.amount;
  const fee = processingFee(amount);
  const net = input.coverFee ? amount : amount - fee;

  let planId: string | null = null;
  if (input.frequency === "monthly") {
    const { data: plan } = await sb
      .from("recurring_plans")
      .insert({
        org_id: org.id,
        donor_id: donorId,
        campaign_id: input.campaignId,
        amount,
        frequency: "monthly",
        status: "active",
        payment_method: "card",
        card_brand: input.cardBrand || "Visa",
        card_last4: input.cardLast4 || "4242",
        started_at: DEMO_TODAY,
        next_charge_date: "2026-07-08",
      })
      .select("id")
      .single();
    planId = plan?.id ?? null;
  }

  const receipt = await nextReceiptNumber(sb);

  const { data: gift } = await sb
    .from("gifts")
    .insert({
      org_id: org.id,
      donor_id: donorId,
      campaign_id: input.campaignId,
      recurring_plan_id: planId,
      amount,
      fee_amount: fee,
      fee_covered: input.coverFee,
      net_amount: net,
      fmv_amount: 0,
      gift_date: DEMO_TODAY,
      payment_method: "card",
      card_brand: input.cardBrand || "Visa",
      card_last4: input.cardLast4 || "4242",
      is_recurring: input.frequency === "monthly",
      tribute_type: input.tributeType || null,
      tribute_name: input.tributeName || null,
      status: "completed",
      receipt_number: receipt,
      receipt_sent: true,
      acknowledged: false,
    })
    .select("id")
    .single();

  revalidatePath("/dashboard");
  revalidatePath("/gifts");
  revalidatePath("/donors");
  revalidatePath("/campaigns");

  return { ok: true as const, giftId: gift?.id, receipt };
}

export async function acknowledgeGift(giftId: string) {
  if (!z.string().uuid().safeParse(giftId).success) {
    return { ok: false as const, error: "Invalid gift id." };
  }
  const sb = getSupabase();
  await sb.from("gifts").update({ acknowledged: true, acknowledged_at: DEMO_TODAY }).eq("id", giftId);
  revalidatePath("/stewardship");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function addManualGift(raw: ManualGiftInput) {
  const parsed = ManualGiftSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: "Invalid gift details." };
  const input = parsed.data;

  const sb = getSupabase();
  const { data: org } = await sb.from("organizations").select("id").limit(1).single();
  if (!org) return { ok: false as const, error: "No organization configured." };

  const amount = input.amount;
  const fee = input.method === "card" ? processingFee(amount) : 0;
  const receipt = await nextReceiptNumber(sb);

  const { data: gift } = await sb
    .from("gifts")
    .insert({
      org_id: org.id,
      donor_id: input.donorId,
      campaign_id: input.campaignId,
      amount,
      fee_amount: fee,
      net_amount: amount - fee,
      gift_date: input.giftDate,
      payment_method: input.method,
      is_recurring: false,
      status: "completed",
      receipt_number: receipt,
      receipt_sent: false,
      acknowledged: false,
      note: input.note || null,
    })
    .select("id")
    .single();

  revalidatePath("/gifts");
  revalidatePath("/dashboard");
  revalidatePath("/donors");
  revalidatePath("/stewardship");

  return { ok: true as const, giftId: gift?.id, receipt };
}
