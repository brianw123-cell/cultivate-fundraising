import Link from "next/link";
import { Stamp, Clock, FileText } from "lucide-react";
import { getStewardshipQueue } from "@/lib/data";
import { Card, KpiCard, Badge, EmptyState, avatarColor } from "@/components/ui";
import { AckButton } from "@/components/AckButton";
import { money, dateLabel, initials } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function StewardshipPage() {
  const q = await getStewardshipQueue();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">Stewardship</h1>
        <p className="text-sm text-ink/55">Gifts awaiting a thank-you acknowledgment</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Awaiting acknowledgment"
          value={q.count.toString()}
          icon={<Stamp size={18} />}
          accent="#D4A017"
        />
        <KpiCard label="Total to acknowledge" value={money(q.total)} accent="#2D6A4F" />
        <KpiCard
          label="Oldest pending"
          value={q.oldest ? dateLabel(q.oldest, "MMM d") : "—"}
          sub="aim to thank within 48 hours"
          icon={<Clock size={18} />}
          accent="#B0830F"
        />
      </div>

      {q.count === 0 ? (
        <EmptyState>🎉 All caught up. Every gift has been acknowledged.</EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-forest-900/8 text-left text-xs uppercase tracking-wide text-ink/45">
                  <th className="px-5 py-3 font-medium">Donor</th>
                  <th className="px-5 py-3 font-medium">Gift</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Campaign</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-900/6">
                {q.list.map((g: any) => (
                  <tr key={g.id} className="hover:bg-forest-50/40">
                    <td className="px-5 py-3">
                      <Link
                        href={`/donors/${g.donor_id}`}
                        className="flex items-center gap-2.5"
                      >
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: avatarColor(g.donorName) }}
                        >
                          {initials(g.donorName)}
                        </span>
                        <span className="font-medium text-forest-900 hover:underline">
                          {g.donorName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-forest-900">{money(g.amount)}</span>
                      {g.amount >= 250 && (
                        <Badge color="gold" className="ml-1.5">
                          $250+
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-3 text-ink/65">{dateLabel(g.gift_date, "MMM d, yyyy")}</td>
                    <td className="px-5 py-3 text-ink/65">{g.campaign?.name || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/letter/${g.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-forest-800/20 bg-white px-3 py-1.5 text-xs font-semibold text-forest-800 hover:bg-forest-50"
                        >
                          <FileText size={13} /> Letter
                        </Link>
                        <AckButton giftId={g.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
