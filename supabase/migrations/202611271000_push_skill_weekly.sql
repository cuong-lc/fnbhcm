-- Migration: push_skill_weekly
-- Nhắc "📈 Tiến bộ thêm 1% nhé" hàng tuần: gửi Web Push cho sale (c0/c1/c2, Phòng FNB) còn mục checklist c1 chưa tick.
-- checklist_catalog = bản sao CLF.CHECKLISTS.c1 trong framework-data.js (key giống app.js: clf_c1_ck_{pi}_{ci}_{ii}).
-- ĐỔI framework-data.js (thêm/bớt/đổi thứ tự mục) ⇒ phải seed lại bảng này.

create extension if not exists pg_cron;

create table if not exists public.checklist_catalog (
  item_key text primary key,
  part text not null,
  cat text not null,
  name text not null,
  sort int not null,
  required boolean not null default true
);
alter table public.checklist_catalog enable row level security;
drop policy if exists checklist_catalog_read on public.checklist_catalog;
create policy checklist_catalog_read on public.checklist_catalog for select to authenticated using (true);

-- Mỗi sale: đã tick bao nhiêu, 3 mục kế tiếp chưa tick (mục bắt buộc trước, theo thứ tự checklist)
create or replace function public.skill_reminder_rows()
returns table(email text, done int, total int, next_items text[])
language sql
stable
security definer
set search_path = public
as $$
  with s as (
    select lower(ra.email) email from role_assignments ra
    where ra.dept like 'Phòng%' and ra.level in ('c0','c1','c2')
  ),
  d as (
    select lower(p.email) email, p.item_key from progress p
    where p.done and p.item_key like 'clf_c1_ck_%'
  )
  select s.email,
    (select count(*) from checklist_catalog c join d on d.item_key=c.item_key and d.email=s.email)::int,
    (select count(*) from checklist_catalog)::int,
    array(select c.name from checklist_catalog c
          where not exists (select 1 from d where d.email=s.email and d.item_key=c.item_key)
          order by c.required desc, c.sort limit 3)
  from s;
$$;
revoke all on function public.skill_reminder_rows() from public, anon, authenticated;

-- GĐTT xem trước nội dung sẽ gửi
create or replace function public.skill_reminder_preview()
returns table(email text, done int, total int, next_items text[], has_push boolean)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_gdtt() then raise exception 'Chỉ GĐTT'; end if;
  return query
    select r.email, r.done, r.total, r.next_items,
      exists(select 1 from push_subscriptions ps where lower(ps.email)=r.email)
    from public.skill_reminder_rows() r order by r.done;
end;
$$;

-- Gửi: chỉ người đã bật thông báo và còn mục chưa tick. p_only = gửi thử cho 1 email.
create or replace function public.send_skill_reminders(p_only text default null)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text;
  r record;
  n int := 0;
begin
  select value into v_key from app_settings where key = 'push_hook_key';
  if v_key is null or v_key = '' then return 0; end if;

  for r in
    select * from public.skill_reminder_rows() x
    where x.done < x.total
      and (p_only is null or x.email = lower(p_only))
      and exists (select 1 from push_subscriptions ps where lower(ps.email) = x.email)
  loop
    begin
      perform net.http_post(
        url := 'https://nqvexaqcdjyqekryrjtx.supabase.co/functions/v1/send-push',
        headers := jsonb_build_object('Content-Type','application/json','x-push-key', v_key),
        body := jsonb_build_object(
          'emails', jsonb_build_array(r.email),
          'title', '📈 Tiến bộ thêm 1% nhé',
          'body', 'Bạn đã xong ' || r.done || '/' || r.total || ' mục. Tuần này thử thêm: '
                  || array_to_string(r.next_items, ' · ') || '. Bấm để tick nha!',
          'url', '/cap-1-nhan-vien.html',
          'tag', 'skill-weekly'
        ),
        timeout_milliseconds := 20000
      );
      n := n + 1;
    exception when others then null;
    end;
  end loop;
  return n;
end;
$$;
revoke all on function public.send_skill_reminders(text) from public, anon, authenticated;

-- 8:00 sáng thứ Hai giờ VN = 01:00 UTC thứ Hai
select cron.unschedule('skill-weekly') where exists (select 1 from cron.job where jobname = 'skill-weekly');
select cron.schedule('skill-weekly', '0 1 * * 1', $$select public.send_skill_reminders()$$);
