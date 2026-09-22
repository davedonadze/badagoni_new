import type { CategoryInput } from "./service";
import type { Localized } from "@/db/schema";

function parseLocalized(value: unknown): Localized {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return {
      en: typeof record.en === "string" ? record.en.trim() : "",
      ka: typeof record.ka === "string" ? record.ka.trim() : "",
    };
  }
  return { en: "", ka: "" };
}

export function parseCategoryInput(body: Record<string, unknown>): CategoryInput {
  return {
    id: typeof body.id === "string" ? body.id.trim() : "",
    label: parseLocalized(body.label),
    order: typeof body.order === "number" ? body.order : 0,
  };
}
