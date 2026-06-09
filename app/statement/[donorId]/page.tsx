import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getStatement } from "@/lib/data";
import { CultivateMark } from "@/components/Logo";
import { PrintButton } from "@/components/PrintButton";
import { money, dateLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function StatementPage({
  params,
  searchParams,
}: {
  params: Promise<{ donorId: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  const { donorId } = await params;
  const { year } = await searchParams;
  const yr = Number(year) || 2025;
  const s = await getStatement(donorId, yr);
  if (!s.donor) return <div className="p-10 text-ink/60">Donor not found.</div>;
  const org = s.org;

  return (
    <div className="min-h-screen overflow-x-clip bg-cream py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* controls */}
        <div className="no-print mb-4 flex items-center justify-between">
          <Link
            href={`/donors/${donorId}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-forest-800"
          >
            <ArrowLeft size={15} /> Back to donor
          </Link>
          <PrintButton />
        </div>

        {/* sheet */}
        <div className="print-sheet mx-auto rounded-2xl border border-forest-900/10 bg-white p-6 shadow-card sm:p-10">
          {/* letterhead */}
          <div className="flex items-start justify-between border-b border-forest-900/10 pb-6">
            <div className="flex items-center gap-3">
              <CultivateMark size={40} />
              <div>
                <div className="font-display text-xl font-semibold text-forest-900">
                  {org?.name}
                </div>
                <div className="text-xs text-ink/55">
                  {org?.address_line1} · {org?.city}, {org?.state} {org?.zip}
                </div>
                <div className="text-xs text-ink/55">
                  EIN {org?.ein} · {org?.email}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-lg font-semibold text-forest-900">
                Annual Giving Statement
              </div>
              <div className="text-sm text-ink/55">Tax year {yr}</div>
            </div>
          </div>

          {/* donor */}
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wide text-ink/45">Prepared for</div>
            <div className="mt-1 font-semibold text-forest-900">{s.name}</div>
            {s.donor.address_line1 && (
              <div className="text-sm text-ink/60">{s.donor.address_line1}</div>
            )}
            <div className="text-sm text-ink/60">
              {[s.donor.city, s.donor.state, s.donor.zip].filter(Boolean).join(", ")}
            </div>
          </div>

          {/* table */}
          <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[440px] text-sm">
            <thead>
              <tr className="border-b border-forest-900/10 text-left text-xs uppercase tracking-wide text-ink/45">
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Designation</th>
                <th className="py-2 font-medium text-right">Amount</th>
                <th className="py-2 font-medium text-right">FMV</th>
                <th className="py-2 font-medium text-right">Deductible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/6">
              {s.gifts.map((g: any) => (
                <tr key={g.id}>
                  <td className="py-2 text-ink/70">{dateLabel(g.gift_date, "MMM d, yyyy")}</td>
                  <td className="py-2 text-ink/70">{g.campaign?.name || "General Fund"}</td>
                  <td className="py-2 text-right text-ink/80">{money(g.amount, true)}</td>
                  <td className="py-2 text-right text-ink/60">
                    {g.fmv > 0 ? money(g.fmv, true) : "—"}
                  </td>
                  <td className="py-2 text-right font-medium text-forest-900">
                    {money(g.amount - g.fmv, true)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-forest-900/15 font-semibold text-forest-900">
                <td className="py-3" colSpan={2}>
                  Totals ({s.gifts.length} gifts)
                </td>
                <td className="py-3 text-right">{money(s.total, true)}</td>
                <td className="py-3 text-right">{money(s.fmvTotal, true)}</td>
                <td className="py-3 text-right">{money(s.deductible, true)}</td>
              </tr>
            </tfoot>
          </table>
          </div>

          {/* summary box */}
          <div className="mt-6 rounded-xl bg-forest-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/70">
                Total tax-deductible contributions for {yr}
              </span>
              <span className="font-display text-2xl font-semibold text-forest-900">
                {money(s.deductible, true)}
              </span>
            </div>
          </div>

          {/* IRS language */}
          <div className="mt-6 space-y-3 text-xs leading-relaxed text-ink/55">
            <p>
              {org?.name} is a tax-exempt organization under Section 501(c)(3) of the
              Internal Revenue Code (EIN {org?.ein}). No goods or services were provided
              in exchange for these contributions except where a fair market value (FMV)
              is shown above, in which case only the amount exceeding the FMV is
              tax-deductible.
            </p>
            <p>
              Please retain this statement for your tax records. This document serves as
              your contemporaneous written acknowledgment under IRS regulations for
              contributions of $250 or more. Consult your tax advisor regarding
              deductibility.
            </p>
          </div>

          <div className="mt-8 border-t border-forest-900/10 pt-4 text-xs text-ink/45">
            With gratitude, the team at {org?.name}. Generated by Cultivate.
          </div>
        </div>
      </div>
    </div>
  );
}
