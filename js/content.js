(function () {
  "use strict";
  fetch("https://eshopeasyhk.github.io/massage-shop-demo/js/content.js?_=" + Date.now())
    .then(function (r) {
      if (!r.ok) throw new Error("demo content.js " + r.status);
      return r.text();
    })
    .then(function (code) {
      var patched = code.replace(
        /var BASE = \(function \(\) \{[\s\S]*?\}\)\(\);/,
        'var BASE = "./";'
      );
      (0, eval)(patched);
    })
    .catch(function (err) {
      console.warn("[content.js loader]", err);
    });
})();
