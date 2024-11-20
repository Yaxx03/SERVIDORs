const CACHE_NAME = 'cache-v1';
const FILES_TO_CACHE = [
    '/SERVIDOR/',
    '/SERVIDOR/index.html',
    '/SERVIDOR/manifest.json',
    '/SERVIDOR/build/1.jpg',
    '/SERVIDOR/build/2.jpg',
    '/SERVIDOR/build/3.jpg',
    '/SERVIDOR/build/4.jpg',
    '/SERVIDOR/build/5.jpg',
    '/SERVIDOR/build/6.jpg',
    '/SERVIDOR/build/cap1.png',
    '/SERVIDOR/build/cap2.png',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching archivos...');
                return cache.addAll(FILES_TO_CACHE);
            })
            .catch((error) => {
                console.error('[Service Worker] Error al agregar archivos al caché:', error);
            })
    );
    self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log(`[Service Worker] Eliminando caché antigua: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptar solicitudes y servir desde la caché si es posible
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('[Service Worker] Sirviendo desde caché:', event.request.url);
                    return response;
                }
                console.log('[Service Worker] Fetching desde la red:', event.request.url);
                return fetch(event.request);
            })
            .catch((error) => {
                console.error('[Service Worker] Error en fetch:', error);
                if (event.request.mode === 'navigate') {
                    return caches.match('/SERVIDORs/index.html'); // Página de respaldo en caso de fallo
                }
            })
    );
});
