import Link from "next/link";
import { Gem, TrendingUp, Target } from "lucide-react";
import { getProspects } from "@/lib/data";
import { Card, KpiCard, Badge, SectionHeading, avatarColor } from "@/components/ui";
import { money, compactMoney, initials, capacityTier, affinityLabel } from "@/lib/format";
import { ProspectsTable } from "@/components/tables/ProspectsTable";

export const dynamic = "force-dynamic";

function AffinityPill({ score }: { score: number }) {
  const label = affinityLabel(score);
  const color = score >= 70 ? "green" : score >= 40 ? "gold" : "gray";
  return (
    <Badge color={color as any}>
      {score} · {label}
    </Badge>
  );
}

export default async function ProspectsPage() {
  const p = await getProspects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">
          Prospect research
        </h1>
        <p className="text-sm text-ink/55">
          Estimated giving capacity, affinity, and wealth indicators
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total estimated capacity"
          value={compactMoney(p.totalCapacity)}
          icon={<Gem size={18} />}
          accent="#2D6A4F"
        />
        <KpiCard
          label="High-potential prospects"
          value={p.highPotential.length.toString()}
          sub="high capacity + affinity, under-giving"
          icon={<Target size={18} />}
          accent="#D4A017"
        />
        <KpiCard
          label="Untapped opportunity"
          value={compactMoney(p.topGap)}
          sub="capacity above current giving"
          icon={<TrendingUp size={18} />}
          accent="#40916C"
        />
      </div>

      {/* top opportunities */}
      {p.highPotential.length > 0 && (
        <Card className="p-5">
          <SectionHeading
            title="Top opportunities"
            subtitle="Wealthy, engaged donors giving below their capacity"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.highPotential.slice(0, 6).map((d) => {
              const tier = capacityTier(d.capacityHigh);
              return (
                <Link
                  key={d.id}
                  href={`/donors/${d.id}`}
                  className="rounded-xl border border-gold-500/25 bg-gold-50/50 p-4 transition-shadow hover:shadow-lift"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-forest-900">{d.name}</span>
                    <span className="font-mono text-sm font-bold text-gold-600">{tier.tier}</span>
                  </div>
                  <div className="mt-1 text-xs text-ink/55">Capacity {tier.label}</div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-ink/55">Given {money(d.lifetime)}</span>
                    <AffinityPill score={d.affinity} />
                  </div>
                  <div className="mt-2 rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-forest-800">
                    {compactMoney(d.gap)} untapped
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      )}

      {/* full ranked table */}
      <Card className="overflow-hidden">
        <div className="border-b border-forest-900/8 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-forest-900">
            All prospects by capacity
          </h2>
        </div>
        <ProspectsTable rows={p.rows} />
      </Card>
    </div>
  );
}
