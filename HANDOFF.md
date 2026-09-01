# HANDOFF — Datajagers eigen website (v3, productiekandidaat)

Laatst bijgewerkt: 2026-09-01. Dit document brengt een nieuwe sessie op het
kennisniveau van de vorige. Lees het volledig vóór de eerste wijziging.

## 1. Wat dit is

De eigen marketingsite van Datajagers (data-agency, Wouter Jagers). Nederlands,
donker-editorial ontwerp: coal `#1D1D1D` + licht `#f6f6f4`, accent `#93c3fd`
(donkere grond) / `#1f66c4` (lichte grond), Plus Jakarta Sans + Fragment Mono.
Statische site, geen framework — Claude Design canvas-componenten.

**Drie kopieën, drie poorten** (launch.json in `../datajagers-website/.claude/`):

| map | poort | rol |
|---|---|---|
| `datajagers-website` | 4460 | v1 — origineel, niet aankomen |
| `datajagers-website-v2` | 4470 | v2 — bevroren |
| `datajagers-website-v3` | 4480 | **v3 — productiekandidaat, hier werken** |

Server starten: preview_start met naam `datajagers-v3`.

## 2. Architectuur — lees dit vóór elke edit

- **Pagina's zijn self-extracting bundles.** `index.html` e.a. bevatten
  `__bundler/manifest` (uuid → gzip+base64), `__bundler/template` (JSON-string)
  en `__bundler/ext_resources`. De runtime doet `documentElement.replaceWith()`
  — de **swap**. Alles wat vóór de swap aan de DOM hangt, sneuvelt.
- **Bronnen**: `src/*.tmpl.html` (paginatemplates), `*.dc.html` (componenten),
  `*.js` (drivers), `site.css`. **Een schijf-edit is dode code tot
  `node build.mjs`** — de bundel bevat eigen kopieën; build.mjs vouwt
  schijfversies terug (match op eerste ~90 tekens) en stampt `?v=mtime`.
- **build.mjs** injecteert per pagina een `dj:head`-blok (title/meta/canonical,
  `curtains.js`, `site.css`), skip-link en main-landmark; sentinel-fenced en
  idempotent. LET OP: de template-island escapet elke `/` als `/` — een
  letterlijke `</script>` in content breekt de pagina.
- **Drivers** openen met een `if (window.__x) return`-guard. curtains.js laadt
  nu op ELKE pagina via dj:head (schijf wint; de manifest-kopie op index no-op't).

## 3. Harde regels & systemen (door Wouter vastgesteld)

- **Landingsregel** (geadopteerd 2026-09-01): na elke navigatie-overgang of
  deep-link mag de vórige sectie nooit in beeld staan. De minibalk
  (`[data-mn-bar]`, 84px) is doorzichtig → sectietop op de viewporttop (0).
  Implementatie: `landOffset()` in curtains.js (alpha-detectie; dekkende balk
  zou balk-bodem −1 geven), gebruikt door `toEl` én `landHash`; native
  hash-sprongen doen hetzelfde (scroll-margin 0 — er staat een wachter-comment
  in site.css). Verifieer landingen ALTIJD vanuit beide scrollrichtingen:
  sticky-gepinde secties (#diensten, gevoel, klantverhalen — negatieve sticky
  top) meten vanaf onder ~1600px te laag; `settleScroll()` itereert daarom
  onder het gordijn tot de meting stilstaat (<2px).
- **Gordijn overal**: één globale click-interceptor in curtains.js.
  Ankerlinks → `toEl` (slats #1D1D1D, 7 stuks, cover 320ms + stagger 40).
  Interne `.html`-links → `coverAndGo` (dekken, dan navigeren; aankomstpagina
  neemt over met coal-cover + Vizier). Native blijven: skip-link (`.dj-skip`),
  mailto, externe URL's, target=_blank, downloads, modifier-kliks. bfcache-terug
  opent het gordijn weer (pageshow-handler).
- **Vizier-preloader** (curtains.js): pre-paint coal cover (synchroon
  helmet-script in ALLE vier templates) → kruislijnen zoeken/vergrendelen →
  ruit landt → woordmerk → iris-exit. MIN 2150ms, CAP 4500. Een watchdog
  (120ms) herbouwt vizier + reset `plIntroStarted` + herbaset `plStart` na de
  swap — zonder die reset toont de preloader alleen een kaal doek (is al eens
  misgegaan). Dev-vlag: `?plhold=1` houdt hem vast.
- **Deep-links**: secties renderen client-side, dus de native hash-sprong vindt
  bij parse niets → `landHash()` landt het anker achter de preloader vóór de
  iris opent.
- **Navvolgorde** (overal identiek): Home 01 · Wie we zijn 02 · Diensten 03 ·
  FAQ 04 · Contact 05. Vier kopieën: Navbar.dc.html (desktop + menupaneel),
  Mininav.dc.html, Footer.dc.html, en een inline footLinks in
  src/contact.tmpl.html. Bij wijziging: alle vier.
- **Designsysteem**: 2 hairline-tokens per grond; eyebrows via Sectiekop met
  doorlopende nummering (01–07); hoversysteem `--dj-hover`/`--dj-dur 0.5s`/
  `--dj-ease cubic-bezier(0.22,1,0.36,1)` met focus-pariteit; CTA's onder
  `[data-cta]`; tap-targets ≥44px via ::before-overlays in site.css
  (lijst uitbreiden als er een nieuw klein control bijkomt — `[data-ke-pill]`
  was de laatste). Breakpoint-drempel: 860px (ke-reduce eronder).
- **Rust boven spektakel**: Wouter vond eerdere voorstellen "way too animated";
  kalm, spaarzaam, doelgericht. De asset-library elders is inspiratie, geen
  bouwmateriaal.

## 4. Sleutelbestanden

- `curtains.js` — gordijn + Vizier + interceptor + landingsregel. Hart van de
  navigatie-UX; wijzigingen hier raken alle pagina's.
- `ke-driver.js` — hero-FLIP (wheel-gebaar bovenaan opent; `geom()` schrijft
  media-fenced px-regels ≥860px; fotolabel krijgt tegenschaal — anders rendert
  het kaartlabel mini/vervormd). Per-frame ke-open/ke-reduce herbevestigd
  (frozen-breakpoint-les).
- `Hero Fullbleed Datajagers.dc.html` — hero + "In cijfers"-paneel. De
  middelste kaart: "Het overzicht" + pill "Ontdek verder" → `#verhaal`
  (twee kopieën: reizend fotolabel + statisch doel; wijzig beide).
- `estafette-driver.js`, `sdb-driver.js`, `image-slot.js`, `WordCycle.js` —
  sectie-drivers. `src/index.tmpl.html` bevat de wig-scrubs, sticky pins
  (`_fitPageHold`: negatieve sticky top) en reveal-engine.
- `build.mjs` — PAGES-metadata (index/contact; ORIGIN https://www.datajagers.nl),
  head-injectie, foldLocalScripts, bustAssets.

## 5. Recent afgerond (deze sessie, alles geverifieerd)

- Navvolgorde overal gelijkgetrokken (Footer had nog een oude kopie).
- Landingsregel geïmplementeerd + iteratieve settle; deep-links flush.
- Gordijn op elke pagina incl. cross-page (coverAndGo) + preloader op
  contact; vizier-regressie na swap gefixt (watchdog/vlagreset).
- Inzichten-pagina verwijderd; footer toont FAQ 04. Bestanden staan als
  vangnet in de sessie-scratchpad (`verwijderd-inzichten/`) — bij twijfel
  navragen, niet terugzetten.
- Middelste cijfers-kaart: "RUST" weg, fotolabel-tegenschaal (mini-artefacten
  weg), "Ontdek verder" is nu een echte link → `#verhaal`, 44px tap-overlay.

## 6. Open beslissingen (aan Wouter voorleggen, niet zelf beslissen)

- Stockfoto's: founder-kaart toont een stock-persoon (lanyard_person.jpg),
  happy-person-2.jpg achter testimonials op 8%.
- Social-URL's zijn placeholders (linkedin.com / instagram.com kaal).
- Contactformulier submit = mailto; echte endpoint nodig voor productie.
- Domein/ORIGIN bevestigen (build.mjs).
- Aankomst-Vizier speelt volledig (~2,2s) bij elke interne paginawissel —
  optie aangeboden om interne hops een verkorte reveal te geven; geen besluit.
- "Ontdek verder" → `#verhaal` is een aanname; expliciet akkoord vragen kan.
- Publicatie (git init + hosting) is nog niet gebeurd — er is GEEN git.

## 7. Verificatieprotocol (hard geleerd — niet overslaan)

1. **Bouw na elke bron-edit** (`node build.mjs`), anders test je oude code.
2. **Batchscripts**: asserts per wijziging; schrijf pas aan het eind; tel de
   uitvoerregels. Een gefaalde stap mag geen halve edits achterlaten.
3. **Meet element-randen**, geen scrollbars (`contain: paint` verbergt
   overflow) en meet **animatiestatus** (computed transform/opacity), niet
   element-bestaan. Rotatie-matrices beginnen met `matrix(0.707…` — schaal via
   kolomlengte berekenen, niet met een regex op "matrix(0".
4. **Sticky secties**: landingen uit beide richtingen testen.
5. **Browser-pane**: screenshots alleen betrouwbaar met gefronte tab; verborgen
   pane pauzeert rAF/scroll-timelines; `color(srgb …/a)` naast `rgba()` parsen.
   Tool-roundtrips (~seconden) kunnen een 2s-animatie niet live samplen —
   gebruik `?plhold=1`.
6. **Hero-FLIP triggeren** in tests: scroll naar 0 en dispatch
   `new WheelEvent('wheel', {deltaY: 120, cancelable: true, bubbles: true})`.
7. Inline ontwerpwaarden (zoals een opacity) nooit generiek wissen — eerst
   kijken wat er staat.

## 8. Startprompt nieuwe sessie

Zie de prompt onderaan dit document of in de chat-overdracht. Kern: lees dit
bestand, start `datajagers-v3` (poort 4480) via preview_start, open desktop-tab
en een tweede tab op mobiel (375×812), wacht de Vizier af en meld je startstatus.
