"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createGoal, setGoalStatus } from "@/app/(app)/dashboard/actions";

export interface GoalView {
  id: string;
  horizon: "short" | "mid" | "long";
  title: string;
  status: "active" | "done" | "paused" | "dropped";
}

const HORIZONS: { key: GoalView["horizon"]; label: string }[] = [
  { key: "short", label: "Short-term" },
  { key: "mid", label: "Mid-term" },
  { key: "long", label: "Long-term" },
];

const NEXT_STATUS: Record<GoalView["status"], GoalView["status"]> = {
  active: "done",
  done: "active",
  paused: "active",
  dropped: "active",
};

/**
 * Goal Microflow Tracker (M3, FF_DASHBOARD_EXTRAS). CRUD on the existing goals
 * table across short/mid/long horizons. Gentle, no pressure: goals can be
 * paused or dropped without any shame framing.
 */
export function GoalMicroflow({ goals }: { goals: GoalView[] }) {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      {HORIZONS.map(({ key, label }) => {
        const inHorizon = goals.filter((g) => g.horizon === key);
        return (
          <div key={key} className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-depth">{label}</p>
            <ul className="flex flex-col gap-1.5">
              {inHorizon.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center gap-2 rounded-lg border border-sand/50 bg-white px-3 py-2"
                >
                  <span
                    className={`flex-1 text-sm ${
                      g.status === "done"
                        ? "text-ink/50 line-through"
                        : "text-ink"
                    }`}
                  >
                    {g.title}
                  </span>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      start(() => setGoalStatus(g.id, NEXT_STATUS[g.status]))
                    }
                    className="rounded-full border border-sand/60 px-3 py-1 text-xs text-depth focus-visible:outline-2 focus-visible:outline-depth"
                  >
                    {g.status === "done" ? "reopen" : "done"}
                  </button>
                </li>
              ))}
              {inHorizon.length === 0 ? (
                <li className="text-sm text-ink/60">Nothing here yet.</li>
              ) : null}
            </ul>
            <form action={createGoal} className="flex gap-2">
              <input type="hidden" name="horizon" value={key} />
              <input
                type="text"
                name="title"
                maxLength={200}
                placeholder={`A ${label.toLowerCase()} goal…`}
                className="min-h-11 flex-1 rounded-lg border border-sand/60 px-3 text-sm focus-visible:outline-2 focus-visible:outline-depth"
              />
              <Button type="submit" variant="secondary" disabled={pending}>
                Add
              </Button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
