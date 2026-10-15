// Garde la page et les polices sur le téléphone : elle s'ouvre sans réseau.
// Page : version gardée affichée tout de suite, nouvelle version téléchargée en arrière-plan (visible à l'ouverture suivante).
const C="suivi-v1",CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  // Envois vers le script Google (partage en direct) : jamais gardés.
  if(/script\.google(usercontent)?\.com$/.test(u.hostname))return;
  const same=u.origin===location.origin,font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);if(!same&&!font)return;
  e.respondWith(caches.open(C).then(async c=>{const key=same&&r.mode==="navigate"?"index.html":r;const hit=await c.match(key,{ignoreSearch:same});
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(key,res.clone());return res;}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit;}const res=await net;return res||new Response("Hors ligne",{status:503});}));});
