-- Supabase SQL: Create gumroad_webhook_logs table for webhook event/error logging
create table if not exists gumroad_webhook_logs (
  id uuid primary key default gen_random_uuid(),
  event_payload jsonb,
  email text,
  product_id text,
  user_id uuid,
  plan_type text,
  status text, -- 'success' or 'error'
  error_message text,
  created_at timestamptz not null default now()
);
-- Index for quick lookup by email or product_id
grant insert, select on gumroad_webhook_logs to anon, authenticated;
