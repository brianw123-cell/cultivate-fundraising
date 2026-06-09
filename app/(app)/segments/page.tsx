import Link from "next/link";
import { Layers, Send, Download } from "lucide-react";
import { getSegmentsPage } from "@/lib/data";
import { Card, avatarColor } from "@/components/ui";
import { money, compactMoney, dateLabel, initials } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SegmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ seg?: string }>;
}) {
  const sp = await searchParams;
  const { segments, active, rows } = await getSegmentsPage(sp.seg);
  const activeDef = segments.find((s) => s.key === active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">Segments</h1>
        <p className="text-sm text-ink/55">Smart donor lists that update automatically</p>
      </div>

      {/* segment cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {segments.map((s) => {
          const isActive = s.key === active;
          return (
            <Link
              key={s.key}
              href={`/segments?seg=${s.key}`}
              className={`rounded-2xl border p-4 transition-all ${
                isActive
                  ? "border-forest-700 bg-forest-800 text-cream shadow-lift"
                  : "border-forest-900/8 bg-white text-forest-900 shadow-card hover:border-forest-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers size={15} className={isActive ? "text-gold-300" : "text-forest-600"} />
                <span className="font-semibold">{s.label}</span>
              </div>
              <p className={`mt-1 text-xs ${isActive ? "text-cream/70" : "text-ink/50"}`}>
                {s.desc}
              </p>
              <div className="mt-3 flex items-end justify-between">
                <span className="font-display text-2xl font-semibold">{s.count}</span>
                <span className={`text-xs ${isActive ? "text-cream/70" : "text-ink/45"}`}>
                  {compactMoney(s.total)} lifetime
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* active segment table */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest-900/8 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-forest-900">
              {activeDef?.label}
            </h2>
            <p className="text-sm text-ink/55">{rows.length} donors in this segment</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/export/donors"
              className="inline-flex items-center gap-1.5 rounded-xl border border-forest-800/20 bg-white px-3.5 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50"
            >
              <Download size={15} /> Export
            </a>
            <Link
              href={`/appeals?seg=${active}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-forest-800 px-3.5 py-2 text-sm font-semibold text-cream hover:bg-forest-900"
            >
              <Send size={15} /> Email this segment
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-forest-900/8 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="px-5 py-3 font-medium">Donor</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium text-right">Lifetime</th>
                <th className="px-5 py-3 font-medium text-right">2026</th>
                <th className="px-5 py-3 font-medium">Last gift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/6">
              {rows.slice(0, 60).map((d: any) => (
                <tr key={d.id} className="hover:bg-forest-50/50">
                  <td className="px-5 py-3">
                    <Link href={`/donors/${d.id}`} className="flex items-center gap-2.5">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: avatarColor(d.name) }}
                      >
                        {initials(d.name)}
                      </span>
                      <span className="font-medium text-forest-900 hover:underline">{d.name}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink/60">
                    {d.city ? `${d.city}, ${d.state}` : "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-forest-900">
                    {money(d.lifetime)}
                  </td>
                  <td className="px-5 py-3 text-right text-ink/65">{money(d.sum2026)}</td>
                  <td className="px-5 py-3 text-ink/60">{dateLabel(d.lastGift, "MMM d, yyyy")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
