"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, Loader2, Heart } from "lucide-react";
import { processDonation } from "@/app/actions";

const PRESETS = [25, 50, 100, 250, 500, 1000];

export function DonationForm({
  campaigns,
  defaultCampaignId,
  accent = "#2D6A4F",
}: {
  campaigns: { id: string; name: string }[];
  defaultCampaignId: string;
  accent?: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(100);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [campaignId, setCampaignId] = useState(defaultCampaignId);
  const [name, setName] = useState("Jordan Sample");
  const [email, setEmail] = useState("jordan@example.com");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12 / 28");
  const [cvc, setCvc] = useState("123");
  const [zip, setZip] = useState("45069");
  const [coverFee, setCoverFee] = useState(true);
  const [showTribute, setShowTribute] = useState(false);
  const [tributeName, setTributeName] = useState("");
  const [tributeType, setTributeType] = useState("in_honor");
  const [processing, setProcessing] = useState(false);

  const effectiveAmount = custom ? Number(custom) || 0 : amount;
  const fee = Math.round((effectiveAmount * 0.022 + 0.3) * 100) / 100;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (effectiveAmount <= 0) return;
    setProcessing(true);
    // simulate the processor round-trip for a realistic feel
    await new Promise((r) => setTimeout(r, 1500));
    const digits = card.replace(/\s/g, "");
    const brand =
      digits[0] === "4" ? "Visa" : digits[0] === "5" ? "Mastercard" : digits[0] === "3" ? "Amex" : "Visa";
    const res = await processDonation({
      amount: effectiveAmount,
      frequency,
      name,
      email,
      campaignId,
      coverFee,
      tributeName: showTribute ? tributeName : undefined,
      tributeType: showTribute ? tributeType : undefined,
      cardLast4: digits.slice(-4),
      cardBrand: brand,
    });
    if (res.ok && res.giftId) {
      router.push(`/give/thank-you?gift=${res.giftId}`);
    } else {
      setProcessing(false);
      alert("Something went wrong. Please try again.");
    }
  }

  const field =
    "w-full rounded-xl border border-forest-900/12 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/15";

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* frequency */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-ink/5 p-1">
        {(["one-time", "monthly"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFrequency(f)}
            className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
              frequency === f ? "bg-white shadow-sm text-forest-900" : "text-ink/55"
            }`}
          >
            {f === "one-time" ? "One-time" : "Monthly"}
          </button>
        ))}
      </div>

      {/* amount */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-forest-900">
          Choose an amount
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => {
            const active = !custom && amount === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setAmount(p);
                  setCustom("");
                }}
                className={`rounded-xl border py-3 text-sm font-semibold transition-all ${
                  active
                    ? "text-white border-transparent"
                    : "border-forest-900/12 text-forest-900 hover:border-forest-500"
                }`}
                style={active ? { backgroundColor: accent } : {}}
              >
                ${p}
              </button>
            );
          })}
        </div>
        <div className="relative mt-2">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50">$</span>
          <input
            inputMode="decimal"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="Other amount"
            className={field + " pl-7"}
          />
        </div>
      </div>

      {/* campaign */}
      {campaigns.length > 1 && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-forest-900">
            Direct my gift to
          </label>
          <select
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className={field}
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* donor info */}
      <div className="grid gap-2 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={field} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={field} />
      </div>

      {/* tribute */}
      <div>
        <button
          type="button"
          onClick={() => setShowTribute((s) => !s)}
          className="flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-900"
        >
          <Heart size={14} /> {showTribute ? "Remove tribute" : "Dedicate this gift"}
        </button>
        {showTribute && (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <select value={tributeType} onChange={(e) => setTributeType(e.target.value)} className={field}>
              <option value="in_honor">In honor of</option>
              <option value="in_memory">In memory of</option>
            </select>
            <input
              value={tributeName}
              onChange={(e) => setTributeName(e.target.value)}
              placeholder="Name"
              className={field}
            />
          </div>
        )}
      </div>

      {/* payment */}
      <div className="rounded-2xl border border-forest-900/12 bg-cream/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-forest-900">
            <CreditCard size={16} /> Payment
          </span>
          <span className="flex items-center gap-1 text-xs text-ink/45">
            <Lock size={12} /> Demo — no real charge
          </span>
        </div>
        <div className="space-y-2">
          <input value={card} onChange={(e) => setCard(e.target.value)} placeholder="Card number" className={field} />
          <div className="grid grid-cols-3 gap-2">
            <input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="MM / YY" className={field} />
            <input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC" className={field} />
            <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="ZIP" className={field} />
          </div>
        </div>
      </div>

      {/* cover fee */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-forest-50 p-3">
        <input
          type="checkbox"
          checked={coverFee}
          onChange={(e) => setCoverFee(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-forest-700"
        />
        <span className="text-sm text-ink/75">
          Add <strong>${fee.toFixed(2)}</strong> to cover processing fees so 100% of my gift
          reaches the cause.
        </span>
      </label>

      <button
        type="submit"
        disabled={processing || effectiveAmount <= 0}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white shadow-lift transition-all disabled:opacity-70"
        style={{ backgroundColor: accent }}
      >
        {processing ? (
          <>
            <Loader2 size={18} className="animate-spin-slow" /> Processing…
          </>
        ) : (
          <>
            Donate ${(coverFee ? effectiveAmount + fee : effectiveAmount).toLocaleString()}
            {frequency === "monthly" ? " / month" : ""}
          </>
        )}
      </button>
      <p className="text-center text-xs text-ink/45">
        Riverside Hope Foundation is a 501(c)(3). Your gift is tax-deductible to the
        extent allowed by law.
      </p>
    </form>
  );
}
