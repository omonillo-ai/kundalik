// «Ёрдамчи» (service worker): интернет бўлмаса ҳам кундалик очилсин
const CACHE = "kundalik-v1";
const FAYLLAR = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-maskable.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FAYLLAR)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))));
  self.clients.claim();
});
// аввал интернетдан, бўлмаса — сақланган нусхадан
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(r => { const nusxa = r.clone(); caches.open(CACHE).then(c => c.put(e.request, nusxa)); return r; })
      .catch(() => caches.match(e.request))
  );
});
