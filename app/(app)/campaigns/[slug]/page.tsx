import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getCampaignDetail } from "@/lib/data";
import { Card, Badge, SectionHeading } from "@/components/ui";
import { GoalThermometer } from "@/components/GoalThermometer";
import { money, dateLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = await getCampaignDetail(slug);
  if (!d) return <div className="text-ink/60">Campaign not found.</div>;
  const { campaign } = d;

  return (
    <div className="space-y-6">
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-forest-800"
      >
        <ArrowLeft size={15} /> All campaigns
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: campaign.accent || "#2D6A4F" }}
            />
            <h1 className="font-display text-3xl font-semibold text-forest-900">
              {campaign.name}
            </h1>
            <Badge color={campaign.status === "active" ? "green" : "gray"}>
              {campaign.status === "active" ? "Active" : "Completed"}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-ink/60">{campaign.description}</p>
        </div>
        <Link
          href={`/give/${campaign.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600"
        >
          Open donation page <ExternalLink size={15} />
        </Link>
      </div>

      {campaign.hero_image && (
        <div className="relative h-48 overflow-hidden rounded-2xl shadow-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={campaign.hero_image}
            alt={campaign.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 to-transparent" />
        </div>
      )}

      <Card className="p-6">
        <GoalThermometer
          raised={d.raised}
          goal={campaign.goal}
          accent={campaign.accent || "#2D6A4F"}
          donors={d.donors}
        />
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Total raised", money(d.raised)],
          ["Gifts", d.giftCount.toString()],
          ["Donors", d.donors.toString()],
          ["Average gift", money(d.avgGift)],
        ].map(([l, v]) => (
          <Card key={l} className="p-4">
            <div className="text-xs text-ink/50">{l}</div>
            <div className="mt-1 font-display text-2xl font-semibold text-forest-900">{v}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <SectionHeading title="Recent gifts" />
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-forest-900/8 text-left text-xs uppercase tracking-wide text-ink/45">
              <th className="py-2 pr-3 font-medium">Donor</th>
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Method</th>
              <th className="py-2 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-900/6">
            {d.recent.map((g: any) => (
              <tr key={g.id} className="hover:bg-forest-50/40">
                <td className="py-2.5 pr-3 font-medium text-forest-900">{g.donorName}</td>
                <td className="py-2.5 pr-3 text-ink/65">{dateLabel(g.gift_date, "MMM d, yyyy")}</td>
                <td className="py-2.5 pr-3 capitalize text-ink/60">{g.payment_method}</td>
                <td className="py-2.5 text-right font-semibold text-forest-900">
                  {money(g.amount)}
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
