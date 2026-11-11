// «Ёрдамчи» (service worker): сайт файлларини сақлаб қўяди.
// Фақат ЎЗ сайтимиздаги GET сўровларга аралашади — Firebase'га тегмайди.
const CACHE = "kundalik-online-v1";
const FAYLLAR = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-maskable.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FAYLLAR)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;   // бегона сўровлар — ўз йўлида
  e.respondWith(
    fetch(e.request)
      .then(r => { const nusxa = r.clone(); caches.open(CACHE).then(c => c.put(e.request, nusxa)); return r; })
      .catch(() => caches.match(e.request))
  );
});
