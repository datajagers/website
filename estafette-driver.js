// Estafette: adempauze-statement wordt in-place vervangen door de diensten-kop;
// het woord "tooling" blijft staan en reist mee. Plus: scroll-reveal voor dienstenrijen.
(function () {
  if (window.__estafette) return; window.__estafette = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The runtime replaces nodes on re-render, so the lookups can't be hoisted
  // outright — but they can be cached and revalidated with isConnected, instead
  // of running seven querySelectors on every one of 60 frames a second.
  var els = null;
  function nodes() {
    if (els && els.track.isConnected && els.word.isConnected) return els;
    var t = document.querySelector('[data-es-track]');
    var st = document.querySelector('[data-es-stage]');
    var a = document.querySelector('[data-es-scene="1"]');
    var b = document.querySelector('[data-es-scene="2"]');
    var w = document.querySelector('[data-es-word]');
    var sa = document.querySelector('[data-es-slot="a"]');
    var sb = document.querySelector('[data-es-slot="b"]');
    els = (t && st && a && b && w && sa && sb)
      ? { track: t, stage: st, s1: a, s2: b, word: w, slotA: sa, slotB: sb }
      : null;
    return els;
  }

  function step() {
    requestAnimationFrame(step);
    if (document.hidden) return;  // a paused tab has nothing to scrub
    var n = nodes();
    if (!n) return;
    var track = n.track, stage = n.stage, s1 = n.s1, s2 = n.s2,
        word = n.word, slotA = n.slotA, slotB = n.slotB;
    if (!reduce && window.innerWidth >= 860) {
      var r = track.getBoundingClientRect();
      var vh = window.innerHeight;
      // The section occupies 300vh of a ~12000px page, so for most of the
      // scroll it is nowhere near the viewport. One layout read decides
      // whether the other three are worth taking.
      if (vh > 0 && (r.bottom < -vh || r.top > vh * 2)) return;
      var p = Math.max(0, Math.min(1, (-r.top) / Math.max(1, r.height - vh)));
      var sm = function (t) { return t * t * (3 - 2 * t); };
      // De sticky stage pint de hele track; de overgang moet dus ongeveer op
      // p=1 klaar zijn, anders scroll je na de animatie nog een scherm door met
      // een stilstaande kop. Was 0.42-0.78 — dat liet ruim 1200px dood pinnen.
      // Nu: korte aanloop, overgang over vrijwel de hele baan, klaar bij 0.96.
      var outT = sm(Math.max(0, Math.min(1, (p - 0.18) / 0.30)));
      var inT = sm(Math.max(0, Math.min(1, (p - 0.40) / 0.56)));
      var w = sm(Math.max(0, Math.min(1, (p - 0.22) / 0.70)));
      s1.style.opacity = (1 - outT).toFixed(3);
      s1.style.transform = 'translateY(' + (-outT * 5).toFixed(2) + 'vh)';
      s2.style.opacity = inT.toFixed(3);
      s2.style.transform = 'translateY(' + ((1 - inT) * 6).toFixed(2) + 'vh)';
      var sr = stage.getBoundingClientRect();
      var ra = slotA.getBoundingClientRect();
      var rb = slotB.getBoundingClientRect();
      var ax = ra.left - sr.left, ay = ra.top - sr.top;
      var by = rb.top - sr.top + (rb.height - ra.height) * 0.5 * w;
      var bx = rb.left - sr.left;
      var scale = 1 + (rb.height / Math.max(ra.height, 1) - 1) * w;
      word.style.opacity = '1';
      word.style.transform = 'translate(' + (ax + (bx - ax) * w).toFixed(1) + 'px,' + (ay + (by - ay) * w).toFixed(1) + 'px) scale(' + scale.toFixed(4) + ')';
      word.style.fontSize = getComputedStyle(slotA).fontSize;
      word.style.color = w > 0.55 ? '#93c3fd' : '#ffffff';
    } else {
      // mobiel/reduced: scenes statisch onder elkaar (CSS), loper verbergen
      word.style.opacity = '0';
    }
  }
  requestAnimationFrame(step);

  // scroll-reveal voor de dienstenrijen (gestaffeld per rij)
  var io = reduce ? null : new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.style.opacity = '1';
      en.target.style.transform = 'none';
      io.unobserve(en.target);
    });
  }, { threshold: 0.18 });
  function armRows() {
    var rows = document.querySelectorAll('[data-es-rij]');
    if (!rows.length) { setTimeout(armRows, 500); return; }
    if (reduce) return;
    rows.forEach(function (row, i) {
      row.style.opacity = '0';
      row.style.transform = 'translateY(30px)';
      row.style.transition = 'opacity 0.7s ease ' + (i % 2) * 0.08 + 's, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ' + (i % 2) * 0.08 + 's';
      io.observe(row);
    });
  }
  armRows();
})();
