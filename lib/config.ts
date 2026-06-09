// Centralized configuration and constants.
//
// NOTE: In production, the "current date / fiscal year" would come from the
// request clock and the org's fiscal settings, not hardcoded constants. They
// are pinned here so the seeded demo's relative metrics (YTD, retention, LYBUNT)
// stay stable and deterministic.

export const DEMO_TODAY = "2026-06-08";
export const CURRENT_YEAR = 2026;
export const PRIOR_YEAR = 2025;
export const PRIOR_YEAR_2 = 2024;

// Stripe nonprofit processing economics (used for fee math on gifts).
export const PROCESSING_FEE_RATE = 0.022;
export const PROCESSING_FEE_FIXED = 0.3;

// IRS thresholds (see deep-research report).
export const ACK_THRESHOLD = 250; // contemporaneous written acknowledgment
export const QUID_PRO_QUO_THRESHOLD = 75; // written disclosure required above this

export const RECEIPT_PREFIX = "RHF";

// Lapsed = no gift within this many months of DEMO_TODAY.
export const LAPSED_CUTOFF_DATE = "2024-12-08";

export function processingFee(amount: number): number {
  return Math.round((amount * PROCESSING_FEE_RATE + PROCESSING_FEE_FIXED) * 100) / 100;
}
