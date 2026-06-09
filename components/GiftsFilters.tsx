"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

const ADV_KEYS = ["campaign", "from", "to", "min", "max"];

export function GiftsFilters({ campaigns }: { campaigns: { id: string; name: string }[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const [campaign, setCampaign] = useState(sp.get("campaign") || "all");
  const [from, setFrom] = useState(sp.get("from") || "");
  const [to, setTo] = useState(sp.get("to") || "");
  const [min, setMin] = useState(sp.get("min") || "");
  const [max, setMax] = useState(sp.get("max") || "");

  const activeCount = ADV_KEYS.filter((k) => {
    const v = sp.get(k);
    return v && v !== "all";
  }).length;

  function apply() {
    const params = new URLSearchParams(sp.toString());
    const set = (k: string, v: string) => {
      if (v && v !== "all") params.set(k, v);
      else params.delete(k);
    };
    set("campaign", campaign);
    set("from", from);
    set("to", to);
    set("min", min);
    set("max", max);
    router.push(`/gifts?${params.toString()}`);
    setOpen(false);
  }

  function clearAll() {
    const params = new URLSearchParams(sp.toString());
    ADV_KEYS.forEach((k) => params.delete(k));
    setCampaign("all");
    setFrom("");
    setTo("");
    setMin("");
    setMax("");
    router.push(`/gifts?${params.toString()}`);
    setOpen(false);
  }

  const field =
    "w-full rounded-lg border border-forest-900/12 bg-white px-3 py-2 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/15";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${
          activeCount > 0
            ? "border-forest-700 bg-forest-50 text-forest-800"
            : "border-forest-800/20 bg-white text-forest-800 hover:bg-forest-50"
        }`}
      >
        <SlidersHorizontal size={15} /> Filters
        {activeCount > 0 && (
          <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest-700 px-1 text-xs font-bold text-cream">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-[300px] space-y-3 rounded-2xl border border-forest-900/10 bg-white p-4 shadow-lift">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/55">Campaign</label>
              <select value={campaign} onChange={(e) => setCampaign(e.target.value)} className={field}>
                <option value="all">All campaigns</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/55">Date range</label>
              <div className="space-y-2">
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={field} />
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={field} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/55">Amount range ($)</label>
              <div className="flex items-center gap-2">
                <input
                  inputMode="numeric"
                  placeholder="Min"
                  value={min}
                  onChange={(e) => setMin(e.target.value.replace(/[^0-9.]/g, ""))}
                  className={field + " min-w-0"}
                />
                <span className="text-ink/40">–</span>
                <input
                  inputMode="numeric"
                  placeholder="Max"
                  value={max}
                  onChange={(e) => setMax(e.target.value.replace(/[^0-9.]/g, ""))}
                  className={field + " min-w-0"}
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <button onClick={clearAll} className="text-sm font-medium text-ink/55 hover:text-forest-800">
                Clear
              </button>
              <button
                onClick={apply}
                className="rounded-lg bg-forest-800 px-4 py-2 text-sm font-semibold text-cream hover:bg-forest-900"
              >
                Apply filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
