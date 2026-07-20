# Performance & security audit — questions for Cat

_The 2026-07-20 audit (docs/audits/performance-security-audit-2026-07-20.md)
found no high-severity problems, and the engineering fixes it recommended are
built. A few things surfaced that aren't engineering calls — they're yours.
Nothing here is urgent enough to block the current build, but #1 should be
settled before real students use a live LLM key._

## 1. Student words going to the AI provider — needs your decision (OQ1)

**What happens today:** when a real LLM key is configured, three features send
a student's own typed words to Anthropic (the AI provider): the brain-dump
sorter (to split their list into items), the "walk me through why my plan
changed" explanation, and — only if we turn it on — a second-pass crisis
check. Nothing is logged on our side, nothing identifies the student to the
provider, and with no key configured ("verbatim mode") nothing is ever sent.

**Why it needs you:** our users are assumed to be minors. Sending their words
to a third party — even de-identified — deserves an explicit decision, not a
default. The provider offers terms where submitted text is never used to
train models and is deleted after processing; we should get that in writing
(a data-processing agreement) before launch, and decide what we tell
students/parents about it.

**What we need from you:**
- [ ] Yes/no: are you comfortable with these three features sending student
      text to the provider under no-training, no-retention terms?
- [ ] If yes: one plain sentence, in your voice, for the privacy page about
      what happens to what a student types.
- [ ] If no: we run interpretation-free (the sorter falls back to a simple
      deterministic split — it already does this without a key).

## 2. How hard should we look for crisis language?

**What happens today:** every free-text message is screened by a fixed
word/phrase list before anything else runs (this is the floor — nothing can
turn it off). It catches direct phrasing and common disguises (l33t-speak),
in English only. There's also an optional second layer — the AI classifier
from #1 — that can catch paraphrased or indirect crisis language the list
misses. It can only ever ADD a catch, never remove one. It's currently OFF.

**The trade-off:** turning the classifier on means more caught cries for help
that don't use the exact words — and it means every free-text message makes
an AI call (see #1; it's also a little slower and costs more). Leaving it off
means the list is the whole net.

**What we need from you:**
- [ ] Should the second-pass classifier be ON by default? (Our
      recommendation: yes, once #1 is settled — it only errs toward showing
      someone the crisis resources.)
- [ ] Do you have students writing in languages other than English? The word
      list is English-only today; if that's a real population, we should plan
      a multilingual list with the safety review.

## 3. Juniper's lines now "type out" as they arrive — check the feel

Before, a whole line popped in at once after a wait. Now the text appears
progressively while it streams, like someone writing to you. We think that
reads calmer than a sudden block of text — but tone is yours. Try a check-in
and tell us: does the typing feel steady, or does it read as hurried? We can
tune the pace or go back to whole-line arrival with one small change.

## 4. Habit streaks now display exactly up to one year

To keep the dashboard fast for long-time users we now load a year of history
per habit. A streak longer than 366 days would display as 366. If someone
ever gets there, do you want "365+"-style wording, a small celebration, or is
the number fine? (No rush — this is a nice problem to have.)

## 5. Standing reminder: age attestation (OQ4)

Unchanged from the checklist, re-surfaced by the audit: onboarding still has
no 13+ attestation or parental-consent slot. It's waiting on legal input, not
engineering. When you have that guidance, the onboarding flow is ready to
take it.
