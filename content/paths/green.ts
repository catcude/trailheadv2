import { RETURN_TARGET, type PathContent } from "../schema";

/**
 * Green Path — From Intention to Alignment.
 * All Juniper text VERBATIM from docs/paths/green-path.md (Cat's IP).
 * Team-drafted connective labels are marked needsCat and listed in
 * docs/content-review/. Known gaps ship as empty tip slots (G-G1, G-G2).
 */
export const green: PathContent = {
  path: "green",
  contentVersion: "2026-07-07.1",
  entryNodeId: "welcome",
  nodes: {
    welcome: {
      id: "welcome",
      kind: "message",
      stage: 1,
      tone: "focused",
      juniper: {
        text: "Hey there 👋 Let’s set today up with clarity.",
        adaptable: true,
        sourceRef: "paths/green-path.md §Storyboard Slide 1",
      },
      next: "s1-mind-scan",
    },
    "s1-mind-scan": {
      id: "s1-mind-scan",
      kind: "freeText",
      stage: 1,
      tone: "focused",
      juniper: {
        // G-G3: doc also has a "3 things" variant; Cat to confirm canonical.
        text: "What are 1–3 things at the top of your mind today?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 1",
      },
      fallbacks: { idk: "fallback-flip", stillStuck: "fallback-still-stuck" },
      next: "s1-covey-sort",
    },
    "s1-covey-sort": {
      id: "s1-covey-sort",
      kind: "tool",
      stage: 1,
      tone: "focused",
      juniper: {
        text: "Sort these into Covey’s Matrix: Important/Urgent, Not Urgent/Important, etc.",
        adaptable: false,
        sourceRef: "paths/green-path.md §Storyboard Slide 2",
      },
      tool: { type: "coveyQuadrantSorter" },
      next: "s1-expand",
    },
    "s1-expand": {
      id: "s1-expand",
      kind: "freeText",
      stage: 1,
      tone: "focused",
      juniper: {
        text: "What other small or big to-dos are floating in your head?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Storyboard Slide 3",
      },
      next: "s1-covey-sort-2",
    },
    "s1-covey-sort-2": {
      id: "s1-covey-sort-2",
      kind: "tool",
      stage: 1,
      tone: "focused",
      juniper: {
        text: "Sort these into Covey buckets again.",
        adaptable: false,
        sourceRef: "paths/green-path.md §Storyboard Slide 3",
        needsCat: true, // storyboard describes this beat; exact line is a draft
      },
      tool: { type: "coveyQuadrantSorter" },
      next: "s2-align",
    },
    "s2-align": {
      id: "s2-align",
      kind: "freeText",
      stage: 2,
      tone: "encouraging",
      juniper: {
        text: "Which one best ties into your Weekly Horizon?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 2",
      },
      tip: {
        // G-G1: teen-friendly urgent-vs-important examples not yet authored.
        title: "What makes something *important but not urgent*?",
        sourceRef: "paths/green-path.md §Storyboard Slide 4",
        gapRef: "G-G1",
      },
      fallbacks: {
        idk: "fallback-flip",
        nothingSoundsRight: "mini-reset",
        stillStuck: "fallback-still-stuck",
      },
      next: "s3-time",
    },
    "s3-time": {
      id: "s3-time",
      kind: "choice",
      stage: 3,
      tone: "practical",
      juniper: {
        text: "Let’s look at your calendar to see how much time you can commit to it.\n\nHow much open time do you have?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 3",
      },
      tip: {
        // G-G2: pop-out body (time-blocking / Pomodoro explainer) not yet authored.
        title: "What is a Pomodoro? What is time-blocking?",
        sourceRef: "paths/green-path.md §Stage 3",
        gapRef: "G-G2",
      },
      options: [
        { id: "block-time", label: "Block time", target: "s4-align-day" },
        { id: "set-reminder", label: "Set reminder", target: "s4-align-day" },
        {
          id: "focus-sprint",
          label: "Use a focus sprint",
          target: "s4-align-day",
        },
      ],
    },
    "s4-align-day": {
      id: "s4-align-day",
      kind: "choice",
      stage: 4,
      tone: "practical",
      juniper: {
        text: "Let’s make sure your day actually supports this plan.",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 4",
      },
      tip: {
        // G-G4: doc carries two candidate lines; this one flagged for Cat.
        body: "Real-life alignment reduces overwhelm and builds flow.",
        sourceRef: "paths/green-path.md §Stage 4 Tip Box",
        gapRef: "G-G4",
      },
      options: [
        { id: "add-buffer", label: "Add buffer", target: "s5-checkin" },
        {
          id: "delete-overlaps",
          label: "Delete overlaps",
          target: "s5-checkin",
        },
        { id: "shift-tasks", label: "Shift tasks", target: "s5-checkin" },
      ],
    },
    "s5-checkin": {
      id: "s5-checkin",
      kind: "choice",
      stage: 5,
      tone: "encouraging",
      juniper: {
        text: "Where’s your head at now that we’ve made this plan?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 5",
      },
      options: [
        { id: "crush-it", label: "💪 Ready to crush it", target: "s6-goal" },
        {
          id: "nervous",
          label: "😬 Ready to do this... but just a little nervous",
          target: "s6-goal",
        },
        {
          id: "overwhelmed",
          label: "🌀 Optimistic but now feeling kinda overwhelmed",
          target: "s6-goal",
        },
        {
          id: "processing",
          label:
            "🔄 I’m processing all the changes we made to my original plan for the day",
          target: "s5-processing",
        },
        { id: "not-sure", label: "🤷 Not sure", target: "s6-goal" },
      ],
      fallbacks: { nothingSoundsRight: "mini-reset" },
    },
    "s5-processing": {
      id: "s5-processing",
      kind: "choice",
      stage: 5,
      tone: "reflective",
      juniper: {
        text: "Want to walk through WHY we made these changes?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 5",
      },
      options: [
        {
          id: "yes-walk-through",
          label: "Yes — walk me through it",
          target: "s5-processing-help",
          needsCat: true,
        },
        {
          id: "no-continue",
          label: "No, I’m good — let’s keep going",
          target: "s6-goal",
          needsCat: true,
        },
      ],
    },
    "s5-processing-help": {
      id: "s5-processing-help",
      kind: "choice",
      stage: 5,
      tone: "reflective",
      juniper: {
        // In verbatim mode this follows the authored comparison beat; the
        // old-vs-new goal comparison itself becomes LLM-grounded in M2.
        text: "Does that help? Or is there something I’m still missing that’s important to you?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 5",
      },
      options: [
        {
          id: "helps",
          label: "That helps",
          target: "s6-goal",
          needsCat: true,
        },
        {
          id: "missing",
          label: "There’s something you’re missing",
          target: "s5-processing-missing",
          needsCat: true,
        },
      ],
    },
    "s5-processing-missing": {
      id: "s5-processing-missing",
      kind: "freeText",
      stage: 5,
      tone: "reflective",
      juniper: {
        text: "Tell me what’s important to you that I’m not seeing yet.",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 5 (Juniper listens and adjusts)",
        needsCat: true, // beat is authored as logic; exact line is a draft
      },
      fallbacks: { nothingSoundsRight: "mini-reset" },
      next: "s6-goal",
    },
    "s6-goal": {
      id: "s6-goal",
      kind: "freeText",
      stage: 6,
      tone: "encouraging",
      juniper: {
        text: "Which goal will you be working on today?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 6",
      },
      next: "s6-calendar",
    },
    "s6-calendar": {
      id: "s6-calendar",
      kind: "choice",
      stage: 6,
      tone: "practical",
      juniper: {
        text: "Want it added to your calendar — plus future steps if we break it down?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 6 (add to calendar beat)",
        needsCat: true, // beat authored as logic; exact line is a draft
      },
      options: [
        {
          id: "add-calendar",
          label: "Add it to my calendar",
          target: "s6-reflect",
          needsCat: true,
        },
        {
          id: "skip-calendar",
          label: "Not right now",
          target: "s6-reflect",
          needsCat: true,
        },
      ],
    },
    "s6-reflect": {
      id: "s6-reflect",
      kind: "reflection",
      stage: 6,
      tone: "warm",
      juniper: {
        text: "How did today go?",
        evening: "Let’s close the loop on your day.",
        adaptable: true,
        sourceRef: "paths/green-path.md §Storyboard Slides 10–11",
      },
      quoteBank: "green",
      next: "s6-evening-tomorrow",
    },
    "s6-evening-tomorrow": {
      id: "s6-evening-tomorrow",
      kind: "freeText",
      stage: 6,
      tone: "warm",
      variantOnly: "evening",
      juniper: {
        text: "What’s one small thing you can do tonight to make tomorrow easier?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 6 (evening flow)",
      },
      next: "s6-habit-stack",
    },
    "s6-habit-stack": {
      id: "s6-habit-stack",
      kind: "message",
      stage: 6,
      tone: "warm",
      variantOnly: "evening",
      juniper: {
        text: "Have you already stacked a habit around this? Or could you try—like reading 15 minutes after you plug in your phone?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Stage 6 (habit stacking nudge)",
      },
      next: "end",
    },
    end: {
      id: "end",
      kind: "end",
      stage: 6,
      tone: "warm",
    },

    // ── Fallback nodes (cross-path spec, CLAUDE.md + Green cheat sheet §6) ──
    "fallback-flip": {
      id: "fallback-flip",
      kind: "freeText",
      stage: 1,
      tone: "grounding",
      juniper: {
        text: "What do you *not* want to feel today?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Cheat Sheet 6 (fallback handling)",
      },
      next: RETURN_TARGET,
    },
    "fallback-still-stuck": {
      id: "fallback-still-stuck",
      kind: "choice",
      stage: 1,
      tone: "grounding",
      juniper: {
        // Cheat sheet §6 authors this beat as logic ("reminds user of their
        // Weekly Horizon or offers a walk/stretch + retry"); line is a draft.
        text: "Want to look back at your Weekly Horizon, or take a quick walk or stretch and come back?",
        adaptable: true,
        sourceRef: "paths/green-path.md §Cheat Sheet 6 (fallback handling)",
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
        text: "Need a breather before we move forward?",
        adaptable: false,
        sourceRef: "paths/green-path.md §Mini Reset Toolkit (trigger prompts)",
      },
      tool: { type: "miniResetToolkit", props: { toolkit: "green" } },
      next: RETURN_TARGET,
    },
  },
};
