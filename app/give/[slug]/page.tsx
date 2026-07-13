import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { getGiveCampaign, getActiveCampaignsForForm } from "@/lib/data";
import { DonationForm } from "@/components/DonationForm";
import { GoalThermometer } from "@/components/GoalThermometer";
import { PublicHeader, PublicFooter } from "@/components/PublicChrome";
import { money, dateLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function GiveCampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [data, campaigns] = await Promise.all([
    getGiveCampaign(slug),
    getActiveCampaignsForForm(),
  ]);
  if (!data) return <div className="p-10 text-ink/60">Campaign not found.</div>;
  const { org, campaign } = data;
  const accent = campaign.accent || "#2D6A4F";

  return (
    <div className="min-h-screen bg-cream">
      <PublicHeader orgName={org?.name} />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/give"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-forest-800"
        >
          <ArrowLeft size={15} /> All ways to give
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* story */}
          <div>
            <div className="relative mb-5 h-56 overflow-hidden rounded-2xl shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={campaign.hero_image || "/campaigns/2026-annual-fund.jpg"}
                alt={campaign.name}
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, rgba(11,26,20,0.05) 30%, ${accent}e6)`,
                }}
              />
              <div className="absolute bottom-4 left-5 right-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-800 backdrop-blur">
                  {campaign.status === "active" ? "Active campaign" : "Campaign"}
                </span>
              </div>
            </div>
            <h1 className="font-display text-3xl font-semibold text-forest-900">
              {campaign.name}
            </h1>
            <p className="mt-3 text-ink/65">{campaign.description}</p>

            <div className="mt-6 rounded-2xl border border-forest-900/8 bg-white p-5 shadow-card">
              <GoalThermometer
                raised={data.raised}
                goal={campaign.goal}
                accent={accent}
                donors={data.donorCount}
              />
            </div>

            {data.recentDonors.length > 0 && (
              <div className="mt-6">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-forest-900">
                  <Users size={15} /> Recent supporters
                </div>
                <div className="space-y-1.5">
                  {data.recentDonors.slice(0, 6).map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
                    >
                      <span className="text-ink/75">{d.name}</span>
                      <span className="text-ink/45">
                        {money(d.amount)} · {dateLabel(d.date, "MMM d")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* form */}
          <div>
            <div className="sticky top-6 rounded-2xl border border-forest-900/8 bg-white p-6 shadow-lift">
              <h2 className="mb-5 font-display text-xl font-semibold text-forest-900">
                Make your gift
              </h2>
              <DonationForm
                campaigns={campaigns.map((c: any) => ({ id: c.id, name: c.name }))}
                defaultCampaignId={campaign.id}
                accent={accent}
              />
            </div>
          </div>
        </div>
      </div>

      <PublicFooter orgName={org?.name} />
    </div>
  );
}
