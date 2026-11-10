/* Service worker : garde le jeu sur l'appareil pour qu'il marche hors connexion.
   Changer VERSION à chaque mise en ligne pour que les joueurs reçoivent la nouvelle version. */
const VERSION = "popites-v19";
/* tous les fichiers à la racine : l'envoi de dossiers par le site de GitHub marche mal */
const SHELL = ["./", "index.html", "style.css", "app.js", "symboles.js", "paquet.js", "badges.js", "fond.js", "collections.js", "questions.js", "manifest.webmanifest",
  "icon-192.png", "icon-512.png", "icon-maskable-512.png", "icon-180.png"];

self.addEventListener("install", e => {
  /* cache:"reload" : on va chercher les fichiers sur le serveur, jamais dans le cache du navigateur
     (sinon la nouvelle version peut garder un ancien app.js pendant 10 minutes) */
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* fichiers du jeu : d'abord le cache (rapide, hors ligne), mise à jour en arrière-plan ;
   polices Google : mises en cache au premier passage */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(res => {
      if (res.ok || res.type === "opaque") cache.put(e.request, res.clone());
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
