/**
 * Sap compatibility layer — SoapCraft Pro v2.0.0
 *
 * This module bridges the legacy consumer interface (DEFAULT_OILS, property-free
 * calculateFormulation) to the new chemistry engine (chemistry.ts + ingredient-dataset.ts).
 *
 * BANNED: propertyRanges, IFRA compliance checks, arbitrary property transforms.
 * The v2 chemistry engine (chemistry.ts) is the authoritative implementation.
 * This layer maps its output to the shape expected by legacy consumer files.
 */

import { calculateFormulation as chemistryCalculate } from "./chemistry";
import { LEGACY_OILS, SYNTHETIC_OIL, type IngredientRecord, findIngredient, getSapKOH, isAvailable, isVerified, isPubliclyUsable, type IngredientStatus, type IngredientReviewerState } from "./ingredient-dataset";

// --- Map IngredientRecord to the legacy DEFAULT_OILS interface ---

interface LegacyOil {
  id: string;
  name: string;
  nameShort: string;
  sapValueNaOH: number;
  sapValueKOH: number;
  hardnessFactor: number;
  latherFactor: number;
  moisturizingFactor: number;
  cleansingFactor: number;
  conditionFactor: number;
  ifraCategory: string | null;
  maxUsagePercent: number | null;
}

/**
 * Build legacy-compatible oil entries from the ingredient manifest.
 * Individual factor values are retained as neutral metadata only;
 * they do NOT produce propertyRanges (which are banned by contract).
 */
function mapToLegacyOil(ing: IngredientRecord): LegacyOil {
  return {
    id: ing.id,
    name: ing.displayName,
    nameShort: ing.displayName.split(" ")[0],
    sapValueNaOH: ing.sapNaOH,
    sapValueKOH: ing.sapKOH,
    // Neutral metadata factors — no property ranges derived from these.
    // Per contract: "Arbitrary ±20% property transforms are prohibited."
    hardnessFactor: 0,
    latherFactor: 0,
    moisturizingFactor: 0,
    cleansingFactor: 0,
    conditionFactor: 0,
    ifraCategory: null,
    maxUsagePercent: null,
  };
}

/** Additional oils not in the core manifest — retained for catalogue compatibility. */
const ADDITIONAL_OILS: LegacyOil[] = [
  { id: "cocoa-butter", name: "Cocoa Butter", nameShort: "Cocoa", sapValueNaOH: 0.1370, sapValueKOH: 0.1970, hardnessFactor: 0, latherFactor: 0, moisturizingFactor: 0, cleansingFactor: 0, conditionFactor: 0, ifraCategory: null, maxUsagePercent: null },
  { id: "mango-butter", name: "Mango Butter", nameShort: "Mango", sapValueNaOH: 0.1370, sapValueKOH: 0.1970, hardnessFactor: 0, latherFactor: 0, moisturizingFactor: 0, cleansingFactor: 0, conditionFactor: 0, ifraCategory: null, maxUsagePercent: null },
  { id: "jojoba-oil", name: "Jojoba Oil", nameShort: "Jojoba", sapValueNaOH: 0.1360, sapValueKOH: 0.1960, hardnessFactor: 0, latherFactor: 0, moisturizingFactor: 0, cleansingFactor: 0, conditionFactor: 0, ifraCategory: null, maxUsagePercent: null },
  { id: "argan-oil", name: "Argan Oil", nameShort: "Argan", sapValueNaOH: 0.1360, sapValueKOH: 0.1960, hardnessFactor: 0, latherFactor: 0, moisturizingFactor: 0, cleansingFactor: 0, conditionFactor: 0, ifraCategory: null, maxUsagePercent: null },
  { id: "hemp-seed-oil", name: "Hemp Seed Oil", nameShort: "Hemp", sapValueNaOH: 0.1350, sapValueKOH: 0.1940, hardnessFactor: 0, latherFactor: 0, moisturizingFactor: 0, cleansingFactor: 0, conditionFactor: 0, ifraCategory: null, maxUsagePercent: null },
  { id: "flaxseed-oil", name: "Flaxseed Oil", nameShort: "Flax", sapValueNaOH: 0.1340, sapValueKOH: 0.1930, hardnessFactor: 0, latherFactor: 0, moisturizingFactor: 0, cleansingFactor: 0, conditionFactor: 0, ifraCategory: null, maxUsagePercent: null },
  { id: "pomace-oil", name: "Olive Pomace Oil", nameShort: "Pomace", sapValueNaOH: 0.1340, sapValueKOH: 0.1920, hardnessFactor: 0, latherFactor: 0, moisturizingFactor: 0, cleansingFactor: 0, conditionFactor: 0, ifraCategory: null, maxUsagePercent: null },
  { id: "babassu-oil", name: "Babassu Oil", nameShort: "Babassu", sapValueNaOH: 0.1890, sapValueKOH: 0.2710, hardnessFactor: 0, latherFactor: 0, moisturizingFactor: 0, cleansingFactor: 0, conditionFactor: 0, ifraCategory: null, maxUsagePercent: null },
  { id: "kyrgyz-kernel-oil", name: "Kyrgyz Kernel Oil", nameShort: "Kyrgyz", sapValueNaOH: 0.1340, sapValueKOH: 0.1920, hardnessFactor: 0, latherFactor: 0, moisturizingFactor: 0, cleansingFactor: 0, conditionFactor: 0, ifraCategory: null, maxUsagePercent: null },
  { id: "safflower-oil", name: "Safflower Oil", nameShort: "Safflower", sapValueNaOH: 0.1350, sapValueKOH: 0.1940, hardnessFactor: 0, latherFactor: 0, moisturizingFactor: 0, cleansingFactor: 0, conditionFactor: 0, ifraCategory: null, maxUsagePercent: null },
];

export const DEFAULT_OILS: readonly LegacyOil[] = Object.freeze([
  ...LEGACY_OILS.map(mapToLegacyOil),
  ...ADDITIONAL_OILS,
]);

// --- Compatibility input/output types ---

export type OilInput = { oilId: string; percent: number };

export interface FormulationInput {
  oilBlend: OilInput[];
  superfatPercent: number;
  lyeConcentrationPercent: number;
  waterToLyeRatio: number;
  fragranceLoadPercent?: number;
}

export interface CalculationResultLegacy {
  lyeNaOH: number;
  lyeKOH: number;
  water: number;
  fragranceLoad: number;
  oilWeightTotal: number;
  lyeWeightTotal: number;
  totalWeight: number;
  warnings: Array<{ type: string; message: string }>;
  // NOTE: propertyRanges is BANNED by contract. Removed.
}

export type CalculationResult = CalculationResultLegacy;

/**
 * Calculate formulation using the authoritative v2 chemistry engine.
 * Maps output to legacy-compatible shape WITHOUT propertyRanges.
 */
export function calculateFormulation(input: FormulationInput): CalculationResultLegacy {
  const chemResult = chemistryCalculate({
    oilBlend: input.oilBlend.map(o => ({ oilId: o.oilId, percent: o.percent })),
    targetOilMass: 1000, // Default batch weight for legacy compatibility
    superfatPercent: input.superfatPercent,
    kohPercentOfAlkaliEquivalents: 0,
    naOHPurityPercent: 100,
    kohPurityPercent: 100,
    waterMode: "water_to_lye_ratio",
    waterToLyeRatio: input.waterToLyeRatio,
    lyeConcentrationPercent: input.lyeConcentrationPercent,
    waterAsPercentOfOils: 30,
    fragranceLoadPercent: input.fragranceLoadPercent ?? 0,
    additivesWeight: 0,
  });

  return {
    lyeNaOH: chemResult.naohAsSuppliedMass,
    lyeKOH: chemResult.kohAsSuppliedMass,
    water: chemResult.water,
    fragranceLoad: chemResult.fragranceLoad,
    oilWeightTotal: chemResult.oilWeightTotal,
    lyeWeightTotal: chemResult.totalAlkaliAsSupplied,
    totalWeight: chemResult.totalWeight,
    warnings: chemResult.warnings.map(w => ({ type: w.type, message: w.message })),
  };
}

// --- Re-exports for consumer compatibility ---
export { findIngredient, getSapKOH, isAvailable, isVerified, isPubliclyUsable };
export { SYNTHETIC_OIL, LEGACY_OILS };
export type { IngredientRecord, IngredientStatus, IngredientReviewerState };
