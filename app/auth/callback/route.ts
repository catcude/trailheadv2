import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isProtectedPath } from "@/lib/supabase/routes";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Only allow same-app redirect targets.
  const nextParam = searchParams.get("next") ?? "/dashboard";
  const next = isProtectedPath(nextParam) ? nextParam : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/sign-in?error=auth`);
}
