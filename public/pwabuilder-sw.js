// This is the "Offline copy of pages" service worker

const CACHE = "pwabuilder-offline";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

// Отправка сообщения в основное приложение, если интернета нет
self.addEventListener('fetch', (event) => {
  if (!navigator.onLine) {
    // Если интернета нет, отправляем сообщение в основное приложение
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'NETWORK_OFFLINE' });
      });
    });
  }
});