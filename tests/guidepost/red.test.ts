import { describe, expect, it } from "vitest";
import { paths, quoteBanks } from "@/content";
import {
  advance,
  startSession,
  type EngineContext,
} from "@/lib/guidepost/machine";
import type { EngineInput, EngineOutput } from "@/lib/guidepost/types";
import type { CheckinVariant } from "@/lib/utils/time";

const redCtx: EngineContext = { content: paths.red!, quoteBanks };

function run(variant: CheckinVariant, inputs: EngineInput[]): EngineOutput[] {
  const outputs = [startSession(redCtx, variant)];
  for (const input of inputs) {
    outputs.push(advance(outputs[outputs.length - 1].state, input, redCtx));
  }
  return outputs;
}

const option = (optionId: string): EngineInput => ({
  type: "option",
  optionId,
});
const text = (t = "one thing"): EngineInput => ({ type: "text", text: t });
const tool = (): EngineInput => ({ type: "toolResult" });

describe("Red path — Stage 1 regulation-first", () => {
  it("opens with the heavy-day opener into the physical check", () => {
    const start = startSession(redCtx, "standard");
    expect(start.state.currentNodeId).toBe("s1-check");
    expect(start.messages.map((m) => m.nodeId)).toEqual(["s1", "s1-check"]);
    expect(start.options?.map((o) => o.id)).toEqual(["unmet", "okay"]);
  });

  it("an unmet need pauses for a caring action before the emotional check-in", () => {
    const [, care] = run("standard", [option("unmet")]);
    expect(care.state.currentNodeId).toBe("s1b");
    expect(care.messages.map((m) => m.nodeId)).toEqual(["s1-care", "s1b"]);
  });
});

describe("Red Stage 2 — weight routes to plan vs reset", () => {
  const toS2 = [option("okay"), option("alone")];

  it("'too much to do' goes to Name Your Priorities (3A)", () => {
    const outs = run("standard", [...toS2, option("too-much")]);
    expect(outs[outs.length - 1].state.currentNodeId).toBe("s3a");
    expect(outs[outs.length - 1].freeText).toBe(true);
  });

  it("'not sure what's wrong' goes to the Mini Reset (3B), then back to 3A", () => {
    const outs = run("standard", [...toS2, option("not-sure")]);
    const reset = outs[outs.length - 1];
    expect(reset.state.currentNodeId).toBe("s3b");
    expect(reset.tool?.type).toBe("miniResetToolkit");
    expect(reset.tool?.props?.toolkit).toBe("red");
    const afterReset = advance(reset.state, tool(), redCtx);
    expect(afterReset.state.currentNodeId).toBe("s3a");
  });
});

describe("Red Stage 3 → regulated shift", () => {
  const toShift = [option("okay"), option("alone"), option("too-much"), text()];

  it("offers Green / Yellow shifts and a stay-on-Red option", () => {
    const outs = run("standard", [...toShift]);
    const shift = outs[outs.length - 1];
    expect(shift.state.currentNodeId).toBe("regulated-shift");
    expect(shift.options?.map((o) => o.id)).toEqual([
      "green",
      "yellow",
      "stay",
    ]);
  });

  it("'Shift to Green' and 'Shift to Yellow' hand off via pathShift", () => {
    const g = run("standard", [...toShift, option("green")]);
    expect(g[g.length - 1].pathShift).toEqual({
      path: "green",
      nodeId: "welcome",
    });
    const y = run("standard", [...toShift, option("yellow")]);
    expect(y[y.length - 1].pathShift).toEqual({ path: "yellow", nodeId: "s1" });
  });

  it("'Stay on Red' lands on the Covey sorter with Red's quadrant labels", () => {
    const outs = run("standard", [...toShift, option("stay")]);
    const covey = outs[outs.length - 1];
    expect(covey.state.currentNodeId).toBe("s4");
    expect(covey.tool?.type).toBe("coveyQuadrantSorter");
    expect(covey.tool?.props?.quadrantLabels).toEqual([
      "Do Now",
      "Do Later",
      "Delegate",
      "Drop",
    ]);
  });
});

describe("Red Stage 5 — reality check, tone, processing changes", () => {
  const toTone = [
    option("okay"),
    option("alone"),
    option("too-much"),
    text(),
    option("stay"),
    tool(), // covey
    text(), // reality check
  ];

  it("'Processing changes' explains the shift, then confirm or add context", () => {
    const outs = run("standard", [...toTone, option("processing")]);
    const proc = outs[outs.length - 1];
    expect(proc.state.currentNodeId).toBe("s5-processing");
    const added = advance(proc.state, option("add-context"), redCtx);
    expect(added.state.currentNodeId).toBe("s5-processing-context");
    const done = advance(added.state, text("the deadline moved"), redCtx);
    expect(done.state.currentNodeId).toBe("s6");
  });

  it("'Overwhelmed again' loops back to a Mini Reset (protective, not planning pressure)", () => {
    const outs = run("standard", [...toTone, option("overwhelmed")]);
    expect(outs[outs.length - 1].state.currentNodeId).toBe("s3b");
  });
});

describe("Red Stage 6 — resilience reflection + variants", () => {
  const toS6 = [
    option("okay"),
    option("alone"),
    option("too-much"),
    text(),
    option("stay"),
    tool(),
    text(),
    option("crush-it"),
  ];

  it("standard variant uses the before-5PM bank and completes (skips evening beat)", () => {
    const outs = run("standard", [...toS6]);
    const reflect = outs[outs.length - 1];
    expect(reflect.state.currentNodeId).toBe("s6");
    expect(reflect.quotes?.[0]).toBe("I was paralyzed—but I moved forward.");
    const end = advance(reflect.state, option("quote-0"), redCtx);
    expect(end.done).toBe(true);
    expect(end.state.currentNodeId).toBe("end");
  });

  it("evening variant uses the 5–10 PM bank and offers the wind-down", () => {
    const outs = run("evening", [...toS6]);
    const reflect = outs[outs.length - 1];
    expect(reflect.quotes?.[0]).toBe("Today didn’t eat me alive 😤");
    const wind = advance(reflect.state, option("quote-0"), redCtx);
    expect(wind.state.currentNodeId).toBe("s6-tomorrow");
    expect(wind.tool?.type).toBe("eveningWindDown");
    const end = advance(wind.state, tool(), redCtx);
    expect(end.done).toBe(true);
  });
});
