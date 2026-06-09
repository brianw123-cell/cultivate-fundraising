import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getReceipt } from "@/lib/data";
import { CultivateMark } from "@/components/Logo";
import { PrintButton } from "@/components/PrintButton";
import { money, dateLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = await getReceipt(id);
  if (!r) return <div className="p-10 text-ink/60">Gift not found.</div>;
  const { gift, donor, org } = r;
  const first = donor?.first_name || r.name.split(" ")[0];

  return (
    <div className="min-h-screen overflow-x-clip bg-cream py-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="no-print mb-4 flex items-center justify-between">
          <Link
            href="/stewardship"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-forest-800"
          >
            <ArrowLeft size={15} /> Back to stewardship
          </Link>
          <PrintButton label="Print letter" />
        </div>

        <div className="print-sheet rounded-2xl border border-forest-900/10 bg-white p-6 shadow-card sm:p-10">
          {/* letterhead */}
          <div className="flex items-center gap-3 border-b border-forest-900/10 pb-6">
            <CultivateMark size={40} />
            <div>
              <div className="font-display text-xl font-semibold text-forest-900">
                {org?.name}
              </div>
              <div className="text-xs text-ink/55">
                {org?.address_line1} · {org?.city}, {org?.state} {org?.zip} · {org?.phone}
              </div>
            </div>
          </div>

          {/* date + address */}
          <div className="mt-8 text-sm text-ink/70">{dateLabel(gift.gift_date, "MMMM d, yyyy")}</div>
          <div className="mt-6 text-sm text-ink/80">
            <div className="font-medium">{r.name}</div>
            {donor?.address_line1 && <div>{donor.address_line1}</div>}
            <div>
              {[donor?.city, donor?.state, donor?.zip].filter(Boolean).join(", ")}
            </div>
          </div>

          {/* body */}
          <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-ink/85">
            <p>Dear {first},</p>
            <p>
              On behalf of everyone at {org?.name}, thank you for your generous gift of{" "}
              <strong>{money(gift.amount, true)}</strong>
              {r.campaign ? (
                <>
                  {" "}
                  in support of <strong>{r.campaign}</strong>
                </>
              ) : null}
              . Your support is the reason our work is possible.
            </p>
            <p>
              Because of friends like you, families across our community have a place to
              turn for opportunity, stability, and hope. Gifts like yours don’t just fund
              programs, they change the trajectory of real lives, right here in Riverside.
            </p>
            {gift.is_recurring && (
              <p>
                As a recurring donor, your steady, year-round commitment is especially
                meaningful. It lets us plan ahead and respond the moment a family needs us.
              </p>
            )}
            <p>
              We are deeply grateful to have you as a partner in this work. Thank you for
              believing in what’s possible.
            </p>
            <p className="pt-2">
              With gratitude,
              <br />
              <span className="mt-3 block font-display text-lg text-forest-900">
                Dana Whitfield
              </span>
              <span className="text-sm text-ink/60">Executive Director, {org?.name}</span>
            </p>
          </div>

          {/* tax footer */}
          <div className="mt-8 border-t border-forest-900/10 pt-4 text-xs leading-relaxed text-ink/50">
            {org?.name} is a 501(c)(3) tax-exempt organization (EIN {org?.ein}).
            {gift.fmv > 0 ? (
              <>
                {" "}
                In exchange for this payment you received goods or services valued at{" "}
                {money(gift.fmv, true)}; the tax-deductible portion is{" "}
                {money(gift.amount - gift.fmv, true)}.
              </>
            ) : (
              <> No goods or services were provided in exchange for this contribution.</>
            )}{" "}
            Receipt {gift.receipt_number}. Please retain for your tax records.
          </div>
        </div>
      </div>
    </div>
  );
}
