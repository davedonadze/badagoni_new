// Shared between the layout (reads it to decide whether to render the age
// gate) and the confirm API route (sets it once the visitor confirms).
export const AGE_GATE_COOKIE = "badagoni_age_confirmed";
export const AGE_GATE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
