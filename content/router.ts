import type { JuniperText, PathId } from "./schema";

/**
 * The universal entry check-in ("the router") — maps the user's state to a
 * path. Opening line is authored (Red storyboard slide 1, confirmed by Cat
 * 2026-07-07). Green/Yellow option labels are team drafts pending Cat's
 * copy (gap G-U1); Blue's is her authored entry phrase.
 * Blue/Red options only appear when their feature flags allow (lib/flags.ts).
 */
export interface RouterOption {
  id: string;
  label: string;
  path: PathId;
  needsCat?: boolean;
  /** Requires this flag (from lib/flags.ts) to be true to appear. */
  flag?: "bluePath" | "redPath";
}

export const routerPrompt: JuniperText = {
  text: "How are you feeling today?",
  adaptable: false,
  sourceRef: "paths/red-path.md §Storyboard Slide 1",
};

export const routerOptions: RouterOption[] = [
  {
    id: "green",
    label: "I’ve got energy and a plan in my head",
    path: "green",
    needsCat: true,
  },
  {
    id: "yellow",
    label: "I know what to do but I can’t start",
    path: "yellow",
    needsCat: true,
  },
  {
    id: "blue",
    label: "I’m fine.",
    path: "blue",
    flag: "bluePath",
  },
  {
    id: "red",
    label: "🟥 Overwhelmed",
    path: "red",
    flag: "redPath",
  },
];
