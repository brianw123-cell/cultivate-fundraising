"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { addManualGift } from "@/app/actions";

export function ManualGiftForm({
  donors,
  campaigns,
}: {
  donors: { id: string; name: string }[];
  campaigns: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [donorId, setDonorId] = useState(donors[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id || "");
  const [method, setMethod] = useState<"cash" | "check" | "card">("check");
  const [giftDate, setGiftDate] = useState("2026-06-08");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<{ receipt?: string } | null>(null);

  const field =
    "w-full rounded-xl border border-forest-900/12 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/15";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!donorId || Number(amount) <= 0) return;
    setSaving(true);
    const res = await addManualGift({
      donorId,
      amount: Number(amount),
      campaignId,
      method,
      giftDate,
      note,
    });
    setSaving(false);
    if (res.ok) {
      setDone({ receipt: res.receipt });
      router.refresh();
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-forest-900/8 bg-white p-8 text-center shadow-card">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-100 text-forest-700">
          <Check size={24} />
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold text-forest-900">
          Gift recorded
        </h2>
        <p className="mt-1 text-sm text-ink/55">Receipt {done.receipt} has been logged.</p>
        <div className="mt-5 flex justify-center gap-2">
          <button
            onClick={() => {
              setDone(null);
              setAmount("");
              setNote("");
            }}
            className="rounded-xl border border-forest-800/20 bg-white px-4 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50"
          >
            Add another
          </button>
          <button
            onClick={() => router.push("/gifts")}
            className="rounded-xl bg-forest-800 px-4 py-2 text-sm font-semibold text-cream hover:bg-forest-900"
          >
            View all gifts
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-forest-900/8 bg-white p-6 shadow-card space-y-4"
    >
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-forest-900">Donor</label>
        <select value={donorId} onChange={(e) => setDonorId(e.target.value)} className={field}>
          {donors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">Amount</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50">$</span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              className={field + " pl-7"}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">Gift date</label>
          <input
            type="date"
            value={giftDate}
            onChange={(e) => setGiftDate(e.target.value)}
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">Campaign</label>
          <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)} className={field}>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value as any)} className={field}>
            <option value="check">Check</option>
            <option value="cash">Cash</option>
            <option value="card">Card (in person)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-forest-900">Note (optional)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Check #1042, received at gala"
          className={field}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 py-3 text-sm font-semibold text-cream hover:bg-forest-900 disabled:opacity-70"
      >
        {saving ? (
          <>
            <Loader2 size={16} className="animate-spin-slow" /> Saving…
          </>
        ) : (
          "Record gift"
        )}
      </button>
    </form>
  );
}
