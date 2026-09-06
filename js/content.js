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
    document.querySelectorAll("a[data-cms-maps]").forEach(function (a) {
      if (contact.mapsUrl) a.href = contact.mapsUrl;
      if (contact.mapsLabel) a.textContent = contact.mapsLabel;
    });
    var embed = document.querySelector("[data-cms='mapsEmbed']");
    if (embed && contact.mapsEmbed) {
      embed.src = contact.mapsEmbed;
    }

  }

  function renderPriceBoard(board, contact) {
    var el = document.querySelector("[data-cms='priceBoard']");
    if (!el || !board) return;
    var digits = (contact && contact.phoneDigits) || "85251057090";
    setText("[data-cms='priceBoardHeading']", board.heading || "價錢牌");
    setText("[data-cms='priceBoardLede']", board.lede || "");

    var rows = (board.items || [])
      .map(function (item) {
        var badge = item.badge
          ? '<span class="menu-badge">' + escapeHtml(item.badge) + "</span>"
          : "";
        return (
          '<li class="menu-row">' +
          '<div class="menu-name"><strong>' +
          escapeHtml(item.name || "") +
          "</strong>" +
          badge +
          "</div>" +
          '<div class="menu-dots" aria-hidden="true"></div>' +
          '<div class="menu-opts">' +
          escapeHtml(item.options || "") +
          "</div>" +
          "</li>"
        );
      })
      .join("");

    var href = waUrl(digits, board.waText || "");
    el.innerHTML =
      '<ol class="menu-board">' +
      rows +
      "</ol>" +
      '<div class="menu-board-cta">' +
      '<a class="btn btn-wa" href="' +
      href +
      '" target="_blank" rel="noopener" data-cms-wa data-cms-wa-text="' +
      escapeAttr(board.waText || "") +
      '">' +
      escapeHtml(board.waLabel || "WhatsApp 查詢價錢牌") +
      "</a>" +
      "</div>";
  }

  function packageCardHtml(p, digits) {
    var featured = p.featured ? " featured" : "";
    var badge = p.badge
      ? '<span class="card-badge">' + escapeHtml(p.badge) + "</span>"
      : "";
    var bullets = (p.bullets || [])
      .map(function (b) {
        return "<li>" + escapeHtml(b) + "</li>";
      })
      .join("");
    var href = waUrl(digits, p.waText || "");
    return (
      '<article class="pkg-card' +
      featured +
      '" id="pkg-' +
      escapeAttr(p.id || "") +
      '">' +
      '<div class="pkg-card-top">' +
      '<div class="pkg-icon">' +
      iconSvg(p.icon || "lotus") +
      "</div>" +
      badge +
      "</div>" +
      '<p class="pkg-cat">' +
      escapeHtml(p.category || p.nameEn || "") +
      "</p>" +
      "<h3>" +
      escapeHtml(p.nameZh || "") +
      "</h3>" +
      '<p class="pkg-summary">' +
      escapeHtml(p.summary || "") +
      "</p>" +
      '<p class="pkg-detail">' +
      escapeHtml(p.detail || "") +
      "</p>" +
      '<div class="pkg-price-block">' +
      '<span class="pkg-price"><span class="currency">HK$</span>' +
      escapeHtml(p.price || "") +
      "</span>" +
      (p.priceNote
        ? '<span class="pkg-price-note">' + escapeHtml(p.priceNote) + "</span>"
        : "") +
      "</div>" +
      (bullets ? '<ul class="pkg-bullets">' + bullets + "</ul>" : "") +
      '<a class="btn btn-wa" href="' +
      href +
      '" target="_blank" rel="noopener" data-cms-wa data-cms-wa-text="' +
      escapeAttr(p.waText || "") +
      '">預約此套票</a>' +
      "</article>"
    );
  }

  function renderPackages(packages, contact) {
    var el = document.querySelector("[data-cms='packages']");
    if (!el || !packages) return;
    var digits = (contact && contact.phoneDigits) || "85251057090";
    el.innerHTML = packages
      .map(function (p) {
        return packageCardHtml(p, digits);
      })
      .join("");
  }

  function renderTrust(trust) {
    var el = document.querySelector("[data-cms='trust']");
    if (!el || !trust) return;
    el.innerHTML = trust
      .map(function (t) {
        return (
          "<li><strong>" +
          escapeHtml(t.title || "") +
          "</strong><span>" +
          escapeHtml(t.body || "") +
          "</span></li>"
        );
      })
      .join("");
  }

  function renderHighlights(items) {
    var el = document.querySelector("[data-cms='aboutHighlights']");
    if (!el || !items) return;
    el.innerHTML = items
      .map(function (h) {
        return "<li>" + escapeHtml(h) + "</li>";
      })
      .join("");
  }

  function renderChips(chips) {
    var el = document.querySelector("[data-cms='heroChips']");
    if (!el || !chips) return;
    el.innerHTML = chips
      .map(function (c) {
        return "<li>" + escapeHtml(c) + "</li>";
      })
      .join("");
  }

  function therapistPhotoHtml(src, alt) {
    var safeSrc = escapeAttr(src);
    var safeAlt = escapeAttr(alt);
    var webp = /\.jpe?g$/i.test(src) ? src.replace(/\.jpe?g$/i, ".webp") : "";
    var imgTag =
      '<img src="' +
      safeSrc +
      '" alt="' +
      safeAlt +
      '" width="1536" height="1024" loading="lazy" decoding="async" />';
    var inner = webp
      ? '<picture><source type="image/webp" srcset="' +
        escapeAttr(webp) +
        '" />' +
        imgTag +
        "</picture>"
      : imgTag;
    return '<div class="therapist-photo">' + inner + "</div>";
  }

  function therapistCardHtml(t, digits) {
    var nameZh = t.nameZh || "";
    var nameEn = t.nameEn || "";
    var displayName = nameZh + (nameEn ? " " + nameEn : "");
    var specialties = (t.specialties || [])
      .map(function (s) {
        return '<li class="therapist-chip">' + escapeHtml(s) + "</li>";
      })
      .join("");
    var bioLines = String(t.bio || "")
      .split(/\n+/)
      .filter(Boolean)
      .map(function (line) {
        return "<p>" + escapeHtml(line) + "</p>";
      })
      .join("");
    var waText =
      t.waText ||
      "您好，想預約技師【" + displayName + "】";
    var href = waUrl(digits, waText);
    var img = t.image
      ? therapistPhotoHtml(t.image, t.imageAlt || displayName)
      : '<div class="therapist-photo therapist-photo--placeholder" aria-hidden="true"></div>';
    return (
      '<article class="therapist-card pkg-card" id="therapist-' +
      escapeAttr(t.id || "") +
      '">' +
      img +
      '<div class="therapist-body">' +
      '<p class="pkg-cat therapist-role">' +
      escapeHtml(t.role || "") +
      "</p>" +
      "<h3>" +
      escapeHtml(displayName) +
      "</h3>" +
      (specialties
        ? '<ul class="therapist-chips">' + specialties + "</ul>"
        : "") +
      '<div class="therapist-bio">' +
      bioLines +
      "</div>" +
      '<a class="btn btn-wa" href="' +
      href +
      '" target="_blank" rel="noopener" data-cms-wa data-cms-wa-text="' +
      escapeAttr(waText) +
      '">預約此技師</a>' +
      "</div>" +
      "</article>"
    );
  }

  function renderTherapists(therapists, contact, section, images) {
    var el = document.querySelector("[data-cms='therapists']");
    if (!el) return;
    if (section) {
      setText(
        "[data-cms='therapistsEyebrow']",
        section.eyebrow || "專業技師"
      );
      setText("[data-cms='therapistsHeading']", section.heading || "技師介紹");
      setText("[data-cms='therapistsLede']", section.lede || "");
      setText(
        "[data-cms='shopAmbientNote']",
        section.shopNote || "店內氛圍（燭光／精油）"
      );
    }
    if (!therapists || !therapists.length) {
      el.innerHTML = "";
    } else {
      var digits = (contact && contact.phoneDigits) || "85251057090";
      el.innerHTML = therapists
        .map(function (t) {
          return therapistCardHtml(t, digits);
        })
        .join("");
    }

    renderShopGallery(images);
  }

  function shopPictureHtml(src, webp, alt) {
    var img =
      '<img src="' +
      escapeAttr(src) +
      '" alt="' +
      escapeAttr(alt || "") +
      '" loading="lazy" decoding="async" />';
    if (webp) {
      return (
        '<picture><source type="image/webp" srcset="' +
        escapeAttr(webp) +
        '" />' +
        img +
        "</picture>"
      );
    }
    return img;
  }

  function renderShopGallery(images) {
    var el = document.querySelector("[data-cms='shopGallery']");
    if (!el || !images) return;
    var photos = images.shopPhotos || [];
    if (!photos.length) {
      el.innerHTML = "";
      return;
    }
    el.innerHTML = photos
      .map(function (p) {
        var caption = p.caption
          ? "<figcaption>" + escapeHtml(p.caption) + "</figcaption>"
          : "";
        return (
          '<figure class="shop-shot">' +
          shopPictureHtml(p.src, p.webp, p.alt) +
          caption +
          "</figure>"
        );
      })
      .join("");
  }

  function apply(data) {
    applyTheme(data.theme);
    applyMeta(data.meta);
    applyWaLinks(data.contact);

    if (data.brand) {
      setText("[data-cms='brandZh']", data.brand.zh);
      setText("[data-cms='brandEn']", data.brand.en);
      setText("[data-cms='brandTagline']", data.brand.tagline);
    }
    (function () {
      var badge = document.querySelector("[data-cms='starterBadge']");
      if (badge) {
        if (data.starterBadge) {
          badge.textContent = data.starterBadge;
          badge.hidden = false;
        } else {
          badge.textContent = "";
          badge.hidden = true;
        }
      }
    })();
    if (data.hero) {
      setText("[data-cms='heroEyebrow']", data.hero.eyebrow);
      setText("[data-cms='heroTitle']", data.hero.title);
      setText("[data-cms='heroLede']", data.hero.lede);
      renderChips(data.hero.chips);
    }
    if (data.images && data.images.hero) {
      var photo = document.querySelector(".hero-photo");
      if (photo) {
        photo.style.backgroundImage =
          'linear-gradient(160deg, rgba(13,10,8,0.28), rgba(13,10,8,0.42)), url("' +
          data.images.hero +
          '")';
        if (data.images.heroAlt) {
          photo.setAttribute("aria-label", data.images.heroAlt);
        }
      }
      setText("[data-cms='heroCredit']", data.images.heroCredit || "店舖實景");
    }
    if (data.images && data.images.about) {
      var aboutPhoto = document.querySelector("[data-cms='aboutPhoto']");
      if (aboutPhoto) {
        aboutPhoto.style.backgroundImage =
          'linear-gradient(160deg, rgba(13,10,8,0.15), rgba(13,10,8,0.45)), url("' +
          data.images.about +
          '")';
        aboutPhoto.style.backgroundSize = "cover";
        aboutPhoto.style.backgroundPosition = "center";
        aboutPhoto.innerHTML = "";
        if (data.images.aboutAlt) {
          aboutPhoto.setAttribute("aria-label", data.images.aboutAlt);
        }
      }
    }
    renderTrust(data.trust);
    renderPriceBoard(data.priceBoard, data.contact);
    renderPackages(data.packages, data.contact);
    renderTherapists(
      data.therapists,
      data.contact,
      data.therapistsSection,
      data.images
    );
    setText("[data-cms='pricingFootnote']", data.pricingFootnote);

    if (data.about) {
      setText("[data-cms='aboutKicker']", data.about.kicker);
      setText("[data-cms='aboutName']", data.about.name);
      setText("[data-cms='aboutRole']", data.about.role);
      setText("[data-cms='aboutBio']", data.about.bio);
      setText("[data-cms='aboutBio2']", data.about.bio2);
      renderHighlights(data.about.highlights);
    }
    if (data.contactSection) {
      setText("[data-cms='contactHeading']", data.contactSection.heading);
      setText("[data-cms='contactBody']", data.contactSection.body);
    }
    setText("[data-cms='footerTag']", data.footerTag);
    (function () {
      var note = document.querySelector("[data-cms='templateNote']");
      if (note) {
        if (data.templateNote) {
          note.textContent = data.templateNote;
          note.hidden = false;
        } else {
          note.textContent = "";
          note.hidden = true;
        }
      }
    })();

    document.documentElement.classList.add("cms-ready");
  }

  window.ShopContent = { apply: apply, waUrl: waUrl, base: BASE };

  fetch(BASE + "data/site.json?_=" + Date.now())
    .then(function (r) {
      if (!r.ok) throw new Error("site.json " + r.status);
      return r.json();
    })
    .then(apply)
    .catch(function (err) {
      console.warn("[content.js]", err);
    });
})();
