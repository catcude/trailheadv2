import type { QuoteBank } from "../schema";

/**
 * VERBATIM from docs/paths/red-path.md §Reflection Quotes (Updated for
 * Emotional Resilience). Red is the one path with distinct authored standard
 * (before 5 PM) and evening (5–10 PM) sets, so the variant selection is real
 * here (C5). Emoji preserved as authored.
 */
export const redQuotes: QuoteBank = {
  path: "red",
  sourceRef:
    "paths/red-path.md §Reflection Quotes (Updated for Emotional Resilience)",
  standard: [
    "I was paralyzed—but I moved forward.",
    "I didn’t shut down—I used my tools and made a plan.",
    "I let myself feel overwhelmed—and I kept going anyway.",
    "I faced it, even though I didn’t feel ready.",
    "I didn’t let the fear of failure stop me today.",
    "I showed up, even when it felt easier not to.",
  ],
  evening: [
    "Today didn’t eat me alive 😤",
    "I used my tools instead of numbing out.",
    "I didn’t let negative self-talk win.",
    "I made a plan, even when everything felt blurry.",
    "I accepted the risk of failure—and moved anyway.",
    "I stayed with myself instead of abandoning my needs.",
  ],
};
