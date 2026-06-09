import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGiveIndex } from "@/lib/data";
import { CultivateMark } from "@/components/Logo";
import { GoalThermometer } from "@/components/GoalThermometer";

export const dynamic = "force-dynamic";

export default async function GiveIndex() {
  const { org, campaigns } = await getGiveIndex();

  return (
    <div className="min-h-screen bg-cream">
      <PublicHeader orgName={org?.name} />

      <section className="bg-radial-forest">
        <div className="mx-auto max-w-4xl px-6 pb-6 pt-14 text-center">
          <h1 className="font-display text-4xl font-semibold text-forest-900 md:text-5xl">
            Support {org?.name}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-ink/65">{org?.mission}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-2">
          {campaigns.map((c) => (
            <Link
              key={c.id}
              href={`/give/${c.slug}`}
              className="group overflow-hidden rounded-2xl border border-forest-900/8 bg-white shadow-card transition-shadow hover:shadow-lift"
            >
              <div className="relative h-40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.hero_image || "/campaigns/2026-annual-fund.jpg"}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/45 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: c.accent || "#2D6A4F" }}
                  />
                  <h2 className="font-display text-lg font-semibold text-forest-900">
                    {c.name}
                  </h2>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink/55">{c.description}</p>
                <div className="mt-4">
                  <GoalThermometer
                    raised={c.raised}
                    goal={c.goal}
                    accent={c.accent || "#2D6A4F"}
                    donors={c.donors}
                  />
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-forest-700 transition-all group-hover:gap-2">
                  Donate now <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <PublicFooter orgName={org?.name} />
    </div>
  );
}

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
