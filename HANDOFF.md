# HANDOFF — Datajagers-website (v4, LIVE)

Laatst bijgewerkt: 2026-09-02. Lees dit volledig vóór de eerste wijziging.
De oude v3-handoff (statische bundel-architectuur) staat in de git-historie;
alles wat je nu nodig hebt staat hier.

**Huidige fase: visuele smoothness** — zie §5. Wouter ervaart de site als
laggy bij scrollen en animaties. Eerst meten, dan pas optimaliseren.

## 1. Wat dit is + status

De eigen marketingsite van Datajagers (data-agency, Wouter Jagers).
Nederlands, donker-editorial: coal `#1D1D1D` + licht `#f6f6f4`, accent
`#93c3fd` (donker) / `#1f66c4` (licht), Plus Jakarta Sans + Fragment Mono.

**LIVE op www.datajagers.nl.** Next.js 16 (App Router, TypeScript, npm,
GSAP; bewust géén Tailwind — de huisstijl is bespoke CSS-tokens).
Netlify bouwt elke push naar `main` automatisch via `netlify.toml`
(Next-runtime-plugin; het build-command in de toml overschrijft de UI).

- Repo: `github.com/datajagers/website` (SSH; https-push faalt non-interactief)
- Werkbranch `v4-next`; **push naar main = live**. Vaste routine:
  `git push origin v4-next && git push origin v4-next:main && git branch -f main v4-next`
- Lokale mappen: deze map is de app; `../datajagers-website-v3` is het
  bevroren statische vangnet (niet aankomen); `../datajagers-hero-prototypes`
  is de speeltuin (poort 4500).
- Dev-server: preview_start met naam `datajagers-v4` (poort 4490;
  launch.json staat in `../datajagers-website/.claude/`).

## 2. Architectuur

- `lib/copy.ts` — ALLE sitecopy op één plek. Copy-wijzigingen alleen hier.
- `app/globals.css` (tokens, CTA-hoversysteem) + `app/site.css` (secties,
  motion). `overflow-x: clip` op html/body is een guard (het wwz-canvas
  parkeert op translateX(100vw)); NOOIT `hidden` — dat breekt alle sticky's.
- `app/page.tsx` — compositie incl. `StickyPin`-wrappers (donkere band en
  testimonials pinnen; wigs schuiven eroverheen) en `PageHold` (footer-reveal).
- `components/motion/` — Preloader (Vizier), Curtains (slats + landingsregel;
  capture-fase interceptor, anders wint Next Link), Reveal (IO + html.js-gate),
  Wig (veer-gedreven wiggen; props `sectieId`/`binnen`), StickyPin, PageHold.
- `components/sections/` — HeroFlip (P5-mechaniek, zie §4), WieWeZijn
  (leesbaan + wipe), Herkenbaar (sticky titel + schalende kaartenmuur),
  Estafette ("tooling" reist), Diensten, Proces, Testimonials, Faq.
- Reveal-beginstanden gelden alleen onder `html.js` (klasse gezet in
  Preloader-effect) zodat no-JS/crawlers alles zien. JSON-LD in
  `components/JsonLd.tsx`. Contactformulier: Formspark `npnD5QsQn`
  (`lib/formspark.ts`), mailto is het vangnet als het ID leeg is.

## 3. Harde regels (door Wouter vastgesteld — niet heronderhandelen)

- **Rust boven spektakel.** Kalm, spaarzaam, doelgericht.
- **Landingsregel**: na elke navigatie mag de vórige sectie nooit in beeld
  staan; Curtains landt secties flush (settle-iteratie, beide richtingen
  getest op <2px).
- **Founder-kaart is bewust anoniem** ("Ontmoet de oprichter", géén naam —
  werkgever-relateerbaarheid). Nooit "verbeteren". Foto lanyard_person.jpg
  is definitief. Kaart linkt naar /contact.
- **Testimonials zijn écht** (collega-feedback, vertaald): inhoudelijk
  niet wijzigen.
- **Copy-wijzigingen**: per sectie akkoord vragen; gedachtestreepjes zijn
  gehumaniseerd — er staan er nog precies 4 bewust ("Jij bouwt, ik
  begeleid —", "30 min — gratis", "04 — TRAJECTEN" en de code-comment);
  geen nieuwe toevoegen.
- Mobiel (<860): gestapeld en leesbaar wint van effect (wwz-wipe is daar
  bewust uitgezet). Reduced motion en no-JS: statisch en compleet.

## 4. De hero (P5-mechaniek, GSAP)

Ruststand: normale foto met een **1px wit venster-kader** op de
middenkaart-plek. Eén scroll-gebaar bovenaan speelt een GSAP-timeline
(power3.inOut, 1.15s): de **rand dijt uit** (box-shadow-spread, 1px →
voorbij de schermranden) terwijl de foto subtiel zoomt (1 → 1.12, origin
op het venstermidden). Het paneel verschijnt op het uitgedijde wit; de
middenkaart is een open venster (echte foto erdoorheen). Terug-gebaar
bovenaan reverset. Parallax-exits via ScrollTrigger (scrub): nav −50px +
fade, paneelkop 12vh lag, rij 6vh, fotolaag 10vh. Warm-up onder de Vizier
(img.decode) tegen first-run jank.

## 5. HUIDIGE FASE: smoothness-audit (meten → dan pas fixen)

Klacht: scroll en animaties voelen laggy. Verdachten, op volgorde van
mijn inschatting (maar: PROFILEER EERST, giswerk heeft hier al eerder
tijd gekost):

1. **Te veel losse scroll-drivers die elkaars layout invalideren.** Per
   scroll-frame draaien: 4× Wig (veer-rAF, leest sectie-rect én schrijft
   clip-path + HEIGHT — height triggert layout!), WieWeZijn (23
   woord-writes + teller-querySelectorAll + rects), Herkenbaar (6×
   cel-rect + transforms + 3 sticky-fades), Footer-sheet, hero-exit-
   ScrollTrigger, en de **Estafette draait een CONTINUE rAF-loop** (v3-
   erfenis) met 3–4 getBoundingClientRect per frame, ook buiten beeld
   (er is een range-bail, maar de loop zelf tikt altijd). Reads en writes
   zijn per driver gebatcht, maar NIET cross-driver → forced reflows.
2. **Wig animeert `height`** (layout per frame, 4 instanties). Kandidaat:
   vaste hoogte + scaleY/clip-path-only.
3. **Hero-rand = box-shadow-spread** — paint-zwaar tijdens de 1.15s (en
   bij reverse). Eenmalig, maar op zwakkere GPU's voelbaar. Kandidaat:
   4 witte vlak-divs (boven/onder/links/rechts, transform-only) of
   mask/clip-benadering.
4. **Beelden**: plain `<img>`, geen next/image; hero-jpg is 1672px breed
   en wordt overal full-bleed gebruikt; geen srcset/preload-tuning.
5. **Dev vs prod**: Turbopack-dev voelt trager dan de Netlify-build.
   Meet op de LIVE site en op `npm run build && npx next start -p 4491`,
   niet alleen op de dev-server.

Meetaanpak die hier werkt (browser-pane, zie §6): PerformanceObserver op
longtasks + frame-tijden samplen tijdens gescripte scroll; per verdachte
de driver tijdelijk uitschakelen en het verschil meten; pas daarna
consolideren (bijv. één gedeelde scroll-rAF-bus met read-fase → write-
fase over alle drivers). Elke optimalisatie: vóór/na-meting in het
verslag, en visueel geen gedragsverandering (alle §3/§4-gedrag blijft).

## 6. Verificatieprotocol (hard geleerd — niet overslaan)

1. Na elke wijziging: `npm run build` moet groen; verifieer op 1440 én 375.
2. **Meet element-randen en computed styles, geen aannames.** Rotatie-
   matrices beginnen met `matrix(0.707…)`; box-shadow serialiseert met de
   kleur eerst.
3. **Browser-pane-valkuilen**: geëmuleerde viewports geven schaal-
   artefacten in screenshots van gecomposite lagen (DOM-metingen kloppen
   wél); een verborgen/achtergrond-pane pauzeert rAF (GSAP valt terug op
   setTimeout; eigen rAF-drivers NIET — front de tab of meet event-
   gedreven); innerHeight kan verdubbeld rapporteren direct na een
   emulatie-wissel.
4. Sticky/pins: landingen en pins uit beide scrollrichtingen testen.
5. Nowrap-teksten (deliverables, kaartlabels): scrollWidth vs clientWidth
   meten op beide breekpunten.
6. Gebaar-tests: `new WheelEvent('wheel',{deltaY:120,cancelable:true,bubbles:true})`
   op window; `?plhold=1`… bestaat niet meer in v4 — de Vizier zit in
   `components/motion/Preloader.tsx` (MIN 2150/CAP 4500).
7. Pushen = live. Doc- en copy-fouten zijn dus meteen publiek; build-groen
   en verificatie éérst.

## 7. Open punten (aan Wouter voorleggen, niet zelf beslissen)

- Social-URL's in de footer zijn kale placeholders (linkedin.com /
  instagram.com); zodra echt: ook `sameAs` in JsonLd.tsx vullen.
- Teamtraining komt als deliverable nergens meer terug (verdween uit
  dienst 03) — gedekt door 1-op-1 coaching of terugbrengen?
- Check of Formspark-notificaties op info@datajagers.nl aankomen.
- Herkenbaar-personas zijn archetypen die als echte posts ogen — bewust
  risico, ooit expliciet bevestigen.
