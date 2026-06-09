"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <Logo size={34} />
      <h1 className="mt-8 font-display text-3xl font-semibold text-forest-900">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-sm text-ink/60">
        We hit an unexpected error loading this page. You can try again or head back home.
      </p>
      {error?.digest && (
        <p className="mt-2 font-mono text-xs text-ink/35">Reference: {error.digest}</p>
      )}
      <div className="mt-7 flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-forest-800 px-5 py-2.5 text-sm font-semibold text-cream hover:bg-forest-900"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-xl border border-forest-800/20 bg-white px-5 py-2.5 text-sm font-semibold text-forest-800 hover:bg-forest-50"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
