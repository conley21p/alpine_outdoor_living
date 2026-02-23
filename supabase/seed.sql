-- OpenClaw Base Platform Seed Data
-- Optional demo records for local development.

insert into public.contacts (first_name, last_name, phone, email, source, notes, tags)
values
  ('Jamie', 'Parker', '(555) 010-1000', 'jamie@example.com', 'website_form', 'Prefers morning appointments.', array['vip']),
  ('Morgan', 'Lee', '(555) 010-2000', 'morgan@example.com', 'referral', 'Interested in recurring service.', array['repeat_customer'])
on conflict do nothing;

insert into public.leads (contact_id, service_needed, preferred_date, message, status, source, assigned_to)
select c.id, 'Lawn Mowing', 'Next Tuesday', 'Looking for bi-weekly mowing service.', 'new', 'website_form', 'owner'
from public.contacts c
where c.email = 'jamie@example.com'
limit 1;

insert into public.leads (contact_id, service_needed, preferred_date, message, status, source, assigned_to)
select c.id, 'Irrigation Repair', 'This Friday', 'Sprinkler zone 2 is not working.', 'contacted', 'referral', 'owner'
from public.contacts c
where c.email = 'morgan@example.com'
limit 1;

insert into public.appointments (contact_id, title, start_time, end_time, address, service, assigned_to, status)
select c.id,
       'Lawn Mowing — 123 Main St',
       now() + interval '2 day',
       now() + interval '2 day 1 hour',
       '123 Main St',
       'Lawn Mowing',
       'Crew A',
       'scheduled'
from public.contacts c
where c.email = 'jamie@example.com'
limit 1;

insert into public.jobs (contact_id, title, status, service, assigned_to, scheduled_date, invoice_amount)
select c.id,
       'Front Yard Cleanup',
       'pending',
       'Cleanup',
       'Crew A',
       current_date + 3,
       180.00
from public.contacts c
where c.email = 'morgan@example.com'
limit 1;

insert into public.employees (name, phone, email, role, active)
values
  ('Alex Rivera', '(555) 010-3000', 'alex@example.com', 'Crew Lead', true),
  ('Casey Brooks', '(555) 010-4000', 'casey@example.com', 'Technician', true)
on conflict do nothing;

insert into public.reviews (customer_name, service, quote, rating, review_date, source, published)
values
  ('Chris M.', 'Lawn Mowing', 'Fast, professional, and consistently excellent work.', 5, current_date - 14, 'Google', true),
  ('Taylor R.', 'Irrigation Repair', 'They diagnosed and fixed the issue the same day.', 5, current_date - 7, 'Website', true),
  ('Jordan K.', 'Seasonal Cleanup', 'Great communication and clean results.', 4, current_date - 3, 'Referral', true)
on conflict do nothing;
