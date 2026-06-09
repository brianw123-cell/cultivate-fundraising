import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDonorsLite, getActiveCampaignsForForm } from "@/lib/data";
import { PledgeForm } from "@/components/PledgeForm";

export const dynamic = "force-dynamic";

export default async function NewPledgePage() {
  const [donors, campaigns] = await Promise.all([
    getDonorsLite(),
    getActiveCampaignsForForm(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/pledges"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-forest-800"
      >
        <ArrowLeft size={15} /> Back to pledges
      </Link>
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">New pledge</h1>
        <p className="text-sm text-ink/55">
          Record a multi-payment commitment. We&apos;ll generate the installment schedule for you.
        </p>
      </div>
      <PledgeForm
        donors={donors.map((d) => ({ id: d.id, name: d.name }))}
        campaigns={campaigns.map((c: any) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
