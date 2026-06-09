"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  HandCoins,
  Repeat,
  BarChart3,
  Settings,
  ExternalLink,
  Target,
  Layers,
  Send,
  Gem,
  Stamp,
  Handshake,
} from "lucide-react";
import { Logo } from "./Logo";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/donors", label: "Donors", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: Target },
  { href: "/prospects", label: "Prospects", icon: Gem },
  { href: "/segments", label: "Segments", icon: Layers },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/gifts", label: "Gifts", icon: HandCoins },
  { href: "/recurring", label: "Recurring", icon: Repeat },
  { href: "/pledges", label: "Pledges", icon: Handshake },
  { href: "/appeals", label: "Appeals", icon: Send },
  { href: "/stewardship", label: "Stewardship", icon: Stamp },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-forest-900/8 bg-white/70 backdrop-blur sticky top-0 h-screen">
      <div className="px-5 py-5 border-b border-forest-900/8">
        <Link href="/dashboard">
          <Logo size={28} />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-forest-800 text-cream"
                  : "text-ink/65 hover:bg-forest-50 hover:text-forest-800"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <Link
          href="/give"
          target="_blank"
          className="flex items-center justify-between gap-2 rounded-xl border border-gold-500/30 bg-gold-50 px-3 py-2.5 text-sm font-semibold text-gold-800 hover:bg-gold-100 transition-colors"
        >
          <span>View donation page</span>
          <ExternalLink size={15} />
        </Link>
      </div>
    </aside>
  );
}
