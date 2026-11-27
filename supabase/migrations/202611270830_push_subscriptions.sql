-- Migration: push_subscriptions
-- Lưu Web Push subscription của từng thiết bị theo email người dùng

create table if not exists public.push_subscriptions (
  id bigserial primary key,
  email text not null,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  ua text,
  created_at timestamptz default now(),
  last_ok timestamptz
);

create index if not exists idx_push_subscriptions_email
  on public.push_subscriptions (lower(email));

alter table public.push_subscriptions enable row level security;

drop policy if exists "push_sub_select_own_or_gdtt" on public.push_subscriptions;
create policy "push_sub_select_own_or_gdtt"
  on public.push_subscriptions
  for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email') or public.is_gdtt());

drop policy if exists "push_sub_insert_own" on public.push_subscriptions;
create policy "push_sub_insert_own"
  on public.push_subscriptions
  for insert
  to authenticated
  with check (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "push_sub_update_own" on public.push_subscriptions;
create policy "push_sub_update_own"
  on public.push_subscriptions
  for update
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'))
  with check (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "push_sub_delete_own" on public.push_subscriptions;
create policy "push_sub_delete_own"
  on public.push_subscriptions
  for delete
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));
