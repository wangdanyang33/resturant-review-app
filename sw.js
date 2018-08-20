var CACHE = 'network-or-cache';
var urlsToCache = ['/', 'data/restaurants.json', '/restaurant.html', '/css/styles.css', '/js/dbhelper.js', '/js/restaurant_info.js', '/js/main.js'];
self.addEventListener('install', function (event) {
    console.log('Service worker is being installed.');
    event.waitUntil(caches.open(CACHE).then(function (cache) {
        return cache.addAll(urlsToCache);
    }));
});

function fromNetwork(request) {
    return new Promise(function (fulfill, reject) {
        fetch(request).then(function (response) {
            fulfill(response);
        }, reject);
    });
}
function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

self.addEventListener('fetch', function (event) {
    event.respondWith(fromCache(event.request).catch(function () {
        return fromNetwork(event.request)
    }));
});
