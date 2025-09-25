self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("infinity-agent-cache").then(cache => {
      return cache.addAll(["/", "/index.html", "/manifest.webmanifest"]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
