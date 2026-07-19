import { describe, expect, it } from "vitest";
import { validatePathContent, type PathContent } from "@/content/schema";
import { paths } from "@/content";

function fixture(overrides: Partial<PathContent> = {}): PathContent {
  return {
    path: "green",
    contentVersion: "test",
    entryNodeId: "start",
    nodes: {
      start: {
        id: "start",
        kind: "choice",
        stage: 1,
        tone: "steady",
        juniper: {
          text: "hello",
          adaptable: true,
          sourceRef: "test",
        },
        options: [{ id: "go", label: "go", target: "finish" }],
      },
      finish: { id: "finish", kind: "end", stage: 6, tone: "warm" },
    },
    ...overrides,
  };
}

describe("validatePathContent", () => {
  it("passes a well-formed path", () => {
    expect(validatePathContent(fixture())).toEqual([]);
  });

  it("catches dangling edge targets", () => {
    const bad = fixture();
    bad.nodes.start = {
      ...bad.nodes.start,
      kind: "choice",
      options: [{ id: "go", label: "go", target: "nowhere" }],
    } as PathContent["nodes"][string];
    const issues = validatePathContent(bad);
    expect(issues.some((i) => i.problem.includes('"nowhere"'))).toBe(true);
  });

  it("accepts known cross-path targets (permeability)", () => {
    const shifting = fixture();
    shifting.nodes.start = {
      ...shifting.nodes.start,
      kind: "choice",
      options: [
        { id: "go", label: "go", target: "finish" },
        { id: "shift", label: "shift", target: "yellow:entry" },
      ],
    } as PathContent["nodes"][string];
    expect(validatePathContent(shifting, new Set(["yellow:entry"]))).toEqual(
      [],
    );
  });

  it("catches unreachable nodes", () => {
    const orphaned = fixture();
    orphaned.nodes.island = {
      id: "island",
      kind: "end",
      stage: 6,
      tone: "warm",
    };
    const issues = validatePathContent(orphaned);
    expect(
      issues.some(
        (i) => i.nodeId === "island" && i.problem === "unreachable from entry",
      ),
    ).toBe(true);
  });

  it("catches a missing entry node", () => {
    const issues = validatePathContent(fixture({ entryNodeId: "ghost" }));
    expect(issues[0]?.problem).toBe("entry node missing");
  });

  it("validates every registered path (registry fills in M1 commit 2)", () => {
    for (const [pathId, content] of Object.entries(paths)) {
      const externals = new Set(
        Object.values(paths)
          .filter((p) => p.path !== pathId)
          .map((p) => `${p.path}:${p.entryNodeId}`),
      );
      expect(validatePathContent(content, externals)).toEqual([]);
    }
  });
});
