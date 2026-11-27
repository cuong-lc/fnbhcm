// Edge Function: send-push (verify_jwt = false)
// Chỉ nhận gọi từ DB trigger hoặc admin có header x-push-key khớp secret PUSH_HOOK_KEY.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const hookKey = Deno.env.get('PUSH_HOOK_KEY') || '';
  const reqKey = req.headers.get('x-push-key') || '';
  if (!hookKey || reqKey !== hookKey) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const vapidPublic = Deno.env.get('VAPID_PUBLIC') || '';
  const vapidPrivate = Deno.env.get('VAPID_PRIVATE') || '';
  const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:cuonglc@sapo.vn';
  const supaUrl = Deno.env.get('SUPABASE_URL') || '';
  const supaKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  if (!vapidPublic || !vapidPrivate || !supaUrl || !supaKey) {
    return json({ error: 'Missing server secrets' }, 500);
  }

  let body: {
    emails?: string[];
    title?: string;
    body?: string;
    url?: string;
    tag?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const rawEmails = Array.isArray(body.emails) ? body.emails : [];
  const lowerEmails = [...new Set(rawEmails.map((e) => String(e || '').trim().toLowerCase()).filter(Boolean))];
  if (!lowerEmails.length || !body.title) {
    return json({ error: 'emails[] and title are required' }, 400);
  }

  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

  const sb = createClient(supaUrl, supaKey);
  const { data: subs, error: selErr } = await sb
    .from('push_subscriptions')
    .select('id, email, endpoint, p256dh, auth')
    .in('email', lowerEmails);

  if (selErr) {
    return json({ error: selErr.message }, 500);
  }
  if (!subs || !subs.length) {
    return json({ sent: 0, removed: 0, failed: 0 });
  }

  const payload = JSON.stringify({
    title: String(body.title),
    body: String(body.body || ''),
    url: String(body.url || '/index.html'),
    tag: String(body.tag || 'fnbhcm-hub'),
  });

  let sent = 0;
  let removed = 0;
  let failed = 0;
  const okIds: number[] = [];
  const deadIds: number[] = [];

  await Promise.allSettled(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth },
          },
          payload
        );
        sent++;
        okIds.push(s.id);
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          removed++;
          deadIds.push(s.id);
        } else {
          failed++;
          console.error('send-push failed for sub', s.id, 'status:', statusCode || 'unknown');
        }
      }
    })
  );

  if (okIds.length) {
    await sb
      .from('push_subscriptions')
      .update({ last_ok: new Date().toISOString() })
      .in('id', okIds);
  }
  if (deadIds.length) {
    await sb.from('push_subscriptions').delete().in('id', deadIds);
  }

  return json({ sent, removed, failed });
});
