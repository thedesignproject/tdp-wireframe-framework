#!/usr/bin/env node
// Builds the static review site into dist/.
//
// Every wireframes/<project>/<board>.html becomes /<project>/<board> (its .png is
// copied too), plus the framework's worked example. The index lists everything,
// so a new board shows up on the next push with no config change.
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
  if (!existsSync(join(out, destDir, "wireframe.css"))) cpSync(css, join(out, destDir, "wireframe.css"));
  const png = join(srcDir, `${name}.png`);
  const hasPng = existsSync(png);
  if (hasPng) cpSync(png, join(out, destDir, `${name}.png`));
  return { title: titleOf(html), href: `/${destDir}/${name}`, png: hasPng ? `/${destDir}/${name}.png` : null };
}

const isBoard = (f) => f.endsWith(".html") && !f.endsWith(".standalone.html");
const groups = [];

const wfRoot = join(root, "wireframes");
if (existsSync(wfRoot)) {
  for (const project of readdirSync(wfRoot, { withFileTypes: true })) {
    if (!project.isDirectory()) continue;
    const dir = join(wfRoot, project.name);
    const boards = readdirSync(dir).filter(isBoard).sort()
      .map((f) => addBoard(dir, basename(f, ".html"), project.name));
    const readme = join(dir, "README.md");
    const heading = existsSync(readme) && readFileSync(readme, "utf8").match(/^#\s+(.+)$/m);
    if (boards.length) groups.push({ title: heading ? heading[1].trim() : humanise(project.name), boards });
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
  .site-thumb { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; object-position: top; border: var(--stroke) solid var(--ink); }
  @media (max-width: 800px) { .site .grid--3 { grid-template-columns: 1fr; } }
</style>
</head>
<body>
  <main class="site">
    <header class="stack">
      <p class="eyebrow">The Design Project</p>
      <h1>Wireframes</h1>
      <p class="lead measure">Every board in the repo, rebuilt on each push. Open a board for the full-size page.</p>
    </header>${groups.map(section).join("")}
  </main>
</body>
</html>
`);

const count = groups.reduce((n, g) => n + g.boards.length, 0);
console.log(`built ${count} boards in ${groups.length} groups → dist/`);
