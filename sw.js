/* Scope is this weather app directory only. Never caches or intercepts the original game. */
const CACHE='tantan-weather-db4b81076f51f24d',PREFIX='tantan-weather-',ASSETS=["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(path=>new Request(new URL(path,self.registration.scope),{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{
  const cached=await caches.match(event.request,{cacheName:CACHE,ignoreSearch:true});
  if(cached)return cached;
  try {const response=await fetch(event.request);return response;}
  catch(error){if(event.request.mode==='navigate')return caches.match(new URL('./index.html',self.registration.scope).href,{cacheName:CACHE});throw error;}
 })());
});
