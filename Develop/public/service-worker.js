const CACHE_NAME= 'budget-tracker-cache-v1';
const APP_PREFIX= 'budget-tracker-cache';
const DATA_CACHE_NAME= 'data-cache-v1';

const FILES_TO_CACHE = [
    '/',
    './index.html',
    './manifest.json',
    './css/style.css',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
    './js/idb.js',
    './js/index.js'
];

// Installing the service worker
self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("intalling cache : " + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

// Clear out old data from the cache
self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function (key) { 
                return key.indexOf(APP_PREFIX);
        })
        // Adding of current cahce name to keeplist
        cacheKeepList.push(CACHE_NAME)

        return Promise.all(keyList.map(function (key, i) {
            if (cacheKeepList.indexOf(key) === -1) {
                console.log("deleting cache : " + keyList[i]);
                return cacheKeepList.delete(keyList[i])
            }
        })
    )
})
    )
    self.clients.claim()
})

// Information from cache
self.addEventListener("fetch", function (evt) {
    console.log("fetch request: " + evt.request.url)
    evt.responsWith(
        caches.match(evt.request).then(function (request) {
            if (request) {
                console.log("respinding with cache : " + evt.request.url)
                return request
            } else {
                console.log("file is not cached, fetching : " + evt.request.url)
                return fetch(evt.request)
            }
        })
    )
})