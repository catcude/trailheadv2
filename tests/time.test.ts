import { describe, expect, it } from "vitest";
import { checkinVariantForHour, isEveningHour } from "@/lib/utils/time";

describe("isEveningHour (5–10 PM window per path docs)", () => {
  it("returns false through the afternoon", () => {
    for (const hour of [0, 6, 12, 16]) {
      expect(isEveningHour(hour)).toBe(false);
    }
  });

  it("starts at 5 PM inclusive", () => {
    expect(isEveningHour(17)).toBe(true);
  });

  it("covers the whole evening window", () => {
    for (const hour of [17, 18, 19, 20, 21]) {
      expect(isEveningHour(hour)).toBe(true);
    }
  });

  it("ends at 10 PM exclusive", () => {
    expect(isEveningHour(22)).toBe(false);
    expect(isEveningHour(23)).toBe(false);
  });

  it("rejects out-of-range or non-integer input instead of guessing", () => {
    expect(isEveningHour(-1)).toBe(false);
    expect(isEveningHour(24)).toBe(false);
    expect(isEveningHour(17.5)).toBe(false);
    expect(isEveningHour(Number.NaN)).toBe(false);
  });
});

describe("checkinVariantForHour", () => {
  it("maps hours to the session variant", () => {
    expect(checkinVariantForHour(9)).toBe("standard");
    expect(checkinVariantForHour(19)).toBe("evening");
    expect(checkinVariantForHour(22)).toBe("standard");
  });
});
