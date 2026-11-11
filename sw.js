const CACHE = "nb-automotriz-v8";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/styles.css",
  "./assets/fonts.css",
  "./assets/app.js",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-192.png",
  "./assets/icon-maskable-512.png",
  "./assets/apple-touch-icon.png",
  "./assets/favicon-32.png",
  "./assets/favicon.ico",
  "./assets/icon-source.png",
  "./assets/catalog/antiasalto.jpg",
  "./assets/catalog/city-car-laminas.jpg",
  "./assets/catalog/city-car-polarizado.jpg",
  "./assets/catalog/sedan-laminas.jpg",
  "./assets/catalog/sedan-polarizado.jpg",
  "./assets/catalog/suv-laminas.jpg",
  "./assets/catalog/suv-polarizado.jpg",
  "./assets/catalog/llaves.jpg",
  "./assets/catalog/modulos.jpg",
  "./assets/fonts/outfit-latin.woff2",
  "./assets/fonts/outfit-latin-ext.woff2",
  "./assets/fonts/manrope-latin.woff2",
  "./assets/fonts/manrope-latin-ext.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isDoc = req.mode === "navigate" || req.destination === "document";
  if (isDoc) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
