# Review checklist

Run this before handing a wireframe back. Two passes: mechanical (`scripts`), then
judgement (eyes).

## Pass 1 — mechanical

```bash
scripts/lint-mono.sh <file>.html          # must print ✓
scripts/render.sh <file>.html <file>.png  # must print "ink: grayscale only ✓"
```

Both must pass. If the lint reports a colour, the answer is never "make it light grey
just here" — it is stroke weight, fill style, size, or space.

## Pass 2 — the drawing

Read the PNG, not the HTML.

**Structure**
- [ ] Every screen has a numbered caption saying what it is and which device.
- [ ] Board width matches the frames inside it (`--width 1500` for one 1280 desktop
      frame + captions; wider if you placed frames side by side).
- [ ] Navigation is consistent across screens — same order, same current item marked.
- [ ] Padding is uniform; nothing touches a frame edge.

**Hierarchy**
- [ ] Each screen has exactly one loudest element (usually the primary action or the
      page title). Two solid black buttons means no hierarchy.
- [ ] Secondary text differs by size/weight/case — not by grey.
- [ ] Rules and borders earn their place; if a box adds no grouping, delete it.

**Content**
- [ ] Real labels from the domain, no lorem ipsum, no "Lorem", no "Item 1".
- [ ] Long-content cases: the longest realistic name, 3-line titles, empty columns.
- [ ] Media is a cross with a tag when the subject matters.

**States**
- [ ] Empty, loading, error, and permission-denied are either drawn or declared out
      of scope in `.todo`.
- [ ] Every form shows one validation error state.
- [ ] Disabled controls say why (annotation), not just "greyed".

**Annotations**
- [ ] Pins sit on the element they describe, numbered in reading order.
- [ ] Every open question is in the notes panel — no undecided behaviour hidden in
      the drawing.
- [ ] `.todo` block states what is deliberately out of scope.

**Flow**
- [ ] The screens are in the order a user hits them, and the caption numbers agree.
- [ ] Anything that navigates elsewhere is annotated with where it goes.
- [ ] A reviewer can answer "what happens next?" for every primary action.

## Pass 3 — the honest question

Ask: *what decision does this drawing force?* A wireframe that could be replaced by
a bullet list is not a wireframe. If the drawing resolves no argument and surfaces no
question, cut it down until it does.

## Handing over

Deliver, in this order:

1. the PNG(s) — what people actually look at;
2. the `.standalone.html` (from `render.sh --inline`) — openable without the repo;
3. one line per open question, copied from the notes panel into the message.

Never deliver only an HTML file that depends on a stylesheet the reviewer does not
have.
