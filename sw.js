const CACHE_NAME = 'lightsout-cdl-v6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './1000011344.jpg',
  './lights-out-logo.jpg',
  './James_Coffman_MVR_DOT_Report.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (
    event.request.url.includes('/send') || 
    event.request.url.includes('/poll') || 
    event.request.url.includes('telegram') ||
    event.request.url.includes('workers.dev')
  ) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
