# HANDOFF — Datajagers eigen website (v3, productiekandidaat)

Laatst bijgewerkt: 2026-09-02. Dit document brengt een nieuwe sessie op het
kennisniveau van de vorige. Lees het volledig vóór de eerste wijziging.

**Huidige fase: Next.js-migratie (besluit Wouter, 2026-09-02) + inhoudsoptimalisatie.**
De site migreert naar Next.js/SSR: map `../datajagers-website-v4`, branch
`v4-next` op dezelfde repo, poort 4490 (launch.json-entry `datajagers-v4`,
copy centraal in `lib/copy.ts`). Fase 1 (alle inhoud server-rendered, huisstijl-
tokens 1-op-1, mailto-formulier, sitemap/robots schoon) staat en is geverifieerd
op 1440 én 375. **Fase 2 (motion) staat ook** (commit `5a137ba`): Vizier-
preloader, gordijn-navigatie met landingsregel (capture-fase interceptor —
Next Link won anders; beide scrollrichtingen flush geverifieerd), reveal-engine,
wig-wipes + boogkap, footer sheet-reveal + page-hold, testimonial-rotatie,
FAQ-micro-animaties, gantt-entree. **Besluit Wouter (2026-09-02): de verkorte
reveal bij interne paginawissels is definitief** (slats dekken, route wisselt,
slats liften — geen vol aankomst-Vizier per hop). **Hero-FLIP is terug in
kalme vorm** (besluit Wouter: wél de FLIP, significant kalmer; commit
`005166e`): één gebaar bovenaan krimpt de hero-foto als clip-path-venster tot
exact de middelste cijfers-kaart, copy fadet, paneel komt met 10px fade-up,
nav kleurt om; terug-gebaar speelt het omgekeerde; mobiel/reduce/no-JS
gestapeld. Zit in `HeroFlip.tsx` (Hero/InCijfers zijn erin opgegaan).
Bewust niet geport: de v3-gebaar-poorten (Herkenbaar-CTA-expansie,
diensten-wipe). Main blijft de statische v3 tot v4 pariteit heeft.
**Copy-akkoorden A–G zijn goedgekeurd en doorgevoerd in v4** (commit
`fa579c1`, alles in `lib/copy.ts` + JSON-LD Organization/FAQPage): o.a.
24-uursbelofte gelijkgetrokken, contactonderwerpen = de vier diensten,
"AI-integratie & Maatwerk", "Alles onder één dak", C-statement "Ervaar de
rust van data die voor je werkt.", FAQ zonder "The Sparring Session",
testimonial-CTA "Werk met ons samen". Testimonials inhoudelijk onaangeroerd.
LET OP: deze v3 heeft die copy-wijzigingen NIET — v3 is bevroren als vangnet.
Nog open uit de audit: founder-kaart (bestaat niet in v4; hangt aan het
stockfoto-besluit) en de cijferkaarten koffie/collega's (blijven staan tenzij
Wouter een echt werkgetal aanlevert).

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
- **Gepubliceerd naar GitHub**: v3 staat op `github.com/datajagers/website`,
  branch `main`. De oude React/Vite-versie zit in de historie eronder.
  De lokale v3-map heeft sinds 2026-09-02 een eigen git, gekoppeld aan
  `origin/main` — gewoon committen en pushen vanuit deze map.
- **Netlify-deploy gefixt (2026-09-02)**: de UI stond op `npm run build`
  (faalde: geen package.json). `netlify.toml` heeft nu een expliciet no-op
  `command` — toml overschrijft de UI. LET OP: www.datajagers.nl serveerde
  ook ná die fix nog de oude React-versie (gemonitord, ~8 min) — deploy-log
  in het Netlify-dashboard checken, of het domein hangt aan een andere site.
- **Besluit Wouter (2026-09-02): contactformulier blijft mailto.** Formspark
  is afgewezen; er komt geen extern endpoint. De mailto-flow is functioneel
  geverifieerd (validatie, foutmeldingen, focus, statusregel, mail-body).

## 6. Huidige fase: inhoudsoptimalisatie

Wouter wil de inhoud optimaliseren. Waar de copy leeft:

| inhoud | bestand |
|---|---|
| Hero (h1 "Data & daarna.", sub, CTA) + "In cijfers"-kop en kaarten | `Hero Fullbleed Datajagers.dc.html` (labels bestaan 2×: reizend + doel — wijzig beide) |
| Wie we zijn: quote, statements A/B/C, chips | `Wie we zijn Statement Concept Light.dc.html` |
| Herkenbaar-sectie | `Herkenbaar.dc.html` |
| Diensten: rijen, deliverables, CTA | `Diensten Sectie Concept.dc.html` |
| Proces (Gantt, fasen) | `Proces Gantt.dc.html` |
| Klantverhalen/testimonials | `Testimonials Concept.dc.html` |
| FAQ (6 vragen + antwoorden) | `FAQ v2.dc.html` / `FAQ Sectie.dc.html` |
| Footer | `Footer.dc.html` (+ inline kopie in `src/contact.tmpl.html`) |
| Contactpagina (formulier, teksten) | `src/contact.tmpl.html` |
| SEO: titles, meta-descriptions, canonical | `build.mjs` (PAGES) |
| sitemap/robots | `sitemap.xml`, `robots.txt` |

Regels voor inhoudswerk:
- **Testimonials zijn écht**: feedback van collega's Thomas Hendriks, Maud
  Hermans en Jasper Smit, vertaald uit het Engels. Niet herschrijven of
  aandikken zonder expliciet overleg — hooguit taalkundig polijsten.
- Toon: Nederlands, kalm, zonder jargon, "data-studio, geen consultancy".
  Wouter corrigeerde eerder richting rust en terughoudendheid.
- Elke copy-edit = bron wijzigen → `node build.mjs` → verifiëren in de
  browser (breekpunten 1440 én 375; tekstlengtes kunnen layouts breken —
  denk aan `white-space: nowrap` op kaartlabels en chips-grids).
- Sectiekop-nummering (01–07) moet doorlopend blijven als secties wijzigen.

## 7. Open beslissingen (aan Wouter voorleggen, niet zelf beslissen)

- Stockfoto's: founder-kaart toont een stock-persoon (lanyard_person.jpg),
  happy-person-2.jpg achter testimonials op 8%.
- Social-URL's zijn placeholders (linkedin.com / instagram.com kaal).
- Domein/ORIGIN bevestigen (build.mjs).
- Aankomst-Vizier speelt volledig (~2,2s) bij elke interne paginawissel —
  optie aangeboden om interne hops een verkorte reveal te geven; geen besluit.
- "Ontdek verder" → `#verhaal` is een aanname; expliciet akkoord vragen kan.

## 8. Verificatieprotocol (hard geleerd — niet overslaan)

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

## 9. Startprompt nieuwe sessie

Kern: lees dit bestand, start `datajagers-v3` (poort 4480) via preview_start,
open een desktop-tab en een tweede tab op mobiel (375×812), wacht de Vizier af,
en begin dan met de inhoudsfase: inventariseer alle copy per sectie (§6),
audit hem kritisch (boodschap, toon, lengte, SEO) en leg verbetervoorstellen
per sectie aan Wouter voor — geen copy wijzigen zonder akkoord.
