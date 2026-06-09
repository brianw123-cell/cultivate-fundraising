import Link from "next/link";
import { Target, ArrowRight } from "lucide-react";
import { getPipeline } from "@/lib/data";
import { Card, KpiCard, avatarColor } from "@/components/ui";
import { money, compactMoney, dateLabel, initials } from "@/lib/format";

export const dynamic = "force-dynamic";

const STAGE_ACCENT: Record<string, string> = {
  identification: "#94a3b8",
  qualification: "#52B788",
  cultivation: "#40916C",
  solicitation: "#D4A017",
  stewardship: "#2D6A4F",
};

export default async function PipelinePage() {
  const p = await getPipeline();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">
            Major gift pipeline
          </h1>
          <p className="text-sm text-ink/55">Moves management across cultivation stages</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Prospects in pipeline"
          value={p.count.toString()}
          icon={<Target size={18} />}
          accent="#2D6A4F"
        />
        <KpiCard label="Total ask amount" value={compactMoney(p.totalAsk)} accent="#D4A017" />
        <KpiCard
          label="In solicitation"
          value={(p.byStage.find((s) => s.key === "solicitation")?.donors.length || 0).toString()}
          sub="ready for the ask"
          accent="#B0830F"
        />
      </div>

      {/* board */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-[repeat(5,minmax(196px,1fr))] gap-3">
          {p.byStage.map((stage) => {
            const accent = STAGE_ACCENT[stage.key];
            return (
              <div key={stage.key} className="min-w-0">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
                    <span className="text-sm font-semibold text-forest-900">{stage.label}</span>
                    <span className="rounded-full bg-ink/8 px-1.5 text-xs font-medium text-ink/55">
                      {stage.donors.length}
                    </span>
                  </div>
                </div>
                <div className="mb-3 text-xs font-medium text-ink/45">
                  {compactMoney(stage.ask)} in asks
                </div>
                <div className="space-y-2.5">
                  {stage.donors.map((d) => (
                    <Link
                      key={d.id}
                      href={`/donors/${d.id}`}
                      className="block rounded-xl border border-forest-900/8 bg-white p-3.5 shadow-card transition-shadow hover:shadow-lift"
                      style={{ borderTop: `3px solid ${accent}` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-forest-900">{d.name}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-ink/45">
                        {money(d.lifetime)} lifetime
                      </div>
                      <div className="mt-2 font-display text-lg font-semibold" style={{ color: accent }}>
                        {money(d.ask)}
                        <span className="ml-1 text-xs font-normal text-ink/45">ask</span>
                      </div>
                      <div className="mt-2 rounded-lg bg-cream/70 px-2 py-1.5 text-xs text-ink/65">
                        {d.nextAction}
                        <div className="mt-0.5 text-ink/40">
                          Due {dateLabel(d.nextDate, "MMM d")}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                          style={{ backgroundColor: avatarColor(d.officer || "") }}
                        >
                          {initials(d.officer || "")}
                        </span>
                        <span className="text-[11px] text-ink/50">{d.officer}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
