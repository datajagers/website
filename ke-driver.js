// Kader-expansie v5 — state als class op [data-ke-root], elke frame herbevestigd
// (overleeft runtime-re-renders); px-geometrie in een dynamisch stylesheet.
(function () {
  if (window.__kedrv) return; window.__kedrv = true;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 860;
  var open = false, busy = false;
  var st = document.createElement('style');
  document.head.appendChild(st);
  function q(s) { return document.querySelector(s); }
  function geom() {
    var hero = q('[data-ke-hero]'), doel = q('[data-ke-doel]'), root = q('[data-ke-root]');
    if (!hero || !doel || !root) return;
    var hr = hero.getBoundingClientRect();
    root.classList.add('ke-meet'); void doel.offsetWidth;
    var r = doel.getBoundingClientRect();
    root.classList.remove('ke-meet');
    var k = Math.max(r.width / hr.width, r.height / hr.height);

    // FLIP. De box blijft hr groot en op (0,0) staan; een transform brengt hem
    // naar de kaart. Zo animeren we niets dat layout kost.
    var sx = r.width / hr.width, sy = r.height / hr.height;
    var dx = r.left - hr.left, dy = r.top - hr.top;

    // De oude foto-transform ging uit van transform-origin 50% 50%. Alles staat
    // nu op origin 0 0, dus we schrijven diezelfde afbeelding om naar een
    // translate+scale vanaf de linkerbovenhoek: scale om het midden verplaatst
    // het punt met (1-k) * halve maat.
    var tx = r.width / 2 - k * hr.width / 2;
    var ty = r.height - k * hr.height;
    var a = tx + (hr.width / 2) * (1 - k);
    var b = ty + (hr.height / 2) * (1 - k);

    // Het kind zit in de geschaalde ruimte van de ouder, dus deel de gewenste
    // schermtransform door de ouderschaal: parent ∘ child == de oude transform.
    var cs = (k / sx), csy = (k / sy);

    // Onder 860px herschikt de component-CSS de hero volledig; deze px-regels
    // zijn daar gif. Media-fence zodat een stale meting nooit mobiel raakt.
    st.textContent = '@media (min-width: 860px){' +
      '[data-ke-root] [data-ke-foto]{left:0!important;top:0!important;width:' + hr.width.toFixed(1) + 'px!important;height:' + hr.height.toFixed(1) + 'px!important;transform:none;border-radius:0}' +
      '[data-ke-root].ke-open [data-ke-foto]{transform:translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + sx.toFixed(5) + ',' + sy.toFixed(5) + ');' +
        // 5px na schaling: deel voor, anders rekt de radius mee uit
        'border-radius:' + (5 / sx).toFixed(2) + 'px / ' + (5 / sy).toFixed(2) + 'px}' +
      '[data-ke-root] [data-ke-img]{width:' + hr.width.toFixed(1) + 'px!important;height:' + hr.height.toFixed(1) + 'px!important}' +
      '[data-ke-root].ke-open [data-ke-img]{transform:translate(' + (a / sx).toFixed(1) + 'px,' + (b / sy).toFixed(1) + 'px) scale(' + cs.toFixed(5) + ',' + csy.toFixed(5) + ')}' +
      // het kaartlabel deelt de ouderschaal en zou mini/vervormd renderen;
      // tegenschaal om het middelpunt zet het op ware grootte (ke-foto clipt)
      '[data-ke-root].ke-open [data-ke-fotolabel]{transform:scale(' + (1 / sx).toFixed(5) + ',' + (1 / sy).toFixed(5) + ');transform-origin:50% 50%}' + '}';
  }
  // The class is reasserted every frame so it survives runtime re-renders, but
  // the element only needs re-querying when the old node is gone — and the hero
  // only exists at the top of the page.
  var rootEl = null;
  function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    if (window.scrollY > window.innerHeight * 2) return;
    if (!rootEl || !rootEl.isConnected) rootEl = q('[data-ke-root]');
    if (!rootEl) return;
    // De pagina kan ná laden naar half scherm gesleept worden; de laadtijd-
    // breakpoint liegt dan. Onder 860 (of bij reduced motion) geldt de statische
    // ke-reduce-presentatie en vervalt de open-stand; terug op desktopbreedte
    // wordt ke-reduce weer losgelaten.
    if (reduce || window.innerWidth < 860) {
      open = false;
      rootEl.classList.remove('ke-open');
      rootEl.classList.add('ke-reduce');
      return;
    }
    rootEl.classList.remove('ke-reduce');
    rootEl.classList.toggle('ke-open', open);
  }
  requestAnimationFrame(loop);
  function set(o) {
    open = o;
    busy = true; setTimeout(function () { busy = false; }, 1300);
    if (o) geom();
  }
  function init() {
    if (!q('[data-ke-root]') || !q('[data-ke-doel]')) { setTimeout(init, 300); return; }
    geom();
    window.addEventListener('resize', geom);
    if (reduce) return;
    function onWheel(e) {
      if (window.innerWidth < 860) return;
      var atTop = window.scrollY < 4;
      if (busy) { if (atTop) e.preventDefault(); return; }
      if (!open && atTop && e.deltaY > 0) { e.preventDefault(); set(true); }
      else if (open && atTop && e.deltaY < -8) { e.preventDefault(); set(false); }
    }
    window.addEventListener('wheel', onWheel, { passive: false });
    var ty = null;
    window.addEventListener('touchstart', function (e) { ty = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (ty === null || window.innerWidth < 860) return;
      var dy = ty - e.touches[0].clientY;
      var atTop = window.scrollY < 4;
      if (busy) { if (atTop) e.preventDefault(); return; }
      if (!open && atTop && dy > 12) { e.preventDefault(); set(true); ty = null; }
      else if (open && atTop && dy < -12) { e.preventDefault(); set(false); ty = null; }
    }, { passive: false });
  }
  init();
})();
