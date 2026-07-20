import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import { HabitList, type HabitView } from "@/components/dashboard/habit-list";
import { AhaLog, type AhaView } from "@/components/dashboard/aha-log";
import { WeeklyHorizonEditor } from "@/components/dashboard/weekly-horizon-editor";
import { computeStreak, streakWindowStart } from "@/lib/utils/streak";
import { currentWeekStart } from "@/lib/utils/week";
import { getFlags } from "@/lib/flags";
import {
  GoalMicroflow,
  type GoalView,
} from "@/components/dashboard/goal-microflow";
import { StreakPanel } from "@/components/dashboard/streak-panel";
import { ProgressReflection } from "@/components/dashboard/progress-reflection";

// Per-user page: always rendered at request time (auth via cookies).
export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard — Trailhead" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  // Two waves instead of a chain: profile + habits need only the user;
  // everything else runs in parallel once the habit ids are known. Explicit
  // user_id filters everywhere — RLS enforces ownership, this is the second
  // layer (defense in depth, 2026-07-20 audit).
  const [{ data: profile }, { data: habitRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("role, display_name")
      .eq("id", user.id)
      .single(),
    supabase
      .from("habits")
      .select("id, title")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .order("created_at", { ascending: true }),
  ]);
  if (!profile?.role || !profile?.display_name) redirect("/onboarding");

  const habitIds = (habitRows ?? []).map((h) => h.id);
  const today = new Date().toISOString().slice(0, 10);
  const flags = getFlags();

  const emptyChecks = {
    data: [] as { habit_id: string; checked_on: string }[],
  };
  const [
    { data: checkRows },
    { data: ahaRows },
    { data: horizon },
    { data: goalRows },
    { data: reflectionRows },
  ] = await Promise.all([
    // Checks bounded to the streak window: enough history for an exact
    // streak up to a year (beyond that the number caps at the window), so
    // the row set stays flat instead of growing with tenure.
    habitIds.length
      ? supabase
          .from("habit_checks")
          .select("habit_id, checked_on")
          .in("habit_id", habitIds)
          .gte("checked_on", streakWindowStart(today))
      : Promise.resolve(emptyChecks),
    supabase
      .from("aha_moments")
      .select("id, text, tag, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("weekly_horizons")
      .select("intentions")
      .eq("user_id", user.id)
      .eq("week_start", currentWeekStart())
      .maybeSingle(),
    flags.dashboardExtras
      ? supabase
          .from("goals")
          .select("id, horizon, title, status")
          .eq("user_id", user.id)
          .not("status", "in", "(dropped)")
          .order("created_at", { ascending: true })
      : Promise.resolve({ data: [] as GoalView[] }),
    supabase
      .from("reflections")
      .select("id, quote_text, created_at")
      .eq("user_id", user.id)
      .not("quote_text", "is", null)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const checksByHabit = new Map<string, string[]>();
  for (const c of checkRows ?? []) {
    const list = checksByHabit.get(c.habit_id) ?? [];
    list.push(c.checked_on);
    checksByHabit.set(c.habit_id, list);
  }
  const habits: HabitView[] = (habitRows ?? []).map((h) => {
    const checks = checksByHabit.get(h.id) ?? [];
    return {
      id: h.id,
      title: h.title,
      checkedToday: checks.includes(today),
      streak: computeStreak(checks, today),
    };
  });

  const ahas: AhaView[] = (ahaRows ?? []).map((a) => ({
    id: a.id,
    text: a.text,
    tag: a.tag,
    createdAt: a.created_at,
  }));

  const intentions = Array.isArray(horizon?.intentions)
    ? (horizon.intentions as string[])
    : [];

  const goals: GoalView[] = (goalRows ?? []) as GoalView[];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-depth">
          Hey, {profile.display_name}
        </h1>
        <form action={signOut}>
          <Button variant="ghost" type="submit">
            Sign out
          </Button>
        </form>
      </header>

      <Card>
        <h2 className="mb-1 font-semibold text-depth">Daily check-in</h2>
        <p className="mb-3 text-sm">
          A few minutes with Juniper — meet the day where you actually are.
        </p>
        <Link
          href="/checkin"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-cta px-6 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-cta/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-depth"
        >
          Start today’s check-in
        </Link>
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold text-depth">Habits</h2>
        <HabitList habits={habits} />
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold text-depth">This week’s horizon</h2>
        <WeeklyHorizonEditor initial={intentions} />
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold text-depth">Aha! moments</h2>
        <AhaLog ahas={ahas} />
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold text-depth">Recent reflections</h2>
        <ul className="flex flex-col gap-2">
          {(reflectionRows ?? []).map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-sand/50 bg-white px-3 py-2 text-sm italic text-depth"
            >
              “{r.quote_text}”
            </li>
          ))}
          {(reflectionRows ?? []).length === 0 ? (
            <li className="text-sm text-ink/60">
              Reflections you keep from a check-in will show up here.
            </li>
          ) : null}
        </ul>
      </Card>

      {flags.dashboardExtras ? (
        <>
          <Card>
            <h2 className="mb-2 font-semibold text-depth">Streaks</h2>
            <StreakPanel habits={habits} />
          </Card>

          <Card>
            <h2 className="mb-2 font-semibold text-depth">Goals</h2>
            <GoalMicroflow goals={goals} />
          </Card>

          <Card>
            <h2 className="mb-2 font-semibold text-depth">
              Progress reflection
            </h2>
            <ProgressReflection />
          </Card>
        </>
      ) : null}
    </main>
  );
}
