import { describe, expect, it } from "vitest";
import { getProvider, verbatimProvider } from "@/lib/llm/provider";

const authored =
  "You’re not broken. Feeling stuck doesn’t mean you’re lazy—it just means something’s in the way. Let’s explore it.";

describe("verbatim provider", () => {
  it("chat returns the authored text unchanged", async () => {
    const result = await verbatimProvider.chat([
      { role: "assistant", content: authored },
    ]);
    expect(result.text).toBe(authored);
  });

  it("stream chunks reassemble to the exact authored text", async () => {
    let assembled = "";
    for await (const chunk of verbatimProvider.stream([
      { role: "assistant", content: authored },
    ])) {
      assembled += chunk;
    }
    expect(assembled).toBe(authored);
  });
});

describe("getProvider", () => {
  it("defaults to verbatim", () => {
    expect(getProvider(undefined)).toBe(verbatimProvider);
    expect(getProvider("verbatim")).toBe(verbatimProvider);
  });

  it("real providers are explicit about arriving in M2", () => {
    expect(() => getProvider("anthropic")).toThrow(/M2/);
    expect(() => getProvider("openai")).toThrow(/M2/);
  });

  it("rejects unknown providers", () => {
    expect(() => getProvider("bard")).toThrow(/Unknown/);
  });
});
