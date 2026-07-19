import type { QuoteBank } from "../schema";

/**
 * VERBATIM from docs/paths/yellow-path.md §Yellow Path – Reflection Quotes.
 * The doc provides one bank (no separate evening set), so both variants use
 * it; noted for Cat (gap G-T3 covers evening sets for non-Green paths).
 */
const quotes = [
  "I made space for what felt messy—and that helped me move.",
  "The fog didn’t lift all at once, but I kept walking.",
  "I asked for help instead of shutting down.",
  "I stayed in the process—even when I didn’t feel ready.",
  "Naming what was hard helped me find what mattered.",
  "Today I planned with honesty—not pressure.",
  "I didn’t skip the hard part—I walked through it.",
  "I moved something forward without being ‘on point.’ That’s progress.",
  "I followed the thread—and clarity found me.",
  "Even when I didn’t feel strong, I stayed open to movement.",
  "I let today be a reset—not a redo.",
  "I asked myself what I needed—and that changed everything.",
  "I trusted the system even when I wasn’t sure I trusted myself.",
  "The plan isn’t perfect—but it’s mine.",
  "I didn’t try to force clarity—I gave it space to emerge.",
];

export const yellowQuotes: QuoteBank = {
  path: "yellow",
  sourceRef: "paths/yellow-path.md §Yellow Path – Reflection Quotes",
  standard: quotes,
  evening: quotes,
};
