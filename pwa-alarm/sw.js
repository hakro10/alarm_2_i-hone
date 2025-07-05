const CACHE_NAME = 'alarm-app-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './icon-192.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Handle background sync for alarms
self.addEventListener('sync', (event) => {
    if (event.tag === 'alarm-sync') {
        event.waitUntil(
            // Sync alarm data
            console.log('Background sync for alarms')
        );
    }
});

// Handle push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Alarm notification',
        icon: './icon-192.png',
        badge: './icon-72.png',
        vibrate: [200, 100, 200],
        tag: 'alarm',
        requireInteraction: true,
        actions: [
            {
                action: 'snooze',
                title: 'Snooze',
                icon: './icon-72.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: './icon-72.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Alarm', options)
    );
});

// Handle notification actions
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'snooze') {
        // Handle snooze action
        console.log('Snooze action clicked');
    } else if (event.action === 'dismiss') {
        // Handle dismiss action
        console.log('Dismiss action clicked');
    } else {
        // Handle notification click (open app)
        event.waitUntil(
            clients.openWindow('./')
        );
    }
});