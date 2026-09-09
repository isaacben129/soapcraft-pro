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

export const MW_NaOH = 39.997;
export const MW_KOH = 56.106;

export const MANIFEST_REVISION = "2.0.0";
export const MANIFEST_SOURCE_TITLE = "SoapCraft Pro Ingredient Source Manifest";
export const MANIFEST_SOURCE_URL = "product/CALCULATION-SPEC.md v2.0.0";
export const MANIFEST_SOURCE_METHOD = "ISO 3657:2020, Codex CXS 210-1999, PubChem";
export const MANIFEST_PUBLICATION_DATE = "2026-09-09";
export const MANIFEST_RETRIEVAL_DATE = "2026-09-09";

export type IngredientStatus = "verified" | "estimated" | "user_override" | "synthetic";
export type IngredientReviewerState = "pending" | "approved" | "rejected";

export interface IngredientRecord {
  readonly id: string;
  readonly displayName: string;
  readonly sapKOH: number;
  readonly sapNaOH: number;
  readonly sourceTitle: string;
  readonly sourceUrl: string;
  readonly sourceMethod: string;
  readonly publicationDate: string;
  readonly retrievalDate: string;
  readonly status: IngredientStatus;
  readonly reviewerState: IngredientReviewerState;
}

/**
 * Synthetic fixture record — impossible to load in production.
 * Used exclusively for algebra tests per CALCULATION-SPEC.md §14.
 */
export const SYNTHETIC_OIL: IngredientRecord = Object.freeze({
  id: "test-oil-a",
  displayName: "Test Oil A (Synthetic)",
  sapKOH: 0.190000,
  sapNaOH: 0.1354477239510926, // = sapKOH × MW_NaOH / MW_KOH
  sourceTitle: MANIFEST_SOURCE_TITLE,
  sourceUrl: MANIFEST_SOURCE_URL,
  sourceMethod: "Synthetic fixture per CALCULATION-SPEC.md §14.1",
  publicationDate: MANIFEST_PUBLICATION_DATE,
  retrievalDate: MANIFEST_RETRIEVAL_DATE,
  status: "synthetic",
  reviewerState: "pending",
});

/**
 * Legacy provisional oil data — internal only, NOT verified for public use.
 * These values may be migrated into the schema to build and test the engine,
 * but no public chemistry route may use an ingredient until its manifest
 * record is `verified`.
 */
export const LEGACY_OILS: readonly IngredientRecord[] = Object.freeze([
  {
    id: "olive-oil", displayName: "Olive Oil",
    sapKOH: 0.1920, sapNaOH: derivNaOH(0.1920),
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values", publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09", status: "estimated", reviewerState: "pending",
  },
  {
    id: "coconut-oil", displayName: "Coconut Oil",
    sapKOH: 0.2730, sapNaOH: derivNaOH(0.2730),
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values", publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09", status: "estimated", reviewerState: "pending",
  },
  {
    id: "palm-oil", displayName: "Palm Oil",
    sapKOH: 0.2020, sapNaOH: derivNaOH(0.2020),
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values", publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09", status: "estimated", reviewerState: "pending",
  },
  {
    id: "shea-butter", displayName: "Shea Butter",
    sapKOH: 0.1830, sapNaOH: derivNaOH(0.1830),
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values", publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09", status: "estimated", reviewerState: "pending",
  },
  {
    id: "castor-oil", displayName: "Castor Oil",
    sapKOH: 0.1810, sapNaOH: derivNaOH(0.1810),
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values", publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09", status: "estimated", reviewerState: "pending",
  },
  {
    id: "sweet-almond-oil", displayName: "Sweet Almond Oil",
    sapKOH: 0.1960, sapNaOH: derivNaOH(0.1960),
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values", publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09", status: "estimated", reviewerState: "pending",
  },
  {
    id: "avocado-oil", displayName: "Avocado Oil",
    sapKOH: 0.1910, sapNaOH: derivNaOH(0.1910),
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values", publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09", status: "estimated", reviewerState: "pending",
  },
  {
    id: "sunflower-oil", displayName: "Sunflower Oil",
    sapKOH: 0.1940, sapNaOH: derivNaOH(0.1940),
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values", publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09", status: "estimated", reviewerState: "pending",
  },
  {
    id: "rice-bran-oil", displayName: "Rice Bran Oil",
    sapKOH: 0.1920, sapNaOH: derivNaOH(0.1920),
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values", publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09", status: "estimated", reviewerState: "pending",
  },
  {
    id: "canola-oil", displayName: "Canola Oil",
    sapKOH: 0.1930, sapNaOH: derivNaOH(0.1930),
    sourceTitle: "Legacy provisional data", sourceUrl: "internal",
    sourceMethod: "Legacy SoapCalc values", publicationDate: "pre-2026-09-09",
    retrievalDate: "pre-2026-09-09", status: "estimated", reviewerState: "pending",
  },
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
