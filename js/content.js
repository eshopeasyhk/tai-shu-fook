(function(){
  "use strict";
  var parts=["js/content-part1.js","js/content-part2.js","js/content-part3.js"];
  Promise.all(parts.map(function(u){
    return fetch(u+"?_="+Date.now()).then(function(r){
      if(!r.ok) throw new Error(u+" "+r.status);
      return r.text();
    });
  })).then(function(chunks){
    (0,eval)(chunks.join(""));
  }).catch(function(e){ console.warn("[content.js]", e); });
})();
