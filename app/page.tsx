import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Repeat,
  ReceiptText,
  BarChart3,
  Users,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const features = [
  {
    icon: HeartHandshake,
    title: "Beautiful donation pages",
    body: "Mobile-ready giving pages with suggested amounts, cover-the-fee, and tributes. Live in minutes.",
  },
  {
    icon: Users,
    title: "Donor records that build themselves",
    body: "Every gift creates or updates a donor profile with full giving history. No spreadsheets.",
  },
  {
    icon: Repeat,
    title: "Recurring giving",
    body: "Weekly to yearly sustaining gifts with automatic retries on failed cards.",
  },
  {
    icon: ReceiptText,
    title: "IRS-ready receipts",
    body: "Automatic acknowledgments for $250+ gifts and quid-pro-quo disclosures for event tickets.",
  },
  {
    icon: BarChart3,
    title: "Reporting that matters",
    body: "Donor retention, LYBUNT, gift-size brackets, and year-end tax statements in a click.",
  },
  {
    icon: ShieldCheck,
    title: "Safe by design",
    body: "Card data never touches our servers. Funds flow straight to your own account.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* nav */}
      <header className="sticky top-0 z-30 border-b border-forest-900/8 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo size={30} />
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
            <a href="#features" className="hover:text-forest-800">Features</a>
            <a href="#pricing" className="hover:text-forest-800">Pricing</a>
            <Link href="/give" className="hover:text-forest-800">See a donation page</Link>
          </nav>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl bg-forest-800 px-4 py-2 text-sm font-semibold text-cream hover:bg-forest-900"
          >
            Live demo <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden bg-radial-forest">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-800/15 bg-white/70 px-3 py-1 text-xs font-medium text-forest-800">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              Fundraising software for growing nonprofits
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-forest-900 md:text-6xl">
              Grow generosity.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink/65">
              The honest, all-in-one fundraising platform. Donation pages, donor
              management, recurring gifts, and tax receipts. None of the bloat, none
              of the surprise fees.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-800 px-6 py-3 text-base font-semibold text-cream shadow-lift hover:bg-forest-900"
              >
                Explore the dashboard <ArrowRight size={18} />
              </Link>
              <Link
                href="/give"
                className="inline-flex items-center gap-2 rounded-xl border border-forest-800/20 bg-white px-6 py-3 text-base font-semibold text-forest-800 hover:bg-forest-50"
              >
                Try a donation
              </Link>
            </div>
            <p className="mt-3 text-xs text-ink/45">No sign-up. Click straight into a live workspace.</p>
          </div>

          {/* faux product preview */}
          <div className="mx-auto mt-14 max-w-4xl">
            <div className="rounded-2xl border border-forest-900/10 bg-white p-3 shadow-lift">
              <div className="rounded-xl bg-cream/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-lg font-semibold text-forest-900">
                      Riverside Hope Foundation
                    </div>
                    <div className="text-xs text-ink/50">Development dashboard</div>
                  </div>
                  <Logo size={22} showWord={false} />
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    ["Raised in 2026", "$84,025"],
                    ["Active donors", "140"],
                    ["Monthly recurring", "$2,310"],
                    ["Donor retention", "71%"],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-xl border border-forest-900/8 bg-white p-3">
                      <div className="text-[11px] text-ink/50">{l}</div>
                      <div className="font-display text-xl font-semibold text-forest-900">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex h-28 items-end gap-1.5 rounded-xl border border-forest-900/8 bg-white p-3">
                  {[30, 42, 38, 55, 48, 62, 58, 70, 64, 80, 74, 92].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${h}%`,
                        background: "linear-gradient(180deg,#52B788,#2D6A4F)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-forest-900 md:text-4xl">
            Everything a small shop needs. Nothing it doesn’t.
          </h2>
          <p className="mt-3 text-ink/65">
            The fundraising essentials, thoughtfully built, so a two-person team can run
            like a ten-person one.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-forest-900/8 bg-white p-6 shadow-card transition-shadow hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-forest-900">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink/60">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="bg-forest-900 text-cream">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold md:text-4xl">
                Honest, flat pricing.
              </h2>
              <p className="mt-4 text-cream/75">
                No per-contact creep. No platform tip prompts shown to your donors. One
                simple monthly price, and your donors keep ~98% of every gift.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-cream/85">
                {[
                  "Unlimited donors and gifts",
                  "Unlimited donation pages and campaigns",
                  "Recurring giving and tax receipts included",
                  "Your data, exportable any time",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2.5">
                    <Check size={16} className="text-gold-300" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-cream p-8 text-ink shadow-lift">
              <div className="text-sm font-medium text-ink/55">Everything plan</div>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-display text-5xl font-semibold text-forest-900">$49</span>
                <span className="mb-1 text-ink/55">/ month</span>
              </div>
              <p className="mt-2 text-sm text-ink/55">
                Plus standard payment processing (discounted nonprofit rates available).
              </p>
              <Link
                href="/dashboard"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-forest-800 py-3 text-sm font-semibold text-cream hover:bg-forest-900"
              >
                Explore the demo <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-forest-900/8 bg-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-ink/55 md:flex-row">
          <Logo size={24} />
          <p>A proof-of-concept demo. Not affiliated with any existing fundraising vendor.</p>
        </div>
      </footer>
    </div>
  );
}
