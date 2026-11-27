// FNBHCM HUB — Service Worker (Web Push, không cache offline)
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('push', (e) => {
  let d = {};
  if (e.data) {
    try {
      d = e.data.json();
    } catch (_) {
      d = { body: e.data.text() };
    }
  }
  const title = d.title || 'FNBHCM HUB';
  const opts = {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/favicon-32.png',
    tag: d.tag || 'fnbhcm-hub',
    data: { url: d.url || '/index.html' }
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const rawUrl = (e.notification.data && e.notification.data.url) || '/index.html';
  const targetUrl = new URL(rawUrl, self.location.origin).href;
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url && c.url.startsWith(self.location.origin) && 'focus' in c) {
          if (c.url !== targetUrl && 'navigate' in c) {
            return c.navigate(targetUrl).then((nc) => (nc || c).focus()).catch(() => c.focus());
          }
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
