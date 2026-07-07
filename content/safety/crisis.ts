/**
 * Crisis-response content ("depth of water" pause). NEVER adaptable — the
 * LLM does not touch this. The boundary line is authored (CLAUDE.md §Safety
 * & Escalation); the intro and trusted-adult prompt are team drafts in
 * Juniper's steady register awaiting Cat's voice pass (flagged in
 * docs/content-review/). Resource details are factual.
 */
export interface CrisisResource {
  name: string;
  detail: string;
}

export const crisisContent = {
  /** Draft (needsCat): steady, no alarm, no judgment. */
  intro:
    "Before we go any further — what you just shared sounds heavy, and it matters more than any plan we could make today.",
  introNeedsCat: true,
  /** Authored boundary line — verbatim from CLAUDE.md/PRD. */
  boundary: "I’m not a counselor, but here’s someone who can help.",
  boundarySourceRef: "CLAUDE.md §Safety & Escalation",
  resources: [
    {
      name: "988 Suicide & Crisis Lifeline",
      detail: "Call or text 988 — free, 24/7 (US)",
    },
    {
      name: "Crisis Text Line",
      detail: "Text HOME to 741741 — free, 24/7 (US)",
    },
  ] satisfies CrisisResource[],
  /** Draft (needsCat). */
  trustedAdult:
    "Is there an adult you trust — a parent, a teacher, a counselor — you could talk to today? You don’t have to carry this alone.",
  trustedAdultNeedsCat: true,
} as const;
