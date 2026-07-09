/**
 * Progress Reflection content (M3 dashboard extra) — VERBATIM from
 * docs/paths/green-path.md §"Cue → Craving → Response → Reward Templates &
 * End-of-Week Prompts". Rendered as a guided reflection panel on the dashboard
 * behind FF_DASHBOARD_EXTRAS. Authored IP; lock-protected.
 */
export interface WeeklyReflectionContent {
  sourceRef: string;
  /** Atomic Habits loop template (Cue → Craving → Response → Reward + reflect). */
  habitLoop: string[];
  /** End-of-week pattern prompts. */
  weeklyPrompts: string[];
}

export const weeklyReflection: WeeklyReflectionContent = {
  sourceRef:
    "paths/green-path.md §Cue → Craving → Response → Reward Templates & End-of-Week Prompts",
  habitLoop: [
    "Cue: What triggers the behavior? (e.g., a time of day, emotion, or event)",
    "Craving: What do you *want* or feel pulled toward in that moment?",
    "Response: What do you actually do (the behavior)?",
    "Reward: What’s the payoff or feeling you get from doing it?",
    "→ Optional Reflection: Is there a different response that could get you the same reward—without the downside?",
  ],
  weeklyPrompts: [
    "What came up most often this week—stress, excitement, disconnection, flow?",
    "Was there a time you felt ‘off’? What led up to it?",
    "What helped you re-center or reset best this week?",
    "Did any patterns show up in what threw you off (certain people, places, times of day)?",
    "What habits felt automatic? Which ones still felt clunky?",
    "What’s one thing you want to keep doing—and one you want to shift?",
  ],
};
