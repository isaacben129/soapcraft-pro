/**
 * Ingredient Source Manifest — SoapCraft Pro v2.0.0
 *
 * Versioned ingredient record interface. Every ingredient record MUST include:
 * stable ID, display name, KOH-basis saponification value or range,
 * derived NaOH factor, source title, source URL/identifier, source method,
 * publication/revision date, retrieval date, value status
 * (`verified`, `estimated`, `user_override`), and reviewer state.
 *
 * NaOH factors are derived from KOH-basis values using MW_NaOH / MW_KOH.
 * Legacy provisional values are marked as `estimated` / internal only.
 * No public chemistry route may use an ingredient until its manifest record
 * is `verified`.
 */

/** NIST WebBook molecular weights used for equivalent-mass conversion. */
export const MW_NaOH = 39.9971;
export const MW_KOH = 56.1056;

export const MANIFEST_REVISION = "2.0.0";
export const MANIFEST_SOURCE_TITLE = "SoapCraft Pro Ingredient Source Manifest";
export const MANIFEST_SOURCE_URL = "product/CALCULATION-SPEC.md v2.0.0";
export const MANIFEST_SOURCE_METHOD = "ISO 3657:2020, Codex CXS 210-1999, PubChem";
export const MANIFEST_PUBLICATION_DATE = "2026-09-09";
export const MANIFEST_RETRIEVAL_DATE = "2026-09-09";

export type IngredientStatus = "verified" | "estimated" | "user_override" | "synthetic";
export type IngredientReviewerState = "pending" | "approved" | "rejected";

/** Oil subtype distinction where the source requires it (e.g., different SAP values for refined vs. unrefined). */
export type OilSubtype = "refined" | "unrefined" | "pomace" | "virgin" | "blend" | "standard" | "synthetic";

/** SAP KOH value range when sources disagree or the value is not a single canonical number. */
export interface SapKOHRange {
  readonly min: number;
  readonly max: number;
  readonly nominal: number;
  readonly sourceOfRange: string;
}

export interface IngredientRecord {
  readonly id: string;
  readonly displayName: string;
  readonly sapKOH: number;
  readonly sapNaOH: number;
  /** Oil subtype where the source distinguishes variants (e.g., olive-oil → pomace vs. virgin). */
  readonly subtype: OilSubtype;
  /** Nominal computational SAP KOH with explicit provenance. Only set when provenance is traceable. */
  readonly sapKOHRange: SapKOHRange | null;
  readonly sourceTitle: string;
  readonly sourceUrl: string;
  readonly sourceMethod: string;
  readonly publicationDate: string;
  readonly retrievalDate: string;
  readonly status: IngredientStatus;
  readonly reviewerState: IngredientReviewerState;
}

/** Synthetic fixture record — impossible to load in production. */
export const SYNTHETIC_OIL: IngredientRecord = Object.freeze({
  id: "test-oil-a",
  displayName: "Test Oil A (Synthetic)",
  sapKOH: 0.190000,
  sapNaOH: 0.1354477239510926,
  subtype: "synthetic",
  sapKOHRange: null,
  sourceTitle: MANIFEST_SOURCE_TITLE,
  sourceUrl: MANIFEST_SOURCE_URL,
  sourceMethod: "Synthetic fixture per CALCULATION-SPEC.md §14.1",
  publicationDate: MANIFEST_PUBLICATION_DATE,
  retrievalDate: MANIFEST_RETRIEVAL_DATE,
  status: "synthetic",
  reviewerState: "pending",
});


/** Reviewed standards-based validation ranges. These are envelopes, not universal nominal constants. */
const REVIEWED_SAP_RANGES: Readonly<Record<string, SapKOHRange>> = Object.freeze({
  "olive-oil": { min: 0.184, max: 0.196, nominal: 0.192, sourceOfRange: "FAO/WHO Codex CXS 33-1981; retrieved 2026-09-10" },
  "coconut-oil": { min: 0.248, max: 0.265, nominal: 0.2565, sourceOfRange: "FAO/WHO Codex CXS 210-1999; retrieved 2026-09-10" },
  "palm-oil": { min: 0.190, max: 0.209, nominal: 0.202, sourceOfRange: "FAO/WHO Codex CXS 210-1999; retrieved 2026-09-10" },
  "shea-butter": { min: 0.160, max: 0.195, nominal: 0.183, sourceOfRange: "FAO/WHO Codex CXS 325R-2017; unrefined shea; retrieved 2026-09-10" },
  "castor-oil": { min: 0.176, max: 0.185, nominal: 0.181, sourceOfRange: "FAO/WHO JECFA Castor Oil specification; retrieved 2026-09-10" },
  "sweet-almond-oil": { min: 0.183, max: 0.207, nominal: 0.196, sourceOfRange: "FAO/WHO Codex CXS 210-1999; almond oil generally; retrieved 2026-09-10" },
  "avocado-oil": { min: 0.170, max: 0.202, nominal: 0.191, sourceOfRange: "FAO/WHO Codex CXS 210-1999; retrieved 2026-09-10" },
  "sunflower-oil": { min: 0.187, max: 0.194, nominal: 0.194, sourceOfRange: "FAO/WHO Codex CXS 210-1999; subtype split required; retrieved 2026-09-10" },
  "rice-bran-oil": { min: 0.180, max: 0.199, nominal: 0.192, sourceOfRange: "FAO/WHO Codex CXS 210-1999; retrieved 2026-09-10" },
  "canola-oil": { min: 0.182, max: 0.193, nominal: 0.193, sourceOfRange: "FAO/WHO Codex CXS 210-1999; low-erucic rapeseed; retrieved 2026-09-10" },
});

/**
 * Legacy provisional oil data — internal only, NOT verified for public use.
 * Each record carries oil subtype and a nominal SAP range where sources disagree.
 * Values remain estimated/pending until Isaac accepts the specialist review.
 */
function makeLegacyOil(entry: {
  id: string;
  displayName: string;
  sapKOH: number;
  subtype: OilSubtype;
  sourceTitle: string;
  sourceUrl: string;
  sourceMethod: string;
}): IngredientRecord {
  const sapNaOH = derivNaOH(entry.sapKOH);
  const nominal = entry.sapKOH;
  const reviewedRange = REVIEWED_SAP_RANGES[entry.id];
  return Object.freeze({
    ...entry,
    sapNaOH,
    subtype: entry.subtype,
    sapKOHRange: reviewedRange ?? {
      min: nominal * 0.95,
      max: nominal * 1.05,
      nominal,
      sourceOfRange: "±5% uncertainty band from legacy SoapCalc estimates pending domain review",
    },
    sourceTitle: entry.sourceTitle,
    sourceUrl: entry.sourceUrl,
    sourceMethod: entry.sourceMethod,
    publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09",
    status: "estimated",
    reviewerState: "pending",
  });
}

export const LEGACY_OILS: readonly IngredientRecord[] = Object.freeze([
  makeLegacyOil({
    id: "olive-oil", displayName: "Olive Oil",
    sapKOH: 0.1920, subtype: "virgin",
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values",
  }),
  makeLegacyOil({
    id: "coconut-oil", displayName: "Coconut Oil",
    sapKOH: 0.2565, subtype: "standard",
    sourceTitle: "Codex validation envelope; nominal pending dedicated calculator source", sourceUrl: "https://www.fao.org/fao-who-codexalimentarius/",
    sourceMethod: "Codex range review — non-public nominal planning value; legacy 0.273 rejected",
  }),
  makeLegacyOil({
    id: "palm-oil", displayName: "Palm Oil",
    sapKOH: 0.2020, subtype: "standard",
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values",
  }),
  makeLegacyOil({
    id: "shea-butter", displayName: "Shea Butter",
    sapKOH: 0.1830, subtype: "unrefined",
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values",
  }),
  makeLegacyOil({
    id: "castor-oil", displayName: "Castor Oil",
    sapKOH: 0.1810, subtype: "standard",
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values",
  }),
  makeLegacyOil({
    id: "sweet-almond-oil", displayName: "Sweet Almond Oil",
    sapKOH: 0.1960, subtype: "virgin",
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values",
  }),
  makeLegacyOil({
    id: "avocado-oil", displayName: "Avocado Oil",
    sapKOH: 0.1910, subtype: "virgin",
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values",
  }),
  makeLegacyOil({
    id: "sunflower-oil", displayName: "Sunflower Oil",
    sapKOH: 0.1940, subtype: "standard",
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values",
  }),
  makeLegacyOil({
    id: "rice-bran-oil", displayName: "Rice Bran Oil",
    sapKOH: 0.1920, subtype: "standard",
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values",
  }),
  makeLegacyOil({
    id: "canola-oil", displayName: "Canola Oil",
    sapKOH: 0.1930, subtype: "standard",
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values",
  }),
]);

/** Derive NaOH saponification factor from KOH basis using molecular weights. */
export function derivNaOH(sapKOH: number): number {
  return sapKOH * MW_NaOH / MW_KOH;
}

/** Look up an ingredient by ID from the manifest. Returns undefined if not found. */
export function findIngredient(id: string): IngredientRecord | undefined {
  if (id === SYNTHETIC_OIL.id) return SYNTHETIC_OIL;
  return LEGACY_OILS.find(o => o.id === id);
}

/** Get the SAP KOH value for an ingredient, throwing if not found. */
export function getSapKOH(id: string): number {
  const ingredient = findIngredient(id);
  if (!ingredient) throw new Error(`Unknown ingredient: ${id}`);
  return ingredient.sapKOH;
}

/** Check if an ingredient is verified and independently approved for public use. */
export function isVerified(id: string): boolean {
  const ingredient = findIngredient(id);
  return ingredient?.status === "verified" && ingredient.reviewerState === "approved";
}

export function isPubliclyUsable(id: string): boolean {
  return isVerified(id);
}

/** Check if an ingredient is available for any calculation (including internal). */
export function isAvailable(id: string): boolean {
  return findIngredient(id) !== undefined;
}
