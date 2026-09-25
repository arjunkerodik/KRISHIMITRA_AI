/* ============================================================
   KrishiMitra AI — Production PWA Service Worker
   Strategies:
   - Static assets (icons, fonts, css, js): Cache First
   - App pages & API routes: Network First with Cache Fallback
   - Push notifications: handled for weather/price/scheme alerts
   ============================================================ */

const CACHE_VERSION = "krishimitra-v3";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;
const LAST_SYNC_DB = "krishimitra-sync";

const STATIC_ASSETS = [
  "/",
  "/login",
  "/crops",
  "/market",
  "/farmtalk",
  "/schemes",
  "/weather",
  "/disease",
  "/dashboard",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.ico",
  "/nature-farm-bg.jpg",
];

const API_ROUTES_TO_CACHE = [
  "/api/market",
  "/api/weather",
  "/api/crops",
];

// ── Helpers ──────────────────────────────────────────────────

async function setLastSynced(key, timestamp) {
  try {
    const db = await openSyncDB();
    const tx = db.transaction("sync_timestamps", "readwrite");
    tx.objectStore("sync_timestamps").put({ key, timestamp });
  } catch {}
}

function openSyncDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(LAST_SYNC_DB, 1);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore("sync_timestamps", { keyPath: "key" });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = reject;
  });
}

// ── Install ───────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // addAll throws if any asset fails — use individual puts to be resilient
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // 1. API routes: Network First → Cache Fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstWithFallback(request, API_CACHE));
    return;
  }

  // 2. Static assets (images, icons, fonts): Cache First
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|woff2?|ttf|eot)$/) ||
    STATIC_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(cacheFirstWithNetwork(request, STATIC_CACHE));
    return;
  }

  // 3. Next.js JS/CSS chunks: Cache First
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(cacheFirstWithNetwork(request, STATIC_CACHE));
    return;
  }

  // 4. App pages: Network First → Cache Fallback
  event.respondWith(networkFirstWithFallback(request, DYNAMIC_CACHE));
});

async function networkFirstWithFallback(request, cacheName) {
  try {
    const networkRes = await fetch(request);
    if (networkRes.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkRes.clone());
      await setLastSynced(request.url, Date.now());
    }
    return networkRes;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Return an offline fallback page for navigation requests
    if (request.mode === "navigate") {
      const fallback = await caches.match("/");
      if (fallback) return fallback;
    }
    return new Response(
      JSON.stringify({ error: "offline", cached: false }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function cacheFirstWithNetwork(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const networkRes = await fetch(request);
    if (networkRes.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkRes.clone());
    }
    return networkRes;
  } catch {
    return new Response("", { status: 503 });
  }
}

// ── Push Notifications ────────────────────────────────────────

self.addEventListener("push", (event) => {
  let data = { title: "KrishiMitra Alert", body: "", icon: "/icon-192.png", url: "/" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "/icon-192.png",
      badge: "/icon-192.png",
      tag: data.tag || "krishimitra-alert",
      data: { url: data.url || "/" },
      actions: data.actions || [],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const existing = windowClients.find((c) => c.url === url && "focus" in c);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
