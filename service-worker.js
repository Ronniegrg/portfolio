// Service Worker for Rouni Gorgees Portfolio

const CACHE_NAME = "rg-portfolio-v4"; // Increment version to invalidate old cache
// Base path from vite.config.js
const BASE_PATH = "/portfolio/";
const urlsToCache = [
  // Only cache static assets that we know exist
  BASE_PATH + "manifest.webmanifest",
  BASE_PATH + "rg-logo-192.png",
  BASE_PATH + "rg-logo-512.png",
  BASE_PATH + "rg-logo.svg",
  BASE_PATH + "Rouni-Gorgees.pdf", // Resume file for quick access
  // Note: We'll cache the main page and other assets dynamically as they're requested
  // since Vite generates hashed filenames that we can't predict at build time
];

// URLs to cache and tracking prevention status determined

// Check if storage is available (handles tracking prevention)
let storageAvailable = null; // Cache the result
let hasLoggedStorageWarning = false; // Prevent spam logging

async function isStorageAvailable() {
  if (storageAvailable !== null) {
    return storageAvailable;
  }

  try {
    // Test basic cache access
    const _testCache = await caches.open("storage-test");
    await caches.delete("storage-test");
    storageAvailable = true;
    // Storage is available
    return true;
  } catch {
    storageAvailable = false;
    if (!hasLoggedStorageWarning) {
      console.info(
        "Service Worker: Running in privacy mode - storage access limited by browser tracking prevention"
      );
      hasLoggedStorageWarning = true;
    }
    // Running in fallback mode without caching
    return false;
  }
}

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const storageAvailable = await isStorageAvailable();

      if (!storageAvailable) {
        console.warn("Storage not available, skipping cache operations");
        return;
      }

      try {
        const cache = await caches.open(CACHE_NAME);

        // Cache resources individually to handle failures gracefully
        const cachePromises = urlsToCache.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
              // Successfully cached resource
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
        // Service worker installation completed
      } catch (error) {
        console.warn("Cache operations failed:", error.message);
      }
    })()
  );
});

// Fetch from cache first, then network
self.addEventListener("fetch", (event) => {
  // Skip handling requests with unsupported schemes
  try {
    const url = new URL(event.request.url);
    if (!["http:", "https:"].includes(url.protocol)) {
      // Explicitly don't handle chrome-extension://, file://, data:, etc.
      console.debug(
        "Service Worker: Skipping unsupported scheme:",
        url.protocol,
        event.request.url
      );
      return;
    }
  } catch (error) {
    console.warn(
      "Service Worker: Invalid URL, skipping:",
      event.request.url,
      error.message
    );
    return;
  }

  event.respondWith(
    (async () => {
      const storageReady = await isStorageAvailable();

      // Try to get from cache first (only if storage is available)
      if (storageReady) {
        try {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            // Serving from cache
            return cachedResponse;
          }
        } catch (error) {
          console.warn("Service Worker: Cache access failed:", error.message);
        }
      }

      // Fetch from network
      try {
        const response = await fetch(event.request);

        // Don't cache JavaScript chunks to avoid stale cache issues with Vite builds
        // JavaScript files with hashes should always be fetched fresh
        const isJSChunk =
          event.request.url.includes("/assets/") &&
          (event.request.url.endsWith(".js") ||
            event.request.url.endsWith(".mjs"));

        // Check for unsupported URL schemes
        const url = new URL(event.request.url);
        const isUnsupportedScheme = !["http:", "https:"].includes(url.protocol);

        // Don't cache if not a valid response or if it's not a GET request
        if (
          !response ||
          response.status !== 200 ||
          event.request.method !== "GET" ||
          !response.headers.get("content-type") ||
          isJSChunk || // Don't cache JS chunks
          isUnsupportedScheme // Don't cache chrome-extension:// or other unsupported schemes
        ) {
          return response;
        }

        // Try to cache the response only if storage is available
        if (storageReady) {
          try {
            // Additional safety check to prevent caching unsupported schemes
            const requestUrl = new URL(event.request.url);
            if (!["http:", "https:"].includes(requestUrl.protocol)) {
              console.warn(
                "Service Worker: Skipping cache for unsupported scheme:",
                event.request.url
              );
              return response;
            }

            const responseToCache = response.clone();
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, responseToCache);
            // Cached resource successfully
          } catch (error) {
            console.warn(
              "Service Worker: Failed to cache resource:",
              event.request.url,
              error.message
            );
          }
        }

        return response;
      } catch (error) {
        // Network request failed
        console.warn(
          "Service Worker: Network request failed:",
          event.request.url,
          error.message
        );

        // Try to return a cached fallback for navigation requests (only if storage is available)
        if (event.request.mode === "navigate" && storageReady) {
          try {
            const cachedResponse = await caches.match(BASE_PATH);
            return (
              cachedResponse ||
              new Response("Offline - Please check your connection", {
                status: 503,
                headers: { "Content-Type": "text/plain" },
              })
            );
          } catch {
            return new Response("Offline - Please check your connection", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            });
          }
        }

        // For non-navigation requests, just let the error propagate
        throw error;
      }
    })()
  );
});

// Update service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    (async () => {
      const storageAvailable = await isStorageAvailable();

      if (!storageAvailable) {
        console.warn("Storage not available, skipping cache cleanup");
        return;
      }

      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
        // Cache cleanup completed
      } catch (error) {
        console.warn("Cache cleanup failed:", error.message);
      }
    })()
  );
});

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CHECK_STORAGE") {
    event.ports[0].postMessage({
      storageAvailable: storageAvailable,
    });
  }
});
