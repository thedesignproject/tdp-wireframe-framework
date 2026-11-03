# designproject.io: homepage wireframes, round 1

Five homepage structures for the new designproject.io, drawn with the `create-wireframe`
skill (Balsamiq Sans, black on white). Start with the overview, then open any version.

**Decision (3 Nov 2026): V1 Credibility Ladder.** The other four stay here as explorations. Round 2 ([`../designproject-io-round-2`](../designproject-io-round-2/README.md))
adds five more directions (V6–V10) and a table of sections worth borrowing into V1.

| Board | Story | Hypothesis it tests |
|---|---|---|
| [00 Overview](00-overview.png) | all five spines + principle matrix | — |
| [V1 Credibility Ladder](v1-credibility-ladder.png) | Hero → logos → big testimonial → results → what we do → YouTube/GitHub → call | "We have zero brand: be credible right away, then keep stacking it." |
| [V2 Wall of Voices](v2-wall-of-voices.png) | Hero → testimonial wall → numbers → one-line what → teams like you → call | "If I don't know the company, I won't read a case study. Many voices beat one deep case." |
| [V3 Problem, Shift, Proof](v3-problem-shift-proof.png) | Hero → your pain → old way vs. TDP → proof → team → ways to work → call | Joshua Bell: the right frame changes the value. Name the pain, then proof lands as the answer. |
| [V4 Open Studio](v4-open-studio.png) | Hero → watch us build → proof strip → open toolbox → quotes → community → call | "Come see us on YouTube and GitHub, then book a call." Give before asking. |
| [V5 Pick Your Path](v5-pick-your-path.png) | Hero → your industry → your stage → free assessment → teams like you → call | "We need verticals." The homepage routes; vertical pages sell. |

Each `.png` is what to review. Each `.standalone.html` opens in any browser with no repo.
Each `.html` is the source (needs the skill's `wireframe.css`).

## What is fixed across all five

- **Positioning and hero.** "A design-led, AI-native product studio": same eyebrow,
  H1, subline, CTAs and acquired-by strip in every version, so we compare story, not
  headline. (From the 2 Nov call: "the hero is always the same, the positioning".)
- **One primary action:** Book a call. Solid only in the hero; repeats are bold-outline.
- **No process explainer on the homepage.** "People don't care how you do it, only that
  you can." Process moves to its own "How we work" page.
- **Case studies are never the first proof.** Testimonials, logos and numbers come first;
  case studies are one click deep.

## The persuasion framework

Every section in every board carries a dashed tag naming the lever it pulls, and each
board has a section-by-section map. The levers:

**Cialdini's seven principles of influence**

| Principle | How it shows up on a TDP homepage |
|---|---|
| Reciprocity | Free value before the ask: YouTube episodes, open GitHub repos, guides, the agentic-workflow assessment |
| Commitment & consistency | Small yeses first: "this is us" cards, a 5-minute assessment, email signup, Product Sprint before Product Team |
| Social proof | Logo wall, testimonials with faces, "50+ funded B2B startups" |
| Authority | Acquired-by strip (Slack, NVIDIA, MrBeast, Accel), hard result numbers, Inc. Power Partner |
| Liking | Real faces, video testimonials, the team on camera, plain-spoken copy |
| Scarcity | A real monthly capacity cap. Bracketed everywhere until we have a true number |
| Unity | "Teams like yours": stage, industry, Friends of Figma / builder community |

**Aristotle's modes of persuasion**

| Mode | Question it answers | Where it lives |
|---|---|---|
| Ethos | Why trust them? | Hero proof strip, logos, results, open repos |
| Pathos | Why should I care? | Pain section (V3), testimonials, "teams like you", the close |
| Logos | Why does it make sense? | Results numbers, before/after model, pricing, stage router |
| (Kairos) | Why now? | Every close: "ship this quarter", capacity |

See the matrix on [00 Overview](00-overview.png) for which version leads with which lever.

## Content we need whatever wins

1. A **time-saved testimonial** in the client's own words (the "three months to one" idea from the call). Collect it; don't write it.
2. The **Finvisor result metric** (Finvisor is first in "Selected work" today but has no number).
3. **8–12 quotes with faces** if V2 wins (we have 3 usable today: Socure, Navengage, OXIO).
4. **Real team photos**, no stock.
5. A **true capacity number** for any scarcity line.

## Fix before anything ships

- Homepage says **Vyro** was acquired by MrBeast; `/work` says **Vouch**. One is wrong.
- Socure funding reads "$100M" on the homepage and "over $100M Series D" on `/work`.
- `/about-us` and `/get-started` still describe a "subscription-based UI/UX design agency",
  which contradicts the product-studio positioning.

## Sources

- Live site and `thedesignproject/designproject.io` (`components/Home/Rebrand*`), read 2 Nov 2026.
- Team call, 2 Nov 2026 (transcript, not committed).

## Re-render

```bash
S=.agents/skills/create-wireframe/scripts
$S/lint-mono.sh wireframes/designproject-io/*.html
$S/render.sh wireframes/designproject-io/v1-credibility-ladder.html --width 1820 --height 9000 --inline
$S/render.sh wireframes/designproject-io/00-overview.html --width 1800 --height 3000 --inline
```
