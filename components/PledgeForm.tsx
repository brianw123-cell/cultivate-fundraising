"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Handshake } from "lucide-react";
import { createPledge } from "@/app/actions";
import { money } from "@/lib/format";

export function PledgeForm({
  donors,
  campaigns,
}: {
  donors: { id: string; name: string }[];
  campaigns: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [donorId, setDonorId] = useState(donors[0]?.id || "");
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id || "");
  const [total, setTotal] = useState("");
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "annually">("monthly");
  const [installments, setInstallments] = useState("12");
  const [startDate, setStartDate] = useState("2026-06-08");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalNum = Number(total) || 0;
  const instNum = Number(installments) || 0;
  const perInstallment = instNum > 0 ? totalNum / instNum : 0;

  const field =
    "w-full rounded-xl border border-forest-900/12 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/15";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!donorId || totalNum <= 0 || instNum <= 0) {
      setError("Pick a donor and enter a total amount and number of installments.");
      return;
    }
    setSaving(true);
    const res = await createPledge({
      donorId,
      campaignId,
      total: totalNum,
      frequency,
      installments: instNum,
      startDate,
    });
    if (res.ok && res.pledgeId) {
      router.push(`/pledges/${res.pledgeId}`);
    } else {
      setSaving(false);
      setError(res.error || "Something went wrong.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-forest-900/8 bg-white p-6 shadow-card">
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

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-forest-900">Campaign / fund</label>
        <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)} className={field}>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">Total pledged</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50">$</span>
            <input
              inputMode="decimal"
              value={total}
              onChange={(e) => setTotal(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="2,400"
              className={field + " pl-7"}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">Start date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={field} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900">Frequency</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as any)} className={field}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-forest-900"># of installments</label>
          <input
            inputMode="numeric"
            value={installments}
            onChange={(e) => setInstallments(e.target.value.replace(/[^0-9]/g, ""))}
            className={field}
          />
        </div>
      </div>

      {totalNum > 0 && instNum > 0 && (
        <div className="rounded-xl bg-forest-50 px-4 py-3 text-sm text-ink/75">
          <span className="font-semibold text-forest-900">{money(perInstallment, true)}</span> per{" "}
          {frequency === "annually" ? "year" : frequency === "quarterly" ? "quarter" : "month"} ·{" "}
          {instNum} installments · {money(totalNum)} total
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 py-3 text-sm font-semibold text-cream hover:bg-forest-900 disabled:opacity-70"
      >
        {saving ? (
          <>
            <Loader2 size={16} className="animate-spin-slow" /> Creating pledge…
          </>
        ) : (
          <>
            <Handshake size={16} /> Create pledge
          </>
        )}
      </button>
    </form>
  );
}
