import { Repeat, RefreshCw } from "lucide-react";
import { getRecurringPageData } from "@/lib/data";
import { Card, KpiCard } from "@/components/ui";
import { RecurringTable } from "@/components/tables/RecurringTable";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RecurringPage() {
  const plans = await getRecurringPageData();
  const active = plans.filter((p) => p.status === "active");
  const monthly = active.reduce((s, p) => {
    const a = p.amount;
    if (p.frequency === "monthly") return s + a;
    if (p.frequency === "quarterly") return s + a / 3;
    if (p.frequency === "annually") return s + a / 12;
    return s + a;
  }, 0);
  const annual = monthly * 12;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">
          Recurring giving
        </h1>
        <p className="text-sm text-ink/55">Sustaining donors on automatic schedules</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Active plans"
          value={active.length.toString()}
          icon={<Repeat size={18} />}
          accent="#2D6A4F"
        />
        <KpiCard
          label="Monthly recurring revenue"
          value={money(monthly)}
          icon={<RefreshCw size={18} />}
          accent="#D4A017"
        />
        <KpiCard
          label="Annualized"
          value={money(annual)}
          sub="projected over 12 months"
          accent="#40916C"
        />
      </div>

      <Card className="overflow-hidden">
        <RecurringTable rows={plans} />
      </Card>
    </div>
  );
}
