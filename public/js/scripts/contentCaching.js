/*

I am leaving this here so you could reuse some parts of it. Be aware of what you are doing
------------------------------------------------------------------------------------------
var pleaseCache = function(url) {
  if (navigator.serviceWorker.controller && url) {
    navigator.serviceWorker.controller.postMessage({
      "command": "pleaseCache",
      "url": url
    });
  }
}

var articlesToCache = function(){
  $('a.articleBox').each(function(){
    pleaseCache($(this).attr('href'));
  });
}

var updateSectionsList = function(){
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
  var open = indexedDB.open("sections-cache", 1);

  open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("store", {keyPath: "url"});
    var index = store.createIndex("url", "url", {unique: true});
  };

  open.onsuccess = function() {
    var db = open.result;
    var store = db.transaction("store", "readwrite").objectStore("store");
    $("#nav a").each(function(){
      //.add does not overwrite if record exists
      store.add({url: 'https://'+window.location.hostname+$(this).attr('href'), cached: 0});
      // dev env
      store.add({url: 'https://'+window.location.hostname+'/app_dev.php'+$(this).attr('href'), cached: 0});
    });
  }

}

var handleOffline = function(){
  var open = indexedDB.open("sections-cache", 1);

  open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("store", {keyPath: "url"});
    var index = store.createIndex("url", "url", {unique: true});
  };

  open.onsuccess = function() {
    var db = open.result;
    var store = db.transaction("store", "readwrite").objectStore("store");
    var index = store.index('url');
    var now = Date.now();
    var minutes15 = 15 * 60 * 1000;

    $('#nav a, #mobileNav a').addClass('offline');

    index.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {
        // cached at all + cached less than 15 minutes ago
        if(cursor.value.cached && (now - cursor.value.timestamp) < minutes15 ){
          var url = cursor.value.url;
          url = url.replace('https://','').replace('/app_dev.php','').replace(window.location.hostname,'');
          $('#nav a[href="'+url+'"], #mobileNav a[href="'+url+'"]').removeClass('offline');
        }

        cursor.continue();
      }
    };
  };

}



$(window).on('load', function(){
  articlesToCache();
  updateSectionsList();
  if(!navigator.onLine) handleOffline();
});

// offline indicator for uncached sections
window.addEventListener("offline", function(e) {
  handleOffline();
});

window.addEventListener("online", function(e) {
  $('.offline').removeClass('offline');
});

*/