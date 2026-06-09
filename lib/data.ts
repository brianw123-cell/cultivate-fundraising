import { getSupabase } from "./supabase";
import { num, donorName } from "./format";
import {
  CURRENT_YEAR,
  PRIOR_YEAR,
  PRIOR_YEAR_2,
  ACK_THRESHOLD,
  DEMO_TODAY,
} from "./config";
import {
  yearOf,
  sumAmount,
  givingByYear,
  donorRetention,
  lybuntSybunt,
  monthlyTrend,
  giftSizeBrackets,
  byPaymentMethod,
  recurringMonthlyEquivalent,
  campaignTotals,
  appealMetrics,
  classifyDonors,
  prospectGap,
  SEGMENT_DEFS,
} from "./analytics";
import type {
  GiftRow,
  DonorRow,
  CampaignRow,
  RecurringPlanRow,
  AppealRow,
} from "./types";

// ---- low level helpers -------------------------------------------------

async function fetchAll<T = any>(table: string, select = "*"): Promise<T[]> {
  const sb = getSupabase();
  const pageSize = 1000;
  let from = 0;
  let all: T[] = [];
  // Supabase caps a single request at 1000 rows; page through to get them all.
  // For datasets that outgrow a few thousand rows, move these aggregations into
  // Postgres views / RPCs instead of pulling rows into JS (see TESTING.md notes).
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await sb
      .from(table)
      .select(select)
      .range(from, from + pageSize - 1);
    if (error || !data || data.length === 0) break;
    all = all.concat(data as T[]);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

// ---- org ---------------------------------------------------------------

export async function getOrg() {
  const sb = getSupabase();
  const { data } = await sb.from("organizations").select("*").limit(1).single();
  return data;
}

// ---- dashboard ---------------------------------------------------------

export async function getDashboardData() {
  const [gifts, campaigns, donors, recurring] = await Promise.all([
    fetchAll<GiftRow>("gifts"),
    fetchAll<CampaignRow>("campaigns"),
    fetchAll<DonorRow>("donors"),
    fetchAll<RecurringPlanRow>("recurring_plans"),
  ]);

  const ytdGifts = gifts.filter((g) => yearOf(g.gift_date) === CURRENT_YEAR);
  const lyGifts = gifts.filter((g) => yearOf(g.gift_date) === PRIOR_YEAR);

  const totalRaisedYTD = sumAmount(ytdGifts);
  // same calendar window last year for an honest YoY comparison
  const lyToDate = sumAmount(lyGifts.filter((g) => g.gift_date.slice(5) <= DEMO_TODAY.slice(5)));
  const ytdDelta = lyToDate ? Math.round(((totalRaisedYTD - lyToDate) / lyToDate) * 100) : 0;

  const activeRecurring = recurring.filter((r) => r.status === "active");
  const ytdDonors = new Set(ytdGifts.map((g) => g.donor_id)).size;

  const byCampaign = campaignTotals(gifts, campaigns)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      accent: c.accent || "#2D6A4F",
      goal: c.goal,
      raised: c.raised,
      status: c.status,
    }))
    .sort((a, b) => b.raised - a.raised);

  const donorById = new Map(donors.map((d) => [d.id, d]));
  const campaignById = new Map(campaigns.map((c) => [c.id, c]));
  const recentGifts = [...gifts]
    .sort((a, b) => (a.gift_date < b.gift_date ? 1 : -1))
    .slice(0, 8)
    .map((g) => ({
      id: g.id,
      amount: num(g.amount),
      gift_date: g.gift_date,
      donor: donorById.get(g.donor_id),
      donorName: donorName(donorById.get(g.donor_id)),
      campaign: g.campaign_id ? campaignById.get(g.campaign_id)?.name : undefined,
      method: g.payment_method,
      is_recurring: g.is_recurring,
    }));

  return {
    totalRaisedYTD,
    ytdDelta,
    lastYearTotal: sumAmount(lyGifts),
    activeRecurringCount: activeRecurring.length,
    monthlyRecurring: Math.round(recurringMonthlyEquivalent(recurring)),
    retentionRate: donorRetention(gifts, PRIOR_YEAR_2, PRIOR_YEAR).rate,
    ytdDonors,
    totalDonors: donors.length,
    avgGift: ytdGifts.length ? totalRaisedYTD / ytdGifts.length : 0,
    giftsYtd: ytdGifts.length,
    trend: monthlyTrend(gifts, `${PRIOR_YEAR}-01`),
    byCampaign,
    byMethod: byPaymentMethod(ytdGifts),
    recentGifts,
  };
}

// ---- donors ------------------------------------------------------------

export async function getDonorsPageData(q?: string) {
  const [donors, gifts] = await Promise.all([fetchAll("donors"), fetchAll("gifts")]);
  const byDonor = new Map<string, { total: number; count: number; last: string }>();
  gifts.forEach((g) => {
    const cur = byDonor.get(g.donor_id) || { total: 0, count: 0, last: "" };
    cur.total += num(g.amount);
    cur.count += 1;
    if (g.gift_date > cur.last) cur.last = g.gift_date;
    byDonor.set(g.donor_id, cur);
  });

  let rows = donors.map((d) => {
    const stats = byDonor.get(d.id) || { total: 0, count: 0, last: "" };
    return {
      ...d,
      name: donorName(d),
      lifetime: stats.total,
      giftCount: stats.count,
      lastGift: stats.last || null,
    };
  });

  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        (r.email || "").toLowerCase().includes(needle) ||
        (r.city || "").toLowerCase().includes(needle)
    );
  }

  rows.sort((a, b) => b.lifetime - a.lifetime);
  return rows;
}

export async function getDonorDetail(id: string) {
  const sb = getSupabase();
  const [{ data: donor }, { data: gifts }, { data: plans }, donors] = await Promise.all([
    sb.from("donors").select("*").eq("id", id).single(),
    sb.from("gifts").select("*, campaign:campaigns(name,slug,accent)").eq("donor_id", id).order("gift_date", { ascending: false }),
    sb.from("recurring_plans").select("*, campaign:campaigns(name)").eq("donor_id", id),
    fetchAll("donors"),
  ]);

  const donorById = new Map(donors.map((d: any) => [d.id, d]));
  const giftList = (gifts || []).map((g: any) => ({
    ...g,
    amount: num(g.amount),
  }));
  const lifetime = giftList.reduce((s: number, g: any) => s + num(g.amount), 0);
  const largest = giftList.reduce((m: number, g: any) => Math.max(m, num(g.amount)), 0);
  const firstGift = giftList.length ? giftList[giftList.length - 1].gift_date : null;
  const lastGift = giftList.length ? giftList[0].gift_date : null;
  const years = new Set(giftList.map((g: any) => (g.gift_date || "").slice(0, 4)));

  return {
    donor,
    name: donorName(donor),
    gifts: giftList,
    plans: plans || [],
    lifetime,
    largest,
    giftCount: giftList.length,
    firstGift,
    lastGift,
    yearsGiving: years.size,
    donorById,
  };
}

// ---- campaigns ---------------------------------------------------------

export async function getCampaignsPageData() {
  const [campaigns, gifts] = await Promise.all([
    fetchAll<CampaignRow>("campaigns"),
    fetchAll<GiftRow>("gifts"),
  ]);
  return campaignTotals(gifts, campaigns).sort((a, b) =>
    a.status === b.status ? b.raised - a.raised : a.status === "active" ? -1 : 1
  );
}

export async function getCampaignDetail(slug: string) {
  const sb = getSupabase();
  const { data: campaign } = await sb.from("campaigns").select("*").eq("slug", slug).single();
  if (!campaign) return null;
  const [{ data: gifts }, donors] = await Promise.all([
    sb.from("gifts").select("*").eq("campaign_id", campaign.id).order("gift_date", { ascending: false }),
    fetchAll("donors"),
  ]);
  const donorById = new Map(donors.map((d: any) => [d.id, d]));
  const list = gifts || [];
  const raised = list.reduce((s: number, g: any) => s + num(g.amount), 0);
  const uniqueDonors = new Set(list.map((g: any) => g.donor_id)).size;
  const recent = list.slice(0, 12).map((g: any) => ({
    ...g,
    amount: num(g.amount),
    donorName: donorName(donorById.get(g.donor_id)),
  }));
  return {
    campaign: { ...campaign, goal: num(campaign.goal_amount) },
    raised: Math.round(raised),
    donors: uniqueDonors,
    giftCount: list.length,
    avgGift: list.length ? raised / list.length : 0,
    recent,
  };
}

// ---- gifts -------------------------------------------------------------

export async function getGiftsPageData(opts: {
  q?: string;
  method?: string;
  campaign?: string;
  from?: string;
  to?: string;
  min?: number;
  max?: number;
}) {
  const [gifts, donors, campaigns] = await Promise.all([
    fetchAll<GiftRow>("gifts"),
    fetchAll<DonorRow>("donors"),
    fetchAll<CampaignRow>("campaigns"),
  ]);
  const donorById = new Map(donors.map((d) => [d.id, d]));
  const campaignById = new Map(campaigns.map((c) => [c.id, c]));

  let rows = gifts.map((g) => ({
    ...g,
    amount: num(g.amount),
    donor: donorById.get(g.donor_id),
    donorName: donorName(donorById.get(g.donor_id)),
    campaignName: (g.campaign_id ? campaignById.get(g.campaign_id)?.name : null) || "—",
  }));

  if (opts.method && opts.method !== "all")
    rows = rows.filter((r) => r.payment_method === opts.method);
  if (opts.campaign && opts.campaign !== "all")
    rows = rows.filter((r) => r.campaign_id === opts.campaign);
  if (opts.from) rows = rows.filter((r) => r.gift_date >= opts.from!);
  if (opts.to) rows = rows.filter((r) => r.gift_date <= opts.to!);
  if (opts.min != null) rows = rows.filter((r) => r.amount >= opts.min!);
  if (opts.max != null) rows = rows.filter((r) => r.amount <= opts.max!);
  if (opts.q) {
    const n = opts.q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.donorName.toLowerCase().includes(n) ||
        (r.receipt_number || "").toLowerCase().includes(n)
    );
  }

  rows.sort((a, b) => (a.gift_date < b.gift_date ? 1 : -1));
  const total = rows.reduce((s, r) => s + r.amount, 0);
  return { rows: rows.slice(0, 150), totalCount: rows.length, totalAmount: total, campaigns };
}

export async function addManualGiftRaw() {
  // placeholder kept for symmetry; actual insert is in actions.ts
}

// ---- recurring ---------------------------------------------------------

export async function getRecurringPageData() {
  const sb = getSupabase();
  const [{ data: plans }, donors] = await Promise.all([
    sb.from("recurring_plans").select("*, campaign:campaigns(name)").order("amount", { ascending: false }),
    fetchAll("donors"),
  ]);
  const donorById = new Map(donors.map((d: any) => [d.id, d]));
  return (plans || []).map((p: any) => ({
    ...p,
    amount: num(p.amount),
    donorName: donorName(donorById.get(p.donor_id)),
    donorId: p.donor_id,
  }));
}

// ---- reports -----------------------------------------------------------

export async function getReportsData() {
  const [gifts, donors] = await Promise.all([
    fetchAll<GiftRow>("gifts"),
    fetchAll<DonorRow>("donors"),
  ]);
  const { lybunt, sybunt } = lybuntSybunt(gifts, CURRENT_YEAR, PRIOR_YEAR);
  return {
    years: givingByYear(gifts),
    lybunt,
    sybunt,
    retention: donorRetention(gifts, PRIOR_YEAR_2, PRIOR_YEAR).rate,
    byMethod: byPaymentMethod(gifts),
    brackets: giftSizeBrackets(gifts),
    totalRaised: Math.round(sumAmount(gifts)),
    totalGifts: gifts.length,
    totalDonors: donors.length,
    needsAck: gifts.filter((g) => num(g.amount) >= ACK_THRESHOLD).length,
    quidProQuo: gifts.filter((g) => num(g.fmv_amount) > 0).length,
  };
}

// ---- year-end statement ------------------------------------------------

export async function getStatement(donorId: string, year: number) {
  const sb = getSupabase();
  const [{ data: donor }, { data: gifts }, org] = await Promise.all([
    sb.from("donors").select("*").eq("id", donorId).single(),
    sb
      .from("gifts")
      .select("*, campaign:campaigns(name)")
      .eq("donor_id", donorId)
      .gte("gift_date", `${year}-01-01`)
      .lte("gift_date", `${year}-12-31`)
      .order("gift_date", { ascending: true }),
    getOrg(),
  ]);
  const list = (gifts || []).map((g: any) => ({ ...g, amount: num(g.amount), fmv: num(g.fmv_amount) }));
  const total = list.reduce((s: number, g: any) => s + g.amount, 0);
  const deductible = list.reduce((s: number, g: any) => s + (g.amount - g.fmv), 0);
  return {
    donor,
    name: donorName(donor),
    org,
    year,
    gifts: list,
    total,
    deductible,
    fmvTotal: total - deductible,
  };
}

// ---- public giving -----------------------------------------------------

export async function getGiveIndex() {
  const [org, campaigns, gifts] = await Promise.all([
    getOrg(),
    fetchAll("campaigns"),
    fetchAll("gifts"),
  ]);
  const active = campaigns
    .filter((c) => c.status === "active")
    .map((c) => {
      const raised = gifts
        .filter((g) => g.campaign_id === c.id)
        .reduce((s, g) => s + num(g.amount), 0);
      const donors = new Set(
        gifts.filter((g) => g.campaign_id === c.id).map((g) => g.donor_id)
      ).size;
      return { ...c, goal: num(c.goal_amount), raised: Math.round(raised), donors };
    });
  return { org, campaigns: active };
}

export async function getGiveCampaign(slug: string) {
  const sb = getSupabase();
  const [{ data: campaign }, org] = await Promise.all([
    sb.from("campaigns").select("*").eq("slug", slug).single(),
    getOrg(),
  ]);
  if (!campaign) return null;
  const [{ data: gifts }, donors] = await Promise.all([
    sb.from("gifts").select("*").eq("campaign_id", campaign.id).order("gift_date", { ascending: false }).limit(8),
    fetchAll("donors"),
  ]);
  const sb2 = getSupabase();
  const { data: allCampaignGifts } = await sb2
    .from("gifts")
    .select("amount,donor_id")
    .eq("campaign_id", campaign.id);
  const donorById = new Map(donors.map((d: any) => [d.id, d]));
  const raised = (allCampaignGifts || []).reduce((s: number, g: any) => s + num(g.amount), 0);
  const donorCount = new Set((allCampaignGifts || []).map((g: any) => g.donor_id)).size;
  const recentDonors = (gifts || []).map((g: any) => ({
    name: donorName(donorById.get(g.donor_id)),
    amount: num(g.amount),
    date: g.gift_date,
  }));
  return {
    org,
    campaign: { ...campaign, goal: num(campaign.goal_amount) },
    raised: Math.round(raised),
    donorCount,
    recentDonors,
  };
}

// ---- receipt -----------------------------------------------------------

export async function getReceipt(giftId: string) {
  const sb = getSupabase();
  const { data: gift } = await sb
    .from("gifts")
    .select("*, campaign:campaigns(name), donor:donors!donor_id(*)")
    .eq("id", giftId)
    .single();
  if (!gift) return null;
  const org = await getOrg();
  return {
    gift: { ...gift, amount: num(gift.amount), fmv: num(gift.fmv_amount) },
    donor: gift.donor,
    name: donorName(gift.donor),
    campaign: gift.campaign?.name,
    org,
  };
}

// ---- team --------------------------------------------------------------

export async function getTeam() {
  const sb = getSupabase();
  const { data } = await sb.from("team_members").select("*").order("created_at");
  return data || [];
}

export async function getActiveCampaignsForForm() {
  const sb = getSupabase();
  const { data } = await sb
    .from("campaigns")
    .select("id,name,slug,accent")
    .eq("status", "active")
    .order("name");
  return data || [];
}

// ---- moves management pipeline ----------------------------------------

export async function getPipeline() {
  const sb = getSupabase();
  const { data } = await sb.from("donors").select("*").not("pipeline_stage", "is", null);
  const donors = data || [];
  const gifts = await fetchAll("gifts");
  const totals = new Map<string, number>();
  gifts.forEach((g) => totals.set(g.donor_id, (totals.get(g.donor_id) || 0) + num(g.amount)));
  const stageDefs = [
    { key: "identification", label: "Identification" },
    { key: "qualification", label: "Qualification" },
    { key: "cultivation", label: "Cultivation" },
    { key: "solicitation", label: "Solicitation" },
    { key: "stewardship", label: "Stewardship" },
  ];
  const byStage = stageDefs.map((s) => {
    const list = donors
      .filter((d: any) => d.pipeline_stage === s.key)
      .map((d: any) => ({
        id: d.id,
        name: donorName(d),
        lifetime: totals.get(d.id) || 0,
        ask: num(d.ask_amount),
        nextAction: d.next_action,
        nextDate: d.next_action_date,
        officer: d.officer,
      }))
      .sort((a, b) => b.ask - a.ask);
    return { ...s, donors: list, ask: list.reduce((x, d) => x + d.ask, 0) };
  });
  const totalAsk = donors.reduce((s: number, d: any) => s + num(d.ask_amount), 0);
  return { byStage, totalAsk, count: donors.length };
}

// ---- smart segments ----------------------------------------------------

export async function getSegmentsPage(activeKey?: string) {
  const [donors, gifts, plans] = await Promise.all([
    fetchAll<DonorRow>("donors"),
    fetchAll<GiftRow>("gifts"),
    fetchAll<RecurringPlanRow>("recurring_plans"),
  ]);
  const enriched = classifyDonors(donors, gifts, plans);
  const segments = SEGMENT_DEFS.map((s) => {
    const members = enriched.filter((d) => d.segKeys.includes(s.key));
    return {
      ...s,
      count: members.length,
      total: Math.round(members.reduce((x, d) => x + d.lifetime, 0)),
    };
  });
  const active =
    activeKey && SEGMENT_DEFS.some((s) => s.key === activeKey) ? activeKey : segments[0].key;
  const rows = enriched
    .filter((d) => d.segKeys.includes(active))
    .sort((a, b) => b.lifetime - a.lifetime);
  return { segments, active, rows };
}

export async function getSegmentsLite() {
  const { segments } = await getSegmentsPage();
  return segments.map((s) => ({ key: s.key, label: s.label, count: s.count }));
}

// ---- prospect research -------------------------------------------------

export async function getProspects() {
  const [donors, gifts] = await Promise.all([fetchAll("donors"), fetchAll("gifts")]);
  const totals = new Map<string, number>();
  gifts.forEach((g) => totals.set(g.donor_id, (totals.get(g.donor_id) || 0) + num(g.amount)));
  const rows = donors
    .map((d) => {
      const lifetime = totals.get(d.id) || 0;
      const capacityHigh = num(d.capacity_high);
      const { gap, underutilized } = prospectGap(capacityHigh, lifetime);
      return {
        id: d.id,
        name: donorName(d),
        city: d.city,
        state: d.state,
        capacityLow: num(d.capacity_low),
        capacityHigh,
        affinity: Number(d.affinity_score || 0),
        indicators: (d.wealth_indicators || []) as string[],
        lifetime,
        gap,
        underutilized,
      };
    })
    .sort((a, b) => b.capacityHigh - a.capacityHigh);
  const highPotential = rows
    .filter((r) => r.capacityHigh >= 25000 && r.affinity >= 50 && r.underutilized)
    .sort((a, b) => b.gap - a.gap);
  return {
    rows,
    highPotential,
    totalCapacity: rows.reduce((s, r) => s + r.capacityHigh, 0),
    topGap: rows.reduce((s, r) => s + (r.underutilized ? r.gap : 0), 0),
  };
}

// ---- stewardship / acknowledgments -------------------------------------

export async function getStewardshipQueue() {
  const sb = getSupabase();
  const { data } = await sb
    .from("gifts")
    .select("*, donor:donors!donor_id(*), campaign:campaigns(name)")
    .eq("acknowledged", false)
    .order("gift_date", { ascending: true });
  const list = (data || []).map((g: any) => ({
    ...g,
    amount: num(g.amount),
    donorName: donorName(g.donor),
  }));
  return {
    list,
    count: list.length,
    total: list.reduce((s: number, g: any) => s + num(g.amount), 0),
    oldest: list[0]?.gift_date || null,
  };
}

// ---- appeal performance ------------------------------------------------

export async function getAppealPerformance() {
  const [appeals, gifts] = await Promise.all([
    fetchAll<AppealRow>("appeals"),
    fetchAll<GiftRow>("gifts"),
  ]);
  return appealMetrics(appeals, gifts);
}

export async function getAllGiftsForExport() {
  const [gifts, donors, campaigns] = await Promise.all([
    fetchAll("gifts"),
    fetchAll("donors"),
    fetchAll("campaigns"),
  ]);
  const dById = new Map(donors.map((d) => [d.id, d]));
  const cById = new Map(campaigns.map((c) => [c.id, c]));
  return gifts
    .map((g) => ({
      date: g.gift_date,
      donor: donorName(dById.get(g.donor_id)),
      email: dById.get(g.donor_id)?.email || "",
      campaign: cById.get(g.campaign_id)?.name || "",
      amount: num(g.amount),
      fee: num(g.fee_amount),
      net: num(g.net_amount),
      method: g.payment_method,
      recurring: g.is_recurring ? "yes" : "no",
      fmv: num(g.fmv_amount),
      receipt: g.receipt_number || "",
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getTopStatementDonors(year: number) {
  const [donors, gifts] = await Promise.all([fetchAll("donors"), fetchAll("gifts")]);
  const totals = new Map<string, number>();
  gifts
    .filter((g) => yearOf(g.gift_date) === year)
    .forEach((g) => totals.set(g.donor_id, (totals.get(g.donor_id) || 0) + num(g.amount)));
  const donorById = new Map(donors.map((d) => [d.id, d]));
  return Array.from(totals.entries())
    .map(([id, total]) => ({ id, name: donorName(donorById.get(id)), total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}

export async function getDonorsLite() {
  const donors = await fetchAll("donors", "id,first_name,last_name,org_name,type,email");
  return donors
    .map((d) => ({ id: d.id, name: donorName(d), email: d.email }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
