const CACHE_NAME = 'silkhat3d-cache-v1';
const urlsToCache = [
  '/silkhat3d/',
  '/silkhat3d/index.html',
  '/silkhat3d/img-afternoon.jpg',
  '/silkhat3d/img-morning.jpg',
  '/silkhat3d/img-sunset1.jpg',
  '/silkhat3d/img-sunset2.jpg',
  '/silkhat3d/img-night1.jpg',
  '/silkhat3d/icon.ico'
];

// インストール時にキャッシュを保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// オフライン時はキャッシュから返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// プッシュ通知を受け取ったときの処理
self.addEventListener('push', (event) => {
  let data = {
    title: 'SilkHat_3D-WalkingSimulator',
    body: '新しいお知らせがあります！',
    url: 'https://silkhat95.github.io/silkhat3d/'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/silkhat3d/icon.ico',
    badge: '/silkhat3d/icon.ico',
    data: { url: data.url || 'https://silkhat95.github.io/silkhat3d/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知をクリックしたときの処理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
