import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <Logo size={34} />
      <div className="mt-8 font-display text-6xl font-semibold text-forest-900">404</div>
      <p className="mt-3 max-w-sm text-ink/60">
        This page wandered off into the garden. Let’s get you back on solid ground.
      </p>
      <div className="mt-7 flex gap-3">
        <Link
          href="/"
          className="rounded-xl border border-forest-800/20 bg-white px-5 py-2.5 text-sm font-semibold text-forest-800 hover:bg-forest-50"
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl bg-forest-800 px-5 py-2.5 text-sm font-semibold text-cream hover:bg-forest-900"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
