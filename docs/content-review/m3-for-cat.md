# M3 for Cat — Blue + Red paths, permeability, and the dashboard extras

Everything in M3 is **flag-gated and invisible in production today.** Nothing
ships to students until you approve the content (Blue) and — for Red — a signed
safety review is completed. This packet lists what's built, every place I used
your words verbatim, and every gap I left as a hidden slot or a clearly-marked
draft (never invented).

## What to do with this doc
- Read the Blue and Red flows in preview (a human flips the flags per-branch).
- Fix or approve each **needsCat draft** line below.
- Fill each **gap** (or tell me to keep it hidden for now).
- For Red: this is also the input to `docs/safety/red-path-review.md`.

---

## 🟦 Blue Path — "I'm fine" (`content/paths/blue.ts`)
Flag: `NEXT_PUBLIC_FF_BLUE_PATH`. Content approvals only (no safety review).

Your words are entered verbatim: Stage 1 opener + all three options, Stage 2
metaphors, Stage 3 mismatch prompt, Stage 4 needspotting, Stage 5 reorientation,
Stage 6 closure, and the five Reflection Tags (as Blue's quote bank).

**Gaps / drafts to resolve before unflagging Blue:**
- **G-B1 — Stage-2 per-metaphor responses.** The doc says "Juniper replies with
  tailored responses based on selection," but those lines aren't written. Right
  now all five metaphors go to the shared Stage-3 beat. *Do you want a tailored
  line per metaphor?*
- **G-B2 — Mood-Matching Visual deck.** The color-wheel / metaphor-deck items
  aren't authored, so that visual is hidden; the five authored metaphors are the
  Stage-2 selection. *Provide the deck, or keep the text metaphors?*
- **G-B3 — Stage-6 grounding script.** "Can we end with something grounding?"
  routes through a hidden slot straight to the reflection (never dead-ends). The
  breath/affirmation script needs your words. (`blue.ts` node `s6-grounding`.)
- **G-B4 — heart-loud interim + ONE draft line.** While Red is gated, Stage-3
  "my heart's loud" routes to an interim that leads into Quiet Needspotting so
  the user is never left hanging. It uses one **draft** bridge line: *"That
  sounds like a lot to be holding. Let's slow down and take care of you first."*
  — approve or rewrite. When Red is released, this option retargets to Red.
- **Reflection prompt (draft):** *"Which of these feels true to carry with
  you?"* (matches the Yellow pattern) — approve or rewrite.
- **Note:** Blue has no separate evening reflection set, so it reuses the same
  Reflection Tags morning and evening (same as Green/Yellow).

---

## 🔴 Red Path — "Overwhelmed" (`content/paths/red.ts`)
Double gate: `FF_RED_PATH` **and** `RED_PATH_RELEASE_APPROVED`. **Cannot ship
without a signed safety review** (`docs/safety/red-path-review.md`).

Verbatim: entry opener, Stage 1 physical check, Stage 1B options, Stage 2 weight
prompt, Stage 3A intentions, Stage 3B reset, the regulated-shift offer, Stage 4
Covey framing, Stage 5 reality check + tone options, Stage 6 prompt, and BOTH
the before-5PM and 5–10PM resilience reflection banks. The Red Mini Reset
Toolkit (breathing / 5-4-3-2-1 / water / walk / stretch + self-talk prompts) is
verbatim in `content/tools/mini-reset.ts`.

**Gaps / drafts to resolve before unflagging Red:**
- **G-R1 — Stage-2 quick-taps (assumption).** The six weight options (🪨 too
  much / 🧠 can't focus / ⚠️ everything urgent / 🌫️ not sure / 🫂 unsupported /
  🌀 too many emotions) and their 3A-vs-3B routing come from the storyboard.
  *Confirm these six and the routing.*
- **G-R2 — ask-for-help scripts + deadline-reality check.** The doc lists these
  as Mini-Reset items but the scripts aren't written; the toolkit ships without
  them. *Provide the scripts?*
- **G-R3 — Stage-5 "why we shifted your goal" (draft).** Only "Does this
  explanation help?" is verbatim; the compare sentence is a **draft**: *"Let me
  show you why we shifted things—how the new plan lines up better with your
  long-term vision, your energy today, and your Weekly Horizon."* plus the
  follow-up *"What feels off or missing? We can adjust."* — approve/rewrite.
- **Stage-1 caring-action (draft):** *"Let's take care of that first—grab a
  snack, some water, or a few minutes to rest. Come back whenever you're
  ready."* — approve/rewrite.
- **Mini-Reset re-entry (draft):** *"Feeling more grounded now? When you're
  ready, we'll head back in and name what matters."* (the doc gives a completion
  cue, not a Juniper sentence.)
- **G-R5 — escalation threshold.** The intensity/frequency/duration line between
  everyday dysregulation and "needs a professional" is the **safety review's**
  job to define (D5). Computed only from the user's own history, shown only to
  them.
- **Deferred:** the optional "revisit your vision map / dream video" close isn't
  built (no such feature yet) — left out, not faked.

---

## 🔀 Permeability (mechanics, always on but only reachable via the above)
A check-in can move between paths mid-session: Blue "head full" → Yellow, Blue
"keep exploring" → Yellow, Blue "ready to tackle" → Green, Red "feeling
regulated" → Green/Yellow. The state machine owns these shifts; the LLM never
does. A shift into a gated path is refused.

---

## 📊 Dashboard extras (`FF_DASHBOARD_EXTRAS`, off in production)
- **Streak System** — gentle summary, no shame on resets. Copy is a **draft**
  (needsCat): *"Miss a day? No streak-shaming here — you just pick back up.
  Resets are part of it."*
- **Goal Microflow** — short/mid/long goals on the existing table; pause/drop/
  reopen with no pressure framing.
- **Progress Reflection** — your Cue → Craving → Response → Reward template and
  end-of-week prompts, verbatim from the Green doc.

---

## ✅ Unflagging checklists

**Blue (content approvals only):**
- [ ] G-B1, G-B2, G-B3 filled or confirmed-hidden
- [ ] G-B4 interim line + reflection prompt approved
- [ ] Full Blue walkthrough in preview reads in your voice
- [ ] Then set `NEXT_PUBLIC_FF_BLUE_PATH=true`

**Red (content approvals **and** signed safety review):**
- [ ] G-R1, G-R2, G-R3 + the Stage-1 and re-entry drafts approved
- [ ] G-R5 escalation threshold defined in the safety review
- [ ] `docs/safety/red-path-review.md` completed and **signed**
- [ ] Only then set `FF_RED_PATH=true` **and** `RED_PATH_RELEASE_APPROVED=true`
