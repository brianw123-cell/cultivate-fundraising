import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDonorsLite, getActiveCampaignsForForm } from "@/lib/data";
import { ManualGiftForm } from "@/components/ManualGiftForm";

export const dynamic = "force-dynamic";

export default async function NewGiftPage() {
  const [donors, campaigns] = await Promise.all([
    getDonorsLite(),
    getActiveCampaignsForForm(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/gifts"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-forest-800"
      >
        <ArrowLeft size={15} /> Back to gifts
      </Link>
      <div>
        <h1 className="font-display text-3xl font-semibold text-forest-900">Record a gift</h1>
        <p className="text-sm text-ink/55">
          Log an offline gift like a check, cash, or an in-person card donation.
        </p>
      </div>
      <ManualGiftForm
        donors={donors.map((d) => ({ id: d.id, name: d.name }))}
        campaigns={campaigns.map((c: any) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
