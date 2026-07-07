# M1 content review — for Cat

Everything Juniper says in the app is your authored text, entered verbatim
(295 strings pinned in `content/authored.lock.json` — CI fails if any of them
change without a reviewed `content:` commit). This packet lists the
exceptions: **drafts I wrote that need your approval or rewrite**, and the
**gaps left unfilled** waiting on your content. Every draft is also marked
`needsCat: true` in code.

Approving is easy: reply with rewrites (or "keep") per item; edits land as a
`content:` commit you review.

## 1. Highest priority — safety copy (`content/safety/crisis.ts`)

Your authored boundary line is used verbatim: *"I'm not a counselor, but
here's someone who can help."* Around it, two drafts in Juniper's steady
register:

- **Intro:** "Before we go any further — what you just shared sounds heavy, and it matters more than any plan we could make today."
- **Trusted adult:** "Is there an adult you trust — a parent, a teacher, a counselor — you could talk to today? You don't have to carry this alone."
- Resources shown (factual): 988 Suicide & Crisis Lifeline (call/text 988) · Crisis Text Line (text HOME to 741741).

## 2. The entry router (`content/router.ts`) — gap G-U1

Opening line is yours ("How are you feeling today?", per your 2026-07-07
direction). The two tappable labels are drafts:

- Green: "I've got energy and a plan in my head"
- Yellow: "I know what to do but I can't start"

## 3. Drafted lines inside the paths (all marked in code)

**Green** (`content/paths/green.ts`)
- Second Covey sort beat: "Sort these into Covey buckets again."
- Processing-changes buttons: "Yes — walk me through it" / "No, I'm good — let's keep going" / "That helps" / "There's something you're missing"
- Listening prompt: "Tell me what's important to you that I'm not seeing yet."
- Calendar beat: "Want it added to your calendar — plus future steps if we break it down?" + "Add it to my calendar" / "Not right now"
- Still-stuck fallback: "Want to look back at your Weekly Horizon, or take a quick walk or stretch and come back?" + its two buttons

**Yellow** (`content/paths/yellow.ts`)
- Stage 3 "not sure" helper: "Take a quick glance at your calendar—and at your energy. Which of these feels real for today?"
- Reflection pick prompt: "Which of these feels true to carry with you?"
- Aha! capture: "Want to save an Aha! moment from today—something that clicked?" + "Save one" / "Not today" + "What clicked? A sentence is plenty."

**Fallback chips (UI):** "I don't know" · "Nothing sounds right" · "Still stuck"

**Other UI microcopy drafts:** onboarding welcome ("Hey — glad you're here…"),
quiz intro, dashboard check-in card, wrap line ("That's a wrap for this
check-in."), gentle rate-limit message, Covey quadrant labels ("Urgent +
Important", "Important, Not Urgent", "Urgent, Not Important", "Neither").

## 4. Questions where your docs have two versions

- **G-G3** — Green Stage 1: "What are **1–3** things…" vs "What are **3** things…" — currently using "1–3". Confirm?
- **G-G4** — Green Stage 4 tip: using "Real-life alignment reduces overwhelm and builds flow." (the doc also has "Cohesion = Flow = Less Stress"). Which is UI-facing?
- Yellow has one reflection-quote bank (no evening set) — both variants use it. Want an evening set?

## 5. Gaps shipped EMPTY (never filled with generated text)

These render as slots that hide until your copy lands:

- **G-G1** — Green Stage 2 tip-box body (urgent-vs-important teen examples). Title shown: "What makes something *important but not urgent*?"
- **G-G2** — Green Stage 3 pop-out body (Pomodoro / time-blocking explainer). Title shown: "What is a Pomodoro? What is time-blocking?"
- **G-Y1** — Yellow 2D tailored micro-starts per resistance type (fear of failure / perfectionism / boredom). All three currently route to your authored reframe ("You don't need to win—you just need to begin.").
- **G-Y2** — Yellow 2B one-minute grounding/naming exercise script. Stand-in: your authored 2E line "✏️ Write down one word for how you feel".
- **G-Y3** — Zoom-Out Exercise (referenced in 2C) — omitted entirely.
- **G-Y4** — outcome → reflection-quote mapping (user currently picks freely from your bank).
- **G-G5** — "vision video / dream mind map" rewatch — feature undefined, omitted.

## 6. What needs nothing from you

All six stages of Green and Yellow (incl. every 2A–2E branch, evening
variants, both Mini Reset Toolkits, both quote banks, habit-stacking nudge,
fallback flip prompt) run verbatim end-to-end. The Blue/Red router options
exist but stay hidden behind flags until M3.
