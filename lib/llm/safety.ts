/**
 * "Depth of water" crisis screening — v0: deterministic lexicon.
 *
 * Runs on EVERY piece of free text BEFORE any other processing (including
 * any LLM call). Calibration is deliberately conservative: a false positive
 * shows someone crisis resources they didn't need; a false negative fails a
 * kid in trouble. When in doubt, flag.
 *
 * On a hit, the API pauses the flow and serves content/safety/crisis.ts in
 * Juniper's steady voice. Telemetry is aggregate-only — never the text,
 * never the user id (scaffolding plan §5). An LLM second-pass classifier
 * arrives in M2; this lexicon remains the floor, not the ceiling.
 */

export type CrisisCategory = "self-harm" | "abuse" | "danger";

export type SafetyResult =
  { ok: true } | { ok: false; category: CrisisCategory };

const LEXICON: Record<CrisisCategory, string[]> = {
  "self-harm": [
    "kill myself",
    "killing myself",
    "kms",
    "end my life",
    "ending my life",
    "end it all",
    "suicide",
    "suicidal",
    "hurt myself",
    "hurting myself",
    "harm myself",
    "self harm",
    "cut myself",
    "cutting myself",
    "want to die",
    "wanna die",
    "wish i was dead",
    "wish i were dead",
    "better off dead",
    "dont want to be alive",
    "unalive myself",
    "unalive me",
    "overdose",
  ],
  abuse: [
    "hits me",
    "beats me",
    "abuses me",
    "abusing me",
    "molested",
    "molests me",
    "raped",
    "rapes me",
    "afraid to go home",
    "scared to go home",
    "not safe at home",
    "unsafe at home",
  ],
  danger: [
    "going to hurt me",
    "gonna hurt me",
    "threatened to kill",
    "threatening to kill",
    "has a gun",
    "brought a gun",
    "has a knife to",
    "in danger right now",
  ],
};

/** Lowercase, de-leet, strip punctuation to spaces, collapse whitespace. */
function normalize(text: string): string {
  const deLeet: Record<string, string> = {
    "0": "o",
    "1": "i",
    "3": "e",
    "4": "a",
    "5": "s",
    "7": "t",
    "@": "a",
    $: "s",
  };
  return text
    .toLowerCase()
    .replace(/[013457@$]/g, (c) => deLeet[c] ?? c)
    .replace(/['’]/g, "")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const COMPILED: { category: CrisisCategory; pattern: RegExp }[] = (
  Object.entries(LEXICON) as [CrisisCategory, string[]][]
).flatMap(([category, phrases]) =>
  phrases.map((phrase) => ({
    category,
    pattern: new RegExp(`\\b${phrase.split(" ").join("\\s+")}\\b`),
  })),
);

export function screen(text: string): SafetyResult {
  const normalized = normalize(text);
  if (normalized.length === 0) return { ok: true };
  for (const { category, pattern } of COMPILED) {
    if (pattern.test(normalized)) {
      return { ok: false, category };
    }
  }
  return { ok: true };
}
