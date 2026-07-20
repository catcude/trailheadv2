import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isProtectedPath } from "@/lib/supabase/routes";
import { generateNonce, noncedCsp, publicCsp } from "@/lib/utils/csp";

export async function middleware(request: NextRequest) {
  const protectedRoute = isProtectedPath(request.nextUrl.pathname);

  // Nonce-based CSP on the authenticated surface (always dynamically
  // rendered, so Next.js can stamp the nonce onto its inline scripts); the
  // public/static surface keeps the inline-allowing policy prerendered pages
  // require. Dev stays permissive everywhere (see lib/utils/csp.ts).
  let csp = publicCsp();
  let requestHeaders: Headers | undefined;
  if (protectedRoute && process.env.NODE_ENV === "production") {
    const nonce = generateNonce();
    csp = noncedCsp(nonce);
    // Next.js reads the nonce out of the request's CSP header and applies it
    // to the framework's own inline scripts; x-nonce lets our components read
    // it via headers() if they ever need to tag a <Script>.
    requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("content-security-policy", csp);
  }

  const response = await updateSession(request, requestHeaders);
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets, so protected paths (see
     * lib/supabase/routes.ts) are enforced and every document response
     * carries a CSP.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
