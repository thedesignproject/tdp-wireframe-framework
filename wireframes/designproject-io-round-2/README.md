# designproject.io: homepage wireframes, round 2

Five more homepage structures for the new designproject.io, drawn with the
`create-wireframe` skill (Balsamiq Sans, black on white). Round 1 drew the five stories
raised on the 2 Nov call ([`../designproject-io`](../designproject-io/README.md)). Round 2
tries five stories nobody proposed yet, so the team picks from a wider field. Start with the
overview, then open any version.

| Board | Story | Hypothesis it tests |
|---|---|---|
| [00 Overview](00-overview.png) | all five spines, sections worth borrowing, principle matrix | — |
| [V6 Proof Up Front](v6-proof-up-front.png) | Split hero (project shot + client quote) → logo wall → results (projects with their numbers) → what we do → watch us build → call | "Show who trusts us and what we built before anyone has to scroll." |
| [V7 One Story](v7-one-story.png) | Hero → Imera, zero to enterprise in 3 months, told in four chapters with a clickable prototype → other results → ways to work with full prices → call | "One story told well beats ten logos. Make them want it, then show the price." |
| [V8 Meet the Makers](v8-meet-the-makers.png) | Hero → logo strip → founder's note → ways to work, shown by who's on each team (no prices) → work, with the faces of who shipped it → quotes → meet your team | "Senior people, made faster by AI. Show the humans and what they shipped." |
| [V9 Objections, Answered](v9-objections-answered.png) | Hero → five buyer questions, each answered with proof → logo strip → trial terms → call | "Buyers arrive with doubts. Answer them in the order they have them." |
| [V10 Time Receipts](v10-time-receipts.png) | Hero → time-saved quote → their estimate vs. shipped → Day 7 / 30 / 60 → quotes → ship this quarter | "AI-native has to mean faster. Prove it in time, not in adjectives." |

Each `.png` is what to review. Each `.standalone.html` opens in any browser with no repo.
Each `.html` is the source (needs the skill's `wireframe.css`).

## Same rules as round 1

- **Hero, topbar and footer are identical** to round 1, so all ten versions compare story,
  not headline. V6 keeps the same hero words but splits the layout to make room for proof.
- **One primary action:** Book a call. Solid only in the hero; repeats are bold-outline.
- **No process explainer.** V10's "Day 7 / 30 / 60" shows outcomes, not steps. V10 is the closest to the line; its notes flag it.
- **Case studies are never the first proof.** V6 shows a project shot with the client's quote
  over it; the case study is one click behind it.
- The persuasion tags and per-board maps use the same vocabulary as round 1 (Cialdini's
  seven principles, Aristotle's three appeals plus kairos). It's explained in plain words on
  the [round 1 overview](../designproject-io/00-overview.png).

## How round 2 relates to round 1

Round 1's main bets were social proof, reciprocity and unity. Round 2 bets on what round 1
used only as support: proof in the first screen (V6), authority (V9), one story (V7), liking (V8) and timing (V10). The
likely winner is one spine from either round plus one or two borrowed sections. The
overview's **Borrow** table suggests where each round 2 section could slot into a round 1
spine.

Round 2 mostly skips reciprocity and unity. If a round 2 spine wins, borrow V4's open
toolbox or V5's "teams like you".

## New content asks

| Version | Needs |
|---|---|
| V6 | Three hero slides, each a project shot + quote + face + logo (only Socure has all four today); Finvisor and Big Health result metrics. |
| V7 | An Imera testimonial (they have none); OK to embed Imera's prototype publicly, or a clickable mock; which plan Imera is on; a "from [$X]" for Product Team; trial terms. |
| V8 | A founder's note in their own words; real team photos with each person's sign-off; true "who worked on what" pairings. |
| V9 | Confirmation from sales that these are the five objections, in this order; real days from signed to started; trial terms in writing. |
| V10 | One client's time-saved quote on the record; their own pre-project estimate and the real duration for each receipt (only Imera's 3 months is known). |

Still open from round 1: Vyro vs. Vouch (MrBeast), the Finvisor metric, and a true capacity
number for every "[N] spots" line.

## Re-render

```bash
S=.agents/skills/create-wireframe/scripts
$S/lint-mono.sh wireframes/designproject-io-round-2/*.html
$S/render.sh wireframes/designproject-io-round-2/v6-proof-up-front.html --width 1820 --height 9000 --inline
$S/render.sh wireframes/designproject-io-round-2/00-overview.html --width 1800 --height 3000 --inline
```
