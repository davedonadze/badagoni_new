import type { WineInput } from "./service";
import type { Localized, WineSpec, WineAward, WineTastingNotes } from "@/db/schema";

function parseCategories(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map(v => v.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map(v => v.trim()).filter(Boolean);
  return [];
}

function nullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

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

function nullableLocalized(value: unknown): Localized | null {
  const localized = parseLocalized(value);
  return localized.en || localized.ka ? localized : null;
}

function parseSpecs(value: unknown): WineSpec[] | null {
  if (!Array.isArray(value)) return null;
  const specs = value
    .map((entry): WineSpec => {
      const record = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
      return { label: parseLocalized(record.label), value: parseLocalized(record.value) };
    })
    .filter(spec => (spec.label.en || spec.label.ka) && (spec.value.en || spec.value.ka));
  return specs.length ? specs : null;
}

function parseAwards(value: unknown): WineAward[] | null {
  if (!Array.isArray(value)) return null;
  const awards = value
    .map((entry): WineAward => {
      const record = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
      return {
        image: typeof record.image === "string" ? record.image.trim() : "",
        name: parseLocalized(record.name),
        year: typeof record.year === "string" ? record.year.trim() : "",
      };
    })
    .filter(award => award.image && (award.name.en || award.name.ka) && award.year);
  return awards.length ? awards : null;
}

function parseTastingNotes(value: unknown): WineTastingNotes | null {
  const record = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const notes: WineTastingNotes = {
    colour: parseLocalized(record.colour),
    aromas: parseLocalized(record.aromas),
    palate: parseLocalized(record.palate),
  };
  return notes.colour.en || notes.colour.ka || notes.aromas.en || notes.aromas.ka || notes.palate.en || notes.palate.ka ? notes : null;
}

export function parseWineInput(body: Record<string, unknown>): WineInput {
  const category = typeof body.category === "string" ? body.category.trim() : "";
  return {
    slug: typeof body.slug === "string" ? body.slug.trim() : "",
    name: parseLocalized(body.name),
    category,
    categories: parseCategories(body.categories ?? category),
    image: typeof body.image === "string" ? body.image.trim() : "",
    style: nullableLocalized(body.style),
    grapes: nullableLocalized(body.grapes),
    alcohol: nullableString(body.alcohol),
    description: nullableLocalized(body.description),
    specs: parseSpecs(body.specs),
    awards: parseAwards(body.awards),
    tastingNotes: parseTastingNotes(body.tastingNotes),
  };
}
