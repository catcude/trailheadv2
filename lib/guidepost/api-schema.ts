import { z } from "zod";

/**
 * /api/checkin request contract. `router` starts a session (option id from
 * the entry router); everything else drives an existing session.
 */
export const CheckinInputSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("router"), optionId: z.string().min(1) }),
  z.object({ type: z.literal("start") }),
  z.object({ type: z.literal("option"), optionId: z.string().min(1) }),
  z.object({ type: z.literal("text"), text: z.string().min(1).max(4000) }),
  z.object({ type: z.literal("toolResult"), payload: z.unknown().optional() }),
  z.object({
    type: z.literal("fallback"),
    kind: z.enum(["idk", "nothingSoundsRight", "stillStuck"]),
  }),
]);

export const CheckinBodySchema = z.object({
  sessionId: z.string().uuid().optional(),
  input: CheckinInputSchema,
  clientLocalHour: z.number().int().min(0).max(23),
});

export type CheckinBody = z.infer<typeof CheckinBodySchema>;

// Client-safe pieces live in ./api-types (zod-free); re-exported here so
// server-side imports keep a single entry point.
export { FALLBACK_LABELS } from "./api-types";
export type { CheckinStateFrame } from "./api-types";
