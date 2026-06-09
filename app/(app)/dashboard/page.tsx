import Link from "next/link";
import {
  TrendingUp,
  Users,
  Repeat,
  HeartHandshake,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { getDashboardData } from "@/lib/data";
import { Card, KpiCard, SectionHeading, Badge, LinkButton } from "@/components/ui";
import { GivingTrendChart, CampaignBarChart, MethodDonut } from "@/components/charts";
import { GoalThermometer } from "@/components/GoalThermometer";
import { money, compactMoney, dateLabel, titleCase } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const d = await getDashboardData();

  return (
    <div className="space-y-7">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink/50">Riverside Hope Foundation</p>
          <h1 className="font-display text-3xl font-semibold text-forest-900">
            Development dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="sage">Fiscal year 2026</Badge>
          <LinkButton href="/gifts/new" variant="primary">
            <Plus size={16} /> Add gift
          </LinkButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Raised in 2026"
          value={money(d.totalRaisedYTD)}
          trend={{ value: d.ytdDelta }}
          sub="vs. same window last year"
          icon={<TrendingUp size={18} />}
          accent="#2D6A4F"
        />
        <KpiCard
          label="Active donors"
          value={d.ytdDonors.toString()}
          sub={`${d.totalDonors} total on file`}
          icon={<Users size={18} />}
          accent="#40916C"
        />
        <KpiCard
          label="Monthly recurring"
          value={money(d.monthlyRecurring)}
          sub={`${d.activeRecurringCount} active plans`}
          icon={<Repeat size={18} />}
          accent="#D4A017"
        />
        <KpiCard
          label="Donor retention"
          value={`${d.retentionRate}%`}
          sub="2025 vs. 2024"
          icon={<HeartHandshake size={18} />}
          accent="#B0830F"
        />
      </div>

      {/* trend + methods */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2 min-w-0">
          <SectionHeading
            title="Giving over time"
            subtitle="Monthly totals since January 2025"
          />
          <GivingTrendChart data={d.trend} />
        </Card>
        <Card className="p-5">
          <SectionHeading title="How donors give" subtitle="2026 by method" />
          <div className="mt-6 flex justify-center">
            <MethodDonut data={d.byMethod} />
          </div>
        </Card>
      </div>

      {/* campaigns + recent */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2 min-w-0">
          <SectionHeading
            title="Campaign performance"
            subtitle="All-time raised by campaign"
            action={
              <Link
                href="/campaigns"
                className="flex items-center gap-1 text-sm font-semibold text-forest-700 hover:text-forest-900"
              >
                View all <ArrowUpRight size={15} />
              </Link>
            }
          />
          <CampaignBarChart
            data={d.byCampaign.slice(0, 6).map((c) => ({
              name: c.name,
              raised: c.raised,
              accent: c.accent,
            }))}
          />
        </Card>

        <Card className="p-5">
          <SectionHeading title="Recent gifts" />
          <div className="divide-y divide-forest-900/6">
            {d.recentGifts.map((g) => (
              <Link
                key={g.id}
                href={`/receipt/${g.id}`}
                className="flex items-center justify-between py-2.5 hover:opacity-80"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-forest-900">
                    {g.donorName}
                  </div>
                  <div className="truncate text-xs text-ink/50">
                    {g.campaign} · {dateLabel(g.gift_date, "MMM d")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-forest-900">
                    {money(g.amount)}
                  </div>
                  {g.is_recurring && (
                    <span className="text-[10px] font-medium text-gold-700">
                      recurring
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* top campaign goal */}
      {d.byCampaign[0] && (
        <Card className="p-5">
          <SectionHeading
            title="Featured goal"
            subtitle={d.byCampaign.find((c) => c.status === "active")?.name || d.byCampaign[0].name}
          />
          {(() => {
            const c = d.byCampaign.find((x) => x.status === "active") || d.byCampaign[0];
            return <GoalThermometer raised={c.raised} goal={c.goal} accent={c.accent} />;
          })()}
        </Card>
      )}
    </div>
  );
}
