import { env } from "cloudflare:workers";

// Translates admin-entered English copy to Georgian via the Claude API, for
// the "Translate" button next to every bilingual field. The admin still
// reviews and can hand-edit the result before saving.
export async function translateToGeorgian(text: string): Promise<string> {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Set it as a Cloudflare Worker secret (wrangler secret put ANTHROPIC_API_KEY) or in .dev.vars for local development."
    );
  }
  if (!text.trim()) return "";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system:
        "Translate the given English text to Georgian for a wine estate's website. Keep the tone editorial and natural, not literal. Reply with only the Georgian translation, no preamble, no quotes.",
      messages: [{ role: "user", content: text }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Translation request failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
  const translation = data.content?.find((block) => block.type === "text")?.text?.trim();
  if (!translation) {
    throw new Error("Translation response did not include any text.");
  }
  return translation;
}
