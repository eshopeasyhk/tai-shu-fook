(function () {
  "use strict";

  var BASE = (function () {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      var m = src.match(/^(.*\/)js\/content\.js(?:\?.*)?$/);
      if (m) return m[1];
    }
    return "./";
  })();

  function waUrl(digits, text) {
    var d = String(digits || "").replace(/\D/g, "");
    if (d.length === 8) d = "852" + d;
    var q = text ? "?text=" + encodeURIComponent(text) : "";
    return "https://wa.me/" + d + q;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function setText(sel, text) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (text != null) el.textContent = text;
    });
  }

  function iconSvg(name) {
    var icons = {
      foot:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 6c-4 0-8 3-9 8-1 4 0 8 2 12l2 6c1 2 3 4 5 4s4-2 5-4l2-6c2-4 3-8 2-12-1-5-5-8-9-8zm0 4c2.5 0 4.5 1.8 5 4.5.6 3-.2 6-1.5 9l-1.8 5.5c-.4.8-1 1.5-1.7 1.5s-1.3-.7-1.7-1.5L21 23.5c-1.3-3-2.1-6-1.5-9C20 11.8 22 10 24 10z"/></svg>',
      lotus:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 10c2 4 2 7 0 10 2-1 5-1 8 0-2 3-5 5-8 6 3 1 6 3 8 6-3 1-6 1-8 0 2 3 2 6 0 10-2-4-2-7 0-10-2 1-5 1-8 0 2-3 5-5 8-6-3-1-6-3-8-6 3-1 6-1 8 0-2-3-2-6 0-10z"/></svg>',
      thai:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M14 34V14h4v8.5L24 14h4.5l-7 10 7.5 10H24l-6-8.5V34h-4zm20-20c4.4 0 7 2.8 7 7.2S38.4 28 34 28h-2v6h-4V14h6zm0 10c2 0 3-1.2 3-2.8S36 18 34 18h-2v6h2z"/></svg>',
      oil:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 6c-1 4-6 8-6 14a6 6 0 0 0 12 0c0-6-5-10-6-14zm0 22c-5 0-10 3-10 8v2h4v-2c0-2 2-4 6-4s6 2 6 4v2h4v-2c0-5-5-8-10-8z"/></svg>',
      herb:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M38 8c-12 2-20 8-24 16-2 4-3 8-3 12 4 0 8-1 12-3 8-4 14-12 16-24-4 2-8 4-11 8 4-1 7-3 10-9zM14 34c2-6 6-11 12-15-5 6-8 12-8 18-2-1-3-2-4-3z"/></svg>',
      combo:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M16 12a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm16 0a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM24 28c6 0 14 3 14 9v3H10v-3c0-6 8-9 14-9z"/></svg>'
    };
    return icons[name] || icons.lotus;
  }

  function applyTheme(theme) {
    if (!theme) return;
    var root = document.documentElement;
    var map = {
      bg: "--bg",
      surface: "--surface",
      surface2: "--surface-2",
      ink: "--ink",
      muted: "--muted",
      sage: "--sage",
      sageDark: "--sage-dark",
      clay: "--clay",
      gold: "--gold",
      whatsapp: "--wa",
      line: "--line"
    };
    Object.keys(map).forEach(function (k) {
      if (theme[k]) root.style.setProperty(map[k], theme[k]);
    });
    if (theme.bg) {
      var tc = document.querySelector('meta[name="theme-color"]');
      if (tc) tc.setAttribute("content", theme.bg);
    }
  }

  function applyMeta(meta) {
    if (!meta) return;
    if (meta.title) {
      document.title = meta.title;
      var ogt = document.querySelector('meta[property="og:title"]');
      if (ogt) ogt.setAttribute("content", meta.title);
    }
    if (meta.description) {
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", meta.description);
      var ogd = document.querySelector('meta[property="og:description"]');
      if (ogd) ogd.setAttribute("content", meta.description);
    }
  }

  function applyWaLinks(contact) {
    if (!contact || !contact.phoneDigits) return;
    document.querySelectorAll("a[data-cms-wa]").forEach(function (a) {
      var text = a.getAttribute("data-cms-wa-text") || contact.waDefaultText || "";
      a.href = waUrl(contact.phoneDigits, text);
    });
    setText("[data-cms='phoneDisplay']", contact.phoneDisplay || contact.phoneDigits);
    (function () {
      var dn = document.querySelector("[data-cms='demoNote']");
      if (dn) {
        if (contact.demoNote) {
          dn.textContent = contact.demoNote;
          dn.hidden = false;
        } else {
          dn.textContent = "";
          dn.hidden = true;
        }
      }
    })();
    setText("[data-cms='hours']", contact.hours || "");
    setText("[data-cms='area']", contact.area || "");
    setText("[data-cms='address']", contact.address || "");
    setText("[data-cms='contactTitle']", contact.title || "");
    setText("[data-cms='contactTagline']", contact.tagline || "");
  }

  function renderPriceBoard(board, contact) {
    var el = document.querySelector("[data-cms='priceBoard']");
    if (!el || !board) return;
    var digits = (contact && contact.phoneDigits) || "85251057090";
