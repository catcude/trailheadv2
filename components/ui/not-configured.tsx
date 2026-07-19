import { Card } from "@/components/ui/card";

/** Shown on auth surfaces when Supabase env vars are missing (see docs/SETUP.md). */
export function NotConfigured() {
  return (
    <Card className="mx-auto max-w-md text-center">
      <h1 className="mb-2 text-xl font-semibold text-depth">Almost there</h1>
      <p className="text-sm">
        Accounts aren&apos;t set up in this environment yet. If you&apos;re
        running Trailhead locally, add the Supabase keys from{" "}
        <code>docs/SETUP.md</code> to <code>.env.local</code>.
      </p>
    </Card>
  );
}
