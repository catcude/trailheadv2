import type { ChatOptions, LLMProvider, LLMResponse, Message } from "./types";

/**
 * Provider selection by env (LLM_PROVIDER). The `verbatim` provider streams
 * authored content unchanged — zero cost, zero network, fully deterministic.
 * It is the M1 default and the permanent fallback: the whole product works
 * without an LLM. Real providers (anthropic/openai) land in M2, SDK imports
 * confined to this directory.
 */
const CHUNK_WORDS = 4;

export const verbatimProvider: LLMProvider = {
  async chat(messages: Message[]): Promise<LLMResponse> {
    return { text: lastContent(messages) };
  },
  async *stream(messages: Message[]): AsyncIterable<string> {
    const words = lastContent(messages).split(/(?<=\s)/);
    for (let i = 0; i < words.length; i += CHUNK_WORDS) {
      yield words.slice(i, i + CHUNK_WORDS).join("");
    }
  },
};

function lastContent(messages: Message[]): string {
  const last = messages.at(-1);
  if (!last) throw new Error("verbatim provider needs at least one message");
  return last.content;
}

export type ProviderName = "verbatim" | "anthropic" | "openai";

export function getProvider(
  name: string | undefined = process.env.LLM_PROVIDER,
): LLMProvider {
  switch (name ?? "verbatim") {
    case "verbatim":
      return verbatimProvider;
    case "anthropic":
    case "openai":
      throw new Error(
        `LLM provider "${name}" is not wired up yet (arrives in M2) — use LLM_PROVIDER=verbatim.`,
      );
    default:
      throw new Error(`Unknown LLM_PROVIDER "${name}".`);
  }
}

/** Convenience: stream an authored text through the active provider. */
export function streamAuthored(text: string): AsyncIterable<string> {
  return verbatimProvider.stream([{ role: "assistant", content: text }]);
}

// Suppress unused-type lint until real providers consume ChatOptions in M2.
export type { ChatOptions };
