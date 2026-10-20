// ทำให้แอปเปิดได้แม้ไม่มีเน็ต (เก็บไฟล์แอปไว้ในเครื่อง)
const CACHE = 'liftlog-v8';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'lib.json', 'body.json'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(res => {
      // ไม่เก็บไฟล์จากเว็บที่ไม่อนุญาต CORS (Chrome นับไฟล์แบบนี้เป็นหลาย MB ต่อไฟล์) ให้เบราว์เซอร์แคชเองแทน
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
