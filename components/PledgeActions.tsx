"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Ban, Loader2 } from "lucide-react";
import { recordPledgePayment, writeOffPledge } from "@/app/actions";

export function PledgeActions({
  pledgeId,
  hasOutstanding,
  status,
}: {
  pledgeId: string;
  hasOutstanding: boolean;
  status: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  if (status === "written_off") return null;

  function pay() {
    start(async () => {
      await recordPledgePayment(pledgeId);
      router.refresh();
    });
  }
  function writeOff() {
    if (!confirm("Write off the remaining balance on this pledge? This marks unpaid installments as uncollectible.")) return;
    start(async () => {
      await writeOffPledge(pledgeId);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      {hasOutstanding && (
        <>
          <button
            onClick={pay}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-forest-800 px-4 py-2 text-sm font-semibold text-cream hover:bg-forest-900 disabled:opacity-60"
          >
            {pending ? <Loader2 size={15} className="animate-spin-slow" /> : <Check size={15} />}
            Record payment
          </button>
          <button
            onClick={writeOff}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            <Ban size={15} /> Write off
          </button>
        </>
      )}
    </div>
  );
}
