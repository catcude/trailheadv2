/**
 * Juniper tone registry — descriptors transcribed from the path cheat sheets.
 * Data-only in M1; the M2 LLM prompt layer consumes these to calibrate
 * phrasing. Tone is a functional requirement, not a style preference.
 */
export const tones: Record<string, { descriptor: string; sourceRef: string }> =
  {
    focused: {
      descriptor: "Focused, Encouraging, Empowering",
      sourceRef: "paths/green-path.md §Cheat Sheet 2 (core emotional energy)",
    },
    encouraging: {
      descriptor: "Encouraging, adaptive to emotion, emotionally safe",
      sourceRef: "paths/yellow-path.md §Cheat Sheet Stage 5",
    },
    hyped: {
      descriptor: "Playful, hyped, encouraging",
      sourceRef: "paths/green-path.md §Cheat Sheet 4 (Ready to crush it)",
    },
    reassuring: {
      descriptor: "Reassuring, steady, normalize nerves",
      sourceRef: "paths/green-path.md §Cheat Sheet 4 (Ready but nervous)",
    },
    calming: {
      descriptor: "Calming, simplified",
      sourceRef:
        "paths/green-path.md §Cheat Sheet 4 (Optimistic but overwhelmed)",
    },
    reflective: {
      descriptor: "Reflective, validating, informative",
      sourceRef: "paths/green-path.md §Cheat Sheet 4 (Processing plan changes)",
    },
    grounding: {
      descriptor: "Grounding, patient, small-win oriented",
      sourceRef: "paths/green-path.md §Cheat Sheet 4 (Not sure)",
    },
    steady: {
      descriptor:
        "Tone flows from stabilizing → normalizing → gently motivating",
      sourceRef: "paths/yellow-path.md §Cheat Sheet Stage 2",
    },
    practical: {
      descriptor: "Practical, flexible, non-judgmental",
      sourceRef: "paths/yellow-path.md §Cheat Sheet Stage 3",
    },
    affirming: {
      descriptor: "Respectful of user’s reality; honors effort to adapt",
      sourceRef: "paths/yellow-path.md §Cheat Sheet Stage 4",
    },
    warm: {
      descriptor: "Reflective, warm, and affirming regardless of outcome",
      sourceRef: "paths/yellow-path.md §Cheat Sheet Stage 6",
    },
    curious: {
      descriptor: "Reassuring, curious, and grounding",
      sourceRef: "paths/yellow-path.md §Cheat Sheet Stage 1",
    },
  };
