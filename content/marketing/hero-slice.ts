import type { PathContent, PathId, QuoteBank } from "../schema";
import { parseShiftTarget } from "../targets";
import { green } from "../paths/green";
import { yellow } from "../paths/yellow";
import { greenQuotes } from "../quotes/green";
import { yellowQuotes } from "../quotes/yellow";
import { routerOptions, routerPrompt } from "../router";

/**
 * The marketing hero's content slice (2026-07-20 audit, B1). The hero taste
 * shows at most HERO_BEATS beats of a Green/Yellow check-in, but it used to
 * import the whole content registry — shipping all four authored path files
 * (including the flag-gated, safety-unreviewed Blue/Red text) in the public
 * client bundle. This module prunes each offered path to exactly the nodes
 * those beats can reach, server-side; the client receives the slice as props
 * and bundles no content at all.
 *
 * Every string in the slice is the same object from the authored content
 * files — verbatim by construction, so the content-integrity lock is
 * unaffected.
 */

/** Must match MAX_BEATS in components/marketing/hero-taste.tsx. */
export const HERO_BEATS = 2;

export interface HeroTasteContent {
  prompt: string;
  options: { id: string; label: string; path: PathId }[];
  paths: Partial<Record<PathId, PathContent>>;
  quoteBanks: Partial<Record<PathId, QuoteBank>>;
}

/**
 * Walk the machine's `present()` semantics (standard variant) from `nodeId`:
 * collect the node, pass through variant-skipped and auto-advancing
 * `message` nodes, and stop at the first interactive node (or a shift/return
 * edge, which the hero never follows). Returns the interactive node's id.
 */
function collectChain(
  content: PathContent,
  nodeId: string,
  keep: Set<string>,
): string | null {
  let currentId: string | null = nodeId;
  while (currentId) {
    if (parseShiftTarget(currentId) || currentId.startsWith("@")) return null;
    const node: PathContent["nodes"][string] | undefined =
      content.nodes[currentId];
    if (!node || keep.has(currentId)) return currentId;
    keep.add(currentId);
    const passesThrough =
      (node.variantOnly && node.variantOnly !== "standard") ||
      node.kind === "message";
    if (!passesThrough || !("next" in node)) return currentId;
    currentId = node.next;
  }
  return null;
}

/** Prune a path to the nodes the hero's beats can present. */
function slicePath(content: PathContent): PathContent {
  const keep = new Set<string>();
  // Beat 1: entering the path presents the entry chain.
  const presentedId = collectChain(content, content.entryNodeId, keep);
  // Beat 2: one option pick on the presented node; each option's target
  // chain must exist for advance() to present it. After that the hero
  // invites sign-up, so no deeper expansion is needed.
  const presented = presentedId ? content.nodes[presentedId] : undefined;
  if (presented?.kind === "choice") {
    for (const option of presented.options) {
      collectChain(content, option.target, keep);
    }
  }
  const nodes: PathContent["nodes"] = {};
  for (const id of keep) nodes[id] = content.nodes[id];
  return { ...content, nodes };
}

export function buildHeroTasteContent(): HeroTasteContent {
  const paths: HeroTasteContent["paths"] = {
    green: slicePath(green),
    yellow: slicePath(yellow),
  };

  // Quote banks only if a sliced node actually offers a reflection pick
  // (none do within two beats today; kept for correctness if entries move).
  const fullBanks: Partial<Record<PathId, QuoteBank>> = {
    green: greenQuotes,
    yellow: yellowQuotes,
  };
  const quoteBanks: HeroTasteContent["quoteBanks"] = {};
  for (const sliced of Object.values(paths)) {
    for (const node of Object.values(sliced.nodes)) {
      if (node.kind === "reflection" && fullBanks[node.quoteBank]) {
        quoteBanks[node.quoteBank] = fullBanks[node.quoteBank];
      }
    }
  }

  return {
    prompt: routerPrompt.text,
    // Only the always-on paths — flag-gated options never reach the hero.
    options: routerOptions
      .filter((o) => !o.flag)
      .map((o) => ({ id: o.id, label: o.label, path: o.path })),
    paths,
    quoteBanks,
  };
}
