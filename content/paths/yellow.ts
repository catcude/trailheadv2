import { RETURN_TARGET, type PathContent } from "../schema";

/**
 * Yellow Path — From Stuck to Steady.
 * All Juniper text VERBATIM from docs/paths/yellow-path.md (Cat's IP),
 * including the five adaptive Stage 2 branches (2A–2E).
 */
export const yellow: PathContent = {
  path: "yellow",
  contentVersion: "2026-07-07.1",
  entryNodeId: "s1",
  nodes: {
    s1: {
      id: "s1",
      kind: "choice",
      stage: 1,
      tone: "reassuring",
      juniper: {
        text: "Sometimes our brain hits the brakes even when we know the next step. Let’s figure out what’s slowing you down.",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 1",
      },
      response: {
        text: "You’re not broken. Feeling stuck doesn’t mean you’re lazy—it just means something’s in the way. Let’s explore it.",
        adaptable: false,
        sourceRef: "paths/yellow-path.md §Stage 1 (general response)",
      },
      options: [
        {
          id: "physical",
          label: "😩 I’m tired, hungry, or just physically off.",
          target: "s2a",
        },
        {
          id: "emotional",
          label:
            "😤 I’m carrying something emotionally—frustrated, anxious, or just heavy.",
          target: "s2b",
        },
        {
          id: "overload",
          label: "😵 There’s too much going on—I don’t know where to start.",
          target: "s2c",
        },
        {
          id: "procrastination",
          label: "⏳ I’ve been procrastinating and I don’t even know why.",
          target: "s2d",
        },
        {
          id: "frozen",
          label: "🧊 I don’t even know. I just feel frozen.",
          target: "s2e",
        },
      ],
      fallbacks: {
        idk: "fallback-flip",
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
    },

    // ── 2A — Physical 😩 ────────────────────────────────────────────────────
    s2a: {
      id: "s2a",
      kind: "choice",
      stage: 2,
      tone: "affirming",
      juniper: {
        text: "Your body’s talking to you—and you listened. That’s a win.\n\nWant to take a moment for a quick reset before we keep going?",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §2A – Physical",
      },
      response: {
        text: "Let’s honor your effort to check in. When you're ready, we’ll make a plan you can actually stick to.",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §2A – Physical",
      },
      options: [
        { id: "water", label: "🥤 Drink water", target: "s3" },
        { id: "snack", label: "🍎 Grab a snack", target: "s3" },
        { id: "stretch", label: "🧘 Take a stretch or breath", target: "s3" },
      ],
    },

    // ── 2B — Emotional 😤 ───────────────────────────────────────────────────
    s2b: {
      id: "s2b",
      kind: "choice",
      stage: 2,
      tone: "steady",
      juniper: {
        text: "Heavy feelings make it hard to move—but naming them is already a step forward.\n\nYou don’t have to fix how you feel to take action. Want to talk it out, or just keep going with that in mind?",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §2B – Emotional",
      },
      options: [
        { id: "pause", label: "Talk it out", target: "s2b-pause" },
        {
          id: "carry",
          label: "Keep going with that in mind",
          target: "s2b-carry",
        },
      ],
    },
    "s2b-pause": {
      id: "s2b-pause",
      kind: "freeText",
      stage: 2,
      tone: "steady",
      juniper: {
        // G-Y2: 2B's dedicated 1-minute grounding/naming script isn't authored
        // yet; this authored line from 2E stands in until Cat's script lands.
        text: "✏️ Write down one word for how you feel",
        adaptable: false,
        sourceRef:
          "paths/yellow-path.md §2E (stand-in for 2B exercise, gap G-Y2)",
      },
      next: "s3",
    },
    "s2b-carry": {
      id: "s2b-carry",
      kind: "message",
      stage: 2,
      tone: "steady",
      juniper: {
        text: "Let’s carry it with care. You’re still allowed to move toward what matters.",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §2B – Emotional",
      },
      next: "s3",
    },

    // ── 2C — Overload 😵 ────────────────────────────────────────────────────
    s2c: {
      id: "s2c",
      kind: "freeText",
      stage: 2,
      tone: "practical",
      juniper: {
        text: "Too much to do makes everything harder to start. Let’s dump it out and sort it.\n\nWhat’s taking up space in your brain today? Let it all out—big or small.",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §2C – Overload",
      },
      next: "s2c-sort",
    },
    "s2c-sort": {
      id: "s2c-sort",
      kind: "tool",
      stage: 2,
      tone: "practical",
      juniper: {
        text: "Let’s sort these into Covey’s 4 quadrants: Urgent/Important, Not Urgent/Important, etc.",
        adaptable: false,
        sourceRef: "paths/yellow-path.md §2C – Overload",
      },
      tool: { type: "coveyQuadrantSorter" },
      next: "s2c-align",
    },
    "s2c-align": {
      id: "s2c-align",
      kind: "freeText",
      stage: 2,
      tone: "practical",
      juniper: {
        // G-Y3: the optional Zoom-Out Exercise referenced here has no
        // authored content yet; it is omitted rather than invented.
        text: "Which of these feel most aligned with what matters to you today?",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §2C – Overload (follow-up prompt)",
      },
      next: "s3",
    },

    // ── 2D — Procrastination ⏳ ─────────────────────────────────────────────
    s2d: {
      id: "s2d",
      kind: "choice",
      stage: 2,
      tone: "curious",
      juniper: {
        text: "Procrastination is usually protecting you from something—it’s not a flaw.\n\nLet’s figure out what kind of resistance this is.",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §2D – Procrastination",
      },
      options: [
        // G-Y1: tailored micro-start ideas per resistance type are not yet
        // authored; all three route to the authored reframe until they land.
        { id: "fear", label: "🎯 Fear of failure", target: "s2d-reframe" },
        {
          id: "perfectionism",
          label: "🧼 Perfectionism",
          target: "s2d-reframe",
        },
        {
          id: "boredom",
          label: "💤 Boredom or disinterest",
          target: "s2d-reframe",
        },
      ],
    },
    "s2d-reframe": {
      id: "s2d-reframe",
      kind: "message",
      stage: 2,
      tone: "curious",
      juniper: {
        text: "You don’t need to win—you just need to begin.",
        adaptable: false,
        sourceRef:
          "paths/yellow-path.md §2D – Procrastination (mindset reframe)",
      },
      next: "s3",
    },

    // ── 2E — Frozen 🧊 ──────────────────────────────────────────────────────
    s2e: {
      id: "s2e",
      kind: "choice",
      stage: 2,
      tone: "grounding",
      juniper: {
        text: "Frozen doesn’t mean broken. It just means overwhelmed.\n\nLet’s try one tiny action—just enough to create movement.",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §2E – Frozen",
      },
      response: {
        text: "You didn’t avoid the stuck—you showed up for it. That counts.",
        adaptable: false,
        sourceRef: "paths/yellow-path.md §2E – Frozen",
      },
      options: [
        { id: "breaths", label: "🌬️ Take three deep breaths", target: "s3" },
        {
          id: "one-word",
          label: "✏️ Write down one word for how you feel",
          target: "s3",
        },
        {
          id: "tidy",
          label: "🕯️ Tidy one corner of your space",
          target: "s3",
        },
      ],
    },

    // ── Stage 3 — Time & Energy Alignment ───────────────────────────────────
    s3: {
      id: "s3",
      kind: "choice",
      stage: 3,
      tone: "practical",
      juniper: {
        text: "Let’s make this doable—not ideal. We’re working with real time and real energy today.\n\nHow much time and energy do you realistically have today?",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 3",
      },
      response: {
        text: "Whatever option you choose—we’ll work with it. Tiny steps count.",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 3",
      },
      options: [
        { id: "quick-hit", label: "⏳ Quick Hit (under 15 min)", target: "s4" },
        { id: "chunk-it", label: "🧩 Chunk It (30–60 min step)", target: "s4" },
        {
          id: "full-sprint",
          label: "💪 Full Sprint (deep session)",
          target: "s4",
        },
        {
          id: "not-sure",
          label: "🤔 Not sure—help me figure that out",
          target: "s3-unsure",
        },
      ],
      fallbacks: { nothingSoundsRight: "mini-reset" },
    },
    "s3-unsure": {
      id: "s3-unsure",
      kind: "choice",
      stage: 3,
      tone: "curious",
      juniper: {
        // Doc authors this beat as logic ("prompts them to glance at their
        // calendar and emotional energy"); exact line is a draft.
        text: "Take a quick glance at your calendar—and at your energy. Which of these feels real for today?",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 3 (unsure branch)",
        needsCat: true,
      },
      options: [
        { id: "quick-hit", label: "⏳ Quick Hit (under 15 min)", target: "s4" },
        { id: "chunk-it", label: "🧩 Chunk It (30–60 min step)", target: "s4" },
        {
          id: "full-sprint",
          label: "💪 Full Sprint (deep session)",
          target: "s4",
        },
      ],
    },

    // ── Stage 4 — Align with Calendar ───────────────────────────────────────
    s4: {
      id: "s4",
      kind: "freeText",
      stage: 4,
      tone: "affirming",
      juniper: {
        text: "Let’s take a sec to check what your day actually looks like—either in your calendar or in your head.\n\nWhat’s already planned today that we should work around?",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 4",
      },
      next: "s4-options",
    },
    "s4-options": {
      id: "s4-options",
      kind: "choice",
      stage: 4,
      tone: "affirming",
      juniper: {
        text: "Making your plan match your actual day is a power move—not a compromise.",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 4 (tone line)",
      },
      options: [
        {
          id: "buffer",
          label: "⛅ Add buffer time before/after focus task",
          target: "s5",
        },
        {
          id: "remove",
          label: "🧽 Remove a non-essential task if needed",
          target: "s5",
        },
        {
          id: "ritual",
          label: "🔁 Pair the new task with a ritual (music, stretch, tea)",
          target: "s5",
        },
        {
          id: "block",
          label: "📅 Block the time visually to lock it in",
          target: "s5",
        },
      ],
    },

    // ── Stage 5 — Emotional Readiness + First Step ──────────────────────────
    s5: {
      id: "s5",
      kind: "choice",
      stage: 5,
      tone: "encouraging",
      juniper: {
        text: "Before we dive in—how are you feeling heading into this?",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 5",
      },
      options: [
        {
          id: "crush-it",
          label: "💪 Ready to crush it",
          target: "s5-first-step",
        },
        {
          id: "nervous",
          label: "😬 Nervous, but willing",
          target: "s5-first-step",
        },
        { id: "foggy", label: "🌀 Foggy or unsure", target: "s5-first-step" },
        {
          id: "adjusting",
          label: "🔄 Still adjusting to today’s changes",
          target: "s5-first-step",
        },
        { id: "idk", label: "🤷 I don’t know yet", target: "s5-first-step" },
      ],
      fallbacks: { nothingSoundsRight: "mini-reset" },
    },
    "s5-first-step": {
      id: "s5-first-step",
      kind: "freeText",
      stage: 5,
      tone: "encouraging",
      juniper: {
        text: "What’s the very first step you can take? Something light, visible, and real.",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 5",
      },
      tip: {
        body: "First steps should take under 2 minutes. Just enough to shift the momentum.",
        sourceRef: "paths/yellow-path.md §Stage 5 (micro-tip)",
      },
      next: "s6",
    },

    // ── Stage 6 — Reflect & Reinforce ───────────────────────────────────────
    s6: {
      id: "s6",
      kind: "choice",
      stage: 6,
      tone: "warm",
      juniper: {
        text: "You made it to the other side of stuck. That deserves reflection.\n\nWhich of these feels true right now?",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 6",
      },
      options: [
        { id: "did-it", label: "🙌 I did what I planned", target: "s6-quote" },
        {
          id: "adjusted",
          label: "🔄 I adjusted but still showed up",
          target: "s6-quote",
        },
        {
          id: "clearer",
          label: "🧠 I didn’t finish, but I feel clearer",
          target: "s6-quote",
        },
        {
          id: "still-here",
          label: "⚠️ I couldn’t really start, but I’m still here",
          target: "s6-quote",
        },
        {
          id: "aha",
          label: "✨ I had a breakthrough or Aha! moment",
          target: "s6-quote",
        },
      ],
    },
    "s6-quote": {
      id: "s6-quote",
      kind: "reflection",
      stage: 6,
      tone: "warm",
      juniper: {
        // G-Y4: outcome → quote mapping unspecified; user picks from the
        // authored bank until Cat maps outcomes to quotes.
        text: "Which of these feels true to carry with you?",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 6 (matching reflection quote)",
        needsCat: true,
      },
      quoteBank: "yellow",
      next: "s6-aha-offer",
    },
    "s6-aha-offer": {
      id: "s6-aha-offer",
      kind: "choice",
      stage: 6,
      tone: "warm",
      juniper: {
        // Doc authors this beat as logic ("encourages the user to save an
        // Aha! moment... short text + tag"); exact line is a draft.
        text: "Want to save an Aha! moment from today—something that clicked?",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 6 (Aha! capture)",
        needsCat: true,
      },
      options: [
        {
          id: "save",
          label: "Save one",
          target: "s6-aha-text",
          needsCat: true,
        },
        { id: "skip", label: "Not today", target: "end", needsCat: true },
      ],
    },
    "s6-aha-text": {
      id: "s6-aha-text",
      kind: "freeText",
      stage: 6,
      tone: "warm",
      juniper: {
        text: "What clicked? A sentence is plenty.",
        adaptable: true,
        sourceRef: "paths/yellow-path.md §Stage 6 (Aha! capture)",
        needsCat: true,
      },
      next: "end",
    },
    end: {
      id: "end",
      kind: "end",
      stage: 6,
      tone: "warm",
    },

    // ── Fallback nodes ──────────────────────────────────────────────────────
    "fallback-flip": {
      id: "fallback-flip",
      kind: "freeText",
      stage: 1,
      tone: "grounding",
      juniper: {
        text: "What do you *not* want to feel today?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Cheat Sheet 6 (universal fallback)",
      },
      next: RETURN_TARGET,
    },
    "fallback-still-stuck": {
      id: "fallback-still-stuck",
      kind: "choice",
      stage: 1,
      tone: "grounding",
      juniper: {
        text: "Want to look back at your Weekly Horizon, or take a quick walk or stretch and come back?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Cheat Sheet 6 (universal fallback)",
        needsCat: true,
      },
      options: [
        {
          id: "weekly-horizon",
          label: "Show me my Weekly Horizon",
          target: RETURN_TARGET,
          needsCat: true,
        },
        {
          id: "walk-stretch",
          label: "Walk or stretch, then retry",
          target: RETURN_TARGET,
          needsCat: true,
        },
      ],
    },
    "mini-reset": {
      id: "mini-reset",
      kind: "tool",
      stage: 1,
      tone: "grounding",
      juniper: {
        text: "Still feeling scattered or stuck?",
        adaptable: false,
        sourceRef: "paths/green-path.md §Mini Reset Toolkit (trigger prompts)",
      },
      tool: { type: "miniResetToolkit", props: { toolkit: "yellow" } },
      next: RETURN_TARGET,
    },
  },
};
