import Link from "next/link";
import { FileText, ShieldCheck, TrendingDown, UserMinus, Receipt } from "lucide-react";
import { getReportsData, getTopStatementDonors } from "@/lib/data";
import { Card, KpiCard, SectionHeading, Badge, ProgressBar } from "@/components/ui";
import { money, compactMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [r, stmtDonors] = await Promise.all([
    getReportsData(),
    getTopStatementDonors(2025),
  ]);
  const maxBracket = Math.max(...r.brackets.map((b) => b.amount), 1);
  const maxYear = Math.max(...r.years.map((y) => y.amount), 1);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">Reports</h1>
        <p className="text-sm text-ink/55">
          Fundraising health, donor retention, and compliance at a glance
        </p>
      </div>

      {/* headline metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Lifetime raised" value={compactMoney(r.totalRaised)} sub={`${r.totalGifts.toLocaleString()} gifts`} accent="#2D6A4F" />
        <KpiCard label="Donor retention" value={`${r.retention}%`} sub="2025 vs. 2024" accent="#40916C" />
        <KpiCard label="LYBUNT donors" value={r.lybunt.toString()} sub="gave in 2025, not yet 2026" accent="#D4A017" />
        <KpiCard label="SYBUNT donors" value={r.sybunt.toString()} sub="lapsed, gave some prior year" accent="#B0830F" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* year over year */}
        <Card className="p-5 min-w-0">
          <SectionHeading title="Year over year" subtitle="Total raised, gifts, and donors" />
          <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] text-sm">
            <thead>
              <tr className="border-b border-forest-900/8 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="py-2 font-medium">Year</th>
                <th className="py-2 font-medium">Raised</th>
                <th className="py-2 font-medium text-right">Gifts</th>
                <th className="py-2 font-medium text-right">Donors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/6">
              {r.years.map((y) => (
                <tr key={y.year}>
                  <td className="py-3 font-semibold text-forest-900">{y.year}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="w-16 font-medium text-forest-900">{compactMoney(y.amount)}</span>
                      <div className="flex-1">
                        <ProgressBar value={y.amount} max={maxYear} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right text-ink/65">{y.gifts.toLocaleString()}</td>
                  <td className="py-3 text-right text-ink/65">{y.donors}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <p className="mt-2 text-xs text-ink/45">2026 reflects year-to-date through June.</p>
        </Card>

        {/* gift size brackets */}
        <Card className="p-5">
          <SectionHeading title="Gift size distribution" subtitle="All-time, by bracket" />
          <div className="space-y-3">
            {r.brackets.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-ink/70">{b.label}</span>
                  <span className="font-medium text-forest-900">
                    {money(b.amount)} <span className="text-ink/40">· {b.count}</span>
                  </span>
                </div>
                <ProgressBar value={b.amount} max={maxBracket} accent="#40916C" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* compliance */}
      <Card className="p-5">
        <SectionHeading
          title="Compliance & receipting"
          subtitle="IRS acknowledgment and disclosure tracking"
          action={<Badge color="green"><ShieldCheck size={13} /> Up to date</Badge>}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-forest-50 p-4">
            <div className="flex items-center gap-2 text-forest-800">
              <Receipt size={16} />
              <span className="text-sm font-semibold">$250+ acknowledgments</span>
            </div>
            <div className="mt-2 font-display text-2xl font-semibold text-forest-900">
              {r.needsAck.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-ink/55">
              Gifts requiring a contemporaneous written acknowledgment. All auto-generated.
            </p>
          </div>
          <div className="rounded-xl bg-gold-50 p-4">
            <div className="flex items-center gap-2 text-gold-800">
              <FileText size={16} />
              <span className="text-sm font-semibold">Quid pro quo disclosures</span>
            </div>
            <div className="mt-2 font-display text-2xl font-semibold text-forest-900">
              {r.quidProQuo.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-ink/55">
              Gala/event gifts over $75 with goods received. FMV disclosed on each receipt.
            </p>
          </div>
          <div className="rounded-xl bg-ink/5 p-4">
            <div className="flex items-center gap-2 text-ink/70">
              <TrendingDown size={16} />
              <span className="text-sm font-semibold">Re-engagement list</span>
            </div>
            <div className="mt-2 font-display text-2xl font-semibold text-forest-900">
              {r.lybunt}
            </div>
            <p className="mt-1 text-xs text-ink/55">
              LYBUNT donors ready for a tailored win-back appeal.
            </p>
          </div>
        </div>
      </Card>

      {/* year-end statements */}
      <Card className="p-5">
        <SectionHeading
          title="Year-end tax statements"
          subtitle="One-click annual giving summaries for donors"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {stmtDonors.map((d) => (
            <Link
              key={d.id}
              href={`/statement/${d.id}?year=2025`}
              className="flex items-center justify-between rounded-xl border border-forest-900/8 bg-white px-4 py-3 hover:border-forest-400 hover:bg-forest-50/40"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-forest-900">
                <FileText size={15} className="text-forest-600" /> {d.name}
              </span>
              <span className="text-sm text-ink/55">{money(d.total)} in 2025 →</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
