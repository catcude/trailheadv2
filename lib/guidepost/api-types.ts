/**
 * Client-safe /api/checkin contract pieces. Deliberately zod-free: the
 * check-in client needs only these labels and the frame shape, and importing
 * them must not drag the request schemas (and zod) into the client bundle.
 * The zod schemas live in ./api-schema, which re-exports this module for
 * server-side callers.
 */

/** Fallback trigger labels shown as user messages (drafts, needsCat). */
export const FALLBACK_LABELS: Record<string, string> = {
  idk: "I don’t know",
  nothingSoundsRight: "Nothing sounds right",
  stillStuck: "Still stuck",
};

/** The terminal SSE `state` frame /api/checkin sends after each turn. */
export interface CheckinStateFrame {
  sessionId: string;
  nodeId: string;
  stage: number;
  toneTag: string;
  options: { id: string; label: string }[] | null;
  tool: { type: string; props?: Record<string, unknown> } | null;
  quotes: string[] | null;
  tip: {
    title?: string;
    body?: string;
    gapRef?: string;
  } | null;
  fallbacks: ("idk" | "nothingSoundsRight" | "stillStuck")[] | null;
  freeText: boolean;
  done: boolean;
  safety?: boolean;
}
