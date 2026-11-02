---
name: create-wireframe
description: Draw low-fidelity UI wireframes in the Balsamiq Sans hand-drawn style, strictly black ink on white paper. Use when asked for a wireframe, lo-fi mockup, sketch of a screen or flow, screen inventory, "Balsamiq style" drawing, greybox, or a black-and-white UI layout for review. Covers desktop, tablet and mobile frames, component vocabulary, annotated open questions, and a linted PNG export.
license: MIT
metadata:
  version: "1.0"
---

# Create a wireframe

A wireframe is a **line drawing of an interface** whose only job is to settle
structure, flow, and priority before anyone spends time on visual design. Here it is
drawn in HTML with the embedded **Balsamiq Sans** face and rendered to PNG, in **pure
black on white** — no greys, no tints, no colour.

Read [`references/monochrome.md`](references/monochrome.md) before your first drawing
in a session. It explains the four legal ways to create hierarchy when the palette is
two values.

## Workflow

### 1. Frame the ask

Decide, and state, before drawing:

- **Which screens** and in what order a user meets them.
- **Which device** each one is (desktop 1280 / tablet 834 / mobile 390).
- **The one decision** this drawing exists to force (layout? navigation? density?).

If the request is ambiguous, draw the smallest set that shows the flow and list the
assumptions in the notes panel — do not stop and ask unless the screen set itself is
ambiguous. Never invent a whole product: two to five screens is a wireframe, twenty is
a backlog.

### 2. Start from the template

```bash
cp "<skill>/assets/template.html" ./wireframes/<slug>.html
```

Keep the `<link rel="stylesheet" href="wireframe.css">` line as-is. `scripts/render.sh`
resolves it against this skill's `assets/` and inlines it, so the export stays
self-contained wherever the file lives. Put working files in the project's
`wireframes/` directory (one file per flow, several screens per file).

### 3. Draw with the sheet, not with new CSS

Use the classes in [`references/components.md`](references/components.md) —
`topbar`, `page`, `card`, `table`, `field`, `btn`, `media`, `tl`, `bars`, `pin`,
`notes`. No inline colours, no new hex, no `opacity`, no shadows. Layout with
`split` / `grid` / `row` / `stack` and the spacing scale.

If a pattern is genuinely missing, add it to `assets/wireframe.css` (built only from
`--ink`, `--paper`, `--stroke*`, spacing) and re-run the lint — never patch a screen
file locally.

Hand-drawn detail: the irregular radii and the optional `<filter id="wobble">` sketch
filter do the "drawn by hand" work. Do not rotate elements, use script fonts by
another name, or add squiggles by hand.

### 4. Annotate

- Numbered `<span class="pin">` on each element that carries a decision.
- A `.notes` panel as the last section of the board, one sentence per pin.
- A `.todo` block for what is deliberately out of scope.

Annotations are the part reviewers argue with. A wireframe with no pins reads as
"this is final" and gets critiqued on the wrong axis.

### 5. Render and lint

```bash
scripts/lint-mono.sh wireframes/<slug>.html      # black & white, offline, Balsamiq Sans
scripts/render.sh wireframes/<slug>.html wireframes/<slug>.png --width 1500 --inline
```

`render.sh` prints `ink: grayscale only ✓` when the capture carries no colour. Both
commands must pass before you show anything. `--inline` also writes
`<slug>.standalone.html` (fonts and CSS embedded) for anyone opening it outside the
repo.

### 6. Review the PNG, then hand over

Open the PNG and run [`references/review-checklist.md`](references/review-checklist.md).
Read the image, not the markup — layout bugs are invisible in HTML and obvious at a
glance in the export.

Deliver: PNG first, standalone HTML second, open questions third (copied from the
notes panel into your message). Do not hand over an HTML file that needs this skill's
assets to render.

## Rules that are not negotiable

1. **Two values.** `#000` and `#fff`. `scripts/lint-mono.sh` fails the build otherwise.
2. **Balsamiq Sans** for every glyph; no other family, no icon fonts, no emoji.
3. **Offline.** No remote fonts, images, or scripts in the artefact.
4. **Images are crosses**, never stock photography, never screenshots.
5. **No lorem ipsum.** Real domain words, or a placeholder that reads as a placeholder.
6. **One loud element per screen.** A second solid-black button is a design bug.
7. **Caption every screen** (`<b>01</b> Name — desktop`). The board must be readable
   out loud.
8. **States count.** Empty, loading, error, permission, long content — draw them or
   declare them out of scope.

## Layout reference

| Thing | Value |
|---|---|
| Desktop frame | 1280px wide |
| Tablet frame | 834px |
| Mobile frame | 390px |
| Page padding | 32px (`--s-6`), 24px grid gap (`--s-5`) |
| Sidebar | 240px |
| Board gap | 48px (`--s-7`), board padding 32px |
| Border | 2px (`--stroke`); 1.5px rows, 3px emphasis |
| Type | 11/13/15/18/24/32/42px; only 400 and 700 exist |
| Export | 2× scale, trimmed, 32px paper margin |

## Files

| Path | What it is |
|---|---|
| `assets/wireframe.css` | the whole design system + embedded Balsamiq Sans (latin, woff2, OFL) |
| `assets/template.html` | starter board to copy |
| `assets/example-project-portal.html` | worked example: dashboard, detail, mobile, modal, notes |
| `assets/example-project-portal.png` | its render — the quality bar to match |
| `references/monochrome.md` | how to build hierarchy in black and white |
| `references/components.md` | component markup, icons, states, annotation patterns |
| `references/review-checklist.md` | pre-handover review |
| `scripts/render.sh` | HTML → trimmed PNG (inlines the sheet, checks for chroma) |
| `scripts/lint-mono.sh` | fails on any colour, opacity, shadow, or remote asset |

Match the density and annotation level of the example, not its content.
