# docs/v2 Alignment for Cat — North Star review, flags, and copy proposals

I read all eight docs/v2 documents and audited the app against them. The short
version: **the build already embodies most of the philosophy** — the
deterministic engine (LLM adapts, never invents), gentle streak resets,
patterns-oriented weekly reflection, and privacy-first safety telemetry all
line up. What changed in this pass is governance and prompt guidance, not your
authored content. This packet lists what I changed, what I found that needs
your call, and copy proposals drafted for your approval (nothing user-facing
was changed without you).

## What to do with this doc
- Resolve the three **flags** below (one is a truncated source file).
- Approve, rewrite, or reject each **proposal** — they are drafts, not shipped.
- Skim "What changed in this pass" to see the non-copy alignment work.

Decisions you already made (2026-07-19), recorded in CLAUDE.md:
- **Full alignment pass** (this packet).
- **Student-primary stays** — docs/v2's lifelong "people" framing noted as
  future direction.
- **"Guide" wording is fine as-is** — "Juniper — a guide" (marketing) and
  "Guidepost is not the guide. It is a guidepost" (philosophy) are compatible:
  Juniper is the voice, Guidepost is the system.

---

## 🚩 Flags — need your input

- **F-V1 — `docs/v2/EducationalPhilosophy.md` is truncated.** The file ends
  mid-sentence: "It supports judgment, communication, help-seeking,
  decision-making, and th". The rest of the document didn't make it into the
  repo. Please provide the complete text — I did not fill it in.

- **F-V2 — docs/v2 numbering gap.** Files carry numbers 00 (Preface) and
  03–07, but `CorePrinciples.md` and `WhyTrailheadExist.md` are unnumbered.
  If they are 01/02, say which is which and I'll rename for a clean sequence;
  if other documents are still coming, ignore this.

- **F-V3 — "Discover Your Path" quiz title vs. Principle 15.** The onboarding
  quiz is titled "Discover Your Path," but CorePrinciples 15 says *"Your path
  is created, not found"* — and ThePatternWeSee explicitly pushes back on
  telling young people to "discover their true path." Options, all drafts:
  - *"How You Work"* — closest to the docs' own question list ("understand how
    you work")
  - *"Getting to Know You"* — plainest, least loaded
  - *"Your Starting Point"* — keeps the trail metaphor without "find your path"
  - Keep "Discover Your Path" — if you read "your path" as the path you're
    already creating, not one hidden in the world.
  Affects: quiz page title, intro card heading, settings link. (The quiz
  *content* — your Big Five scenarios — is untouched either way.)

---

## ✍️ Proposals — needsCat drafts

- **P-V1 — Quiz intro framing (extends existing gap G-O1).** The current
  intro draft already says answers "teach Juniper how you like to be talked
  to" — that's aligned (informs tone, never labels). If you want the
  patterns-not-labels promise explicit, a candidate second line, yours to
  rewrite: *"This isn't a personality test and it won't put you in a box —
  it's just information about how you work."*

- **P-V2 — Landing connective copy (existing gap G-L1).** docs/v2 gives you
  strong candidate language for the still-unwritten connective copy, e.g.:
  - *"Before you can choose your path, you have to be able to see yourself
    clearly."* (WhyTrailheadExist)
  - *"Your path isn't out there waiting to be found. It's under your feet."*
    (ThePatternWeSee / Principle 15)
  - *"No single grade, label, or bad day tells the whole story of who you're
    becoming."* (Principle 3 / 16, teen register)
  These are adaptations of your own docs/v2 phrasing — mark any you'd approve
  verbatim, or rewrite.

- **P-V3 — Future personality reports (no action now).** Scoring is still
  blocked on OQ2. I encoded the ThePersonBeneath design implications as a hard
  rule in `lib/personality/scoring.ts`: if scores are ever shown, they read as
  patterns/tendencies inviting reflection, never as types or labels. When OQ2
  is answered, report copy will come back to you as a fresh needsCat packet.

---

## ✅ What changed in this pass (no user-facing copy touched)

- **CLAUDE.md** — docs/v2 added as the canonical philosophy layer (above the
  PRD in interpretive precedence); new "Philosophy in Practice" section
  (Learning Loop, patterns-not-labels, questions-over-advice,
  behavior-is-information, ownership); two new "When In Doubt" checks; your
  three decisions recorded.
- **Juniper persona prompt** (`lib/llm/prompts/juniper.ts`) — added:
  *"Never present a feeling, pattern, or trait as who the student is — it's
  information, not identity. Leave interpretation with the student: don't
  assign hope, motivation, or direction, and don't add certainty a line
  doesn't have. Steady beats cheerful."* The rephrase-only hard rules are
  unchanged — the LLM still cannot add content or change meaning, so your
  authored lines still ship verbatim in verbatim mode and meaning-stable in
  adaptive mode.
- **Plan-change explainer** (`lib/llm/plan-change.ts`) — added hard rule:
  *"Describe what the student said and chose — never characterize who they
  are."*
- **Personality scoring stub** (`lib/personality/scoring.ts`) — patterns-not-
  labels requirement documented for whenever OQ2 unblocks scoring.

## ✅ Audited, already aligned — no change

- **Streak System** — gentle reset copy ("Fresh start today. Every day you
  show up counts." / "No streak-shaming here") matches Principles 1, 12, 13.
- **Progress Reflection** — your habit-loop template and end-of-week prompts
  are verbatim and are exactly the Learning Loop's reflection step.
- **Aha! log** — neutral, student-owned insight capture; no labels.
- **Brain-dump interpreter** (`lib/llm/interpret.ts`) — segments the student's
  own words only; already forbidden from inventing or advising.
- **Safety/crisis content** — boundary language ("I'm not a counselor…"),
  trusted-adult prompts, and aggregate-only telemetry match GuidepostPhilosophy
  ("encourage someone to involve a trusted person") and Principle 24 (privacy
  for honest reflection).
- **The engine itself** — authored content canonical, LLM constrained to tone,
  state machine owns flow: this is "AI should amplify human wisdom, not
  replace human judgment" (Principle 22) already built.
