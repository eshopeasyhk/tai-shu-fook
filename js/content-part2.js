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
      ? '<div class="therapist-photo" style="background-image:url(\'' +
        escapeAttr(t.image) +
        "')\" role=\"img\" aria-label=\"" +
        escapeAttr(t.imageAlt || displayName) +
        '"></div>'
      : '<div class="therapist-photo therapist-photo--placeholder" aria-hidden="true"></div>';
    return (
