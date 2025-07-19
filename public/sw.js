const CACHE_NAME = 'efnu-cache-v1'
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/globe.svg',
  '/file.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg',
]

const ROUTES_TO_PRECACHE = ['/en', '/fi']



self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([...STATIC_ASSETS, ...ROUTES_TO_PRECACHE]))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request

  // Only GET requests
  if (req.method !== 'GET') return

  const acceptHeader = req.headers.get('accept') || ''

  if (acceptHeader.includes('text/html')) {
    // Handle dynamic routes like /en/page
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone)
          })
          return res
        })
        .catch(() => {
          // fallback to cache or offline.html
          return caches.match(req).then((cachedRes) => {
            return cachedRes || caches.match('/offline.html')
          })
        })
    )
  } else {
    // Handle static assets (JS, CSS, images)
    event.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached ||
          fetch(req)
            .then((res) => {
              if (
                req.url.startsWith(self.location.origin) &&
                req.url.match(/\.(js|css|png|svg|ico|woff2?|ttf|eot)$/)
              ) {
                const resClone = res.clone()
                caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone))
              }
              return res
            })
            .catch(() => undefined)
        )
      })
    )
  }
})


// === YOUR PUSH NOTIFICATION CODE (unchanged) ===

self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  event.waitUntil(clients.openWindow('https://testapppwanotification.netlify.app'))
})
