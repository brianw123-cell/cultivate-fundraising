"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
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
  { href: "/appeals", label: "Appeals", icon: Send },
  { href: "/stewardship", label: "Stewardship", icon: Stamp },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-forest-800 hover:bg-forest-50"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-forest-950/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-cream p-4 shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <Logo size={26} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/60 hover:bg-forest-50"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-0.5">
              {nav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      active
                        ? "bg-forest-800 text-cream"
                        : "text-ink/70 hover:bg-forest-50"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/give"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center justify-between rounded-xl border border-gold-500/30 bg-gold-50 px-3 py-2.5 text-sm font-semibold text-gold-800"
            >
              View donation page <ExternalLink size={15} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
