-- Supabase SQL: Create paypal_webhook_logs table for webhook event/error logging
create table if not exists paypal_webhook_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text,
  event_id text,
  payload jsonb,
  status text not null, -- 'success' or 'error'
  error_message text,
  created_at timestamptz not null default now()
);
-- Index for quick lookup by event_id
grant insert, select on paypal_webhook_logs to anon, authenticated;
