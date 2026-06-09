import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { getReceipt } from "@/lib/data";
import { CultivateMark } from "@/components/Logo";
import { PrintButton } from "@/components/PrintButton";
import { money, dateLabel, titleCase } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = await getReceipt(id);
  if (!r) return <div className="p-10 text-ink/60">Receipt not found.</div>;
  const { gift, org } = r;
  const deductible = gift.amount - gift.fmv;
  const isQuidProQuo = gift.fmv > 0;
  const needsAck = gift.amount >= 250;

  return (
    <div className="min-h-screen overflow-x-clip bg-cream py-8">
      <div className="mx-auto max-w-xl px-4">
        <div className="no-print mb-4 flex items-center justify-between">
          <Link
            href="/gifts"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/55 hover:text-forest-800"
          >
            <ArrowLeft size={15} /> Back
          </Link>
          <PrintButton label="Print receipt" />
        </div>

        <div className="print-sheet rounded-2xl border border-forest-900/10 bg-white p-6 shadow-card sm:p-8">
          {/* header */}
          <div className="flex items-start justify-between border-b border-forest-900/10 pb-5">
            <div className="flex items-center gap-3">
              <CultivateMark size={36} />
              <div>
                <div className="font-display text-lg font-semibold text-forest-900">
                  {org?.name}
                </div>
                <div className="text-xs text-ink/55">EIN {org?.ein}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-base font-semibold text-forest-900">
                Donation Receipt
              </div>
              <div className="text-xs text-ink/55">{gift.receipt_number}</div>
            </div>
          </div>

          {/* thank you */}
          <div className="mt-6 text-center">
            <div className="text-sm text-ink/55">Thank you for your generous gift,</div>
            <div className="mt-1 font-display text-xl font-semibold text-forest-900">
              {r.name}
            </div>
          </div>

          {/* amount */}
          <div className="mt-6 rounded-xl bg-forest-50 p-5 text-center">
            <div className="text-xs uppercase tracking-wide text-ink/45">Gift amount</div>
            <div className="font-display text-4xl font-semibold text-forest-900">
              {money(gift.amount, true)}
            </div>
            {gift.is_recurring && (
              <div className="mt-1 text-xs font-medium text-gold-700">Recurring gift</div>
            )}
          </div>

          {/* details */}
          <dl className="mt-6 space-y-2.5 text-sm">
            <Row label="Date" value={dateLabel(gift.gift_date, "MMMM d, yyyy")} />
            <Row label="Designation" value={r.campaign || "General Fund"} />
            <Row
              label="Payment method"
              value={
                gift.payment_method === "card"
                  ? `${gift.card_brand || "Card"} ···· ${gift.card_last4 || ""}`
                  : titleCase(gift.payment_method)
              }
            />
            {gift.tribute_type && (
              <Row
                label="Dedication"
                value={`${titleCase(gift.tribute_type)} ${gift.tribute_name || ""}`}
              />
            )}
          </dl>

          {/* quid pro quo disclosure */}
          {isQuidProQuo && (
            <div className="mt-5 rounded-xl border border-gold-500/30 bg-gold-50 p-4 text-xs leading-relaxed text-ink/70">
              <div className="mb-1 font-semibold text-gold-800">
                Quid pro quo disclosure
              </div>
              In exchange for this payment you received goods or services with an
              estimated fair market value of <strong>{money(gift.fmv, true)}</strong>. The
              amount of your contribution that is tax-deductible for federal income tax
              purposes is limited to the excess of your payment over the value received,
              or <strong>{money(deductible, true)}</strong>.
            </div>
          )}

          {/* 250+ acknowledgment */}
          {!isQuidProQuo && needsAck && (
            <div className="mt-5 rounded-xl border border-forest-900/10 bg-cream/60 p-4 text-xs leading-relaxed text-ink/70">
              No goods or services were provided in exchange for this contribution. This
              letter serves as your contemporaneous written acknowledgment for a single
              contribution of $250 or more, as required by the IRS.
            </div>
          )}

          {/* footer language */}
          <p className="mt-5 text-xs leading-relaxed text-ink/50">
            {org?.name} is a nonprofit organization exempt from federal income tax under
            Section 501(c)(3). Your contribution is tax-deductible to the extent allowed
            by law. Please retain this receipt for your records.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-forest-900/6 pb-2.5">
      <dt className="text-ink/50">{label}</dt>
      <dd className="font-medium text-forest-900">{value}</dd>
    </div>
  );
}
