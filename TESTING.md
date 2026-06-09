# Cultivate — Testing Protocol

A fundraising platform moves money and generates tax documents, so the testing
bar is higher than a typical CRUD app. This document is the full plan; the
checked items are implemented today.

## Test pyramid

### 1. Unit tests — pure logic (✅ implemented, 31 tests, `npm test`)
Fast, deterministic, no DB. These cover the code most likely to be *wrong in a
way that matters* (money math, donor analytics, IRS thresholds).
- `tests/format.test.ts` — currency formatting, dates, donor naming, capacity tiers.
- `tests/analytics.test.ts` — giving-by-year, donor retention, LYBUNT/SYBUNT,
  monthly trend, gift-size brackets, payment-method mix, recurring monthly
  equivalent, campaign roll-ups, appeal ROI, segment classification, prospect gap.
- `tests/csv.test.ts` — CSV escaping + the Stripe fee formula.

Run: `npm test` (CI) / `npm run test:watch` (local).

### 2. Static analysis (✅ implemented, gates the build)
- `npm run typecheck` — `tsc --noEmit`, 0 errors. Enforced in `next build`.
- `npm run lint` — `next lint` (next/core-web-vitals), 0 warnings. Enforced in build.

### 3. Integration tests — data layer + DB (⬜ recommended)
Run the query functions in `lib/data.ts` and the server actions in
`app/actions.ts` against a disposable Supabase branch (not the demo project).
- `getDashboardData`, `getReportsData`, etc. return expected shapes/totals.
- `processDonation` creates a donor + gift + (for monthly) a recurring plan,
  computes the fee correctly, and assigns a sequential receipt number.
- `addManualGift` and `acknowledgeGift` mutate the right rows.
- Validation: malformed input (negative amount, bad email, non-UUID id) is
  rejected by the zod schemas before any write.
Tooling: Vitest + a seeded test branch via the Supabase CLI, torn down per run.

### 4. End-to-end tests — browser (⬜ recommended, scaffold with Playwright)
Critical user journeys, run against a preview deploy:
- **Donation flow:** open a campaign → pick amount → toggle monthly →
  submit → land on thank-you → receipt renders with correct amount + receipt #.
- **Quid-pro-quo receipt:** a gala gift shows the FMV disclosure.
- **$250+ receipt:** shows the contemporaneous-acknowledgment language.
- **Stewardship:** "Mark acknowledged" removes a gift from the queue.
- **Manual gift entry:** records and appears in the ledger + dashboard.
- **Navigation:** every sidebar route renders without error.
- **Mobile:** no horizontal overflow at 375 / 390 / 430px (see §6).

### 5. Security / compliance tests (⬜ required before real data)
- **RLS:** with production policies, an anon user cannot read another org's
  donors/gifts (the current demo `demo_all` policy is intentionally open and
  MUST be replaced).
- **PCI:** assert no raw PAN/CVC is ever sent to our server or stored (Stripe
  hosted Checkout only). Card data in our DB is limited to brand + last4.
- **Receipt correctness:** deductible = amount − FMV; $250+ always carries the
  acknowledgment statement; >$75 quid-pro-quo always carries the FMV disclosure.
- **Money-flow:** funds route to each org's own (future) Stripe Connect account;
  the platform never holds funds.

### 6. Non-functional (⬜ recommended)
- **Responsive/overflow:** automated check that `documentElement.scrollWidth <=
  innerWidth` on every route at mobile widths (we verified this manually).
- **Accessibility:** axe-core pass (contrast, labels, keyboard nav, alt text).
- **Performance:** Lighthouse budget; watch the in-JS aggregation (`fetchAll`)
  as data grows — migrate hot aggregations to Postgres views/RPCs.
- **Visual regression:** snapshot key screens (dashboard, receipt, statement).

## CI gate (recommended)
On every PR: `npm run lint && npm run typecheck && npm test && npm run build`,
then Playwright E2E against the Vercel preview URL.

## Known limitations the tests must eventually cover
- In-memory aggregation won't scale past a few thousand rows per org.
- Receipt numbering uses a count+1 (race-prone under concurrency) — move to a DB
  sequence and add a concurrency test.
- Money is handled as JS numbers; for a payments product, migrate to integer
  cents (or Postgres `numeric` end-to-end) and add rounding tests.
