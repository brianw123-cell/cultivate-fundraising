import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPledgeDetail } from "@/lib/data";
import { Card, KpiCard, Badge, SectionHeading } from "@/components/ui";
import { GoalThermometer } from "@/components/GoalThermometer";
import { PledgeActions } from "@/components/PledgeActions";
import { money, dateLabel, titleCase } from "@/lib/format";

export const dynamic = "force-dynamic";

const instColor: Record<string, "green" | "gold" | "gray" | "sage" | "red"> = {
  paid: "green",
  pending: "gray",
  overdue: "gold",
  written_off: "red",
};

export default async function PledgeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = await getPledgeDetail(id);
  if (!d) return <div className="text-ink/60">Pledge not found.</div>;
  const { pledge, summary } = d;

  return (
    <div className="space-y-6">
      <Link
        href="/pledges"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-forest-800"
      >
        <ArrowLeft size={15} /> All pledges
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-semibold text-forest-900">
              <Link href={`/donors/${pledge.donor_id}`} className="hover:underline">
                {d.name}
              </Link>
            </h1>
            <Badge color={pledge.status === "active" ? "green" : pledge.status === "written_off" ? "red" : "sage"}>
              {titleCase(pledge.status)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-ink/55">
            {money(pledge.total)} pledged · {money(pledge.installmentAmount)} {titleCase(pledge.frequency)} ·{" "}
            {d.campaign || "General Fund"} · started {dateLabel(pledge.start_date, "MMM yyyy")}
          </p>
        </div>
        <PledgeActions pledgeId={pledge.id} hasOutstanding={summary.outstanding > 0} status={pledge.status} />
      </div>

      <Card className="p-6">
        <GoalThermometer raised={summary.paid} goal={pledge.total} accent={d.accent} />
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Total pledged", money(pledge.total)],
          ["Paid to date", money(summary.paid)],
          ["Outstanding", money(summary.outstanding)],
          ["Overdue", `${summary.overdueCount} · ${money(summary.overdueAmount)}`],
        ].map(([l, v]) => (
          <Card key={l} className="p-4">
            <div className="text-xs text-ink/50">{l}</div>
            <div className="mt-1 font-display text-2xl font-semibold text-forest-900">{v}</div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-forest-900/8 px-5 py-4">
          <SectionHeading title="Installment schedule" subtitle={`${d.installments.length} installments`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-forest-900/8 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-5 py-3 font-medium">Due date</th>
                <th className="px-5 py-3 font-medium text-right">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/6">
              {d.installments.map((i: any) => (
                <tr key={i.id} className="hover:bg-forest-50/40">
                  <td className="px-5 py-3 text-ink/50">{i.seq}</td>
                  <td className="px-5 py-3 text-ink/70">{dateLabel(i.due_date, "MMM d, yyyy")}</td>
                  <td className="px-5 py-3 text-right font-medium text-forest-900">{money(i.amount)}</td>
                  <td className="px-5 py-3">
                    <Badge color={instColor[i.status] || "gray"}>{titleCase(i.status)}</Badge>
                  </td>
                  <td className="px-5 py-3 text-ink/55">{i.paid_date ? dateLabel(i.paid_date, "MMM d, yyyy") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
