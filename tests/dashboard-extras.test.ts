import { describe, expect, it } from "vitest";
import { weeklyReflection } from "@/content/tools/weekly-reflection";
import { getFlags } from "@/lib/flags";

/**
 * M3 dashboard extras (Streak System, Goal Microflow, Progress Reflection) live
 * behind FF_DASHBOARD_EXTRAS. This guards the "production unchanged" default and
 * the verbatim Progress-Reflection content.
 */
describe("dashboard extras gating", () => {
  it("is OFF by default (no env) — extras stay hidden in production", () => {
    expect(getFlags().dashboardExtras).toBe(false);
  });
});

describe("Progress Reflection content (verbatim)", () => {
  it("carries the Atomic Habits loop and end-of-week prompts", () => {
    expect(weeklyReflection.habitLoop).toHaveLength(5);
    expect(weeklyReflection.weeklyPrompts).toHaveLength(6);
    expect(weeklyReflection.habitLoop[0]).toBe(
      "Cue: What triggers the behavior? (e.g., a time of day, emotion, or event)",
    );
    expect(weeklyReflection.weeklyPrompts[5]).toBe(
      "What’s one thing you want to keep doing—and one you want to shift?",
    );
  });
});
