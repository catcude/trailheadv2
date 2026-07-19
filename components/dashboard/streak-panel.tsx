import type { HabitView } from "@/components/dashboard/habit-list";

/**
 * Streak System (M3, FF_DASHBOARD_EXTRAS). Gentle reset, NO shame messaging
 * (CLAUDE.md): we celebrate momentum and normalize starting over. Copy is a
 * team draft (needsCat) pending Cat — see m3-for-cat.md.
 */
export function StreakPanel({ habits }: { habits: HabitView[] }) {
  const active = habits.filter((h) => h.streak > 0);
  const best = habits.reduce((m, h) => Math.max(m, h.streak), 0);

  return (
    <div className="flex flex-col gap-3">
      {habits.length === 0 ? (
        <p className="text-sm text-ink/60">
          Add a habit above and your streaks will grow here.
        </p>
      ) : (
        <>
          <p className="text-sm text-depth">
            {active.length > 0
              ? `You’ve got ${active.length} habit${active.length === 1 ? "" : "s"} going right now — longest run: ${best} day${best === 1 ? "" : "s"}.`
              : "Fresh start today. Every day you show up counts."}
          </p>
          <ul className="flex flex-wrap gap-2">
            {habits.map((h) => (
              <li
                key={h.id}
                className="rounded-full border border-sand/60 bg-white px-3 py-1 text-xs text-depth"
              >
                {h.title}: {h.streak > 0 ? `${h.streak}🔥` : "fresh start"}
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink/60">
            Miss a day? No streak-shaming here — you just pick back up. Resets
            are part of it.
          </p>
        </>
      )}
    </div>
  );
}
