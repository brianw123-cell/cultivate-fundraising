import Link from "next/link";
import { Handshake, AlertTriangle, TrendingDown, Plus } from "lucide-react";
import { getPledgesPageData } from "@/lib/data";
import { Card, KpiCard, Badge, ProgressBar, LinkButton } from "@/components/ui";
import { money, compactMoney, dateLabel, titleCase } from "@/lib/format";

export const dynamic = "force-dynamic";

const statusColor: Record<string, "green" | "gold" | "gray" | "sage" | "red"> = {
  active: "green",
  completed: "sage",
  written_off: "red",
};

export default async function PledgesPage() {
  const { rows, stats, attention } = await getPledgesPageData();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">Pledges</h1>
          <p className="text-sm text-ink/55">
            Multi-payment commitments with installment schedules and balances
          </p>
        </div>
        <LinkButton href="/pledges/new">
          <Plus size={16} /> New pledge
        </LinkButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total pledged" value={compactMoney(stats.totalPledged)} icon={<Handshake size={18} />} accent="#2D6A4F" />
        <KpiCard label="Outstanding balance" value={compactMoney(stats.outstanding)} sub="still to be collected" accent="#40916C" />
        <KpiCard label="Past due" value={money(stats.overdueAmount)} sub={`${stats.overduePledges} pledges`} icon={<TrendingDown size={18} />} accent="#B0830F" />
        <KpiCard label="Active pledges" value={rows.filter((r) => r.status === "active").length.toString()} accent="#D4A017" />
      </div>

      {attention.length > 0 && (
        <Card className="border-gold-500/30 bg-gold-50/50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold-800">
            <AlertTriangle size={16} /> Needs attention — overdue installments
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {attention.slice(0, 6).map((p) => (
              <Link
                key={p.id}
                href={`/pledges/${p.id}`}
                className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm hover:shadow-card"
              >
                <span className="text-sm font-medium text-forest-900">{p.donorName}</span>
                <span className="text-sm font-semibold text-gold-700">{money(p.overdueAmount)} due</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-forest-900/8 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="px-5 py-3 font-medium">Donor</th>
                <th className="px-5 py-3 font-medium">Campaign</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
                <th className="px-5 py-3 font-medium">Progress</th>
                <th className="px-5 py-3 font-medium text-right">Outstanding</th>
                <th className="px-5 py-3 font-medium">Next due</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/6">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-forest-50/50">
                  <td className="px-5 py-3">
                    <Link href={`/pledges/${p.id}`} className="font-medium text-forest-900 hover:underline">
                      {p.donorName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink/65">{p.campaignName}</td>
                  <td className="px-5 py-3 text-right font-semibold text-forest-900">{money(p.total)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <ProgressBar value={p.paid} max={p.total} />
                      </div>
                      <span className="text-xs text-ink/55">{p.pctPaid}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-ink/70">{money(p.outstanding)}</td>
                  <td className="px-5 py-3">
                    {p.nextDue ? (
                      <span className={p.overdueCount > 0 ? "font-medium text-gold-700" : "text-ink/65"}>
                        {dateLabel(p.nextDue, "MMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="text-ink/40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <Badge color={statusColor[p.status] || "gray"}>{titleCase(p.status)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
