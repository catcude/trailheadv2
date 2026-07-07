import { crisisContent } from "@/content/safety/crisis";

/**
 * Compose the crisis-pause messages served when the safety screen trips.
 * Verbatim from content/safety/crisis.ts — never adapted, never generated.
 */
export function composeSafetyMessages(): { nodeId: string; text: string }[] {
  const resources = crisisContent.resources
    .map((r) => `${r.name}: ${r.detail}`)
    .join("\n");
  return [
    { nodeId: "safety:intro", text: crisisContent.intro },
    { nodeId: "safety:boundary", text: crisisContent.boundary },
    { nodeId: "safety:resources", text: resources },
    { nodeId: "safety:trusted-adult", text: crisisContent.trustedAdult },
  ];
}
