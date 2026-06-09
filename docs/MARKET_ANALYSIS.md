# Nonprofit Fundraising Software — Market, Blackbaud, and the Cultivate Opportunity

A research brief on the market Blackbaud competes in, how the software and money actually
work, what Cultivate (this proof-of-concept) already does versus Blackbaud, the opportunity
for a lean low-cost build, the recommended technology stack, and the legal/regulatory
guardrails. Written for someone who works in the industry.

## Executive summary

Nonprofit fundraising software is a large, mature, and crowded market. Blackbaud is the
incumbent giant: comprehensive, deeply embedded in mid-to-large nonprofits, and priced and
implemented accordingly. Below it sits a wide field of mid-market donor CRMs, and below that
a fast-moving layer of low-cost and even free online-giving tools that win on simplicity and
fee transparency. The opportunity for a cheap, no-frills build is real but narrow: you do not
win on a feature checklist against Blackbaud; you win on simplicity, honest flat pricing,
data ownership, and a reachable niche. Cultivate already covers most of what a Raiser's Edge
user touches day to day. The hard parts of the build are not the features — they are payments
(PCI scope), tax-receipt correctness, and US state charitable-solicitation registration.

## The market Blackbaud is in

Blackbaud (NASDAQ: BLKB) is the dominant legacy vendor in software for nonprofits and the
broader "social good" sector. Its footprint spans fundraising, accounting, education,
healthcare philanthropy, and arts/cultural organizations. Relevant product lines:

- **Raiser's Edge NXT** — the flagship fundraising CRM for mid-to-large nonprofits.
- **Blackbaud CRM** — enterprise/large-shop fundraising platform.
- **eTapestry** — entry-level CRM for small organizations.
- **Financial Edge NXT** — nonprofit fund accounting (general ledger), integrates with RE.
- **Luminate Online / TeamRaiser** — online marketing, email, peer-to-peer/event fundraising.
- **Blackbaud Merchant Services (BBMS)** — the payments layer.
- **Target Analytics** — wealth screening and prospect research.
- **Altru** (arts/cultural), education products (K-12 tuition/enrollment), and grantmaking tools.

Blackbaud's strengths are breadth, depth, and entrenchment. Its recurring criticisms are
cost, complexity, long implementations, multi-year contracts, and uneven/legacy UX (NXT
modernized much of it). That gap between "powerful but heavy/expensive" and "simple but
shallow" is exactly where new entrants try to live.

## Market landscape and pricing tiers

The market is not one product — it is five overlapping categories. Knowing which "type" a
product is explains its pricing and who it competes with.

- **Donor CRM / donor management** — a relational donor database is the system of record;
  everything hangs off the constituent record. *Players:* Bloomerang, DonorPerfect, Neon CRM,
  Little Green Light, Kindful, Keela, Virtuous. *Pricing:* roughly $45–$250+/month, usually
  scaling with contact count.
- **Online giving / donation platforms** — a payment-led front end (a hosted donation form)
  with light or no CRM. *Players:* Donorbox, Givebutter, Zeffy, GiveLively, Qgiv, Fundraise
  Up. *Pricing:* "free" (donor-tip or platform-fee model) up to ~$139+/month.
- **Peer-to-peer / crowdfunding** — supporters create their own sub-pages. *Players:* Classy,
  Givebutter, Funraise, GoFundMe. *Pricing:* platform fee or subscription; Classy is
  mid-market/enterprise.
- **Events / auctions** — ticketing, registration, mobile bidding, paddle raise. *Players:*
  OneCause, Greater Giving, Givebutter. *Pricing:* per-event or annual license, often steep.
- **All-in-one suites / enterprise CRM** — bundle the above. *Players:* Blackbaud, Salesforce
  Nonprofit Cloud, Bonterra (EveryAction/Network for Good), Neon One. *Pricing:* mid-market
  $$$ to enterprise five-to-six figures per year.

The underlying structure is the same everywhere: a `donors`/constituents table at the center,
a `gifts` table linked to donors and campaigns/funds, a payment processor, a communications
layer, and reporting on top. Even on a $50,000/year platform, the donation form is a thin
front end that writes a gift row and matches or creates a donor row.

## Blackbaud's competition

- **Enterprise:** Salesforce Nonprofit Cloud (successor to NPSP), Microsoft-based solutions,
  and Bonterra (a roll-up of EveryAction, Network for Good, and others).
- **Mid-market donor CRM:** Bloomerang (which also owns Kindful and Qgiv), DonorPerfect, Neon
  One, Virtuous, Little Green Light.
- **Low-cost / online giving:** Donorbox, Givebutter, Fundraise Up, and the genuinely free
  Zeffy and GiveLively.
- **Events / auctions:** OneCause, Greater Giving (Global Payments).
- **Peer-to-peer:** Classy (owned by GoFundMe).

The notable competitive dynamic: consolidation at the top (Bloomerang, Bonterra, Salesforce
absorbing share) and disruption at the bottom (free/low-fee tools resetting price expectations
for small orgs).

## Blackbaud's feature set (what Raiser's Edge NXT does)

A representative list of what a Raiser's Edge user works with:

- Constituent 360 records, relationships, and households (spouse/employer links, household
  giving roll-ups).
- Gift/donation processing; online donation forms; recurring gifts.
- **Pledges** with installment schedules, payment burn-down, reminders, and write-offs.
- **Moves management** — major-gift prospect pipeline across cultivation stages.
- **Prospect research and wealth screening** (Target Analytics) — capacity ratings, affinity.
- Segmentation and the (in)famous ad-hoc **Query** builder.
- Appeals/mailings with response and **ROI** tracking.
- Events, memberships, and volunteer tracking.
- Tribute/honor gifts and soft credits.
- Communications/**Actions** tracking (a per-constituent timeline of touchpoints).
- Dashboards and reporting; donor retention, LYBUNT/SYBUNT.
- Receipting and acknowledgments; year-end tax statements.
- Fund accounting via Financial Edge integration (revenue recognition, pledges receivable).
- Data health / duplicate management; a mobile app for gift officers.

## How the workflow actually works

**The online giving flow** (the canonical, verified sequence that is the product's core):

1. Donor hits a call-to-action (a donation page or button).
2. Selects one-time or recurring, and an amount.
3. Chooses a payment method (card, bank transfer/ACH, or digital wallet).
4. The processor routes the charge to the card network/bank for approval.
5. Funds are queued for payout to the nonprofit's bank account.
6. The donor receives an on-screen confirmation and an email receipt.
7. For recurring gifts, the processor securely stores the payment credentials and re-charges
   on schedule (the card data lives with the processor, never in the nonprofit's database).

**The operational fundraising loop** that wraps around it: identify and research prospects →
segment and appeal (email/mail/events) → receive and process gifts (online and offline) →
acknowledge and receipt (with the correct IRS language) → steward and report → renew and
upgrade (retention, LYBUNT win-backs, recurring/pledge conversion, major-gift moves
management). Pledges and recurring gifts are distinct: a pledge is a fixed total over a set
period via installments (a receivable on the books); a recurring gift is open-ended until
canceled.

## Feature comparison — Cultivate (built) vs Blackbaud

Cultivate is the proof-of-concept platform built for this demo. Status key: Built = working
in the demo; Partial = present but simplified; Not built = not yet.

| Capability | Cultivate | Blackbaud RE NXT |
| --- | --- | --- |
| Donor records + full giving history | Built | Yes |
| Online donation pages (one-time + recurring) | Built (payments simulated) | Yes |
| Recurring gifts | Built | Yes |
| Pledges + installment schedule + write-off | Built | Yes |
| Moves-management pipeline | Built | Yes |
| Prospect research / wealth + affinity ratings | Built (illustrative scores) | Yes (Target Analytics) |
| Smart segments (Major, LYBUNT, sustainers, etc.) | Built | Yes (via Query) |
| Campaigns / funds with goal tracking | Built | Yes |
| Gifts ledger with search, filters, sortable columns | Built | Yes |
| Appeals + performance / ROI tracking | Built | Yes |
| Stewardship / acknowledgment queue | Built | Yes |
| IRS-compliant receipts + year-end tax statements | Built | Yes |
| Reporting: retention, LYBUNT/SYBUNT, gift-size, by method | Built | Yes |
| CSV export of donors and gifts | Built | Yes |
| Tributes / soft credits | Partial (data model) | Yes |
| Relationships / households | Not built | Yes |
| Events / ticketing / auctions | Not built | Yes (Luminate/Altru) |
| Communications / actions log per donor | Partial (pipeline next-action) | Yes |
| Real payment processing (PCI) | Not built (simulated) | Yes (BBMS) |
| Fund accounting / revenue recognition | Not built | Yes (Financial Edge) |
| Authentication, roles, multi-org security | Not built (open demo) | Yes |

The headline: Cultivate already covers the large majority of *day-to-day fundraising-office*
features. What is missing is mostly the heavy, regulated, or enterprise layers — real
payments, accounting integration, events, households, and production-grade security.

## The opportunity for a cheap, simple, no-frills build

This is a mature, crowded market with a genuinely free incumbent (Zeffy), so the wedge is not
features. The exploitable cracks:

- **Fee fatigue.** "Free" tools monetize through donor tip prompts or fee skimming, which many
  nonprofits dislike asking their donors to subsidize. A flat, predictable, low monthly price
  where the org keeps ~98% of every gift and there is no donor tip prompt is an honest pitch.
- **Pricing that punishes growth.** CRMs that charge by contact count get more expensive as the
  org succeeds. A flat price that does not creep is differentiating.
- **Fragmentation.** Small shops cobble together a payment tool plus a spreadsheet plus an email
  tool. One simple tool that does donation page + receipts + donor list + recurring beats that.
- **Data ownership.** "It is your database, export anytime, no lock-in" resonates with orgs
  burned by migrations.
- **Niche + relationship.** The edge over a venture-funded competitor is distribution, not code.
  A specific community (local charities, faith groups, schools) plus hands-on setup wins.

The honest risk: low willingness to pay (nonprofits are cost-sensitive) and a free price anchor.
Treat this as a niche or service-attached product, not a venture-scale play.

## Recommended technology stack

The validated stack for this kind of product is **Next.js (App Router) + React + TypeScript +
Tailwind CSS + Supabase (Postgres, Auth, row-level security) + Vercel**, with **Stripe** for
payments. This is exactly what Cultivate is built on, and nothing materially better surfaced in
research for this use case. Key points:

- **Stripe is the payments backbone.** Using Stripe's hosted Checkout/Elements sends card data
  straight to Stripe and never through your servers, which collapses PCI scope from the 300+
  controls of the full self-assessment (SAQ D) down to the simplest one (SAQ A). Stripe handles
  encryption and tokenization by default.
- **Architecture keystone: Stripe Connect.** Each nonprofit connects (or creates) its own Stripe
  account so donations settle directly to *them* — the platform never holds or disburses funds.
  This keeps you out of money-transmitter licensing, pushes the merchant/PCI obligation onto each
  org where it belongs, and lets each org claim its own discounted nonprofit rate.
- **Recurring via Stripe Billing**, with automatic retry of failed payments. The card credentials
  live with Stripe; your database stores only non-sensitive references (status, customer id,
  brand/last4).
- **Add-ons:** a transactional email service (e.g., Resend/Postmark) for receipts, and HTML
  print-to-PDF for tax statements (no heavy PDF library needed).

In short: keep card/billing state in Stripe, sync only non-sensitive references into Postgres
via webhooks, and let Stripe-hosted pages do collection.

## Legal and regulatory challenges

This is where fundraising software differs from an ordinary app — it moves money and produces
tax documents.

- **PCI-DSS (card security).** Any org handling card donations must comply, regardless of method,
  and attests annually. Using Stripe's hosted pages keeps you at the simplest assessment (SAQ A);
  routing raw card numbers through your own server forfeits that. PCI is enforced contractually by
  the card networks (fines, loss of processing), not by statute, but the consequences are real.
- **IRS receipt rules — build these into receipts.**
  - For any single gift of **$250 or more**, the donor needs a *contemporaneous written
    acknowledgment* or loses the deduction. Required fields: organization name, amount, and a
    statement that no goods or services were provided (or a description + good-faith fair-market
    value if they were). No penalty on the charity, but it is table stakes.
  - For a **quid pro quo** payment over **$75** (the donor gets something back, e.g., a gala
    ticket), the charity *must* provide a written disclosure stating the deductible portion is only
    the amount above fair market value, plus a good-faith FMV estimate. This one carries a real
    penalty: $10 per contribution, up to $5,000 per event (IRC 6714/6115). So once events or
    tickets are in scope, correct FMV capture and disclosure is mandatory, not optional.
- **State charitable solicitation registration.** Roughly 40 US states require a nonprofit to
  register before soliciting their residents; only a handful do not. Because an online form
  solicits nationwide, nonprofit users may carry multi-state obligations (the Charleston Principles
  are the online safe-harbor framework). This is the nonprofit's burden, not the platform's, but a
  good product surfaces guidance in onboarding and never implies it handles registration.
- **Payment economics.** Stripe offers an eligible-nonprofit discount of roughly 2.2% + $0.30 (vs.
  the standard 2.9% + $0.30), but eligibility requires that 80%+ of Stripe volume be
  tax-deductible donations — heavy event/ticket revenue can disqualify an org from the discount.
  Re-confirm current rates before relying on them.
- **Money transmission.** Route funds directly to each org via Stripe Connect; pooling and
  disbursing donations yourself can make you a regulated money transmitter (a 50-state licensing
  problem). This is the biggest legal reason the Connect architecture is non-negotiable.
- **Data privacy.** You store donor PII (names, emails, addresses, giving history). Lean on
  encryption at rest, publish a privacy policy, honor access/deletion requests (CCPA/CPRA for
  California donors, GDPR if any EU donors), and have a breach-notification plan. Keeping card data
  entirely with Stripe sidesteps the worst of it.

## Other things an industry person will find interesting

- **Pledges hit the books differently than gifts.** Under FASB ASC 958-605, an *unconditional*
  pledge is recognized as revenue and a receivable when promised, not when paid; multi-year pledges
  are discounted to net present value; *conditional* pledges are not recognized until the condition
  is met. Most demos skip this entirely — handling it correctly signals real domain understanding.
- **The "free" model is a pricing reset, not charity.** Zeffy and GiveLively shift the cost to
  donor tips or optional contributions. The honest counter-position is flat, transparent pricing.
- **Data ownership and migration pain** are recurring switching triggers — orgs leave when fees
  creep or data feels trapped. "Export anytime" is a real selling point.
- **AI is the current frontier the incumbents are slow on** — auto-drafted thank-you notes, donor
  summaries, suggested next asks, and natural-language reporting are where a nimble product can look
  ahead of a legacy platform.
- **Retention is the unglamorous metric that matters most** — LYBUNT/SYBUNT win-backs and converting
  one-time donors to recurring/pledge usually beat chasing new acquisition.

## Sources and caveats

The payments, PCI, IRS, and state-registration points were fact-checked against primary sources
(Stripe documentation, IRS Publication 1771 and the quid-pro-quo guidance, the IRS state-requirements
page) and corroborated by the PCI SSC SAQ framework and nonprofit-sector references. The competitor
list and pricing tiers are directional market knowledge (2025–2026) and should be re-confirmed before
relying on specific numbers — processor rates and vendor pricing change. The Cultivate-vs-Blackbaud
table reflects the demo build as of this writing.
