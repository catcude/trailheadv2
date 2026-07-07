import type { PathContent, PathId, QuoteBank } from "./schema";

/**
 * Content registry. Paths register here as they're entered from docs/paths/
 * (Green + Yellow in M1; Blue + Red arrive flag-gated in M3).
 *
 * collectAuthoredStrings() feeds the content-integrity lock
 * (content/authored.lock.json): every user-facing string, keyed stably, so
 * any change to Cat's verbatim content is a deliberate, reviewed `content:`
 * commit (regenerate with `pnpm content:lock`).
 */
export const paths: Partial<Record<PathId, PathContent>> = {};

export const quoteBanks: Partial<Record<PathId, QuoteBank>> = {};

export function collectAuthoredStrings(): Record<string, string> {
  const out: Record<string, string> = {};

  for (const content of Object.values(paths)) {
    for (const node of Object.values(content.nodes)) {
      const prefix = `${content.path}/${node.id}`;
      if (node.juniper) {
        out[`${prefix}/juniper`] = node.juniper.text;
        if (node.juniper.evening) {
          out[`${prefix}/juniper.evening`] = node.juniper.evening;
        }
      }
      if (node.kind === "choice") {
        for (const option of node.options) {
          out[`${prefix}/option:${option.id}`] = option.label;
        }
      }
    }
  }

  for (const bank of Object.values(quoteBanks)) {
    bank.standard.forEach((quote, i) => {
      out[`quotes/${bank.path}/standard/${i}`] = quote;
    });
    bank.evening.forEach((quote, i) => {
      out[`quotes/${bank.path}/evening/${i}`] = quote;
    });
  }

  return out;
}
