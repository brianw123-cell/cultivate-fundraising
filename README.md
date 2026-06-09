# Cultivate

Simple, honest fundraising software for growing nonprofits — a proof-of-concept
fundraising CRM. Donation pages, donor management, recurring gifts, moves-management
pipeline, prospect research, segments, appeals, stewardship, reporting, and
IRS-compliant tax receipts.

**Live demo:** https://cultivate-fundraising.vercel.app (seeded with fake data, no login)

## Stack
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (Fraunces + Inter)
- **Supabase** (Postgres) for data
- **Recharts** for charts, **zod** for validation
- **Vercel** for hosting

## Project layout
- `app/` — routes (admin app under `app/(app)`, public giving pages, printable receipts/statements/letters)
- `components/` — UI primitives, charts, sortable tables, forms
- `lib/analytics.ts` — pure, unit-tested fundraising logic (retention, LYBUNT, ROI, segments…)
- `lib/data.ts` — data access (queries + delegates to analytics)
- `app/actions.ts` — server actions (zod-validated)
- `tests/` — unit tests; `tests/integration/` — live-DB integration tests

## Scripts
```bash
npm run dev              # local dev (use PORT=3100 if 3000 is busy)
npm run build            # production build (type + lint gates enforced)
npm test                 # unit tests (Vitest)
npm run test:integration # integration tests (hits the live DB)
npm run coverage         # coverage report
npm run typecheck        # tsc --noEmit
npm run lint             # next lint
```

See `TESTING.md` for the full testing protocol and known limitations.

> Demo notes: payments are simulated (no Stripe), RLS is intentionally open, and the
> public anon key is committed as a fallback. Lock these down before any real data.
