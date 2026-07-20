"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { currentWeekStart } from "@/lib/utils/week";

/**
 * Dashboard server actions (WS6). Every action authenticates and writes only
 * the current user's rows; RLS is the backstop. No analytics, no tracking.
 */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthenticated");
  return { supabase, user };
}

export async function createHabit(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title || title.length > 120) return;
  const { supabase, user } = await requireUser();
  await supabase.from("habits").insert({ user_id: user.id, title });
  revalidatePath("/dashboard");
}

export async function archiveHabit(habitId: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("habits")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", habitId)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

/** Toggle today's check for a habit: add it if missing, remove it if present. */
export async function toggleHabitToday(habitId: string) {
  const { supabase, user } = await requireUser();
  // habit_checks carries no user_id (ownership flows through habits), so
  // verify the habit is the caller's before touching its checks.
  const owned = await supabase
    .from("habits")
    .select("id")
    .eq("id", habitId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!owned.data) return;
  const today = new Date().toISOString().slice(0, 10);
  const existing = await supabase
    .from("habit_checks")
    .select("id")
    .eq("habit_id", habitId)
    .eq("checked_on", today)
    .maybeSingle();
  if (existing.data) {
    await supabase.from("habit_checks").delete().eq("id", existing.data.id);
  } else {
    await supabase
      .from("habit_checks")
      .insert({ habit_id: habitId, checked_on: today });
  }
  revalidatePath("/dashboard");
}

export async function setWeeklyHorizon(intentions: string[]) {
  const cleaned = intentions
    .map((i) => i.trim())
    .filter(Boolean)
    .slice(0, 10);
  const { supabase, user } = await requireUser();
  await supabase.from("weekly_horizons").upsert(
    {
      user_id: user.id,
      week_start: currentWeekStart(),
      intentions: cleaned,
    },
    { onConflict: "user_id,week_start" },
  );
  revalidatePath("/dashboard");
}

export async function addAha(text: string, tag: string | null) {
  const clean = text.trim();
  if (!clean) return;
  const { supabase, user } = await requireUser();
  await supabase
    .from("aha_moments")
    .insert({ user_id: user.id, text: clean, tag: tag?.trim() || null });
  revalidatePath("/dashboard");
}

/**
 * Goal Microflow (M3 dashboard extra, FF_DASHBOARD_EXTRAS). CRUD on the
 * existing `goals` table (short/mid/long horizons). Owner-only via RLS.
 */
const GOAL_HORIZONS = ["short", "mid", "long"] as const;
const GOAL_STATUSES = ["active", "done", "paused", "dropped"] as const;

export async function createGoal(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const horizon = String(formData.get("horizon") ?? "");
  if (!title || title.length > 200) return;
  if (!(GOAL_HORIZONS as readonly string[]).includes(horizon)) return;
  const { supabase, user } = await requireUser();
  await supabase.from("goals").insert({ user_id: user.id, horizon, title });
  revalidatePath("/dashboard");
}

export async function setGoalStatus(goalId: string, status: string) {
  if (!(GOAL_STATUSES as readonly string[]).includes(status)) return;
  const { supabase, user } = await requireUser();
  await supabase
    .from("goals")
    .update({ status })
    .eq("id", goalId)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}
