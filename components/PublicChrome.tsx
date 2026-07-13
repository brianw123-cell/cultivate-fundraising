import Link from "next/link";
import { CultivateMark } from "@/components/Logo";

export function PublicHeader({ orgName }: { orgName?: string }) {
  return (
    <header className="border-b border-forest-900/8 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <CultivateMark size={28} />
          <span className="font-display text-lg font-semibold text-forest-900">
            {orgName}
          </span>
        </div>
        <Link href="/dashboard" className="text-sm font-medium text-ink/55 hover:text-forest-800">
          Admin view →
        </Link>
      </div>
    </header>
  );
}

export function PublicFooter({ orgName }: { orgName?: string }) {
  return (
    <footer className="border-t border-forest-900/8 bg-cream">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-6 py-8 text-center text-xs text-ink/45">
        <p>
          {orgName} is a registered 501(c)(3). Donations are tax-deductible to the extent
          allowed by law.
        </p>
        <p className="flex items-center gap-1.5">
          Powered by <CultivateMark size={14} />{" "}
          <span className="font-display font-semibold text-forest-700">Cultivate</span>
        </p>
      </div>
    </footer>
  );
}
