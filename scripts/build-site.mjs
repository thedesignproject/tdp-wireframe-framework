#!/usr/bin/env node
// Builds the static review site into dist/.
//
// Every wireframes/<project>/<board>.html becomes /<project>/<board> (its .png is
// copied too), plus the framework's worked example. The index lists everything,
// so a new board shows up on the next push with no config change.
//
// To put boards on the shortlist, add wireframes/<project>/site.json:
//   { "shortlist": ["<board file name>"], "why": "One sentence.", "title": "List heading" }
// Shortlisted boards from every project sit side by side at the top of the index
// (set "chosen" instead of "shortlist" once one wins); the rest are listed
// underneath as explorations. "title" overrides the heading of that list.
//
// CRRT feedback: set "crrt": { "projectId": "<public project key>" } in site.config.json
// and every hosted page gets the CRRT widget (github.com/thedesignproject/CRRT), loaded
// from a CDN through an import map. Only dist/ is touched: the board sources, PNGs and
// standalone files stay offline and monochrome.
//
// No dependencies: runs on the Node that Vercel provides.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const out = join(root, "dist");
const skillAssets = join(root, ".agents/skills/create-wireframe/assets");
const css = join(skillAssets, "wireframe.css");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(css, join(out, "wireframe.css"));

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const titleOf = (file) => {
  const m = readFileSync(file, "utf8").match(/<title>([^<]*)<\/title>/i);
  return (m ? m[1] : basename(file, ".html")).replace(/\s+—\s+wireframe\s*$/i, "").trim();
};
const humanise = (slug) => slug.replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());

// Copy one board (source HTML + PNG) into dist/<dir>/ and return its index entry.
function addBoard(srcDir, name, destDir) {
  const html = join(srcDir, `${name}.html`);
  mkdirSync(join(out, destDir), { recursive: true });
  cpSync(html, join(out, destDir, `${name}.html`));
  withCrrt(join(out, destDir, `${name}.html`));
  if (!existsSync(join(out, destDir, "wireframe.css"))) cpSync(css, join(out, destDir, "wireframe.css"));
  const png = join(srcDir, `${name}.png`);
  const hasPng = existsSync(png);
  if (hasPng) cpSync(png, join(out, destDir, `${name}.png`));
  return { title: titleOf(html), href: `/${destDir}/${name}`, png: hasPng ? `/${destDir}/${name}.png` : null };
}

const siteConfigFile = join(root, "site.config.json");
const siteConfig = existsSync(siteConfigFile) ? JSON.parse(readFileSync(siteConfigFile, "utf8")) : {};
const crrt = siteConfig.crrt && siteConfig.crrt.projectId ? siteConfig.crrt : null;
const crrtSnippet = crrt ? `
<!-- CRRT feedback widget (added by scripts/build-site.mjs; not part of the wireframe) -->
<script type="importmap">${JSON.stringify({ imports: {
  "react": "https://esm.sh/react@19.1.0",
  "react/jsx-runtime": "https://esm.sh/react@19.1.0/jsx-runtime",
  "react-dom/client": "https://esm.sh/react-dom@19.1.0/client?external=react",
  "@thedesignproject/crrt": `https://cdn.jsdelivr.net/npm/@thedesignproject/crrt@${crrt.version || "0.3.24"}/dist/crrt.es.js`,
} })}</script>
<script type="module">
  import { createElement } from "react";
  import { createRoot } from "react-dom/client";
  import { FeedbackWidget } from "@thedesignproject/crrt";
  const host = document.createElement("div");
  host.id = "crrt-root";
  document.body.append(host);
  createRoot(host).render(createElement(FeedbackWidget, ${JSON.stringify({ projectId: crrt.projectId, theme: crrt.theme || "light" })}));
</script>
` : "";
const withCrrt = (file) => {
  if (!crrt) return;
  const html = readFileSync(file, "utf8");
  if (html.includes("</body>")) writeFileSync(file, html.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${crrtSnippet}</body>`));
};

const isBoard = (f) => f.endsWith(".html") && !f.endsWith(".standalone.html");
const groups = [];
const features = [];
let chosenAny = false;

const wfRoot = join(root, "wireframes");
if (existsSync(wfRoot)) {
  const projects = readdirSync(wfRoot, { withFileTypes: true }).sort((x, y) => x.name.localeCompare(y.name));
  for (const project of projects) {
    if (!project.isDirectory()) continue;
    const dir = join(wfRoot, project.name);
    const boards = readdirSync(dir).filter(isBoard).sort((x, y) => x.localeCompare(y, "en", { numeric: true }))
      .map((f) => addBoard(dir, basename(f, ".html"), project.name));
    const readme = join(dir, "README.md");
    const heading = existsSync(readme) && readFileSync(readme, "utf8").match(/^#\s+(.+)$/m);
    const title = heading ? heading[1].trim() : humanise(project.name);
    const siteJson = join(dir, "site.json");
    const meta = existsSync(siteJson) ? JSON.parse(readFileSync(siteJson, "utf8")) : {};
    const picks = [].concat(meta.chosen || meta.shortlist || []).map((name) => {
      const board = boards.find((b) => b.href.endsWith(`/${name}`));
      if (!board) throw new Error(`${siteJson}: no board named ${name}`);
      return board;
    });
    if (meta.chosen) chosenAny = true;
    for (const board of picks) features.push({ project: title, board, why: meta.why });
    const rest = boards.filter((b) => !picks.includes(b));
    if (rest.length) groups.push({ title: meta.title || (picks.length ? `Explorations · ${title}` : title), boards: rest });
  }
}

groups.push({
  title: "Framework example",
  boards: [addBoard(skillAssets, "example-project-portal", "example")],
});

const card = (b) => `
        <a class="card stack site-card" href="${b.href}">
          ${b.png ? `<img class="site-thumb" src="${b.png}" alt="" loading="lazy">` : `<div class="media media--thumb"></div>`}
          <strong>${esc(b.title)}</strong>
        </a>`;

const feature = (f) => `
        <a class="card site-card site-feature stack" href="${f.board.href}">
          ${f.board.png ? `<img class="site-thumb" src="${f.board.png}" alt="">` : `<div class="media media--thumb"></div>`}
          <div class="stack">
            <p class="eyebrow">${esc(f.project)}</p>
            <h3>${esc(f.board.title)}</h3>
            ${f.why ? `<p class="muted">${esc(f.why)}</p>` : ""}
            <span class="btn btn--sm site-cta">Open the board</span>
          </div>
        </a>`;

const shortlist = () => !features.length ? "" : `
    <section class="stack stack--loose">
      <div class="row"><span class="badge badge--solid">${chosenAny ? "Chosen direction" : "Shortlist"}</span><span class="muted">${chosenAny ? "The team picked this one. Everything below stays as exploration." : "Being discussed: one of these becomes the homepage."}</span></div>
      ${features.length === 1 ? feature(features[0]).replace("site-feature stack", "site-feature site-feature--solo") : `<div class="grid grid--${Math.min(features.length, 3)}">${features.map(feature).join("")}
      </div>`}
    </section>`;

const section = (g) => `
    <section class="stack stack--loose">
      <h2>${esc(g.title)}</h2>
      <div class="grid grid--3">${g.boards.map(card).join("")}
      </div>
    </section>`;

writeFileSync(join(out, "index.html"), `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TDP Wireframes</title>
<link rel="stylesheet" href="/wireframe.css">
<style>
  .site { max-width: 1200px; margin: 0 auto; padding: var(--s-7) var(--s-5); display: grid; gap: var(--s-7); }
  .site-card { color: inherit; text-decoration: none; }
  .site-feature { border-width: 3px; padding: var(--s-5); }
  .site-cta { justify-self: start; }
  .site-feature--solo { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: var(--s-6); align-items: start; }
  .site-thumb { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; object-position: top; border: var(--stroke) solid var(--ink); }
  @media (max-width: 800px) {
    .site .grid--2, .site .grid--3, .site-feature--solo { grid-template-columns: 1fr; }
    .site-feature { padding: var(--s-4); }
  }
</style>
</head>
<body>
  <main class="site">
    <header class="stack">
      <p class="eyebrow">The Design Project</p>
      <h1>Wireframes</h1>
      <p class="lead measure">The ${chosenAny ? "chosen direction" : "shortlist"} first, then every exploration behind it. Rebuilt on each push; open a board for the full-size page.</p>
    </header>${shortlist()}${groups.map(section).join("")}
  </main>
</body>
</html>
`);

withCrrt(join(out, "index.html"));

const count = groups.reduce((n, g) => n + g.boards.length, 0);
console.log(`built ${count} boards in ${groups.length} groups → dist/${crrt ? ` (CRRT widget: ${crrt.projectId})` : ""}`);
