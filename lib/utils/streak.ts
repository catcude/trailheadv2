/**
 * Habit streak — consecutive days ending at today (or yesterday, so a streak
 * isn't "broken" the moment a new day starts before the user checks in). This
 * is the gentle-reset spirit (CLAUDE.md Streak System: "no shame messaging"):
 * we compute a number; the UI never scolds a reset to zero.
 *
 * `checkedOn` is a list of YYYY-MM-DD strings; `today` defaults to today (UTC).
 */
export function computeStreak(
  checkedOn: string[],
  today: string = new Date().toISOString().slice(0, 10),
): number {
  const days = new Set(checkedOn);
  const cursor = new Date(`${today}T00:00:00Z`);

  // Anchor at today if checked, else yesterday if checked, else no streak.
  if (!days.has(iso(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!days.has(iso(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(iso(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * How much check history the dashboard loads per habit. 366 days keeps
 * streaks exact up to a full year; a streak longer than the window displays
 * as the window length (a cap, never a reset — gentle-reset spirit holds).
 * Bounding the fetch keeps the dashboard's row set flat as users accumulate
 * history instead of growing without limit.
 */
export const STREAK_WINDOW_DAYS = 366;

/** First day (YYYY-MM-DD) of the streak window ending at `today`. */
export function streakWindowStart(
  today: string = new Date().toISOString().slice(0, 10),
): string {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - STREAK_WINDOW_DAYS);
  return iso(d);
}
