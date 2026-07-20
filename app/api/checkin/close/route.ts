import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isTrustedOrigin } from "@/lib/utils/origin-check";

/**
 * Close the user's unfinished check-in sessions (WS8 "Start fresh"). Marks any
 * open session ended so the resume offer clears. Owner-only via RLS + auth.
 */
export const dynamic = "force-dynamic";

// Generous abuse ceiling, not a throttle — closing sessions is cheap and rare.
const LIMIT = { limit: 30, windowMs: 60_000 };

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "invalid request" }, { status: 403 });
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
      p_key: `close:${user.id}`,
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
  await supabase
    .from("chat_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("ended_at", null);
  return NextResponse.json({ ok: true });
}
