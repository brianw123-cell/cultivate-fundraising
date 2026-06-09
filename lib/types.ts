// Domain types for the Cultivate data model. Hand-maintained to mirror the
// Postgres schema (regenerate from Supabase when the network allows).

export type GiftRow = {
  id: string;
  org_id: string;
  donor_id: string;
  campaign_id: string | null;
  fund_id: string | null;
  recurring_plan_id: string | null;
  appeal_id: string | null;
  amount: number | string;
  fee_amount: number | string | null;
  fee_covered: boolean | null;
  net_amount: number | string | null;
  fmv_amount: number | string | null;
  gift_date: string;
  payment_method: string;
  card_brand: string | null;
  card_last4: string | null;
  is_recurring: boolean | null;
  tribute_type: string | null;
  tribute_name: string | null;
  soft_credit_donor_id: string | null;
  status: string;
  receipt_number: string | null;
  receipt_sent: boolean | null;
  acknowledged: boolean | null;
  acknowledged_at: string | null;
  note: string | null;
};

export type DonorRow = {
  id: string;
  org_id: string;
  type: string;
  first_name: string | null;
  last_name: string | null;
  org_name: string | null;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  donor_since: string | null;
  tags: string[] | null;
  capacity_low: number | string | null;
  capacity_high: number | string | null;
  affinity_score: number | null;
  wealth_indicators: string[] | null;
  pipeline_stage: string | null;
  ask_amount: number | string | null;
  next_action: string | null;
  next_action_date: string | null;
  officer: string | null;
};

export type CampaignRow = {
  id: string;
  org_id: string;
  fund_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  goal_amount: number | string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  accent: string | null;
  hero_image: string | null;
};

export type RecurringPlanRow = {
  id: string;
  org_id: string;
  donor_id: string;
  campaign_id: string | null;
  amount: number | string;
  frequency: string;
  status: string;
  payment_method: string | null;
  card_brand: string | null;
  card_last4: string | null;
  started_at: string | null;
  next_charge_date: string | null;
};

export type AppealRow = {
  id: string;
  org_id: string;
  name: string;
  channel: string | null;
  audience_size: number | null;
  cost: number | string | null;
  sent_date: string | null;
};
