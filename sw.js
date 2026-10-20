// ทำให้แอปเปิดได้แม้ไม่มีเน็ต (เก็บไฟล์แอปไว้ในเครื่อง)
const CACHE = 'liftlog-v9';
// วิดีโอสาธิตท่าหลัก 24 ท่า เก็บไว้ในเครื่องตั้งแต่ติดตั้ง ใช้ในยิมได้แม้ไม่มีเน็ต
const DEMOS = ['EIeI8Vf', 'ns0SIbU', 'v3xmPAR', 'I4hDWkc', 'my33uHU', '17lJ1kr', 'RVwzP10', 'fUBheHs', 'ila4NZS', 'lBDjFxJ', 'eZyBC3j', 'qXTaZnJ', '10Z2DXU', 'wQ2c4XD', '8ozhUIZ', 'kTbSH9h', 'DsgkuIt', '25GPyDY', '2NpxjC1', '3ZflifB', 'h8LFzo9', 'VBAWRPG', 'WW95auq', 'I3tsCnC'].map(id => `demos/${id}.mp4`);
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'lib.json', 'body.json', ...DEMOS];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(res => {
      // ไม่เก็บไฟล์จากเว็บที่ไม่อนุญาต CORS (Chrome นับไฟล์แบบนี้เป็นหลาย MB ต่อไฟล์) ให้เบราว์เซอร์แคชเองแทน
      // วิดีโอบางครั้งโหลดเป็นท่อน (206) ซึ่งเก็บลงแคชไม่ได้ เก็บเฉพาะไฟล์เต็ม (200)
      if (res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
