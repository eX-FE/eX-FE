const CACHE_NAME = 'ex-twitter-v1';
const urlsToCache = [
  '/',
  '/home',
  '/explore',
  '/notifications',
  '/messages',
  '/profile',
  '/x-logo.svg',
  '/x-logo-white.png',
  '/_next/static/css/app/globals.css',
  '/offline.html'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache addAll failed:', error);
      })
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received', event);
  
  let notificationData = {
    title: 'eX Notification',
    body: 'You have a new notification',
    icon: '/x-logo-white.png',
    badge: '/x-logo.svg',
    tag: 'ex-notification',
    requireInteraction: false,
    actions: []
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data
      };
    } catch (error) {
      console.error('Service Worker: Error parsing push notification data', error);
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    requireInteraction: notificationData.requireInteraction,
    actions: notificationData.actions,
    data: notificationData.data || {},
    vibrate: [200, 100, 200],
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();

  const notificationData = event.notification.data || {};
  let urlToOpen = '/home';

  // Determine URL based on notification type
  switch (notificationData.type) {
    case 'new_follower':
      urlToOpen = `/profile/${notificationData.username}`;
      break;
    case 'tweet_like':
    case 'tweet_reply':
      urlToOpen = `/tweets/${notificationData.tweetId || ''}`;
      break;
    case 'mention':
      urlToOpen = `/notifications`;
      break;
    default:
      urlToOpen = '/home';
  }

  // Handle action clicks
  if (event.action) {
    switch (event.action) {
      case 'view_profile':
        urlToOpen = `/profile/${notificationData.username}`;
        break;
      case 'reply':
        urlToOpen = `/tweets/${notificationData.tweetId}`;
        break;
      default:
        break;
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              url: urlToOpen,
              data: notificationData
            });
            return client.focus();
          }
        }
        
        // If app is not open, open new window
        if (clients.openWindow) {
          return clients.openWindow(self.location.origin + urlToOpen);
        }
      })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // If both cache and network fail, show offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
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

// Background Sync for offline tweet posting
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-tweets') {
    console.log('Background sync for tweets');
    event.waitUntil(syncTweets());
  }
});

async function syncTweets() {
  try {
    // Get pending tweets from IndexedDB
    const pendingTweets = await getPendingTweets();
    
    for (const tweet of pendingTweets) {
      try {
        await fetch('/api/tweets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tweet.token}`
          },
          body: JSON.stringify(tweet.data)
        });
        
        // Remove from pending list
        await removePendingTweet(tweet.id);
      } catch (error) {
        console.error('Failed to sync tweet:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getPendingTweets() {
  // Placeholder - would implement IndexedDB storage
  return [];
}

async function removePendingTweet(id) {
  // Placeholder - would implement IndexedDB removal
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from eX Twitter',
    icon: '/x-logo-white.png',
    badge: '/x-logo.svg',
    tag: 'ex-notification',
    renotify: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/dismiss-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('eX Twitter', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/notifications')
    );
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
