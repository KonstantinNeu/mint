// Service Worker: speichert die App-Dateien auf dem Gerät, damit Mint auch ohne Internet startet.
// Wichtig: Nach Änderungen an App-Dateien die Nummer bei CACHE_NAME erhöhen, damit Geräte die neue Version holen.
// Die Finanzdaten (localStorage) hat damit nichts zu tun, sie liegen nie in diesem Speicher.

const CACHE_NAME = "mint-v1";

const DATEIEN = [
  "./",
  "index.html",
  "style.css",
  "manifest.webmanifest",
  "logo.svg",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "apple-touch-icon.png",
  "fonts/lora-latin.woff2",
  "fonts/lora-latin-ext.woff2",
  "explosion.js",
  "app.js",
  "sprache.js",
  "sprueche.js",
  "schulden-texte.js",
  "einstellungen.js",
  "einkommen.js",
  "fixkosten.js",
  "ausgaben.js",
  "budget.js",
  "schulden.js",
  "ruecklage.js",
  "sparziele.js",
  "uebersicht.js",
  "jahr.js",
  "begruessung.js",
  "sperre.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(DATEIEN); }));
  self.skipWaiting();
});

// Alte Speicher-Versionen aufräumen
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (namen) {
      return Promise.all(namen.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Erst aus dem Speicher antworten (schnell, auch offline), im Hintergrund die neueste Version nachladen
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (gespeichert) {
      const netz = fetch(e.request).then(function (antwort) {
        if (antwort && antwort.ok && new URL(e.request.url).origin === location.origin) {
          const kopie = antwort.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, kopie); });
        }
        return antwort;
      }).catch(function () { return gespeichert; });
      return gespeichert || netz;
    })
  );
});
