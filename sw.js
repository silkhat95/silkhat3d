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
self.addEventListener("push", (event) => {
  let data = { title: "お知らせ", body: "新しい更新があります。", url: "/" };
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(targetUrl));
});
