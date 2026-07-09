/**
 * Mini Reset Toolkits — VERBATIM from the Green and Yellow path docs.
 * Summoned as structured UI (MiniResetToolkit component), never text blobs.
 */
export interface MiniResetToolkit {
  sourceRef: string;
  /** Section heading → verbatim reset actions. */
  sections: { heading: string; actions: string[] }[];
  /** Verbatim re-entry prompt shown when the user is ready to continue. */
  reentry: string;
}

export const miniResetToolkits: Record<
  "green" | "yellow" | "red",
  MiniResetToolkit
> = {
  green: {
    sourceRef: "paths/green-path.md §Green Path – Mini Reset Toolkit",
    sections: [
      {
        heading: "Suggested Micro-Reset Actions",
        actions: [
          "Step outside for 3 minutes and take a deep breath.",
          "Do 5 jumping jacks or a light stretch.",
          "Drink a full glass of water.",
          "Write down 3 things on your mind and set them aside.",
          "Text someone you trust just to say hi.",
          "Look at a calming image or video for 60 seconds.",
          "Pet your dog/cat or hug something soft.",
          "Listen to one favorite song start to finish.",
          "Do one small thing you can check off (e.g. throw trash away, plug in phone).",
        ],
      },
    ],
    reentry:
      "Feeling a little more grounded? Let’s head back in and choose something small to begin with.",
  },
  yellow: {
    sourceRef: "paths/yellow-path.md §Yellow Path – Mini Reset Toolkit",
    sections: [
      {
        heading: "🌬️ Sensory Resets",
        actions: [
          "Take three deep breaths, stretching your arms up as you inhale.",
          "Run cold or warm water over your hands and focus on the feeling.",
          "Light a candle, turn on a lamp, or adjust your lighting to refresh your space.",
          "Stand up and gently stretch while looking out a window.",
          "Sip a drink slowly—notice the temperature, the flavor, the moment.",
        ],
      },
      {
        heading: "🧽 Environmental Micro-Shifts",
        actions: [
          "Clear one small surface or move one item to make space.",
          "Tidy your focus area for 2 minutes—set a soft timer.",
          "Switch to a different chair, surface, or part of the room.",
          "Put on calming background music, a lo-fi playlist, or nature sounds.",
          "Open a window or door for a breath of fresh air.",
        ],
      },
      {
        heading: "🧭 Gentle Reconnection Actions",
        actions: [
          "Write down one task you *do* want to do (not just what you should do).",
          "Open the tab or app you need—don’t do anything else yet.",
          "Text a friend or supportive person and let them know you’re regrouping.",
          "Re-read your daily intention or revisit your Weekly Horizon.",
          "Stand up, shake out your hands, and whisper: “Okay—next right thing.”",
        ],
      },
    ],
    reentry:
      "Feeling a little more grounded? Let’s head back in and choose something small to begin with.",
  },
  red: {
    sourceRef: "paths/red-path.md §Red Path – Mini Reset Toolkit",
    sections: [
      {
        heading: "🛠️ Mini Reset Options",
        actions: [
          "3-minute breathing exercise (box breathing or square breathing)",
          "Grounding sensory scan (5-4-3-2-1 method: sight, sound, touch, smell, taste)",
          "Drink a glass of cold water slowly and name one feeling",
          "Walk to a different room or go outside for 90 seconds",
          "Do one slow stretch and shake out your arms",
        ],
      },
      {
        heading: "💬 Optional Self-Talk Prompts",
        actions: [
          "It’s okay to pause. I’m not falling behind.",
          "I can reset without solving everything first.",
          "I deserve care even when I’m not productive.",
        ],
      },
    ],
    // Reentry is a team draft (needsCat / gap G-R2-adjacent): the doc gives a
    // completion CUE ("I'm feeling more grounded now"), not a Juniper reentry
    // sentence. Flagged in m3-for-cat.md.
    reentry:
      "Feeling more grounded now? When you’re ready, we’ll head back in and name what matters.",
  },
};
