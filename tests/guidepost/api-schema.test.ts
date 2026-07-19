import { describe, expect, it } from "vitest";
import { CheckinBodySchema } from "@/lib/guidepost/api-schema";
import { composeSafetyMessages } from "@/lib/guidepost/safety-messages";
import { crisisContent } from "@/content/safety/crisis";

describe("checkin body schema", () => {
  it("accepts a router start", () => {
    expect(
      CheckinBodySchema.safeParse({
        input: { type: "router", optionId: "yellow" },
        clientLocalHour: 9,
      }).success,
    ).toBe(true);
  });

  it("accepts a session turn", () => {
    expect(
      CheckinBodySchema.safeParse({
        sessionId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        input: { type: "text", text: "hi" },
        clientLocalHour: 19,
      }).success,
    ).toBe(true);
  });

  it("rejects junk: bad hour, bad uuid, oversized text, unknown type", () => {
    const bad = [
      { input: { type: "text", text: "x" }, clientLocalHour: 24 },
      {
        sessionId: "not-a-uuid",
        input: { type: "text", text: "x" },
        clientLocalHour: 1,
      },
      {
        sessionId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        input: { type: "text", text: "x".repeat(4001) },
        clientLocalHour: 1,
      },
      { input: { type: "hack" }, clientLocalHour: 1 },
      { input: { type: "fallback", kind: "give-up" }, clientLocalHour: 1 },
    ];
    for (const body of bad) {
      expect(CheckinBodySchema.safeParse(body).success).toBe(false);
    }
  });
});

describe("safety messages", () => {
  it("serves the authored boundary line and both hotlines, verbatim", () => {
    const messages = composeSafetyMessages();
    const all = messages.map((m) => m.text).join("\n");
    expect(all).toContain(crisisContent.boundary);
    expect(all).toContain("988");
    expect(all).toContain("741741");
    expect(messages.map((m) => m.nodeId)).toContain("safety:trusted-adult");
  });
});
