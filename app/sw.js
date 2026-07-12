/* Discipline 30 — FocusLab · service worker (network-first, cache = secours hors-ligne) */
var CACHE = 'discipline30-v4';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).catch(function(){}));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method!=='GET') return;
  var url = new URL(req.url);
  // ne pas mettre en cache l'analytics ni les POST externes
  if(url.origin!==location.origin){ return; }
  // network-first : la mise à jour se propage toujours ; le cache ne sert qu'en hors-ligne
  e.respondWith(
    fetch(req).then(function(res){
      if(res && res.status===200){ var copy=res.clone(); caches.open(CACHE).then(function(c){c.put(req,copy);}); }
      return res;
    }).catch(function(){ return caches.match(req); })
  );
});
