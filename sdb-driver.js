// Scroll-choreografie Strategische duidelijkheid B (geladen vanuit hoofdpagina-helmet én sectie-helmet)
(function () {
  if (window.__sdbdrv) return; window.__sdbdrv = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var q = function (s) { return document.querySelector(s); };
  function scrub() {
    if (reduce || window.innerWidth < 860) return;
    var kop = q('[data-sdb-kop]');
    if (!kop) return;
    var sec = kop.closest('section');
    if (!sec) return;
    var r = sec.getBoundingClientRect();
    var vh = window.innerHeight;
    var runway = Math.max(1, r.height - vh);
    var p = Math.max(0, Math.min(1, (-r.top) / runway));
    var eo = function (t) { return 1 - Math.pow(1 - t, 3); };
    var seg = function (a, b) { return eo(Math.max(0, Math.min(1, (p - a) / (b - a)))); };
    // kopregel + foto zetten zich neer
    var kopregel = q('[data-sdb-kopregel]');
    if (kopregel) { var tk = seg(0, 0.12); kopregel.style.opacity = tk.toFixed(3); kopregel.style.transform = 'translateY(' + ((1 - tk) * 16).toFixed(1) + 'px)'; }
    var foto = q('[data-sdb-foto]');
    if (foto) { var tf = seg(0.02, 0.18); foto.style.opacity = tf.toFixed(3); foto.style.transform = 'translateY(' + ((1 - tf) * 4).toFixed(2) + 'vh) scale(' + (0.97 + tf * 0.03).toFixed(4) + ')'; }
    // lichte parallax in het beeld, doorlopend
    var img = q('[data-sdb-img]');
    if (img) img.style.transform = 'translateY(' + ((p - 0.5) * -4).toFixed(2) + 'vh)';
    // kop schrijft zich (wipe links -> rechts)
    var tw = seg(0.07, 0.26);
    kop.style.clipPath = 'inset(-2% ' + ((1 - tw) * 100).toFixed(2) + '% -2% -2%)';
    kop.style.opacity = tw > 0 ? '1' : '0';
    // intro
    var intro = q('[data-sdb-intro]');
    if (intro) { var ti = seg(0.22, 0.36); intro.style.opacity = ti.toFixed(3); intro.style.transform = 'translateY(' + ((1 - ti) * 18).toFixed(1) + 'px)'; }
    // kolommen één voor één
    [1, 2, 3].forEach(function (n, i) {
      var k = q('[data-sdb-kol="' + n + '"]');
      if (!k) return;
      var t = seg(0.3 + i * 0.08, 0.42 + i * 0.08);
      k.style.opacity = t.toFixed(3);
      k.style.transform = 'translateY(' + ((1 - t) * 22).toFixed(1) + 'px)';
    });
    // CTA als slot
    var cta = q('[data-sdb-cta]');
    if (cta) { var tc = seg(0.54, 0.65); cta.style.opacity = tc.toFixed(3); cta.style.transform = 'translateY(' + ((1 - tc) * 14).toFixed(1) + 'px)'; }
  }
  var pending = false;
  function onS() {
    if (pending) return; pending = true;
    var done = function () { if (!pending) return; pending = false; scrub(); };
    if (window.requestAnimationFrame) window.requestAnimationFrame(done);
    setTimeout(done, 80); // fallback: rAF kan gethrottled zijn (achtergrond/embedded)
  }
  window.addEventListener('scroll', onS, { passive: true });
  window.addEventListener('resize', onS);
  var io = reduce ? null : new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('sdb-in'); io.unobserve(en.target); } });
  }, { threshold: 0.2 });
  // adempauze-statement in Herkenbaar: gestaffelde reveal
  var ioA = reduce ? null : new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      var els = en.target.querySelectorAll('[data-hk-adem-el]');
      els.forEach(function (el, i) { setTimeout(function () { el.style.opacity = '1'; el.style.transform = 'none'; }, i * 180); });
      ioA.unobserve(en.target);
    });
  }, { threshold: 0.4 });
  function armAdem() {
    var host = document.querySelector('[data-hk-adem]');
    if (!host) { setTimeout(armAdem, 400); return; }
    if (reduce) return;
    host.querySelectorAll('[data-hk-adem-el]').forEach(function (el) {
      el.style.opacity = '0'; el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
    });
    ioA.observe(host);
  }
  armAdem();
  function arm() {
    var els = document.querySelectorAll('[data-sdb-reveal]');
    if (!els.length) { setTimeout(arm, 350); return; }
    if (io) for (var i = 0; i < els.length; i++) io.observe(els[i]);
    onS();
  }
  arm();
})();
