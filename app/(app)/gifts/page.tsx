import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { getGiftsPageData } from "@/lib/data";
import { Card, LinkButton } from "@/components/ui";
import { SearchBox } from "@/components/SearchBox";
import { GiftsTable } from "@/components/tables/GiftsTable";
import { money, titleCase } from "@/lib/format";

export const dynamic = "force-dynamic";

const METHODS = ["all", "card", "ach", "check", "cash"];

export default async function GiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; method?: string }>;
}) {
  const sp = await searchParams;
  const { rows, totalCount, totalAmount } = await getGiftsPageData({
    q: sp.q,
    method: sp.method,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">Gifts</h1>
          <p className="text-sm text-ink/55">
            {totalCount.toLocaleString()} gifts · {money(totalAmount)} total
            {rows.length < totalCount && ` · showing latest ${rows.length}`}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <SearchBox placeholder="Search donor or receipt #…" />
          <a
            href="/api/export/gifts"
            className="inline-flex items-center gap-1.5 rounded-xl border border-forest-800/20 bg-white px-3.5 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50"
          >
            <Download size={15} /> Export
          </a>
          <LinkButton href="/gifts/new">
            <Plus size={16} /> Add gift
          </LinkButton>
        </div>
      </div>

      {/* method filter */}
      <div className="flex flex-wrap gap-2">
        {METHODS.map((m) => {
          const active = (sp.method || "all") === m;
          const href = m === "all" ? "/gifts" : `/gifts?method=${m}`;
          return (
            <Link
              key={m}
              href={href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-forest-800 text-cream"
                  : "bg-white border border-forest-900/10 text-ink/60 hover:border-forest-400"
              }`}
            >
              {titleCase(m)}
            </Link>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <GiftsTable rows={rows} />
      </Card>
    </div>
  );
}
