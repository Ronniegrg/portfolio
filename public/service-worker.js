// Service Worker for Rouni Gorgees Portfolio
console.log("Service Worker: Script loaded");

const CACHE_NAME = "rg-portfolio-v2";
// Base path from vite.config.js
const BASE_PATH = "/portfolio/";
const urlsToCache = [
  // Only cache static assets that we know exist
  BASE_PATH + "manifest.webmanifest",
  BASE_PATH + "rg-logo-192.png",
  BASE_PATH + "rg-logo-512.png",
  BASE_PATH + "rg-logo.svg",
  // Note: We'll cache the main page and other assets dynamically as they're requested
  // since Vite generates hashed filenames that we can't predict at build time
];

console.log("Service Worker: URLs to cache:", urlsToCache);

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache resources individually to handle failures gracefully
      const cachePromises = urlsToCache.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
            console.log(`Successfully cached: ${url}`);
          } else {
            console.warn(
              `Failed to fetch ${url}: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.warn(`Error caching ${url}:`, error.message);
        }
      });

      await Promise.allSettled(cachePromises);
      console.log("Service worker installation completed");
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

      // Fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response or if it's not a GET request
          if (
            !response ||
            response.status !== 200 ||
            event.request.method !== "GET" ||
            !response.headers.get("content-type")
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the response asynchronously
          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache).catch((error) => {
                console.warn(
                  "Failed to cache resource:",
                  event.request.url,
                  error
                );
              });
            })
            .catch((error) => {
              console.warn("Failed to open cache:", error);
            });

          return response;
        })
        .catch((error) => {
          // Network request failed
          console.warn("Network request failed:", event.request.url, error);
          // Return a generic offline response for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match(BASE_PATH).then((cachedResponse) => {
              return cachedResponse || new Response("Offline", { status: 503 });
            });
          }
          throw error;
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
