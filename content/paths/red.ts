import { RETURN_TARGET, type PathContent } from "../schema";

/**
 * Red Path — From Overwhelm to Ownership.
 * All Juniper text VERBATIM from docs/paths/red-path.md (Cat's IP). Being on
 * Red does NOT itself mean danger (D5) — it means dysregulated / needing a
 * nervous-system reset; the always-on crisis lexicon is the separate danger
 * check. Red is DOUBLE-GATED (lib/flags.ts: FF_RED_PATH && RED_PATH_RELEASE_
 * APPROVED) and cannot ship without a signed safety review; the router hides
 * it and the route refuses shifts into it until both envs are set.
 *
 * Grounding exits everywhere (PRD §6.3): every choice/freeText node carries
 * stillStuck + nothingSoundsRight fallbacks.
 *
 * Gaps shipped honestly (never fabricated; see m3-for-cat.md):
 *  - G-R1: the Stage-2 six quick-taps are the storyboard's (assumption).
 *  - G-R2: ask-for-help scripts / deadline-reality check aren't authored;
 *    the Mini Reset Toolkit ships without them.
 *  - G-R3: the Stage-5 "why we shifted your goal" explanation is drafted
 *    (needsCat); the verbatim beat is only "Does this explanation help?".
 *  - G-R5: escalation thresholds are the safety-review's scope, not content.
 */
export const red: PathContent = {
  path: "red",
  contentVersion: "2026-07-09.1",
  entryNodeId: "s1",
  nodes: {
    // ── Entry opener (storyboard Slide 1) ───────────────────────────────────
    s1: {
      id: "s1",
      kind: "message",
      stage: 1,
      tone: "grounding",
      juniper: {
        text: "Hey there. I can tell things feel heavy today. Let’s take it one step at a time.",
        adaptable: true,
        sourceRef: "paths/red-path.md §Storyboard Slide 1",
      },
      next: "s1-check",
    },

    // ── Stage 1 — Regulation First ──────────────────────────────────────────
    "s1-check": {
      id: "s1-check",
      kind: "choice",
      stage: 1,
      tone: "grounding",
      juniper: {
        text: "Let’s start with the basics. Are you low on sleep, hungry, dehydrated, or just feeling overstimulated?",
        adaptable: true,
        sourceRef: "paths/red-path.md §Stage 1 – Regulation First",
      },
      options: [
        {
          id: "unmet",
          label: "I could use sleep, food, water, or a break",
          target: "s1-care",
          needsCat: true,
        },
        {
          id: "okay",
          label: "I’m okay on the basics",
          target: "s1b",
          needsCat: true,
        },
      ],
      fallbacks: {
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
    },
    // Doc gives logic ("Juniper pauses and suggests caring action"), no
    // verbatim line — drafted, needsCat.
    "s1-care": {
      id: "s1-care",
      kind: "message",
      stage: 1,
      tone: "grounding",
      juniper: {
        text: "Let’s take care of that first—grab a snack, some water, or a few minutes to rest. Come back whenever you’re ready.",
        adaptable: true,
        sourceRef: "paths/red-path.md §Stage 1 (caring-action pause)",
        needsCat: true,
      },
      next: "s1b",
    },

    // ── Stage 1B — Emotional Check-In ───────────────────────────────────────
    s1b: {
      id: "s1b",
      kind: "choice",
      stage: 1,
      tone: "warm",
      juniper: {
        text: "What else might be going on emotionally or socially?",
        adaptable: true,
        sourceRef: "paths/red-path.md §Stage 1B – Emotional Check-In",
      },
      options: [
        { id: "alone", label: "I feel alone or disconnected", target: "s2" },
        { id: "ashamed", label: "I feel ashamed or guilty", target: "s2" },
        {
          id: "overloaded",
          label: "I’m mentally overloaded or scattered",
          target: "s2",
        },
      ],
      fallbacks: {
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
    },

    // ── Stage 2 — What's Weighing On You ────────────────────────────────────
    // G-R1: the six quick-taps come from the storyboard (Slide 4). Their
    // 3A/3B routing is the storyboard's; annotate as an assumption.
    s2: {
      id: "s2",
      kind: "choice",
      stage: 2,
      tone: "validating",
      juniper: {
        text: "Let’s name the biggest weight today—what’s really pressing on you?",
        adaptable: true,
        sourceRef: "paths/red-path.md §Stage 2 – What’s Weighing On You",
      },
      options: [
        {
          id: "too-much",
          label: "🪨 Too much to do, don’t know where to start",
          target: "s3a",
        },
        { id: "cant-focus", label: "🧠 I can’t focus", target: "s3a" },
        {
          id: "urgent",
          label: "⚠️ Everything feels urgent / panic mode",
          target: "s3a",
        },
        { id: "not-sure", label: "🌫️ Not sure what’s wrong", target: "s3b" },
        { id: "unsupported", label: "🫂 I feel unsupported", target: "s3b" },
        {
          id: "too-many-emotions",
          label: "🌀 Too many emotions, no time to deal with them",
          target: "s3b",
        },
      ],
      fallbacks: {
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
    },

    // ── Stage 3A — Name Your Priorities (Slide 6) ───────────────────────────
    s3a: {
      id: "s3a",
      kind: "freeText",
      stage: 3,
      tone: "flexible",
      juniper: {
        text: "Let’s name 1–3 things you want to focus on—not everything, just what matters most.",
        adaptable: true,
        sourceRef: "paths/red-path.md §Storyboard Slide 6 (Stage 3A)",
      },
      next: "regulated-shift",
      fallbacks: {
        idk: "fallback-flip",
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
    },

    // ── Stage 3B — Needs Restoration / Mini Reset (Slide 5) ─────────────────
    // Ask-for-help scripts + deadline-reality check (G-R2) aren't authored, so
    // the Red Mini Reset Toolkit ships without them.
    s3b: {
      id: "s3b",
      kind: "tool",
      stage: 3,
      tone: "grounding",
      juniper: {
        text: "Let’s take a moment to reset before planning.",
        adaptable: true,
        sourceRef: "paths/red-path.md §Storyboard Slide 5 (Stage 3B)",
      },
      tool: { type: "miniResetToolkit", props: { toolkit: "red" } },
      next: "s3a",
    },

    // ── Optional Path Shift — Feeling Regulated? (Slide 7) ──────────────────
    "regulated-shift": {
      id: "regulated-shift",
      kind: "choice",
      stage: 3,
      tone: "empowering",
      juniper: {
        text: "You’ve done some serious work to get grounded—nice job.\n\nIf you’re feeling more regulated now, you have some options:\n• If you’re feeling focused and ready to crush your goals, shift to Green Path.\n• If you’re feeling more centered but still unsure, shift to Yellow Path.\n• Or continue with the Red Path if you want to keep it gentle.",
        adaptable: true,
        sourceRef: "paths/red-path.md §Storyboard Slide 7",
      },
      options: [
        { id: "green", label: "Shift to Green", target: "green:welcome" },
        { id: "yellow", label: "Shift to Yellow", target: "yellow:s1" },
        { id: "stay", label: "Stay on Red", target: "s4" },
      ],
      fallbacks: {
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
    },

    // ── Stage 4 — Covey Sorting (Slide 8, Do Now/Later/Delegate/Drop) ───────
    s4: {
      id: "s4",
      kind: "tool",
      stage: 4,
      tone: "empowering",
      juniper: {
        text: "Let’s sort your tasks: urgent & important, not urgent but important, not important, etc.",
        adaptable: true,
        sourceRef: "paths/red-path.md §Stage 4 – Covey Sorting",
      },
      tool: {
        type: "coveyQuadrantSorter",
        props: { quadrantLabels: ["Do Now", "Do Later", "Delegate", "Drop"] },
      },
      next: "s5",
    },

    // ── Stage 5 — Reality Check + Re-Scope ──────────────────────────────────
    s5: {
      id: "s5",
      kind: "freeText",
      stage: 5,
      tone: "realistic",
      juniper: {
        text: "Check your calendar—what’s realistic for today? Want to shrink or shift something?",
        adaptable: true,
        sourceRef: "paths/red-path.md §Stage 5 – Reality Check + Re-Scope",
      },
      next: "s5-tone",
      fallbacks: {
        idk: "fallback-flip",
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
    },
    // Emotional Tone Before Focus (Slide 9).
    "s5-tone": {
      id: "s5-tone",
      kind: "choice",
      stage: 5,
      tone: "adaptive",
      juniper: {
        text: "How are you feeling about your day now?",
        adaptable: true,
        sourceRef: "paths/red-path.md §Storyboard Slide 9",
      },
      options: [
        { id: "crush-it", label: "💪 Ready to crush it", target: "s6" },
        { id: "nervous", label: "😬 Ready but nervous", target: "s6" },
        { id: "overwhelmed", label: "🌀 Overwhelmed again", target: "s3b" },
        {
          id: "processing",
          label: "🔄 Processing changes",
          target: "s5-processing",
        },
        { id: "not-sure", label: "🤷 Not sure", target: "s6" },
      ],
      fallbacks: {
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
    },
    // Why We Shifted Your Goal (Slide 10 / Special Case). The compare is drafted
    // (G-R3, needsCat); only "Does this explanation help?" is verbatim.
    "s5-processing": {
      id: "s5-processing",
      kind: "choice",
      stage: 5,
      tone: "reflective",
      juniper: {
        text: "Let me show you why we shifted things—how the new plan lines up better with your long-term vision, your energy today, and your Weekly Horizon.\n\nDoes this explanation help?",
        adaptable: true,
        sourceRef:
          "paths/red-path.md §Special Case: Processing Changes (Stage 5)",
        needsCat: true,
      },
      options: [
        { id: "yes", label: "Yes, that helps", target: "s6" },
        {
          id: "add-context",
          label: "Let me add what’s missing",
          target: "s5-processing-context",
          needsCat: true,
        },
      ],
      fallbacks: {
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
    },
    "s5-processing-context": {
      id: "s5-processing-context",
      kind: "freeText",
      stage: 5,
      tone: "reflective",
      juniper: {
        text: "What feels off or missing? We can adjust.",
        adaptable: true,
        sourceRef:
          "paths/red-path.md §Special Case: Processing Changes (Stage 5)",
        needsCat: true,
      },
      next: "s6",
      fallbacks: {
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
    },

    // ── Stage 6 — Reflect & Reconnect ───────────────────────────────────────
    s6: {
      id: "s6",
      kind: "reflection",
      stage: 6,
      tone: "warm",
      juniper: {
        text: "Which reflection feels true right now?",
        adaptable: true,
        sourceRef: "paths/red-path.md §Stage 6 – Reflect & Reconnect",
      },
      quoteBank: "red",
      next: "s6-tomorrow",
    },
    // Evening Wind Down (Slide 12 / End-of-Day logic) — evening variant only.
    "s6-tomorrow": {
      id: "s6-tomorrow",
      kind: "tool",
      stage: 6,
      tone: "warm",
      variantOnly: "evening",
      juniper: {
        text: "What’s one little thing you could do to make tomorrow easier?",
        adaptable: true,
        sourceRef: "paths/red-path.md §End-of-Day Reflection Logic (evening)",
      },
      tool: { type: "eveningWindDown" },
      next: "end",
    },
    end: {
      id: "end",
      kind: "end",
      stage: 6,
      tone: "warm",
    },

    // ── Fallback nodes (universal, mirrors Yellow/Blue; reset uses Red kit) ──
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
      tool: { type: "miniResetToolkit", props: { toolkit: "red" } },
      next: RETURN_TARGET,
    },
  },
};
