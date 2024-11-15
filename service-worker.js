// Nombre del caché
const CACHE_NAME = 'offline-cache-v1';

// Archivos que se deben almacenar en caché
const FILES_TO_CACHE = [
    '/SERVIDOR/',
    '/SERVIDOR/index.html',
    '/SERVIDOR/manifest.json',
    '/SERVIDOR/icons/actualizar.jpg',
    '/SERVIDOR/icons/ajustes3.jpg',
    '/SERVIDOR/icons/comprobar.jpg',
    '/SERVIDOR/icons/controlar.jpg',
    '/SERVIDOR/icons/descargar.jpg',
    '/SERVIDOR/icons/mas.jpg',
    '/SERVIDOR/icons/desktop.png',
    '/SERVIDOR/icons/mobile.png',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(FILES_TO_CACHE);
            })
            .catch((error) => {
                console.error('Error al agregar archivos al caché:', error);
            })
    );
    self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptar las solicitudes para servir desde la caché si están disponibles
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
            .catch(() => caches.match('/SERVIDOR/index.html'))
    );
});