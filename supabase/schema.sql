-- OpenClaw Base Platform Supabase Schema
-- Run this file once when provisioning a new project.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_name text not null,
  last_name text,
  phone text,
  email text,
  source text,
  notes text,
  tags text[] not null default '{}',
  status text not null default 'active',
  constraint contacts_status_check check (status in ('active', 'inactive', 'blocked'))
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  contact_id uuid references public.contacts(id) on delete set null,
  service_needed text,
  preferred_date text,
  message text,
  status text not null default 'new',
  source text,
  agent_notes text,
  owner_notes text,
  assigned_to text,
  constraint leads_status_check check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'unresponsive'))
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  contact_id uuid references public.contacts(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  address text,
  service text,
  assigned_to text,
  status text not null default 'scheduled',
  google_event_id text,
  notes text,
  reminder_sent boolean not null default false,
  constraint appointments_status_check check (status in ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'))
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  contact_id uuid references public.contacts(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  title text not null,
  status text not null default 'pending',
  service text,
  assigned_to text,
  scheduled_date date,
  completed_date date,
  invoice_amount numeric(10,2),
  paid_amount numeric(10,2),
  notes text,
  photos text[] not null default '{}',
  constraint jobs_status_check check (status in ('pending', 'in_progress', 'completed', 'invoiced', 'paid'))
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text,
  email text,
  google_calendar_id text,
  role text,
  active boolean not null default true,
  notes text
);

create table if not exists public.email_queue (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  to_email text not null,
  to_name text,
  subject text not null,
  body_html text not null,
  body_text text,
  status text not null default 'pending_approval',
  type text,
  approved_at timestamptz,
  sent_at timestamptz,
  contact_id uuid references public.contacts(id) on delete set null,
  error_message text,
  constraint email_queue_status_check check (status in ('pending_approval', 'approved', 'sent', 'failed', 'cancelled'))
);

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  amount numeric(10,2) not null,
  vendor text not null,
  reason text not null,
  status text not null default 'pending',
  requested_by text not null default 'openclaw_agent',
  approved_at timestamptz,
  executed_at timestamptz,
  approval_token text unique,
  expires_at timestamptz,
  transaction_ref text,
  notes text,
  constraint payment_requests_status_check check (status in ('pending', 'approved', 'denied', 'executed', 'expired'))
);

create table if not exists public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  action text not null,
  entity_type text,
  entity_id uuid,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'success',
  constraint agent_logs_status_check check (status in ('success', 'error', 'pending'))
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  service text,
  quote text not null,
  rating int not null default 5,
  review_date date not null default current_date,
  source text,
  published boolean not null default true,
  constraint reviews_rating_check check (rating between 1 and 5)
);

create index if not exists idx_contacts_created_at on public.contacts(created_at desc);
create index if not exists idx_contacts_email on public.contacts(lower(email));
create index if not exists idx_contacts_phone on public.contacts(phone);
create index if not exists idx_leads_contact_id on public.leads(contact_id);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_appointments_start_time on public.appointments(start_time asc);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_email_queue_status on public.email_queue(status);
create index if not exists idx_payment_requests_status on public.payment_requests(status);
create index if not exists idx_payment_requests_expires_at on public.payment_requests(expires_at);
create index if not exists idx_agent_logs_created_at on public.agent_logs(created_at desc);
create index if not exists idx_reviews_published on public.reviews(published);

drop trigger if exists set_contacts_updated_at on public.contacts;
create trigger set_contacts_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists set_appointments_updated_at on public.appointments;
create trigger set_appointments_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

drop trigger if exists set_jobs_updated_at on public.jobs;
create trigger set_jobs_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

drop trigger if exists set_employees_updated_at on public.employees;
create trigger set_employees_updated_at
before update on public.employees
for each row execute function public.set_updated_at();

drop trigger if exists set_email_queue_updated_at on public.email_queue;
create trigger set_email_queue_updated_at
before update on public.email_queue
for each row execute function public.set_updated_at();

drop trigger if exists set_payment_requests_updated_at on public.payment_requests;
create trigger set_payment_requests_updated_at
before update on public.payment_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

alter table public.contacts enable row level security;
alter table public.leads enable row level security;
alter table public.appointments enable row level security;
alter table public.jobs enable row level security;
alter table public.employees enable row level security;
alter table public.email_queue enable row level security;
alter table public.payment_requests enable row level security;
alter table public.agent_logs enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Authenticated full access contacts" on public.contacts;
create policy "Authenticated full access contacts"
on public.contacts
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated full access leads" on public.leads;
create policy "Authenticated full access leads"
on public.leads
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated full access appointments" on public.appointments;
create policy "Authenticated full access appointments"
on public.appointments
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated full access jobs" on public.jobs;
create policy "Authenticated full access jobs"
on public.jobs
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated full access employees" on public.employees;
create policy "Authenticated full access employees"
on public.employees
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated full access email_queue" on public.email_queue;
create policy "Authenticated full access email_queue"
on public.email_queue
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated full access payment_requests" on public.payment_requests;
create policy "Authenticated full access payment_requests"
on public.payment_requests
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated full access agent_logs" on public.agent_logs;
create policy "Authenticated full access agent_logs"
on public.agent_logs
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated full access reviews" on public.reviews;
create policy "Authenticated full access reviews"
on public.reviews
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published reviews" on public.reviews;
create policy "Public can read published reviews"
on public.reviews
for select
to anon, authenticated
using (published = true);

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists "Public can read gallery objects" on storage.objects;
create policy "Public can read gallery objects"
on storage.objects
for select
to public
using (bucket_id = 'gallery');

drop policy if exists "Authenticated can manage gallery objects" on storage.objects;
create policy "Authenticated can manage gallery objects"
on storage.objects
for all
to authenticated
using (bucket_id = 'gallery')
with check (bucket_id = 'gallery');
