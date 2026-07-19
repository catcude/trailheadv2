import { weeklyReflection } from "@/content/tools/weekly-reflection";

/**
 * Progress Reflection (M3, FF_DASHBOARD_EXTRAS). Renders Cat's authored habit-
 * loop template and end-of-week pattern prompts VERBATIM as a guided reflection
 * panel (content/tools/weekly-reflection.ts, lock-protected).
 */
export function ProgressReflection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-depth">
          Cue → Craving → Response → Reward
        </p>
        <ul className="flex flex-col gap-1.5">
          {weeklyReflection.habitLoop.map((line) => (
            <li
              key={line}
              className="rounded-lg border border-sand/50 bg-white px-3 py-2 text-sm text-ink"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-depth">
          End-of-week pattern prompts
        </p>
        <ul className="flex flex-col gap-1.5">
          {weeklyReflection.weeklyPrompts.map((line) => (
            <li key={line} className="text-sm text-ink">
              • {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
