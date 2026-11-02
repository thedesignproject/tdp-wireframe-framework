# Monochrome rules

A wireframe here is **black ink on white paper**. Not "mostly grey", not "subtle
tints" — two values and the paper they sit on.

## The palette

| Token | Value | Use |
|---|---|---|
| `--ink` | `#000` | every line, every glyph, every filled shape |
| `--paper` | `#fff` | background, and the inside of filled-with-ink elements (text on black) |
| `transparent` | — | only inside gradients that build the image-placeholder cross and hatch patterns |

Nothing else. `scripts/lint-mono.sh` enforces this and will fail the build on any
`#333`, `#eee`, `rgba(...)`, `gray`, `opacity`, `box-shadow`, or remote asset.

Antialiasing produces grey pixels in the export — that is rendering, not design.
Do not introduce grey on purpose to "soften" something.

## Hierarchy without grey

The temptation is to reach for a lighter grey for secondary text or a filled
grey for cards. Refused. Four legal levers instead:

1. **Stroke weight** — `--stroke-thin` 1.5px for row separators, `--stroke` 2px for
   controls and cards, `--stroke-bold` 3px for the one thing on screen that must be
   read first. Weight is the strongest signal available.
2. **Fill style** — solid black (`btn--primary`, `badge--solid`, `bars__bar`),
   hatched (`overlay`), dashed outline (`panel`, `btn--quiet`, `bars__bar--ghost`),
   or empty. Four levels before you need a fifth.
3. **Type** — size (`--fs-xs` → `--fs-3xl`), weight (400/700), case, letter-spacing,
   and italic for asides. Balsamiq Sans has no light weight; use size, not grey.
4. **Space** — proximity and alignment group things better than a box ever will.

If two elements still look identical after those four, they probably *are* the same
element-level importance and the design, not the styling, needs a decision.

## What black-on-white changes about the design

- **Borders carry the composition.** Screens read as line drawings, so plan the
  line work: outer frame, section rules, row separators. An unboxed region reads
  as empty space rather than as a subtle panel.
- **Reversed type is loud.** A black button with white label is the loudest thing
  on the page. Use it once per screen — the primary action — and not for filters,
  tabs, or badges that merely happen to be selected (`badge--solid` on a status is
  fine because it is text, not an action).
- **Images are crosses, never photographs.** `.media` plus a `media__tag` if the
  subject matters ("hero — team photo").
- **Charts are solid bars and 2px strokes.** No fills, no legends in colour, no
  greys for a second series: use hatching, dashed outlines, or split the chart.

## Non-negotiables

- No `opacity`, no `filter: blur`, no `box-shadow`, no gradients except the two
  structural ones in the sheet, no icon fonts, no emoji.
- No remote fonts, images, or scripts. Everything renders with the network off.
- No `text-shadow`, no `-webkit-text-stroke`, no `mix-blend-mode`.
- No colour words in prose either — "the red CTA" describes a design that cannot
  exist in this file. Say "the filled CTA".

## When a stakeholder asks for colour

That is a different artefact (a hi-fi comp or a styled prototype). Say so, keep the
wireframe monochrome, and note the colour intent in the annotations: *"3 — confirm
brand accent before hi-fi"*. The wireframe's job is structure and flow; colour
decisions made here get thrown away anyway.
