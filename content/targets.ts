/**
 * Path ids and edge-target helpers, zod-free on purpose: the state machine
 * (and through it the client bundles — hero taste, check-in) needs these at
 * runtime, and importing them must not drag zod into client JavaScript.
 * content/schema.ts re-exports everything here and builds its zod schemas
 * on top, so server-side validation is unchanged.
 */

export const PATH_IDS = ["green", "yellow", "blue", "red"] as const;
export type PathId = (typeof PATH_IDS)[number];

/** Target sentinel: return to the node that triggered a fallback detour. */
export const RETURN_TARGET = "@return";

/**
 * A cross-path shift target is written "<path>:<nodeId>" (e.g. "yellow:s1").
 * Returns the parsed path + node when the string is a well-formed shift target
 * for a known path, else null (ordinary same-path targets and "@return").
 * The state machine uses this to hand a permeability shift back to the route;
 * only the route (never the LLM) then swaps the active path.
 */
export function parseShiftTarget(
  target: string,
): { path: PathId; nodeId: string } | null {
  const idx = target.indexOf(":");
  if (idx <= 0) return null;
  const path = target.slice(0, idx);
  const nodeId = target.slice(idx + 1);
  if (!(PATH_IDS as readonly string[]).includes(path) || !nodeId) return null;
  return { path: path as PathId, nodeId };
}
