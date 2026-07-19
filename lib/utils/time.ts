/**
 * Evening window for Guidepost check-in variants.
 *
 * Every path has a standard and an evening (5–10 PM) variant — see the path
 * docs in docs/paths/ ("Evening Wind Down (5–10 PM)"). The client sends its
 * local hour; the boundary is inclusive of 5 PM (17) and runs to 10 PM (22)
 * exclusive, so 9:59 PM is evening and 10:00 PM is not.
 */
export const EVENING_START_HOUR = 17;
export const EVENING_END_HOUR = 22;

export function isEveningHour(localHour: number): boolean {
  if (!Number.isInteger(localHour) || localHour < 0 || localHour > 23) {
    return false;
  }
  return localHour >= EVENING_START_HOUR && localHour < EVENING_END_HOUR;
}

export type CheckinVariant = "standard" | "evening";

export function checkinVariantForHour(localHour: number): CheckinVariant {
  return isEveningHour(localHour) ? "evening" : "standard";
}
