import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { currentWeekStart } from "@/lib/utils/week";

/**
 * Current week's Weekly Horizon intentions for the signed-in user. The
 * check-in's still-stuck fallback reads these back so the student can
 * re-anchor to what they already set (WS6). Owner-only via RLS + auth,
 * with an explicit user filter as the second layer (2026-07-20 audit).
 */

// Generous abuse ceiling, not a throttle — this is a single cheap read.
const LIMIT = { limit: 60, windowMs: 60_000 };

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ intentions: [] });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { data: allowed, error: rateError } = await supabase.rpc(
    "check_rate_limit",
    {
      p_key: `horizon:${user.id}`,
      p_limit: LIMIT.limit,
      p_window_ms: LIMIT.windowMs,
    },
  );
  if (rateError) {
    return NextResponse.json(
      { error: "rate limit unavailable" },
      { status: 500 },
    );
  }
  if (!allowed) {
    return NextResponse.json({ error: "too many requests" }, { status: 429 });
  }
  const { data } = await supabase
    .from("weekly_horizons")
    .select("intentions")
    .eq("user_id", user.id)
    .eq("week_start", currentWeekStart())
    .maybeSingle();
  const intentions = Array.isArray(data?.intentions)
    ? (data.intentions as string[])
    : [];
  return NextResponse.json({ intentions });
}
