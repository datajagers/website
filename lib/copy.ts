// Alle sitecopy op één plek — 1-op-1 overgenomen uit v3 (stand 2026-09-02,
// vóór de copy-audit-akkoorden). Wijzigingen uit de audit landen hier.

export const NAV = [
  { label: "Home", href: "/", num: "01" },
  { label: "Wie we zijn", href: "/#verhaal", num: "02" },
  { label: "Diensten", href: "/#diensten", num: "03" },
  { label: "FAQ", href: "/#faq", num: "04" },
  { label: "Contact", href: "/contact", num: "05" },
];

export const HERO = {
  titel: "Data & daarna",
  sub: "Begrijpelijke data voor scherpere beslissingen. Eén versie van de waarheid.",
  cta: "Plan een gesprek",
};

export const IN_CIJFERS = {
  num: "01",
  label: "Het overzicht", // sluit aan op de middenkaart waar de hero-FLIP in landt

  kop: "Overzicht geeft rust,",
  kopGrijs: "elke dag opnieuw.",
  kaarten: [
    { label: "KOPPEN KOFFIE", waarde: "3.200", foto: "/uploads/coffee.jpg", alt: "Koffie to go op een Parijse straathoek" },
    { label: "HET OVERZICHT", waarde: "Ontdek verder", foto: "/uploads/hero-character-sitting-on-top-of-clouds-692f40c3.jpg", alt: "", href: "/#verhaal" },
    { label: "BLIJE COLLEGA’S", waarde: "99%", foto: "/assets/happy_collegas.jpg", alt: "Blije collega’s van Datajagers" },
  ],
};

export const WIE_WE_ZIJN = {
  num: "02",
  label: "Wie we zijn",
  quote:
    "Data is voor mij nooit het doel geweest. Het is de kortste weg naar een eerlijk gesprek over wat er écht toe doet.",
  rail: "Zoek je duidelijkheid in je data, dan bouwen we die samen.",
  cta: "Plan een gesprek",
  statements: [
    {
      letter: "A",
      tekst:
        "Wij maken data begrijpelijk, besluitvorming scherper en teams zekerder van hun keuzes — nuchter, helder en zonder ruis.",
      grijs: "",
      chips: ["Mensentaal boven jargon", "Duidelijkheid boven dashboardchaos", "Scherpe analyse zonder ego"],
    },
    {
      letter: "B",
      tekst:
        "Datajagers begon uit nieuwsgierigheid, groeide uit tot passie — en is nu het specialisme.",
      grijs: "Van procesoptimalisatie met Lean Six Sigma, via Google Certified Data Analyst, naar AI-specialist.",
      chips: ["Bewezen ervaring", "Persoonlijke aanpak", "Alles onder één dak", "Doorlopende support"],
    },
    {
      letter: "C",
      tekst: "Ervaar de rust",
      grijs: "van data die voor je werkt.",
      chips: [],
    },
  ],
  strip: [
    { num: "01 / DE RUST", tekst: "Overzicht zonder ruis" },
    { num: "02 / DE BELOFTE", tekst: "Vertrouwen in je data" },
    { num: "03 / HET RESULTAAT", tekst: "Vertrouwen in je eigen keuzes", accent: true },
  ],
};

export const HERKENBAAR = {
  num: "03",
  label: "Herkenbaar",
  rechts: "06 signalen",
  kop: "Het zit in je hoofd. Alleen nog niet in je systeem.",
  sub: "Zes dingen die we elke week horen.",
  posts: [
    { name: "Sanne Bakker", handle: "@sanne_ops", role: "operations manager", time: "2 u", comments: 12, likes: 89, quote: "Ik zie precies wat ik wil. Ik krijg het alleen niet gebouwd.", hashtag: "#hetzitinmijnhoofd" },
    { name: "Ruben Meijer", handle: "@rubenmeijer", role: "eigenaar webshop", time: "5 u", comments: 23, likes: 154, quote: "Zoveel data, zoveel tools. Waar begin je?", hashtag: "#waarbeginik" },
    { name: "Femke de Wit", handle: "@femke_mkt", role: "teamlead marketing", time: "1 d", comments: 31, likes: 208, quote: "Elke maand hetzelfde rapport. Met de hand.", hashtag: "#copypaste" },
    { name: "Jeroen van Dam", handle: "@jeroenvd", role: "financieel directeur", time: "2 d", comments: 48, likes: 312, quote: "Vijf dashboards verder, nog steeds geen antwoord.", hashtag: "#datachaos" },
    { name: "Anouk Visser", handle: "@anouk_data", role: "data-analist", time: "3 d", comments: 19, likes: 176, quote: "Twee rapporten, twee waarheden.", hashtag: "#wieheeftgelijk" },
    { name: "Mark de Haan", handle: "@markdehaan", role: "algemeen directeur", time: "1 w", comments: 27, likes: 243, quote: "We meten alles. En weten niks.", hashtag: "#metenzonderweten" },
  ],
};

export const DIENSTEN = {
  num: "04",
  label: "Diensten",
  rechts: "04 — TRAJECTEN",
  woord: "tooling", // de estafette-loper: reist van scene 1 naar de dienstenkop
  brug: { wit: "Niet je mensen zitten vast.", grijs: "Je tooling zit vast." },
  kop: "tooling die wél meewerkt.",
  kopGrijs: "En training die je team meeneemt.",
  intro:
    "Van procesoptimalisatie tot dashboards en AI-workflows — gebouwd mét je team, zodat het blijft werken als wij weg zijn.",
  meetlat: "./ ANTWOORD BINNEN 24 UUR",
  cta: "Plan een gesprek",
  rows: [
    {
      num: "01",
      titel: "Procesoptimalisatie",
      kort: "Minder verspilling, meer resultaat volgens bewezen Lean Six Sigma-principes.",
      deliverables: [
        "Proces in kaart & knelpuntanalyse",
        "Businesscase: euro's in, euro's uit",
        "Verbeterroadmap, geprioriteerd",
        "Borging: meetplan & werkafspraken",
      ],
    },
    {
      num: "02",
      titel: "Data & Dashboards",
      kort: "Zet jouw rommelige data om in inzichten die je écht gebruikt.",
      deliverables: [
        "Custom dashboards, gebouwd in Python",
        "Analytics: het verhaal achter de cijfers",
        "Robuust datamodel als fundament",
        "Rapportages die zichzelf verversen",
      ],
    },
    {
      num: "03",
      titel: "AI-integratie & Maatwerk",
      kort: "Breng AI in je dagelijkse workflow — praktisch, niet theoretisch.",
      deliverables: [
        "Centraal kennismanagement, goud waard",
        "Custom AI-tooling: van service tot SEO",
        "Audit: website & kennis in sync",
        "Echte workflow-automatisering",
      ],
    },
    {
      num: "04",
      titel: "1-op-1 AI-Coaching",
      kort: "Jij bouwt, ik begeleid — je gaat weg met iets dat werkt.",
      deliverables: [
        "Echte use case uit jouw werk",
        "Op je eigen laptop, hands-on",
        "Efficiënt werken met AI én skills",
        "Plus: je resultaat presenteren",
      ],
    },
  ],
};

export const PROCES = {
  num: "05",
  label: "Het proces",
  rechts: "04 fasen",
  kop: "Zo werken we",
  kopGrijs: "van vraag naar rust.",
  intro: "Vier fasen, elkaar overlappend — want inzicht wacht niet op een opgeleverd systeem.",
  fasen: [
    { num: "01", titel: "Ontdekken", start: 1, end: 3, tekst: "We beginnen met luisteren: doelen, cijfers en waar het schuurt — helder voordat we iets bouwen." },
    { num: "02", titel: "Strategie", start: 2.6, end: 5.5, tekst: "De vertaalslag: welke vraag beantwoorden we, met welke data, in welke taal. Eén richting, geen ruis." },
    { num: "03", titel: "Bouwen", start: 4.4, end: 9, tekst: "Dashboards, koppelingen en AI-workflows — gebouwd mét je team, getoetst aan de echte praktijk." },
    { num: "04", titel: "Live & daarna", start: 7.8, end: 11, tekst: "Livegang is het begin: we blijven meten, bijsturen en ondersteunen zodat het waardevol blijft." },
  ],
};

// Testimonials zijn ECHTE feedback van collega's (vertaald uit het Engels).
// Inhoudelijk niet wijzigen zonder expliciet overleg met Wouter.
export const TESTIMONIALS = {
  num: "06",
  label: "Wat collega's zeggen",
  kop: "Echte mensen.",
  kopGrijs: "Echte verhalen.",
  intro: "Ongefilterde woorden van de mensen met wie we dagelijks aan data, dashboards en AI werken.",
  meetlat: "./ ECHTE MENSEN, ECHTE SAMENWERKING",
  cta: "Werk met ons samen",
  quotes: [
    {
      quote:
        "Wouter is goud waard. Hij pakt zaken meteen op en heeft het bijzondere vermogen om een complexe vraag uit een halve zin te begrijpen. Als strategische sparringpartner kijkt hij steevast vanuit een andere hoek, waardoor hij verborgen inzichten en ‘verstopte tabellen’ boven tafel haalt die het begrip van een project flink vergroten.",
      author: "Thomas Hendriks",
      role: "Digital Product Manager",
      num: "01",
    },
    {
      quote:
        "Met een scherp oog voor efficiëntie pakt Wouter procesverbeteringen proactief op en zorgt hij dat geen moeite verloren gaat. Hij stelt altijd de cruciale vraag: ‘Wat wil je met deze data bereiken?’ Dat dwingt tot een extra reflectieslag, waardoor tijd gaat naar projecten die echt waarde toevoegen in plaats van rapportages die in de la belanden.",
      author: "Maud Hermans",
      role: "SEO Content Marketeer",
      num: "02",
    },
    {
      quote:
        "Wouters grootste kracht is zijn conceptuele denkvermogen en zijn talent om structuur te scheppen in chaos. Dat blijkt vooral wanneer hij complexe datastromen ontwart of dashboardeisen scherp krijgt. Met zijn gestructureerde blik en drang naar consistentie legt hij een rotsvast fundament onder elk project — een echte aanwinst voor ieder team.",
      author: "Jasper Smit",
      role: "Lead Business Analyst",
      num: "03",
    },
  ],
};

export const FAQ = {
  num: "07",
  label: "Veelgestelde vragen",
  sidebar: {
    cta: "Plan een gesprek",
    duur: "30 min — gratis",
    tekst: "Geen verkooppraatje — gewoon eerlijke antwoorden. Staat je vraag er niet bij? Stel hem direct.",
  },
  items: [
    {
      q: "Met wat voor bedrijven werken jullie?",
      a: "Kleine tot middelgrote teams die generieke tools ontgroeid zijn of vastlopen in inefficiënte workflows. De rode draad: volop data, maar geen duidelijke richting — of een heldere richting, maar niet de tools om er te komen.",
    },
    {
      q: "Hoe ziet een typisch traject eruit?",
      a: "Elk project begint met de sparringsessie — een eerlijk gesprek over het ‘waarom’. Daarna varieert de looptijd van een gerichte sprint van één week tot een partnerschap van meerdere maanden, afhankelijk van scope en complexiteit.",
    },
    {
      q: "Hoe verschilt dit van een gewone consultant?",
      a: "Je krijgt een strategische sparringpartner, geen rapportschrijver. Het doel is nooit een document in de la — maar een werkende oplossing die vanaf dag één echte waarde creëert. Een halve zin is meestal genoeg om te weten wat er nodig is.",
    },
    {
      q: "Welke tools en technologieën gebruiken jullie?",
      a: "Wat past bij de klus. Excel en Power BI voor datawerk, Python en SQL voor zwaardere analyses, OpenAI-API’s voor AI-integraties en Lean Six Sigma voor procesvraagstukken. De tool volgt het probleem, niet andersom.",
    },
    {
      q: "Werken jullie remote of on-site?",
      a: "Voornamelijk remote, met de optie voor on-site sessies wanneer het werk daarom vraagt — zeker bij complexe data-architectuurworkshops of strategische sparringsessies waar samen in één ruimte zijn het verschil maakt.",
    },
    {
      q: "Hoe gaan we van start?",
      a: "Plan een gratis sparringsessie. In 30 minuten bepalen we of er een match is en wat de eerste concrete stap is. Geen pitchdeck, geen poespas — gewoon een eerlijk gesprek over jouw uitdaging.",
    },
  ],
};

export const FOOTER = {
  uitnodiging: "Klaar om samen te werken?",
  email: "info@datajagers.nl",
  cta: "Neem contact op",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "Instagram", href: "https://www.instagram.com" },
    { label: "Mail", href: "mailto:info@datajagers.nl" },
  ],
};

export const CONTACT = {
  titel: "Neem contact op",
  sub: "Kies een onderwerp, laat je vraag achter en je hoort binnen 24 uur van ons.",
  // opties spiegelen de vier diensten (DIENSTEN.rows) + "Iets anders"
  onderwerpen: [
    { value: "", label: "Selecteer" },
    { value: "procesoptimalisatie", label: "Procesoptimalisatie" },
    { value: "dashboards", label: "Data & Dashboards" },
    { value: "ai", label: "AI-integratie & Maatwerk" },
    { value: "coaching", label: "1-op-1 AI-Coaching" },
    { value: "anders", label: "Iets anders" },
  ],
};
