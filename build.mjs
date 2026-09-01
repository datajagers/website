#!/usr/bin/env node
// build.mjs — re-bundles the self-extracting pages from the on-disk sources.
//
// Each page (index/contact/inzicht/inzichten) ships three JSON islands:
//   __bundler/manifest       { uuid: { mime, compressed, data:<base64 gzip> } }
//   __bundler/ext_resources  [ { id, uuid } ]  — id "./X.dc.html" = a local file
//   __bundler/template       JSON string of the real page HTML
// The runtime mints blob URLs from the manifest and then does
// documentElement.replaceWith(parsed template), so the template's <html>
// attributes and <head> become the live document's — but a crawler or a
// no-JS visitor only ever sees the outer wrapper. Head metadata is therefore
// written into BOTH.
//
// Editing a .dc.html on disk does NOT change a page until this script folds it
// back into that page's manifest. Drivers (*.js) and site.css load from disk at
// runtime and need no rebuild.
//
//   node build.mjs           rebuild every page from current sources
//   node build.mjs --check    report without writing

import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, readdirSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';

// Change this one line if the site ships on a different host.
const ORIGIN = 'https://www.datajagers.nl';
const OG_IMAGE = `${ORIGIN}/uploads/hero-character-sitting-on-top-of-clouds-692f40c3.jpg`;

// mainAfter/mainBefore wrap the real content in a <main> landmark so the skip
// link clears the navigation. Pages without a clean pair tag their <h1> as the
// skip target instead — a valid fallback, just without the landmark.
const PAGES = {
  'index.html': {
    path: '/',
    title: 'Datajagers — Begrijpelijke data voor scherpere beslissingen',
    description:
      'Datajagers maakt data begrijpelijk en besluitvorming scherper. Procesoptimalisatie, dashboards en AI-workflows — gebouwd mét je team, zodat het blijft werken.',
    mainAfter: '<dc-import name="Mininav" home="" contact-href="contact.html" hint-size="1px,1px" style="display:block;"></dc-import>',
    mainBefore: '<dc-import name="Footer" contact-href="contact.html"',
  },
  'contact.html': {
    path: '/contact.html',
    title: 'Contact — Datajagers',
    description:
      'Laat je vraag achter en we reageren binnen 24 uur. Of plan direct een gratis sparringsessie van 30 minuten.',
    mainAfter: '<dc-import name="Navbar" home="index.html" contact-href="#contact" active="Contact" hint-size="100%,120px"></dc-import>',
    mainBefore: '<dc-import name="Footer" home="index.html"',
  },
};

const ISLAND = (name) =>
  new RegExp(`(<script type="__bundler/${name}">\\s*)([\\s\\S]*?)(\\s*</script>)`);

function readIsland(src, name) {
  const m = src.match(ISLAND(name));
  return m ? JSON.parse(m[2]) : null;
}

// The template island holds page HTML containing literal </script> tags. Left
// bare they terminate the island's own <script> early and truncate the bundle,
// so the incumbent bundler escapes every forward slash as / — matched here.
function encode(value) {
  return JSON.stringify(value).replace(/\//g, '\\u002F');
}

function writeIsland(src, name, value) {
  const m = src.match(ISLAND(name));
  if (!m) throw new Error(`island ${name} not found`);
  return src.slice(0, m.index) + m[1] + encode(value) + m[3] +
         src.slice(m.index + m[0].length);
}

function localPath(id) {
  if (!id.startsWith('./')) return null;
  const p = decodeURIComponent(id.slice(2));
  return existsSync(p) ? p : null;
}

// Drivers and site.css load from disk, so the browser caches them across builds
// and can keep running yesterday's JS against today's markup. Stamp each local
// asset reference with the file's mtime so a rebuild always wins.
const assetVersion = (p) => {
  try { return Math.floor(statSync(p).mtimeMs).toString(36); } catch { return '0'; }
};
function bustAssets(html) {
  return html.replace(
    /(src|href)="(\.\/)?([A-Za-z0-9_.-]+\.(?:js|css))(\?v=[^"]*)?"/g,
    (m, attr, dot, file) => existsSync(file)
      ? `${attr}="${dot || ''}${file}?v=${assetVersion(file)}"`
      : m
  );
}

// The drivers are embedded in the manifest by uuid as well as living on disk,
// and the embedded copy is the one the template loads. Each driver opens with a
// `if (window.__x) return` guard, so the embedded copy wins and an edited file
// on disk becomes dead code. Fold them in by matching the decoded payload
// against the file's opening bytes.
function foldLocalScripts(manifest) {
  const files = readdirSync('.').filter((f) => f.endsWith('.js') && f !== 'build.mjs');
  let n = 0;
  for (const entry of Object.values(manifest)) {
    if (!/javascript/.test(entry.mime || '')) continue;
    let text;
    try {
      let raw = Buffer.from(entry.data, 'base64');
      if (entry.compressed) raw = gunzipSync(raw);
      text = raw.toString('utf8');
    } catch { continue; }
    const match = files.find((file) => {
      const head = readFileSync(file, 'utf8').slice(0, 90);
      return head.length > 20 && text.slice(0, 400).includes(head);
    });
    if (!match) continue;
    const bytes = Buffer.from(bustAssets(readFileSync(match, 'utf8')), 'utf8');
    entry.data = (entry.compressed ? gzipSync(bytes, { level: 9 }) : bytes).toString('base64');
    n++;
  }
  return n;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function headTags(meta) {
  return `<!--dj:head-->
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<link rel="canonical" href="${ORIGIN}${meta.path}">
<link rel="icon" href="assets/logo_mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/logo_mark.svg">
<meta name="theme-color" content="#1D1D1D">
${meta.noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}<meta property="og:type" content="website">
<meta property="og:site_name" content="Datajagers">
<meta property="og:locale" content="nl_NL">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${ORIGIN}${meta.path}">
<meta property="og:image" content="${OG_IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<script src="curtains.js"></script>
<link rel="stylesheet" href="site.css">
<!--/dj:head-->
`;
}

// Every injection is fenced by a sentinel and stripped before being re-applied,
// so the build is idempotent — running it twice yields the same file.
function stripInjected(html) {
  return html
    .replace(/<!--dj:head-->[\s\S]*?<!--\/dj:head-->\s*/g, '')
    .replace(/<a class="dj-skip"[^>]*>.*?<\/a>/g, '')
    .replace(/<main id="hoofdinhoud">/g, '')
    .replace(/<\/main><!--\/dj:main-->/g, '')
    .replace(/ id="hoofdinhoud" tabindex="-1"/g, '');
}

// Applies to the template (what the browser ends up rendering) and to the outer
// wrapper (what a crawler or a no-JS visitor sees before the runtime boots).
function patchDocument(html, meta, { body }) {
  let out = stripInjected(html);

  // 1. Language. WCAG 3.1.1 — the whole site is Dutch.
  out = out.replace(/<html(?![^>]*\blang=)([^>]*)>/i, '<html lang="nl"$1>');

  // 2. Head metadata, ahead of </head> so component helmets can still override.
  out = out.replace(/<\/head>/i, `${headTags(meta)}</head>`);

  if (!body) return out;

  // 3. Main landmark, where the page has an unambiguous pair of anchors.
  let landmarked = false;
  if (meta.mainAfter && meta.mainBefore &&
      out.includes(meta.mainAfter) && out.includes(meta.mainBefore)) {
    out = out.replace(meta.mainAfter, `${meta.mainAfter}<main id="hoofdinhoud">`);
    out = out.replace(meta.mainBefore, `</main><!--/dj:main-->${meta.mainBefore}`);
    landmarked = true;
  } else {
    // Fallback: the <h1> becomes the skip target. tabindex="-1" makes it
    // programmatically focusable so focus actually lands there, not just scroll.
    out = out.replace(/<h1(?![^>]*\bid=)/i, '<h1 id="hoofdinhoud" tabindex="-1"');
    landmarked = /id="hoofdinhoud"/.test(out);
  }
  if (!landmarked) throw new Error(`no skip-link target found in ${meta.path}`);

  // 4. Skip link as the first thing in the body.
  out = out.replace(
    /<body([^>]*)>/i,
    '<body$1><a class="dj-skip" href="#hoofdinhoud">Naar hoofdinhoud</a>'
  );

  return out;
}

const check = process.argv.includes('--check');
const eject = process.argv.includes('--eject');

// Page markup used to be editable only as a JSON string inside the bundle it
// ships in. --eject writes each template out to src/ once; from then on that
// file is the source and the bundle is pure output.
const srcTemplate = (page) => `src/${page.replace(/\.html$/, '')}.tmpl.html`;

for (const [page, meta] of Object.entries(PAGES)) {
  let src = readFileSync(page, 'utf8');
  const manifest = readIsland(src, 'manifest');
  const ext = readIsland(src, 'ext_resources');
  let template = readIsland(src, 'template');

  const tpl = srcTemplate(page);
  if (eject) {
    mkdirSync('src', { recursive: true });
    writeFileSync(tpl, stripInjected(template));
    console.log(`ejected ${tpl}`);
    continue;
  }
  if (existsSync(tpl)) template = readFileSync(tpl, 'utf8');

  let folded = 0;
  for (const { id, uuid } of ext) {
    const p = localPath(id);
    if (!p || !manifest[uuid]) continue;
    const raw = readFileSync(p);
    // .dc.html components reference the drivers; stamp those too
    const bytes = /\.(html|css|js)$/i.test(p)
      ? Buffer.from(bustAssets(raw.toString('utf8')), 'utf8')
      : raw;
    const entry = manifest[uuid];
    entry.data = (entry.compressed ? gzipSync(bytes, { level: 9 }) : bytes)
      .toString('base64');
    folded++;
  }

  const foldedScripts = foldLocalScripts(manifest);

  template = bustAssets(patchDocument(template, meta, { body: true }));

  src = writeIsland(src, 'manifest', manifest);
  src = writeIsland(src, 'template', template);
  // The outer wrapper is the no-JS / pre-crawl view: give it the real title and
  // description instead of "Bundled Page". Its body is replaced wholesale once
  // the runtime boots, so it gets head metadata only.
  src = src.replace(/<title>Bundled Page<\/title>\s*/i, '');
  src = bustAssets(patchDocument(src, meta, { body: false }));

  if (check) {
    console.log(`${page.padEnd(15)} would fold ${folded} component(s)`);
  } else {
    writeFileSync(page, src);
    console.log(`built ${page.padEnd(15)} folded ${folded} component(s), ${foldedScripts} script(s)`);
  }
}
