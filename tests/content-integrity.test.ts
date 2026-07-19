import { describe, expect, it } from "vitest";
import { collectAuthoredStrings } from "@/content";

/**
 * Content-integrity lock: Cat's authored strings are IP, implemented
 * verbatim. This snapshot pins every user-facing string; if it fails, either
 * revert the change or — for a deliberate, Cat-approved edit — regenerate
 * with `pnpm content:lock` and land it in a `content:` commit she reviews.
 */
describe("authored content lock", () => {
  it("matches content/authored.lock.json", async () => {
    const strings = collectAuthoredStrings();
    await expect(JSON.stringify(strings, null, 2) + "\n").toMatchFileSnapshot(
      "../content/authored.lock.json",
    );
  });
});
