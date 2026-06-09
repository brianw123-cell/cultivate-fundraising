"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { acknowledgeGift } from "@/app/actions";

export function AckButton({ giftId }: { giftId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  function onClick() {
    start(async () => {
      await acknowledgeGift(giftId);
      setDone(true);
      router.refresh();
    });
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-forest-600">
        <Check size={15} /> Done
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg bg-forest-800 px-3 py-1.5 text-xs font-semibold text-cream hover:bg-forest-900 disabled:opacity-60"
    >
      {pending ? <Loader2 size={13} className="animate-spin-slow" /> : <Check size={13} />}
      Mark acknowledged
    </button>
  );
}
