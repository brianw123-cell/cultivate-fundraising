import Link from "next/link";
import { Check, ArrowRight, Mail } from "lucide-react";
import { getReceipt } from "@/lib/data";
import { PublicHeader, PublicFooter } from "../page";
import { money, titleCase } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ gift?: string }>;
}) {
  const { gift } = await searchParams;
  const r = gift ? await getReceipt(gift) : null;
  const orgName = r?.org?.name || "Riverside Hope Foundation";

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <PublicHeader orgName={orgName} />

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-100 text-forest-700">
            <Check size={32} />
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold text-forest-900">
            Thank you{r ? `, ${r.name.split(" ")[0]}` : ""}!
          </h1>
          <p className="mt-2 text-ink/65">
            Your gift makes a real difference for the families {orgName} serves.
          </p>

          {r && (
            <div className="mt-7 rounded-2xl border border-forest-900/8 bg-white p-6 text-left shadow-card">
              <div className="flex items-center justify-between border-b border-forest-900/8 pb-3">
                <span className="text-sm text-ink/55">Your gift</span>
                <span className="font-display text-2xl font-semibold text-forest-900">
                  {money(r.gift.amount, true)}
                  {r.gift.is_recurring && (
                    <span className="text-sm font-medium text-gold-700"> / mo</span>
                  )}
                </span>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/50">Designation</dt>
                  <dd className="font-medium text-forest-900">{r.campaign || "General Fund"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/50">Receipt #</dt>
                  <dd className="font-medium text-forest-900">{r.gift.receipt_number}</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-forest-50 px-3 py-2.5 text-xs text-ink/60">
                <Mail size={14} className="text-forest-600" />
                A receipt has been emailed for your tax records.
              </div>
              <Link
                href={`/receipt/${gift}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 py-3 text-sm font-semibold text-cream hover:bg-forest-900"
              >
                View / print receipt <ArrowRight size={15} />
              </Link>
            </div>
          )}

          <Link
            href="/give"
            className="mt-6 inline-block text-sm font-medium text-forest-700 hover:underline"
          >
            Return to giving page
          </Link>
        </div>
      </div>

      <PublicFooter orgName={orgName} />
    </div>
  );
}
