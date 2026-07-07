import { Card } from "@/components/ui/card";

export const metadata = { title: "Settings — Trailhead" };

/*
 * Settings stub (M0). Billing lands here in M2 — cancel in two taps from
 * this page is a product commitment, not a nice-to-have.
 */
export default function SettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold text-depth">Settings</h1>
      <Card>
        <p className="text-sm">
          Profile, quiz retakes, and billing (with easy cancel — two taps,
          always) will live here.
        </p>
      </Card>
    </main>
  );
}
