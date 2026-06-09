import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Repeat,
  Heart,
  Gem,
} from "lucide-react";
import { getDonorDetail } from "@/lib/data";
import { Card, Badge, avatarColor, SectionHeading } from "@/components/ui";
import {
  money,
  dateLabel,
  initials,
  titleCase,
  donorName,
  capacityTier,
  affinityLabel,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DonorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = await getDonorDetail(id);
  if (!d.donor) {
    return <div className="text-ink/60">Donor not found.</div>;
  }
  const { donor } = d;

  const stats = [
    ["Lifetime giving", money(d.lifetime)],
    ["Total gifts", d.giftCount.toString()],
    ["Largest gift", money(d.largest)],
    ["Years giving", d.yearsGiving.toString()],
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/donors"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-forest-800"
      >
        <ArrowLeft size={15} /> All donors
      </Link>

      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-semibold text-white"
            style={{ backgroundColor: avatarColor(d.name) }}
          >
            {initials(d.name)}
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold text-forest-900">
              {d.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink/55">
              <Badge color={donor.type === "individual" ? "sage" : "gold"}>
                {titleCase(donor.type)}
              </Badge>
              {donor.tags?.map((t: string) => (
                <Badge key={t} color="gray">
                  {titleCase(t)}
                </Badge>
              ))}
              <span>· Donor since {dateLabel(donor.donor_since, "MMM yyyy")}</span>
            </div>
          </div>
        </div>
        <Link
          href={`/statement/${donor.id}?year=2025`}
          className="inline-flex items-center gap-2 rounded-xl border border-forest-800/20 bg-white px-4 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50"
        >
          <FileText size={16} /> 2025 tax statement
        </Link>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([l, v]) => (
          <Card key={l} className="p-4">
            <div className="text-xs text-ink/50">{l}</div>
            <div className="mt-1 font-display text-2xl font-semibold text-forest-900">
              {v}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* contact + recurring */}
        <div className="space-y-5">
          <Card className="p-5">
            <SectionHeading title="Contact" />
            <div className="space-y-2.5 text-sm text-ink/70">
              {donor.email && (
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-ink/40" /> {donor.email}
                </div>
              )}
              {donor.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-ink/40" /> {donor.phone}
                </div>
              )}
              {donor.city && (
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-ink/40" />
                  {donor.city}, {donor.state} {donor.zip}
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Calendar size={15} className="text-ink/40" />
                First gift {dateLabel(d.firstGift)}
              </div>
            </div>
          </Card>

          {donor.capacity_high && (
            <Card className="p-5">
              <SectionHeading title="Prospect research" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-ink/55">
                    <Gem size={14} className="text-gold-600" /> Giving capacity
                  </span>
                  <span className="font-mono font-bold text-gold-600">
                    {capacityTier(Number(donor.capacity_high)).tier}
                    <span className="ml-2 font-sans text-xs font-normal text-ink/55">
                      {capacityTier(Number(donor.capacity_high)).label}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink/55">Affinity score</span>
                  <Badge
                    color={
                      Number(donor.affinity_score) >= 70
                        ? "green"
                        : Number(donor.affinity_score) >= 40
                        ? "gold"
                        : "gray"
                    }
                  >
                    {donor.affinity_score} · {affinityLabel(Number(donor.affinity_score))}
                  </Badge>
                </div>
                {donor.wealth_indicators?.length > 0 && (
                  <div>
                    <div className="mb-1.5 text-sm text-ink/55">Wealth indicators</div>
                    <div className="flex flex-wrap gap-1.5">
                      {donor.wealth_indicators.map((i: string) => (
                        <span
                          key={i}
                          className="rounded-full bg-forest-50 px-2.5 py-1 text-xs text-forest-700"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {d.plans.length > 0 && (
            <Card className="p-5">
              <SectionHeading title="Recurring plans" />
              <div className="space-y-3">
                {d.plans.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl bg-forest-50 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <Repeat size={15} className="text-forest-600" />
                      <div>
                        <div className="text-sm font-semibold text-forest-900">
                          {money(p.amount)} / {titleCase(p.frequency)}
                        </div>
                        <div className="text-xs text-ink/50">
                          {p.campaign?.name} · next {dateLabel(p.next_charge_date, "MMM d")}
                        </div>
                      </div>
                    </div>
                    <Badge color="green">{titleCase(p.status)}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* giving history */}
        <Card className="p-5 lg:col-span-2 min-w-0">
          <SectionHeading title="Giving history" subtitle={`${d.giftCount} gifts`} />
          <div className="max-h-[520px] overflow-auto scroll-thin">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-forest-900/8 text-left text-xs uppercase tracking-wide text-ink/45">
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Campaign</th>
                  <th className="py-2 pr-3 font-medium">Method</th>
                  <th className="py-2 pr-3 font-medium text-right">Amount</th>
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-900/6">
                {d.gifts.map((g: any) => (
                  <tr key={g.id} className="hover:bg-forest-50/40">
                    <td className="py-2.5 pr-3 text-ink/70">{dateLabel(g.gift_date, "MMM d, yyyy")}</td>
                    <td className="py-2.5 pr-3 text-ink/70">{g.campaign?.name || "—"}</td>
                    <td className="py-2.5 pr-3">
                      <span className="capitalize text-ink/60">{g.payment_method}</span>
                      {g.is_recurring && (
                        <span className="ml-1 text-[10px] text-gold-700">· recurring</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-semibold text-forest-900">
                      {money(g.amount)}
                    </td>
                    <td className="py-2.5 text-right">
                      {g.tribute_type && (
                        <span title={`${titleCase(g.tribute_type)} ${g.tribute_name}`}>
                          <Heart size={13} className="inline text-gold-600" />
                        </span>
                      )}
                      <Link
                        href={`/receipt/${g.id}`}
                        className="ml-2 text-xs font-medium text-forest-700 hover:underline"
                      >
                        Receipt
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
