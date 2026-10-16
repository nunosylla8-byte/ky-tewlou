const C='kyt-v4',SH='kyt-share';
const SHELL=['/','/manifest.webmanifest','/icon-192.png','/icon-512.png','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js','https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Source+Sans+3:wght@400;600;700&display=swap'];
// Installation tolérante : un fichier manquant n'empêche plus l'installation
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(SHELL.map(u=>fetch(new Request(u,{mode:u[0]=='/'?'same-origin':'no-cors'})).then(x=>c.put(u,x)).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C&&x!=SH).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
// Réception d'un partage (lien YouTube ou fichier vidéo / audio) depuis une autre application
async function share(r){try{const f=await r.formData(),c=await caches.open(SH);for(const k of await c.keys())await c.delete(k);let i=0;
 for(const x of f.getAll('media'))if(x&&x.size)await c.put('/__share/'+(i++),new Response(x,{headers:{'x-name':encodeURIComponent(x.name||'media'),'content-type':x.type||'application/octet-stream'}}));
 return Response.redirect('/?'+new URLSearchParams({shared:'1',url:f.get('url')||'',text:f.get('text')||''}),303)}catch(e){return Response.redirect('/',303)}}
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method==='POST'&&u.pathname==='/share-target'){e.respondWith(share(r));return}
 if(r.method!=='GET'||u.hostname.endsWith('supabase.co'))return;
 if(r.mode==='navigate'){e.respondWith(Promise.race([fetch(r),new Promise((_,j)=>setTimeout(j,4000))]).then(x=>{if(x.ok){const cp=x.clone();caches.open(C).then(c=>c.put('/',cp))}return x}).catch(()=>caches.match('/').then(m=>m||fetch(r))));return}
 e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const cp=x.clone();caches.open(C).then(c=>c.put(r,cp))}return x}).catch(()=>m);return m||f}))});
