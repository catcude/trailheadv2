import { describe, expect, it } from "vitest";
import { buildHeroTasteContent } from "@/content/marketing/hero-slice";
import { green } from "@/content/paths/green";
import { yellow } from "@/content/paths/yellow";
import { blue } from "@/content/paths/blue";
import { red } from "@/content/paths/red";
import {
  advance,
  startSession,
  type EngineContext,
} from "@/lib/guidepost/machine";

/**
 * The marketing hero's content slice (2026-07-20 audit, B1): the public
 * bundle must carry only the nodes the hero's beats can reach — and never
 * the flag-gated Blue/Red content.
 */

const slice = buildHeroTasteContent();

describe("hero taste content slice", () => {
  it("offers only the always-on paths", () => {
    expect(Object.keys(slice.paths).sort()).toEqual(["green", "yellow"]);
    expect(slice.options.map((o) => o.path).sort()).toEqual([
      "green",
      "yellow",
    ]);
  });

  it("contains no Blue or Red authored text", () => {
    const serialized = JSON.stringify(slice);
    for (const gated of [blue, red]) {
      for (const node of Object.values(gated.nodes)) {
        if (node.juniper) expect(serialized).not.toContain(node.juniper.text);
      }
    }
  });

  it("is a strict, verbatim subset of the full paths", () => {
    for (const [full, sliced] of [
      [green, slice.paths.green!],
      [yellow, slice.paths.yellow!],
    ] as const) {
      const keptIds = Object.keys(sliced.nodes);
      expect(keptIds.length).toBeGreaterThan(0);
      expect(keptIds.length).toBeLessThan(Object.keys(full.nodes).length);
      expect(sliced.entryNodeId).toBe(full.entryNodeId);
      for (const id of keptIds) {
        // Same objects, not copies — verbatim by construction.
        expect(sliced.nodes[id]).toBe(full.nodes[id]);
      }
    }
  });

  it("supports every beat the hero can play without missing nodes", () => {
    for (const option of slice.options) {
      const content = slice.paths[option.path]!;
      const ctx: EngineContext = { content, quoteBanks: slice.quoteBanks };
      // Beat 1: enter the path.
      const out = startSession(ctx, "standard");
      expect(out.messages.length).toBeGreaterThan(0);
      // Beat 2: every offered option must advance cleanly.
      for (const o of out.options ?? []) {
        const next = advance(out.state, { type: "option", optionId: o.id }, ctx);
        expect(next.state.currentNodeId).toBeTruthy();
      }
    }
  });

  it("uses the authored router prompt", () => {
    expect(slice.prompt).toBe("How are you feeling today?");
  });
});
