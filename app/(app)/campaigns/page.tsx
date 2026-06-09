import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { getCampaignsPageData } from "@/lib/data";
import { Card, Badge } from "@/components/ui";
import { GoalThermometer } from "@/components/GoalThermometer";
import { dateLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns = await getCampaignsPageData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">Campaigns</h1>
        <p className="text-sm text-ink/55">{campaigns.length} campaigns and funds</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {campaigns.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: c.accent || "#2D6A4F" }}
                  />
                  <h2 className="font-display text-lg font-semibold text-forest-900">
                    {c.name}
                  </h2>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-ink/55">{c.description}</p>
              </div>
              <Badge color={c.status === "active" ? "green" : "gray"}>
                {c.status === "active" ? "Active" : "Completed"}
              </Badge>
            </div>

            <GoalThermometer
              raised={c.raised}
              goal={c.goal}
              accent={c.accent || "#2D6A4F"}
              donors={c.donors}
            />

            <div className="mt-4 flex items-center justify-between border-t border-forest-900/8 pt-3 text-sm">
              <span className="text-ink/50">
                {dateLabel(c.start_date, "MMM yyyy")} – {dateLabel(c.end_date, "MMM yyyy")}
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href={`/give/${c.slug}`}
                  target="_blank"
                  className="flex items-center gap-1 font-medium text-gold-700 hover:underline"
                >
                  Donation page <ExternalLink size={13} />
                </Link>
                <Link
                  href={`/campaigns/${c.slug}`}
                  className="flex items-center gap-1 font-semibold text-forest-700 hover:underline"
                >
                  Details <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
