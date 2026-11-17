// Offline cache: app shell cache-first with background refresh; fonts cached on first use.
const CACHE = 'lockin-v8';
const SHELL = ['./', 'index.html', 'app.css', 'app.js', 'sync.js', 'config.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  // fonts and the pinned supabase-js build never change, so cache them; Supabase API calls are not cached
  const font = url.host.includes('fonts.googleapis.com') || url.host.includes('fonts.gstatic.com') || url.host === 'cdn.jsdelivr.net';
  if (!same && !font) return;
  // app files: network first so updates show on the next open; cache only when offline. Fonts: cache first.
  e.respondWith(caches.open(CACHE).then(async c => {
    if (same) {
      try { const r = await fetch(req, { cache: 'no-cache' }); if (r && r.ok) c.put(req, r.clone()); return r; }
      catch (err) { return (await c.match(req)) || Response.error(); }
    }
    const hit = await c.match(req);
    if (hit) return hit;
    const r = await fetch(req); if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r;
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow('./')));
});
