const SHELL='shell-v1',TILES='tiles-v1';
const FILES=['./','index.html','manifest.json','maplibre-gl.js','maplibre-gl.css','logo.png','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.hostname.endsWith('tile.opentopomap.org')){
    e.respondWith(caches.open(TILES).then(async c=>{
      const hit=await c.match(e.request.url);if(hit)return hit;
      try{const r=await fetch(e.request);if(r.ok)c.put(e.request.url,r.clone());return r}catch(err){return new Response('',{status:504})}
    }));return;
  }
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(SHELL).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
  }
});
