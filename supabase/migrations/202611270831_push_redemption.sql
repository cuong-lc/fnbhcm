-- Migration: push_redemption
-- Gửi Web Push khi GĐTT duyệt (da_trao) hoặc huỷ (huy) yêu cầu đổi quà

create or replace function public.trg_push_redemption_fn()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text;
  v_title text;
  v_body text;
begin
  if old.status is distinct from 'cho_trao' or new.status not in ('da_trao', 'huy') then
    return new;
  end if;

  select value into v_key
  from public.app_settings
  where key = 'push_hook_key';

  if v_key is null or v_key = '' then
    return new;
  end if;

  if new.status = 'da_trao' then
    v_title := '🎁 Quà đã được duyệt';
    v_body := coalesce(new.reward_name, 'Quà')
      || ' × ' || coalesce(new.qty, 1)::text
      || ' · mã ' || coalesce(new.code, '')
      || '. GĐTT đã xử lý, đã trừ ' || coalesce(new.cost, 0)::text || ' điểm.';
  else
    v_title := '↩️ Yêu cầu đổi quà bị huỷ';
    v_body := coalesce(new.reward_name, 'Quà')
      || ' · mã ' || coalesce(new.code, '')
      || '. Điểm đã hoàn lại.';
  end if;

  begin
    perform net.http_post(
      url := 'https://nqvexaqcdjyqekryrjtx.supabase.co/functions/v1/send-push',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-push-key', v_key
      ),
      body := jsonb_build_object(
        'emails', jsonb_build_array(lower(new.email)),
        'title', v_title,
        'body', v_body,
        'url', '/index.html#hub-challenge',
        'tag', 'redemption-' || coalesce(new.id::text, '')
      ),
      timeout_milliseconds := 20000
    );
  exception when others then
    return new;
  end;

  return new;
end;
$$;

drop trigger if exists trg_push_redemption on public.redemptions;
create trigger trg_push_redemption
  after update of status on public.redemptions
  for each row
  execute function public.trg_push_redemption_fn();
