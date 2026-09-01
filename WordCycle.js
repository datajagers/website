// <word-cycle> — cycles a single inline word with a blur/fade vertical transition
// and an eased width animation. Dependency-free custom element.
// Attributes:
//   words="a|b|c"   interval="2400"   color="#2f7fd6"   gradient="linear-gradient(...)"
//   weight="500"    ease="cubic-bezier(...)"   width-dur=".62s"
// Inherits font-size/family from its parent (it lives inline inside a heading).
//
// All styling lives in the shadow root: a React host wipes inline styles it doesn't
// own (including `transition`, which silently kills the easing), so the host itself
// is styled via :host rules and the animated width sits on an inner shadow element.
(function () {
  if (customElements.get('word-cycle')) return;

  class WordCycle extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;

      this._words = (this.getAttribute('words') || '')
        .split('|').map(function (s) { return s.trim(); }).filter(Boolean);
      if (!this._words.length) this._words = [this.textContent.trim() || 'helder'];
      this._interval = parseInt(this.getAttribute('interval') || '2400', 10);
      this._fit = (this.getAttribute('fit') || 'max');
      this._startDelay = parseInt(this.getAttribute('start-delay') || '0', 10);
      this.reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

      const color = this.getAttribute('color') || '';
      const gradient = this.getAttribute('gradient') || '';
      const weight = this.getAttribute('weight') || '';
      const ease = this.getAttribute('ease') || 'cubic-bezier(.65,0,.35,1)';
      const wdur = this.getAttribute('width-dur') || '.62s';

      const root = this.attachShadow ? this.attachShadow({ mode: 'open' }) : this;
      this._root = root;

      const style = document.createElement('style');
      style.textContent =
        ':host{display:inline-block;position:relative;white-space:nowrap;vertical-align:baseline;}' +
        '.slot{display:inline-block;position:relative;white-space:nowrap;' +
        (this.reduce ? '' : 'transition:width ' + wdur + ' ' + ease + ';') + '}' +
        '.measure{position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap;pointer-events:none;}' +
        '.word{display:inline-block;white-space:nowrap;will-change:transform,opacity,filter;line-height:1.05;padding-bottom:.06em;}';
      root.appendChild(style);

      const slot = document.createElement('span');
      slot.className = 'slot';
      this._slot = slot;

      this._measure = document.createElement('span');
      this._measure.className = 'measure';
      this._measure.setAttribute('aria-hidden', 'true');

      this._word = document.createElement('span');
      this._word.className = 'word';

      if (weight) { this._word.style.fontWeight = weight; this._measure.style.fontWeight = weight; }
      if (gradient) {
        this._word.style.backgroundImage = gradient;
        this._word.style.webkitBackgroundClip = 'text';
        this._word.style.backgroundClip = 'text';
        this._word.style.color = 'transparent';
        this._word.style.webkitTextFillColor = 'transparent';
      } else if (color) {
        this._word.style.color = color;
      }

      slot.appendChild(this._measure);
      slot.appendChild(this._word);
      root.appendChild(slot);

      this._i = 0;
      this._word.textContent = this._words[0];
      const self = this;
      const setW = function () {
        if (self._fit === 'word') {
          self._slot.style.width = self._measureWidth(self._words[self._i]) + 'px';
          return;
        }
        var max = 0;
        for (var k = 0; k < self._words.length; k++) max = Math.max(max, self._measureWidth(self._words[k]));
        self._slot.style.width = max + 'px';
      };
      requestAnimationFrame(setW);
      setTimeout(setW, 120);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(setW);

      this._start = function () {
        if (self._timer || self._firstTO || self.reduce || self._words.length < 2) return;
        var firstDelay = self._interval + (self._startDelay || 0);
        self._firstTO = setTimeout(function () {
          self._firstTO = null;
          self._next();
          self._timer = setInterval(function () { self._next(); }, self._interval);
        }, firstDelay);
      };
      this._stop = function () { clearInterval(self._timer); self._timer = null; if (self._firstTO) { clearTimeout(self._firstTO); self._firstTO = null; } };

      if ('IntersectionObserver' in window) {
        this._io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) self._start(); else self._stop(); });
        }, { threshold: 0.01 });
        this._io.observe(this);
      } else {
        this._start();
      }
    }

    disconnectedCallback() {
      if (this._stop) this._stop();
      if (this._io) this._io.disconnect();
    }

    _measureWidth(t) {
      this._measure.textContent = t;
      return Math.ceil(this._measure.getBoundingClientRect().width) + 2;
    }

    _next() {
      const nextI = (this._i + 1) % this._words.length;
      const w = this._words[nextI];
      const el = this._word;
      const self = this;
      const swap = function () {
        el.textContent = w;
        self._i = nextI;
        if (self._fit === 'word') self._slot.style.width = self._measureWidth(w) + 'px';
        try {
          el.animate(
            [{ transform: 'translateY(-45%)', opacity: 0, filter: 'blur(8px)' },
             { transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' }],
            { duration: 440, easing: 'cubic-bezier(.2,.65,.3,.9)', fill: 'both' }
          );
        } catch (_) {}
      };
      if (!el.animate) { swap(); return; }
      try {
        const out = el.animate(
          [{ transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' },
           { transform: 'translateY(45%)', opacity: 0, filter: 'blur(8px)' }],
          { duration: 300, easing: 'cubic-bezier(.4,0,1,1)', fill: 'both' }
        );
        out.finished.then(swap).catch(swap);
      } catch (_) { swap(); }
    }
  }

  customElements.define('word-cycle', WordCycle);
})();
