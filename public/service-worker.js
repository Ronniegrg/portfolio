// Service Worker for Rouni Gorgees Portfolio
const CACHE_NAME = "rg-portfolio-v1";
// Base path from vite.config.js
const BASE_PATH = "/portfolio/";
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "manifest.webmanifest",
  BASE_PATH + "rg-logo-192.png",
  BASE_PATH + "rg-logo-512.png",
  BASE_PATH + "rg-logo.svg",
  // Only cache assets that actually exist in production
  BASE_PATH + "assets/", // Vite builds CSS and JS into assets folder
];

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch from cache first, then network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        // Don't cache if not a valid response or if it's not a GET request
        if (
          !response ||
          response.status !== 200 ||
          event.request.method !== "GET"
        ) {
          return response;
        }

        // Clone the response
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Update service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
