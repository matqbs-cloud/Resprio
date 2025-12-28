const CACHE_NAME = 'respiro-cache-v1';
const APP_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css', 
  '/src/app.js',
  '/src/ui.js',
  '/src/session.js',
  '/src/native.js',
  '/src/consts.js',
  '/src/exercises.js',
  '/manifest.webmanifest',
  '/sounds/inhale.wav', 
  '/sounds/hold.wav',
  '/sounds/exhale.wav',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS))
    );
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys
                .filter(key => key.startsWith('respiro-cache-') && key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});


self.addEventListener('fetch', event => {
    const { request } = event;
    if (request.method !== 'GET') return;

    event.respondWith(
        caches.match(request).then(cached => {
            
            const networkFetch = fetch(request)
                .then(response => {
                    const clone = response.clone();
                    if (response.ok && request.url.startsWith(self.location.origin)) {
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => cached); 

            return cached || networkFetch;
        })
    );
});