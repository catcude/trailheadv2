import { Suspense } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthForm } from "@/components/ui/auth-form";
import { NotConfigured } from "@/components/ui/not-configured";

export const metadata = { title: "Sign in — Trailhead" };

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      {isSupabaseConfigured() ? (
        <Suspense>
          <AuthForm mode="sign-in" />
        </Suspense>
      ) : (
        <NotConfigured />
      )}
    </main>
  );
}
