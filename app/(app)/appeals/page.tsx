import Link from "next/link";
import { getSegmentsLite, getAppealPerformance } from "@/lib/data";
import { AppealComposer } from "@/components/AppealComposer";
import { Card, KpiCard, Badge } from "@/components/ui";
import { money, compactMoney, dateLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AppealsPage({
  searchParams,
}: {
  searchParams: Promise<{ seg?: string; view?: string }>;
}) {
  const sp = await searchParams;
  const view = sp.view === "performance" ? "performance" : "compose";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">Appeals</h1>
        <p className="text-sm text-ink/55">
          Compose appeals and measure how each one performs
        </p>
      </div>

      {/* tabs */}
      <div className="flex gap-1 rounded-xl bg-ink/5 p-1 w-fit">
        <Tab href="/appeals" active={view === "compose"} label="Compose" />
        <Tab
          href="/appeals?view=performance"
          active={view === "performance"}
          label="Performance"
        />
      </div>

      {view === "compose" ? <ComposeView seg={sp.seg} /> : <PerformanceView />}
    </div>
  );
}

function Tab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
        active ? "bg-white text-forest-900 shadow-sm" : "text-ink/55 hover:text-forest-800"
      }`}
    >
      {label}
    </Link>
  );
}

async function ComposeView({ seg }: { seg?: string }) {
  const segments = await getSegmentsLite();
  return <AppealComposer segments={segments} defaultSeg={seg} />;
}

async function PerformanceView() {
  const p = await getAppealPerformance();
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Raised via appeals" value={compactMoney(p.totalRev)} accent="#2D6A4F" />
        <KpiCard
          label="Blended ROI"
          value={`${p.blendedRoi.toFixed(1)}×`}
          sub={`on ${money(p.totalCost)} spent`}
          accent="#D4A017"
        />
        <KpiCard label="Total responses" value={p.totalResponses.toString()} accent="#40916C" />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-forest-900/8 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="px-5 py-3 font-medium">Appeal</th>
                <th className="px-5 py-3 font-medium">Sent</th>
                <th className="px-5 py-3 font-medium text-right">Audience</th>
                <th className="px-5 py-3 font-medium text-right">Responses</th>
                <th className="px-5 py-3 font-medium text-right">Rate</th>
                <th className="px-5 py-3 font-medium text-right">Avg gift</th>
                <th className="px-5 py-3 font-medium text-right">Cost</th>
                <th className="px-5 py-3 font-medium text-right">Revenue</th>
                <th className="px-5 py-3 font-medium text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/6">
              {p.rows.map((a) => (
                <tr key={a.id} className="hover:bg-forest-50/50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-forest-900">{a.name}</div>
                    <div className="text-xs text-ink/45">{a.channel}</div>
                  </td>
                  <td className="px-5 py-3 text-ink/65">{dateLabel(a.sent, "MMM d, yyyy")}</td>
                  <td className="px-5 py-3 text-right text-ink/65">
                    {a.audience.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right text-ink/65">{a.responses}</td>
                  <td className="px-5 py-3 text-right text-ink/65">
                    {a.responseRate.toFixed(1)}%
                  </td>
                  <td className="px-5 py-3 text-right text-ink/65">{money(a.avgGift)}</td>
                  <td className="px-5 py-3 text-right text-ink/65">{money(a.cost)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-forest-900">
                    {money(a.revenue)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Badge color={a.roi >= 5 ? "green" : a.roi >= 2 ? "gold" : "gray"}>
                      {a.roi.toFixed(1)}×
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-xs text-ink/45">
        Revenue is attributed to gifts received within 60 days of each appeal.
      </p>
    </div>
  );
}
