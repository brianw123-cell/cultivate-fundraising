-- Pledges (Option B): schema + seed.
-- Run once in Supabase → SQL Editor (or `supabase db push`). Creating the tables
-- also makes the in-app "New pledge" form work. Safe to re-run (idempotent DDL;
-- the seed appends, so only run the seed block once).

-- ---- schema ----------------------------------------------------------------
create table if not exists pledges (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  donor_id uuid references donors(id) on delete cascade,
  campaign_id uuid references campaigns(id),
  total_amount numeric(12,2) not null,
  frequency text not null,
  installment_count int not null,
  installment_amount numeric(12,2) not null,
  start_date date not null,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists pledge_installments (
  id uuid primary key default gen_random_uuid(),
  pledge_id uuid references pledges(id) on delete cascade,
  org_id uuid references organizations(id) on delete cascade,
  seq int not null,
  due_date date not null,
  amount numeric(12,2) not null,
  status text default 'pending',
  paid_date date,
  created_at timestamptz default now()
);

alter table gifts add column if not exists pledge_id uuid references pledges(id);
create index if not exists idx_pledge_inst_pledge on pledge_installments(pledge_id);

alter table pledges enable row level security;
alter table pledge_installments enable row level security;
create policy demo_all on pledges for all using (true) with check (true);
create policy demo_all on pledge_installments for all using (true) with check (true);

-- ---- seed (~18 fake pledges) — run once ------------------------------------
with d as (select id, row_number() over (order by created_at, id) rn from donors),
c as (select id, row_number() over (order by created_at, id) rn from campaigns where status = 'active'),
base as (
  select x,
    1 + floor(random() * (select count(*) from donors))::int as didx,
    1 + floor(random() * (select count(*) from campaigns where status = 'active'))::int as cidx,
    (array[2400,5000,1200,6000,10000,3600,1800,12000,4800,9000])[1 + floor(random()*10)::int]::numeric as total,
    floor(random() * 4)::int as fi,
    (date '2024-06-01' + (random() * 360)::int) as sdate
  from generate_series(1, 18) x
)
insert into pledges (org_id, donor_id, campaign_id, total_amount, frequency, installment_count, installment_amount, start_date, status)
select (select id from organizations limit 1), d.id, c.id, base.total,
  (array['monthly','monthly','quarterly','annually'])[base.fi + 1],
  (array[24,24,8,3])[base.fi + 1],
  round(base.total / (array[24,24,8,3])[base.fi + 1], 2),
  base.sdate, 'active'
from base join d on d.rn = base.didx join c on c.rn = base.cidx;

insert into pledge_installments (pledge_id, org_id, seq, due_date, amount, status)
select p.id, p.org_id, gs.n,
  (p.start_date + (gs.n - 1) * (case p.frequency when 'monthly' then interval '1 month' when 'quarterly' then interval '3 months' else interval '1 year' end))::date,
  p.installment_amount, 'pending'
from pledges p cross join lateral generate_series(1, p.installment_count) gs(n);

update pledge_installments set status = 'paid', paid_date = due_date + (floor(random()*4))::int
where due_date <= date '2026-06-08' and random() < 0.85;

update pledge_installments set status = 'overdue'
where due_date <= date '2026-06-08' and status = 'pending';

update pledges p set status = 'completed'
where not exists (select 1 from pledge_installments i where i.pledge_id = p.id and i.status <> 'paid');
