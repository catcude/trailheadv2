import { Suspense } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AuthForm } from "@/components/ui/auth-form";
import { NotConfigured } from "@/components/ui/not-configured";

export const metadata = { title: "Make an account — Trailhead" };

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      {isSupabaseConfigured() ? (
        <Suspense>
          <AuthForm mode="sign-up" />
        </Suspense>
      ) : (
        <NotConfigured />
      )}
    </main>
  );
}
