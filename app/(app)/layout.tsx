import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* demo banner */}
        <div className="flex items-center justify-center gap-2 bg-forest-900 px-4 py-1.5 text-center text-xs font-medium text-cream/90">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          Demo workspace · Riverside Hope Foundation · no login required
        </div>

        {/* mobile top bar */}
        <div className="flex items-center justify-between border-b border-forest-900/8 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-1">
            <MobileNav />
            <Logo size={24} />
          </div>
          <Link href="/give" className="text-sm font-semibold text-forest-700">
            Donate →
          </Link>
        </div>

        <main className="mx-auto w-full min-w-0 max-w-[1200px] flex-1 overflow-x-clip px-5 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
