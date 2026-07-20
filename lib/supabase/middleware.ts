import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./config";
import { isProtectedPath } from "./routes";

export async function updateSession(
  request: NextRequest,
  /** Modified request headers to forward (e.g. the CSP nonce headers). */
  requestHeaders?: Headers,
) {
  const nextResponse = () =>
    requestHeaders
      ? NextResponse.next({ request: { headers: requestHeaders } })
      : NextResponse.next({ request });
  let supabaseResponse = nextResponse();

  const protectedRoute = isProtectedPath(request.nextUrl.pathname);
  const env = getSupabaseEnv();
  if (!env) {
    // Not configured (fresh clone / CI): let public pages work; keep the
    // authenticated app closed rather than silently open.
    if (protectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Public paths skip the Supabase Auth round-trip entirely (2026-07-20
  // audit, A2): getUser() is a network call whose only job here is gating
  // protected paths. Pages and API routes that need the user fetch — and
  // refresh — it themselves via the server client.
  if (!protectedRoute) return supabaseResponse;

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        // Keep the forwarded header copy in sync with the refreshed cookies.
        if (requestHeaders) {
          const cookieHeader = request.headers.get("cookie");
          if (cookieHeader) requestHeaders.set("cookie", cookieHeader);
        }
        supabaseResponse = nextResponse();
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: do not run code between createServerClient and
  // supabase.auth.getUser() — it can cause hard-to-debug session bugs.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
