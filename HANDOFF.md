# HANDOFF — Datajagers-website (v4, LIVE)

Laatst bijgewerkt: 2026-09-04. Lees dit volledig vóór de eerste wijziging.
De oude v3-handoff (statische bundel-architectuur) staat in de git-historie;
alles wat je nu nodig hebt staat hier.

**Status: smoothness-audit afgerond, optimalisaties live** — zie §5 voor
de metingen, wat er is doorgevoerd en wat er nog open staat.

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

## 5. Smoothness: audit afgerond, optimalisaties doorgevoerd (2026-09-04)

Meetresultaat eerst: op een M-serie-Mac was er meetbaar níets mis — prod,
dev (warm), live site én mobiel 375 scrollen op een vastgeklonken 120fps
(0 gemiste frames, 0 long tasks, in élke configuratie; alle drivers samen
~0,33ms van het 8,3ms-framebudget). De oude verdachtenlijst staat in de
git-historie; per driver gekwantificeerd via tijdelijke uitschakel-toggles.

Doorgevoerd (alle vier geverifieerd gedragsidentiek, mét vóór/na-meting):

1. **HeroFlip**: wheel/touchmove alleen `passive: false` bovenaan in
   stage-modus (her-registratie bij de scrollgrens). Buiten de top wacht
   de compositor niet meer op de main thread — het enige pad dat gescripte
   scroll principieel niet kan meten (echte-gebaar-latency).
2. **Wig**: vaste dooshoogte + clip-path-only (diagonaal als polygon met
   verrekend percentage, boog als path()-dome die de border-radius-vorm
   exact reproduceert). De height-write/layout-invalidatie per frame is
   weg. Geometrie ≤0,3px gelijk; main-werk −20% desktop, −25% mobiel
   (0,65→0,52 / 0,59→0,44 ms per frame).
3. **Estafette**: kick-patroon i.p.v. continue rAF-loop, plus één kick op
   fonts.ready tegen verschoven slot-rects. Idle tikt de sectie niet meer.
4. **Kaartbeelden**: srcset/sizes met q70-varianten, −528kB op vijf
   beelden. De middenkaart hergebruikt bewust de al geladen hero-jpg;
   founder-kaart en portret onaangeraakt.

Open punten / wetenswaardig voor een vervolg:

- Wouter voelt de lag op een MacBook Pro M4 Pro — meetbaar niet
  gereproduceerd. Vraag staat uit: waar/wanneer precies (sectie, tijdens
  het gebaar of erná, welk scherm)? Kandidaat-verklaring "erná" = de
  bewuste veer/scrub-choreografie zelf (trailing leest als lag).
- De Wig-veer is per-frame gedefinieerd (0.07/0.106/0.875 per tick): op
  een 60Hz-scherm trailt hij ~2× zo lang als op 120Hz. Gedragsvraag,
  bewust niet aangepast.
- GSAP's ticker tikt idle door (120/s, ~0 kost) zodra ScrollTrigger
  geregistreerd is — eventuele energie-hygiëne.
- Hero-jpg (1672px) is te klein voor 1440@2x (2880px nodig): licht
  onscherp op retina. Geen groter origineel gevonden in alle projectmappen;
  opschalen afgewezen (nepscherpte). Wil je dit fixen: nieuwe bron nodig.
- Niet doen: de gedeelde scroll-rAF-bus — cross-driver-reflows kosten
  aantoonbaar te weinig voor de complexiteit.

## 6. Verificatieprotocol (hard geleerd — niet overslaan)

1. Na elke wijziging: `npm run build` moet groen; verifieer op 1440 én 375.
2. **Meet element-randen en computed styles, geen aannames.** Rotatie-
   matrices beginnen met `matrix(0.707…)`; box-shadow serialiseert met de
   kleur eerst.
3. **Browser-pane-valkuilen**: geëmuleerde viewports geven schaal-
   artefacten in screenshots van gecomposite lagen (DOM-metingen kloppen
   wél); een verborgen/achtergrond-pane pauzeert rAF (GSAP valt terug op
   setTimeout; eigen rAF-drivers NIET — front de tab of meet event-
   gedreven); dat geldt óók per TAB: een niet-actieve tab in een zichtbare
   pane pauzeert rAF net zo hard (tabs_select vóór elke rAF-meting, en
   tussen tool-calls door loopt rAF sowieso niet betrouwbaar door);
   innerHeight kan verdubbeld rapporteren direct na een emulatie-wissel.
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
