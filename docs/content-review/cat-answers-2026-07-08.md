# Trailhead — open questions, answered by Cat

_Saved 2026-07-08._

> Verbatim export from `questions-for-cat.html` (the download Cat sent back).
> This is the source of record for the "Decisions from Cat — 2026-07-08"
> section in `docs/Trailhead_Buildmap.md`. Voice-transcription artifacts are
> preserved as-is; where a line was garbled, the buildmap flags it rather than
> guessing.

## Checkpoint 1 — Powering Juniper

_Unblocks the next build stretch_

### Which AI should power Juniper's adaptive voice?

_Why it matters:_ Guidepost runs fully without any AI today (it streams your exact words). The AI's only jobs are softening phrasing to the right tone, reading free-text answers, and a second safety check. We need to pick a provider before turning that on.

_Where we were leaning:_ Our recommendation: Anthropic's Claude, on a small fast model, with your words as the guaranteed fallback if it's ever unavailable.

**Cat's answer:** Initially we're, we are going to use the dialogue tree and my exact no words, but ultimately we're going to set up a database using the source material that the AI can draw from 2 answer and guide the user. Because the dialogue tree as it is, is not complex enough to meet what  People's needs are going to be. We will use supabase as the database.

### What's free, what's paid, and at what price?

_Why it matters:_ The free tier has to be genuinely useful, never a teaser — that's a core value. We just need your lines for where free ends and paid begins, and the price.

_Where we were leaning:_ Our placeholder: FREE = one full check-in a day + unlimited Mini Resets. PAID = unlimited check-ins, the full dashboard, community, and history. Price: not set.

**Cat's answer:** We'll go with your recommendation for the placeholder and the price will be, it will be determined later.

## Checkpoint 2 — Keeping it safe

_Highest priority — this is the deep-water layer_

### Do these crisis-moment lines sound right in your voice?

_Why it matters:_ When a student types something that signals real danger, Juniper pauses everything and shows this. The boundary line and the hotlines are already locked exactly as written. The other two lines are our drafts and need your ear most of all.

> Intro (draft): “Before we go any further — what you just shared sounds heavy, and it matters more than any plan we could make today.”  •  Boundary (locked): “I'm not a counselor, but here's someone who can help.”  •  Then: 988 Suicide & Crisis Lifeline, and Crisis Text Line (text HOME to 741741).  •  Trusted adult (draft): “Is there an adult you trust — a parent, a teacher, a counselor — you could talk to today? You don't have to carry this alone.”

**Cat's answer:** Safe email to your farm and I definitely like that regal breakfast and we're uncertain to say how to say it and I want the AI to  Prepare the user to go to the trusted adult by giving the user tools, scripts, and guidance.

### How many heavy free-text moments before Juniper gently pulls back?

_Why it matters:_ To keep the app from pulling a student deeper than it should, after a few emotional open-text turns in a row Juniper offers a grounding reset instead of another probing question. We need your number for 'a few.'

_Where we were leaning:_ Our placeholder: 3 turns in a row.

**Cat's answer:** For now, let's keep it at 3 probing questions. And then the grounding reset that is not dismissive in tone. So I don't want it to be too abrupt or too much of a shift, and we're going to add more layers to  This part of the app later

### Who runs the Red Path safety review, and roughly when?

_Why it matters:_ The Red Path (overwhelm / emotional flooding) is built but locked behind a gate that only a signed safety review can open — it cannot reach students until then. We need to know who does that review and your rough timing.

**Cat's answer:** So the thing about the red path is it doesn't necessarily mean that the student is in imminent danger, a red path just means that the user is very dysregulated and needs nervous system reset, that's why details of the intensity in the frequency of how many times a user is in the redpath.  How long they stay in the red path to help define that line between this is normal human dysregulation, and you need a medical, you know, professional.\n Student could be in the red path, everyday, and if end up in the green path.  Where they could start on the green path, everyday and end up on the red path, depending on what the day brings, so it's not something that builds in a positive or negative direction. The app helps the user navigate the ups and downs of the day/life.

## Checkpoint 3 — Your words

_Small content calls that are yours to make_

### The very first thing a student taps — do these two buttons sound like you?

_Why it matters:_ The opening question is your line, “How are you feeling today?” Under it are two options that route to the Green and Yellow paths. Those two labels are our drafts.

> Green (has energy, wants structure): “I've got energy and a plan in my head.”  •  Yellow (knows what to do but can't start): “I know what to do but I can't start.”

**Cat's answer:** I think for the yellow wording. It should be more like I know what I need to do or want to do, but I'm not sure how to start. So based on what the user's answer is to that initial question is which path they're starting on? So it won't just be yellow and green. It will also be red and blue and depending on the state of the user. When they begin using, it is what the AI is going to respond to  To help move them into a more regulated state, or to help them utilize the regulated state that they're in

### Two tiny wording picks (G-G3 & G-G4).

_Why it matters:_ Your path doc had two phrasings for each of these and we don't want to guess.

> 1) Stage 1 opener: “What are 1–3 things at the top of your mind today?”  vs  “What are 3 things…?”   2) A Stage 4 tip line: “Real-life alignment reduces overwhelm and builds flow.”  vs  “Cohesion = Flow = Less Stress.”

**Cat's answer:** Stage 1: what are 1-3 things at the top of your mind today?"
Stage 4: We want to reach the flow state by aligning your goals and your actions.

### How should the Discover Your Path quiz change how Juniper talks?

_Why it matters:_ The 5-minute quiz is built and its answers are saved, but we're not scoring them yet — because how an A/B/C answer should shift Juniper's tone (more structure? more reassurance? more directness?) is a call only you can make. This also unlocks future tutor matching.

**Cat's answer:** Actually, the way that the AI will shift their tone is based on the answers that they give using Vanessa. Van Edwards source material, which we'll have the API for so it's based off of the Big Five personality test.  But she goes into detail about communication style, and that's what the AI is going to tap into to respond to the user.

## Checkpoint 4 — The bigger picture

_Later milestones — your direction now saves rework later_

### Where should community live?

_Why it matters:_ Your vision has containers for students, parents, and teachers with overlap spaces. We can build that inside Trailhead, or start it on an existing platform like Skool. The two paths look very different for us, so your lean matters early.

_Where we were leaning:_ Our default if you have no strong preference: build it in-app so student privacy stays under our roof.

**Cat's answer:** I agree, keeping it in app. One thing that I think we can steal from skool is the kind of forum format for people to post and others to be able to answer

### Is community free or paid — and who keeps it safe?

_Why it matters:_ Two open pieces: whether community is part of the paid tier or open to everyone, and who moderates it (reports and moderation ship from day one either way).

**Cat's answer:** Let's actually keep the community forum limited to parent and teacher accounts. So it's more focused on answers and questions and resources rather than students connecting with other students or students connecting with adults.

### Anything region-specific we must handle for minors before schools?

_Why it matters:_ We're building privacy-first for minors: a simple 13+ checkbox, and we collect as little as possible. Before we sell to schools there may be consent rules (state, district, COPPA/FERPA specifics) you know about that we should plan for now.

_Where we were leaning:_ Our current posture: 13+ self-check + data minimization, with a parental-consent step reserved for the school rollout.

**Cat's answer:** 13+ self-check + data minimization, with a parental-consent step reserved for the school rollout

### Tutoring is the original dream — how do you picture keeping it safe?

_Why it matters:_ Tutor matching is the far-horizon milestone. Tutors are adults working with minors, so vetting and safeguarding will be its own big piece. We're not building it yet — we just want your instinct so we design toward it, not away from it.

**Cat's answer:** I do think that any one who wants to tutor will have to go through a background check. In like criminal history and we'll have standards for that, and I think that the tutoring aspect is something that's going to roll out in a small geographic area or with a small kind of contained group of users, and then  We, we will be able to make it more scalable. As we go.

---

_Line-by-line wording drafts (beyond the ones above) live in the repo's content-review notes — we can walk those separately whenever you want._
