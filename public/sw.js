/* Infinity-agent service worker — pages-v12 */
const BASE='/Infinity-agent';
const CACHE='infinity-agent-pages-v12';
const ASSETS=[`${BASE}/`,`${BASE}/index.html`,`${BASE}/manifest.webmanifest`,`${BASE}/icon.svg`];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>(k!==CACHE?caches.delete(k):Promise.resolve())))));self.clients.claim()});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
