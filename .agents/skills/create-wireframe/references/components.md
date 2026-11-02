# Component vocabulary

Everything below ships in `assets/wireframe.css`. Copy the markup, keep the class
names, and add nothing that needs a new colour. Sizes are on a 4/8/12/16/24/32/48/64
spacing scale (`--s-1` … `--s-8`).

## Page furniture

```html
<main class="board">            <!-- flex-wrap of screens, 48px gaps -->
  <section>
    <div class="screen__caption"><b>01</b> Projects — desktop</div>
    <div class="screen screen--desktop"> … </div>
  </section>
</main>
```

| Frame | Width | Use |
|---|---|---|
| `.screen--desktop` | 1280 | default laptop/desktop screen |
| `.screen--tablet` | 834 | iPad portrait-ish |
| `.screen--mobile` | 390 | phone |
| `.screen--fluid` | 100% | dialogs, components, small crops |

Always caption a screen (`<b>NN</b> name — device`). Numbered captions are what make a
board reviewable out loud.

Inside a screen: `.topbar`, `.page` (32px padding, grid gap 24), optional
`.shell` (sidebar 240px + content) and `.footer`.

## Navigation

```html
<header class="topbar">
  <div class="brand"><span class="brand__mark">T</span> Product</div>
  <nav class="nav">
    <a href="#" aria-current="page">Projects</a>
    <a href="#">Files</a>
  </nav>
  <div class="topbar__spacer"></div>
  <div class="search">
    <svg …magnifier…></svg><input placeholder="Search projects">
  </div>
  <div class="avatar">PR</div>
</header>
```

- Sidebar nav: `.shell` > `aside.sidebar` + `.nav.nav--stack`, mark the current item
  with `aria-current="page"` (it renders as a boxed item).
- Tabs: `.tabs` with `aria-selected="true"`.
- Filters: `.segmented` with `aria-pressed="true"` on one child.
- Breadcrumb: plain `<p class="muted">Workspace / Finvisor / Sprint 4</p>`.

## Layout

`.split` (1/1), `.split--aside` (2/1), `.split--form` (320px + 1fr), `.grid--2/3/4`,
`.row` (+ `--between`, `--top`), `.stack` (+ `--tight`, `--loose`),
`.rule` / `.rule--dashed` / `.divider`. Prefer these over hand-rolled `style=""`.

## Buttons

```html
<button class="btn btn--primary">New request</button>   <!-- one per screen -->
<button class="btn">Share</button>                       <!-- secondary -->
<button class="btn btn--quiet">Export</button>           <!-- dashed = tertiary -->
<button class="btn btn--sm">Edit</button>
<button class="btn btn--icon" aria-label="Menu">…</button>
<a class="btn btn--block" href="#">Join call</a>
<div class="btn-group"><button class="btn btn--sm">Day</button><button class="btn btn--sm">Week</button></div>
```

`disabled` renders dashed — use it for states that are genuinely unavailable, and
annotate why.

## Forms

```html
<div class="field">
  <label class="label" for="email">Email address</label>
  <input class="input" id="email" placeholder="name@company.com">
  <span class="hint">They get view-only access.</span>
</div>

<select class="select"><option>Newest first</option></select>
<textarea class="textarea" placeholder="What do you need?"></textarea>

<label class="check"><span class="check__box check__box--on"></span> Notify by email</label>
<label class="radio"><span class="radio__dot radio__dot--on"></span> Can comment</label>
<label class="row"><span class="toggle toggle--on"><span class="toggle__knob"></span></span> Auto-archive</label>
```

Error state: `.input[aria-invalid="true"]` (bold dashed border) plus
`<span class="error">Enter a work email.</span>`.

Layout a form with `.stack.stack--loose`; put submit/cancel in a `.row.row--between`
at the end. Show at least one validation state per form-heavy screen — that is what
stakeholders actually forget to specify.

## Surfaces

`.card` (2px box), `.card--flat` (rules only), `.card__head` / `.card__title`,
`.panel` (dashed), `.callout` (3px left rule), `.badge` / `.badge--solid`,
`.metric__value` / `.metric__label` for the KPI trio or quad, `.avatar` / `--lg`.

Rule of thumb: at most one level of nesting. A `.card` inside a `.card` inside a
`.panel` is three boxes doing the job of one.

## Media and placeholder copy

```html
<div class="media media--thumb"></div>                  <!-- cropped thumbnail -->
<div class="media media--hero"><span class="media__tag">hero — team photo</span></div>
<div class="media media--circle"></div>                 <!-- avatar-sized -->

<div class="tl tl--title w-60"></div>     <!-- solid bar: heading slot -->
<div class="tl tl--thin w-100"></div>     <!-- solid bar: thin rule-ish -->
<div class="tl tl--scribble w-90"></div>  <!-- wavy scribble: body copy -->
```

- **Scribble** (`.tl--scribble`) is the honest lo-fi look for copy you have not
  written. Use it for paragraphs.
- **Solid bars** read as structural rules; use for one-line labels in dense tables
  or card lists.
- Never lorem ipsum. Either real words from the domain ("Sprint 4 of 6") or a
  placeholder — fake latin makes reviewers critique grammar instead of layout.
- Widths: `.w-10` … `.w-100` in tens.

## Tables and lists

```html
<table class="table">
  <thead><tr><th>Deliverable</th><th>Owner</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>Button + input states</td><td>Pili</td><td>Ready</td></tr>
  </tbody>
</table>

<ul class="list">
  <li class="list__item"><div class="avatar">PR</div><div>…</div></li>
</ul>
```

Tables get a 2px head rule and 1.5px row rules. No zebra shading (that would be
grey). Numeric columns get `.mono` for tabular figures.

## Charts

```html
<div class="bars">
  <span class="bars__bar" style="height:40%"></span>
  <span class="bars__bar" style="height:88%"></span>
  <span class="bars__bar bars__bar--ghost" style="height:95%"></span>  <!-- forecast -->
</div>

<svg class="spark" viewBox="0 0 200 64"><polyline points="0,50 40,44 80,52 120,20 160,26 200,8"/></svg>
```

Series are told apart by fill (solid / dashed ghost / hatched), never by colour.
Label axes with `.hint` text; a chart without units is a decoration.

## States worth drawing

```html
<div class="overlay">                        <!-- hatched scrim behind a modal -->
  <div class="modal"> … </div>
</div>

<div class="toast">Saved — 2 files uploaded</div>

<div class="empty">
  <div class="skeleton"></div>
  <p><strong>No files yet</strong></p>
  <p class="muted">Upload the first asset to start the review.</p>
  <button class="btn btn--primary">Upload</button>
</div>
```

The five states reviewers always ask about: **empty, loading, error, permission-denied,
and long-content.** Draw them as extra screens in the same board rather than describing
them in prose.

## Annotations

```html
<span class="pin">4</span>            <!-- numbered marker, inline in the UI -->

<ol class="notes">
  <li><span class="pin">4</span><span>Upload needs a plan-limit error state.</span></li>
</ol>

<div class="todo">
  <div class="todo__head">Out of scope</div>
  <span class="muted">Billing, SSO, and notification preferences are separate flows.</span>
</div>
```

Pins belong on the element they describe, in reading order. The notes panel sits as
the last section of the board at `width:420px`. Keep notes to one sentence each;
if a note needs three, the screen needs a decision.

## Icons

Inline SVG only, `stroke="currentColor"` or `#000`, `stroke-width="2"`,
`fill="none"`, round caps, 18–24px. No icon fonts, no emoji.

```html
<!-- search -->
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg>
<!-- menu -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
<!-- close -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
<!-- plus -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
<!-- chevron-down -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
<!-- check -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>
<!-- upload -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4m0 0L7 9m5-5 5 5M4 17v2h16v-2"/></svg>
<!-- bell -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>
<!-- user -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
<!-- filter -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
```

## Marketing pages (long-scroll sites)

A homepage is one tall `.screen--desktop` made of stacked `.section` blocks.

```html
<section class="section section--hero">          <!-- centred, no top rule -->
  <span class="lens">A · Ethos + Authority</span>  <!-- annotation, not UI -->
  <h1 class="display">A design-led, AI-native product studio</h1>
  <div class="proof-strip"><span class="proof"><b>Woven</b> acquired by <b>Slack</b></span></div>
</section>

<section class="section section--tight section--center">
  <div class="logo-wall"><span class="logo">Socure</span> …</div>   <!-- names, never logo images -->
</section>

<section class="section">
  <p class="quote--xl">"…"</p>                      <!-- also .quote, .quote--sm -->
  <div class="cite"><div class="avatar">ES</div><div><strong>Name</strong> · Role</div></div>
  <div class="media"><span class="play"></span></div>            <!-- video placeholder -->
  <div class="flow"><span class="flow__step">Context</span><span class="flow__arrow"></span>…</div>
</section>

<section class="section section--loud section--center">   <!-- the close: 3px top rule -->
  <a class="btn btn--bold btn--lg">Book a call</a>          <!-- repeat CTA: bold, never solid -->
</section>

<div class="cta-bar"><a class="btn btn--primary btn--block">Book a call</a></div>  <!-- sticky mobile -->
```

- `.lens` names the persuasion lever (Cialdini / Aristotle) a section pulls. It is
  dashed and italic so it never reads as UI. On mobile it drops into the flow.
- The hero CTA is the page's one solid button. Later repeats of the same action use
  `.btn--bold`.
- `.flow__step--quiet` (dashed) is the "old way" or not-yet state in a before/after.

## Adding a component

If a screen needs something the sheet does not have:

1. Add it to `assets/wireframe.css` under the right section, built only from `--ink`,
   `--paper`, `--stroke*` and the spacing scale.
2. Run `scripts/lint-mono.sh assets/wireframe.css`.
3. Use it in the wireframe.

Do not add one-off `style="border-color:#999"` fixes in a screen file. The sheet is
the design system; a wireframe that invents local styling is not reusable.
