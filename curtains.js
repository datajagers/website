// curtains.js — "Curtains: Scope" style section-transition.
// A row of vertical slats (matching the hero's sliced photo) drops in to cover
// the viewport, the page jumps to the target while hidden, then the slats lift
// away to reveal it. Exposes window.__curtains.{to(y), toEl(id, offset)}.
// Honours prefers-reduced-motion (instant jump, no slats).
(function () {
  if (window.__curtains) return;

  var N = 7;                 // slat count — mirrors the hero peel
  var STAGGER = 40;          // ms between slats
  var COVER = 320;           // ms per slat, drop-in
  var REVEAL = 360;          // ms per slat, lift-away
  var HOLD = 110;            // ms held fully covered while the page jumps
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var overlay = null, panels = [], busy = false;

  function build() {
    overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    var s = overlay.style;
    s.position = 'fixed'; s.inset = '0'; s.zIndex = '2000';
    s.overflow = 'hidden';
    s.pointerEvents = 'none';
    var w = 100 / N;
    for (var i = 0; i < N; i++) {
      var p = document.createElement('div');
      var ps = p.style;
      ps.position = 'absolute';
      ps.top = '0'; ps.bottom = '0';
      ps.left = (i * w) + '%';
      ps.width = (w + 0.6) + '%';   // slight overlap kills the sub-pixel seams
      ps.transformOrigin = 'top';
      ps.transform = 'scaleY(0)';
      // Kleur van de diensten-band — het groene verloop was een restant van
      // het oude (vervallen) groene designsysteem.
      ps.background = '#1D1D1D';
      ps.willChange = 'transform';
      ps.backfaceVisibility = 'hidden';
      overlay.appendChild(p);
      panels.push(p);
    }
    document.body.appendChild(overlay);
  }

  function run(from, to, dur) {
    return Promise.all(panels.map(function (p, i) {
      return p.animate(
        [{ transform: 'scaleY(' + from + ')' }, { transform: 'scaleY(' + to + ')' }],
        { duration: dur, delay: i * STAGGER, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }
      ).finished;
    }));
  }

  // document-space top of a section's eyebrow tag (the small uppercase pill at its
  // start), falling back to the section top. This is what we align under the navbar.
  function eyebrowTop(sec) {
    var ref = null;
    var els = sec.querySelectorAll('span,div,p');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var t = (el.textContent || '').trim();
      if (t.length < 3 || t.length > 44) continue;
      var cs = getComputedStyle(el);
      if (cs.textTransform === 'uppercase' && parseFloat(cs.letterSpacing) > 0.4) { ref = el; break; }
    }
    if (!ref) ref = sec;
    // expliciet anker wint van de heuristiek: [data-nav-anchor] op de sectie
    // zelf betekent "land op de sectietop" (de heuristiek pakte in #diensten
    // de eerste uppercase deliverable-regel in plaats van het begin)
    if (sec.hasAttribute && sec.hasAttribute('data-nav-anchor')) ref = sec;
    var expl = sec.querySelector && sec.querySelector('[data-nav-anchor]');
    if (expl) ref = expl;
    return ref.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
  }

  function resolve(t) { return typeof t === 'function' ? t() : t; }

  // Harde landingsregel: de vorige sectie mag na een overgang nooit in beeld
  // staan. Dat betekent: sectietop strak onder de vaste balk, met 1px overlap
  // zodat subpixel-naden niet doorschemeren. De balk wordt live gemeten (per
  // settle-iteratie) in plaats van hardcoded, zodat de regel op elk breakpoint
  // en na balkwijzigingen blijft gelden.
  function bgAlpha(str) {
    if (!str || str === 'transparent') return 0;
    var m = str.match(/rgba?\(([^)]+)\)/);            // rgb()/rgba()
    if (m) { var p = m[1].split(','); return p.length > 3 ? parseFloat(p[3]) : 1; }
    m = str.match(/color\([^)]*\/\s*([\d.]+)\s*\)/); // color(srgb r g b / a)
    if (m) return parseFloat(m[1]);
    return 1; // hex/keyword: dekkend
  }
  function landOffset() {
    var bar = document.querySelector('[data-mn-bar]');
    if (bar) {
      var r = bar.getBoundingClientRect();
      // de minibalk is doorzichtig (alleen backdrop-blur): de vorige sectie
      // schijnt er dwars doorheen, dus alleen 'sectietop op de viewporttop'
      // voldoet aan de regel. Een dekkende balk zou wél ruimte verdienen.
      if (bgAlpha(getComputedStyle(bar).backgroundColor) < 0.98) return 0;
      if (r.height > 0 && r.top <= 1 && r.bottom > 0) return r.bottom - 1;
    }
    return 0;
  }

  // Secties met een sticky pin (#diensten, gevoel, klantverhalen) meten vanaf
  // onder de pin in hun gestuckte positie — tot ~1600px onder hun natuurlijke
  // top. Eén scrollTo verandert die meting, dus itereren tot hij stilstaat.
  function settleScroll(target) {
    var y = 0;
    for (var i = 0; i < 4; i++) {
      y = resolve(target);
      window.scrollTo(0, y);
      // getBoundingClientRect in resolve() forceert layout; klaar zodra de
      // hermeting binnen 2px van de vorige stap blijft
      if (Math.abs(resolve(target) - y) < 2) break;
    }
  }

  function to(target) {
    if (reduce || !('animate' in document.createElement('div'))) {
      settleScroll(target);
      return Promise.resolve();
    }
    if (busy) return Promise.resolve();
    busy = true;
    if (!overlay) build();
    panels.forEach(function (p) { p.style.transformOrigin = 'top'; p.style.transform = 'scaleY(0)'; });
    overlay.style.pointerEvents = 'auto';
    return run(0, 1, COVER).then(function () {
      settleScroll(target);   // itereer verborgen — sticky pins verschuiven de meting
      return new Promise(function (r) { setTimeout(r, HOLD); });
    }).then(function () {
      return run(1, 0, REVEAL);
    }).then(function () {
      overlay.style.pointerEvents = 'none';
      busy = false;
    });
  }

  function toEl(id, offset) {
    if (!document.getElementById(id)) return Promise.resolve();
    return to(function () {
      var sec = document.getElementById(id);
      if (!sec) return (window.scrollY || 0);
      var off = (offset == null) ? landOffset() : offset;
      return Math.max(0, eyebrowTop(sec) - off);
    });
  }

  // ---------------------------------------------------------------------------
  // Preloader: a coal-black screen with a large white logo, shown immediately to
  // hide initial component flicker, then curtained away left->right once loaded.
  // ---------------------------------------------------------------------------
  var PL_BG = '#1d1d1d';
  var PL_LOGO = window.__preloaderLogo || 'assets/logo_wordmark.svg';
  var plStart = Date.now();
  var plRevealed = false;

  // 1c "Horizon": het woordmerk rijst boven de basislijn uit (line-reveal);
  // bij gereed spant een haarlijn zich over het midden en splijt het doek
  // naar boven en onder open (split-doors exit).
  // "Vizier": twee haarlijnen zoeken en vergrendelen op het middelpunt, de
  // ruit landt op het kruis, het woordmerk zet zich eronder. De exit is een
  // iris die vanuit het vergrendelpunt opent. Alles composietor-only.
  function plEl(tag, css) {
    var e = document.createElement(tag);
    for (var k in css) e.style[k] = css[k];
    e.setAttribute('aria-hidden', 'true');
    return e;
  }
  function buildPreloader() {
    var pl = document.getElementById('dj-preloader');
    if (!pl) {
      pl = document.createElement('div');
      pl.id = 'dj-preloader';
      var s0 = pl.style;
      s0.position = 'fixed'; s0.inset = '0'; s0.zIndex = '3000'; s0.overflow = 'hidden';
      (document.body || document.documentElement).appendChild(pl);
    }
    if (pl.querySelector('.dj-pl-lv')) return;   // vizier al opgebouwd
    // de synchrone pre-paint heeft de cover meestal al neergezet — hergebruik
    var cover = pl.querySelector('.dj-pl-cover');
    if (!cover) {
      cover = plEl('div', { position: 'absolute', inset: '0', background: PL_BG,
        willChange: 'clip-path' });
      cover.className = 'dj-pl-cover';
      pl.appendChild(cover);
    }
    var lineV = plEl('span', { position: 'absolute', left: '50%', top: '0', bottom: '0',
      width: '1px', background: 'rgba(255,255,255,0.5)',
      transform: 'translateX(-6vw) scaleY(0)', transformOrigin: 'top', willChange: 'transform' });
    lineV.className = 'dj-pl-lv';
    var lineH = plEl('span', { position: 'absolute', top: '50%', left: '0', right: '0',
      height: '1px', background: 'rgba(255,255,255,0.5)',
      transform: 'translateY(5vh) scaleX(0)', transformOrigin: 'left', willChange: 'transform' });
    lineH.className = 'dj-pl-lh';
    var dia = plEl('span', { position: 'absolute', left: '50%', top: '50%',
      width: '11px', height: '11px', background: '#93c3fd',
      transform: 'translate(-50%,-50%) rotate(45deg) scale(0)', willChange: 'transform' });
    dia.className = 'dj-pl-dia';
    var word = plEl('span', { position: 'absolute', left: '50%', top: '60%',
      width: 'min(380px, 52vw)', aspectRatio: '1157 / 127', background: '#ffffff',
      transform: 'translateX(-50%) translateY(10px)', opacity: '0',
      willChange: 'transform, opacity' });
    word.className = 'dj-pl-word';
    word.setAttribute('aria-label', 'datajagers');
    var m = 'url("' + PL_LOGO + '") center/contain no-repeat';
    word.style.webkitMask = m; word.style.mask = m;
    cover.appendChild(lineV); cover.appendChild(lineH);
    cover.appendChild(dia); cover.appendChild(word);
  }
  var plIntroStarted = false;
  var PL_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  function startPreloadIntro() {
    if (plIntroStarted) return;
    var pl = document.getElementById('dj-preloader');
    if (!pl) return;
    var lv = pl.querySelector('.dj-pl-lv'), lh = pl.querySelector('.dj-pl-lh');
    var dia = pl.querySelector('.dj-pl-dia'), word = pl.querySelector('.dj-pl-word');
    if (!lv || !word) return;
    plIntroStarted = true;
    var canAnim = !reduce && ('animate' in document.createElement('div'));
    if (!canAnim) {
      // statisch: alleen het woordmerk, gecentreerd
      if (lh) lh.style.display = 'none';
      lv.style.display = 'none';
      if (dia) dia.style.display = 'none';
      word.style.top = '50%';
      word.style.transform = 'translateX(-50%) translateY(-50%)';
      word.style.opacity = '1';
      return;
    }
    // zoeken: de lijnen tekenen zich naast/onder het doel...
    lv.animate(
      [{ transform: 'translateX(-6vw) scaleY(0)' }, { transform: 'translateX(-6vw) scaleY(1)' }],
      { duration: 420, delay: 150, easing: PL_EASE, fill: 'forwards' });
    lh.animate(
      [{ transform: 'translateY(5vh) scaleX(0)' }, { transform: 'translateY(5vh) scaleX(1)' }],
      { duration: 420, delay: 320, easing: PL_EASE, fill: 'forwards' });
    // ...en vergrendelen op het middelpunt
    lv.animate(
      [{ transform: 'translateX(-6vw) scaleY(1)' }, { transform: 'translateX(0) scaleY(1)' }],
      { duration: 520, delay: 640, easing: PL_EASE, fill: 'forwards' });
    lh.animate(
      [{ transform: 'translateY(5vh) scaleX(1)' }, { transform: 'translateY(0) scaleX(1)' }],
      { duration: 520, delay: 800, easing: PL_EASE, fill: 'forwards' });
    // de ruit landt op het kruis
    dia.animate(
      [{ transform: 'translate(-50%,-50%) rotate(45deg) scale(0)' },
       { transform: 'translate(-50%,-50%) rotate(45deg) scale(1)' }],
      { duration: 380, delay: 1260, easing: PL_EASE, fill: 'forwards' });
    // woordmerk zet zich eronder
    word.animate(
      [{ opacity: 0, transform: 'translateX(-50%) translateY(10px)' },
       { opacity: 1, transform: 'translateX(-50%) translateY(0)' }],
      { duration: 450, delay: 1480, easing: PL_EASE, fill: 'forwards' });
  }

  // Deep-links: de secties renderen client-side, dus de native hash-sprong
  // vindt bij parse nog niets en blijft op 0 staan. Land het anker daarom
  // terwijl de preloader nog dekt — zelfde offset en settle als de nav.
  function landHash(done) {
    var id = (location.hash || '').slice(1);
    if (!id) { done(); return; }
    var tries = 0;
    (function attempt() {
      var sec = document.getElementById(id);
      if (sec) {
        settleScroll(function () { return Math.max(0, eyebrowTop(sec) - landOffset()); });
        done(); return;
      }
      if (++tries > 10) { done(); return; }   // anker bestaat niet — gewoon onthullen
      setTimeout(attempt, 150);
    })();
  }

  function revealPreload() {
    var pl = document.getElementById('dj-preloader');
    if (!pl || plRevealed) return;
    plRevealed = true;
    pl.style.pointerEvents = 'none';
    landHash(function () { revealPreloadNow(pl); });
  }
  function revealPreloadNow(pl) {
    var canAnim = !reduce && ('animate' in document.createElement('div'));
    if (!canAnim) {
      pl.style.transition = 'opacity .45s ease';
      pl.style.opacity = '0';
      setTimeout(function () { if (pl.parentNode) pl.parentNode.removeChild(pl); }, 480);
      return;
    }
    var cover = pl.querySelector('.dj-pl-cover') || pl;
    // iris: het doek opent vanuit het vergrendelpunt; lijnen, ruit en woordmerk
    // zitten ín de cover en rijden mee de clip uit.
    var a = cover.animate(
      [{ clipPath: 'circle(150% at 50% 50%)' }, { clipPath: 'circle(0% at 50% 50%)' }],
      { duration: 760, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
    var done = function () { if (pl.parentNode) pl.parentNode.removeChild(pl); };
    if (a.finished && a.finished.then) a.finished.then(done).catch(done);
    else setTimeout(done, 820);
    setTimeout(done, 1200); // vangnet
  }

  function schedulePreloadReveal() {
    var MIN = 2150, CAP = 4500;   // intro (~1.9s) maakt af vóór de iris
    var fire = function () {
      setTimeout(revealPreload, Math.max(0, MIN - (Date.now() - plStart)));
    };
    var afterLoad = function () {
      var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      fonts.then(function () { setTimeout(fire, 350); });
    };
    if (document.readyState === 'complete') afterLoad();
    else window.addEventListener('load', afterLoad, { once: true });
    setTimeout(revealPreload, CAP); // hard safety net
  }

  buildPreloader();
  startPreloadIntro();
  // De bundel vervangt documentElement (self-extracting template); een
  // preloader die vóór die swap is gebouwd sneuvelt daarbij. Waak tot de
  // reveal: staat de cover er kaal bij (helmet-pre-paint) of ontbreekt hij,
  // dan opnieuw aankleden en de intro herstarten.
  var plWatch = setInterval(function () {
    if (plRevealed) { clearInterval(plWatch); return; }
    var pl = document.getElementById('dj-preloader');
    if (!pl || !pl.querySelector('.dj-pl-lv')) {
      // de swap nam de geanimeerde elementen mee: intro-vlag terug en de
      // choreografie-klok herbasen, anders weigert de run-once-guard de
      // herstart en knipt MIN de intro af
      plIntroStarted = false;
      plStart = Date.now();
      buildPreloader();
      startPreloadIntro();
    }
  }, 120);   // ook wanneer het synchrone helmet-script de cover al bouwde
  // dev-vlag: ?plhold laat de preloader staan (intro speelt, iris wacht) —
  // voor het beoordelen en tunen van de vizier-fases
  if (!/[?&]plhold/.test(location.search)) schedulePreloadReveal();

  // Interne paginalink: dek het scherm en navigeer dan — de nieuwe pagina
  // neemt het over met zijn eigen coal-cover + vizier, dus geen reveal hier.
  function coverAndGo(url) {
    if (reduce || !('animate' in document.createElement('div'))) { location.href = url; return; }
    if (busy) return;
    busy = true;
    if (!overlay) build();
    panels.forEach(function (p) { p.style.transformOrigin = 'top'; p.style.transform = 'scaleY(0)'; });
    overlay.style.pointerEvents = 'auto';
    run(0, 1, COVER).then(function () { location.href = url; });
  }

  // terug via bfcache: de pagina komt terug mét gesloten gordijn — open het
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && overlay) {
      panels.forEach(function (p) { p.style.transform = 'scaleY(0)'; });
      overlay.style.pointerEvents = 'none';
      busy = false;
    }
  });

  // Eén interceptor voor alle pagina's: sectielinks door het gordijn naar hun
  // anker, interne .html-links via coverAndGo. Externe links, mailto, nieuwe
  // tabs, downloads en de skip-link blijven native.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    if (a.classList.contains('dj-skip')) return;   // toegankelijkheid: direct springen
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') {
      if (href.length < 2 || !document.getElementById(href.slice(1))) return;
      e.preventDefault();
      toEl(href.slice(1));
      return;
    }
    if (!/^[a-z0-9._-]+\.html(#[\w-]*)?$/i.test(href)) return;
    e.preventDefault();
    coverAndGo(a.href);
  });

  window.__curtains = { to: to, toEl: toEl, revealPreload: revealPreload };
})();
