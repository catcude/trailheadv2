import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "./actions";

// Per-user page: always rendered at request time (auth via cookies).
export const dynamic = "force-dynamic";

export const metadata = { title: "Welcome — Trailhead" };

/*
 * Minimal onboarding: role + display name, nothing else (data minimization —
 * users are assumed minors). The Discover Your Path quiz slots in after this
 * in M1, always skippable. Copy below is placeholder-level and marked for
 * Cat's review (gap G-O1 in the scaffolding plan).
 */
export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  if (profile?.role && profile?.display_name) redirect("/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        {/* NEEDS-CAT: onboarding welcome copy in Juniper's voice */}
        <h1 className="mb-1 text-2xl font-semibold text-depth">
          Hey — glad you&apos;re here.
        </h1>
        <p className="mb-6 text-sm">
          Two quick things and you&apos;re in. That&apos;s all we ask for.
        </p>

        <form action={completeOnboarding} className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-medium">I&apos;m a…</legend>
            {(
              [
                ["student", "Student"],
                ["parent", "Parent"],
                ["teacher", "Educator"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-sand/60 px-3 has-checked:border-cta has-checked:bg-coral/10"
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  required
                  className="accent-cta"
                />
                {label}
              </label>
            ))}
          </fieldset>

          <label className="flex flex-col gap-1 text-sm font-medium">
            What should we call you?
            <input
              name="displayName"
              type="text"
              required
              maxLength={60}
              defaultValue={profile?.display_name ?? ""}
              className="min-h-11 rounded-lg border border-sand/60 px-3 focus-visible:outline-2 focus-visible:outline-depth"
            />
          </label>

          <Button type="submit">Let&apos;s go</Button>
        </form>
      </Card>
    </main>
  );
}
