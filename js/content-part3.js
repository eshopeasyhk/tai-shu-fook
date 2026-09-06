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
      return;
    }
    var digits = (contact && contact.phoneDigits) || "85251057090";
    el.innerHTML = therapists
      .map(function (t) {
        return therapistCardHtml(t, digits);
      })
      .join("");

    var ambient = document.querySelector(".shop-ambient-photo");
    if (ambient && images && images.shopAmbient) {
      ambient.style.backgroundImage =
        'linear-gradient(160deg, rgba(13,10,8,0.25), rgba(13,10,8,0.55)), url("' +
        images.shopAmbient +
        '")';
      if (images.shopAmbientAlt) {
        ambient.setAttribute("aria-label", images.shopAmbientAlt);
      }
    }
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
          'linear-gradient(160deg, rgba(13,10,8,0.35), rgba(13,10,8,0.55)), url("' +
          data.images.hero +
          '")';
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
