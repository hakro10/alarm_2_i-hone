self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('alarm-app-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/bundle.js',
        '/manifest.json',
        '/icon-192.png',
        '/icon-512.png',
        '/_redirects'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ... existing code ...
