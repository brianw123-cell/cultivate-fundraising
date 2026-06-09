import { Download } from "lucide-react";
import { getDonorsPageData } from "@/lib/data";
import { Card } from "@/components/ui";
import { SearchBox } from "@/components/SearchBox";
import { DonorsTable } from "@/components/tables/DonorsTable";

export const dynamic = "force-dynamic";

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const donors = await getDonorsPageData(sp.q);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">Donors</h1>
          <p className="text-sm text-ink/55">
            {donors.length} {sp.q ? "matching" : "total"} supporters
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <SearchBox placeholder="Search name, email, city…" />
          <a
            href="/api/export/donors"
            className="inline-flex items-center gap-1.5 rounded-xl border border-forest-800/20 bg-white px-3.5 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50"
          >
            <Download size={15} /> Export
          </a>
        </div>
      </div>

      <Card className="overflow-hidden">
        <DonorsTable rows={donors} />
      </Card>
    </div>
  );
}
