self.addEventListener('install', function(event){
    console.log('ServiceWorker installed');
    event.waitUntil(
      caches.open('static')
        .then(function(cache){
          cache.addAll([
            '.',
            'index.html',
            'js/main.js',
            'css/main.css',
            'img/96x96.png',
            'img/144x144.png',
            'img/256x256.png',
            'img/512x512.png',
            'img/arrow_up.png',
            'img/arrow_down.png',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
            'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css',
            'https://code.jquery.com/jquery-3.7.1.min.js',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js'
          ]);
        })
    );
  });
  
  self.addEventListener('activate', function(){
    console.log('ServiceWorker activated');
  });
  
  self.addEventListener('fetch', function(event){
    event.respondWith(
      caches.match(event.request)
        .then(function(res){
          if (res) {
            return res;
          } else {
            return fetch(event.request);
          }
        })
    );
  });