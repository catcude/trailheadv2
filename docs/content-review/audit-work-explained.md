# What I built — in plain English

_You asked for a "performance and security audit and an optimization plan," and
then for the work itself. This is the plain-language version of what actually
got done — no tech jargon. If you want the technical record it's in
`docs/audits/` and `docs/plans/`, but you shouldn't need it._

## The bottom line first

Trailhead was already in good shape and genuinely safe before I touched it. I
went through the whole thing carefully looking for two kinds of problems — places
where it was slower than it needed to be, and any weak spots in how students'
information is protected. I didn't find anything alarming. What I did was make
the app noticeably **faster to load**, and I **locked a few extra doors** that
were already mostly closed.

**Nothing about how Juniper talks to a student changed.** Not a single one of
your words was touched. The only thing a student might notice is that Juniper's
replies now appear more naturally (more on that below), and everything loads a
bit quicker.

---

## Part 1 — Making it faster

### The dashboard now asks for everything at once

Think of the dashboard (habits, streaks, aha moments, weekly horizon) as needing
to fetch several things from the filing cabinet before it can show you the page.
Before, it was fetching them **one at a time** — ask, wait for the answer, ask
the next, wait again. I changed it to ask for everything **at the same time** and
wait once. Same information, same privacy, but the page shows up roughly twice as
fast. The dashboard is the first thing a student sees when they log in, so this
one matters.

### The landing page stopped carrying luggage it doesn't need

When someone visits the Trailhead homepage, their phone or computer has to
download the page before it appears. That download was secretly including the
**entire** check-in script for **all four paths** — including the Red and Blue
paths, which aren't released yet. Every single visitor was downloading all of it,
even though the little check-in taste on the homepage only ever uses Green and
Yellow.

Two problems with that: it made the page heavier (slower) than it needed to be,
and it meant the not-yet-released, not-yet-safety-reviewed Red path words were
technically being sent out to the public. I fixed it so the homepage now carries
**only** the small piece it actually uses. The homepage is lighter, and the
unreleased content stays where it belongs — private, until you and the safety
review say otherwise.

### Juniper now "types" instead of popping in

Before, when Juniper replied, there'd be a pause and then the whole message would
appear all at once in a block. Now the words appear as they arrive, the way it
looks when a real person is typing a message to you. It reads calmer and more
human. (I'd genuinely like your read on the feel of this — it's noted as a
question in the questions doc.)

### The check-in only loads a tool when it's needed

The check-in has eight little interactive tools (the mood picker, the Covey
sorter, the mini-reset toolkit, and so on). Before, all eight were loaded up
front, even though a student only ever sees one at a time. Now each one loads the
moment it's actually needed. Less waiting, nothing wasted.

---

## Part 2 — Locking a few extra doors (the security side)

None of these were open holes — think of them as adding a second lock to doors
that already had one good lock. That's the responsible way to protect kids' data:
never rely on a single thing.

### A second ID check on a student's own data

The system already made sure a student can only ever see their own check-ins,
habits, and reflections — that protection sits deep in the database and it's
solid. I added a second, independent check in the app itself that asks "is this
really their data?" before handing anything back. If the first lock ever failed,
the second one still holds. A student's private dialogue stays theirs, full stop.

### A stricter rule about what's allowed to run on private pages

On the logged-in pages (where a student's real words appear), I tightened the
rule for what code the browser is allowed to run, so that only our own trusted
code can run there. This is a standard protection against a nasty class of attack
where someone tries to sneak malicious code onto a page. The public marketing
pages keep the ordinary setting — there's no private student content there to
protect.

### Turning away requests that didn't come from us

I added a check so that actions like saving or closing a check-in only go through
if the request genuinely came from the Trailhead site itself — not from some
other website trying to act on a student's behalf without them knowing.

### Speed bumps so nobody can hammer the buttons

A couple of buttons (closing a session, pulling up your weekly horizon) had no
limit on how fast they could be pressed in a row. I added generous limits — high
enough that a normal student will never notice, low enough that nobody can abuse
them.

### The payment page no longer trusts an address it's handed

When a student goes to manage a subscription, the app sends them off to the
payment provider and back. I made sure the "back" address is one we've set
ourselves, rather than trusting whatever address the incoming request claims —
so that redirect can't be pointed somewhere it shouldn't go.

---

## Part 3 — What still needs you

A few things that came out of this aren't mine to decide — they're yours, and
they're not urgent enough to hold anything up. They're written out plainly in a
companion file: **`audit-questions-for-cat.md`** (same folder as this one). The
most important one is a decision about student's typed words being sent to the AI
provider when we switch on a live AI key — worth settling before real students
use it.

---

## In one sentence

The app is faster and a little better protected, none of your authored content or
Juniper's voice changed, and the only thing a student will feel is a smoother,
more natural check-in.
