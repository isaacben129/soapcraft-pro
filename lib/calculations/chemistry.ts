/**
 * Deterministic Formulation Engine — SoapCraft Pro v2.0.0
 *
 * Implements the chemistry calculation contract from CALCULATION-SPEC.md v2.0.0.
 *
 * Key behaviors:
 * - Explicit positive oil mass (no hidden 1000g default)
 * - Percentage total validation (±0.0001 tolerance)
 * - NaOH/KOH/mixed-alkali based on KOH share of pure alkali equivalents
 * - One recipe-level superfat multiplier before independent purity division
 * - Separate NaOH, KOH and total as-supplied outputs
 * - Three mutually exclusive water modes
 * - Full precision internally; display-only rounding
 * - Typed errors/warnings; no silent clamps/substitutions
 * - No arbitrary property ranges; no oil-level IFRA
 * - Versioned ingredient record interface
 * - Production route disabled by default via PUBLIC_CHEMISTRY_ENABLED=false
 */

import { z } from "zod";
import {
  findIngredient,
  getSapKOH,
  isAvailable,
  isPubliclyUsable,
  MW_NaOH,
  MW_KOH,
  MANIFEST_REVISION,
  type IngredientRecord,
} from "./ingredient-dataset";

// ============================================================================
// Feature flag — production chemistry OFF by default
// ============================================================================

/**
 * Check if the public chemistry API is enabled.
 * Reads the environment at call time so tests and server runtimes fail closed predictably.
 */
export function isPublicChemistryEnabled(): boolean {
  return typeof process !== "undefined" && process.env.PUBLIC_CHEMISTRY_ENABLED === "true";
}

export class PublicChemistryGateError extends Error {
  constructor(
    public readonly code: "PUBLIC_CHEMISTRY_DISABLED" | "INGREDIENT_NOT_PUBLICLY_VERIFIED",
    message: string,
  ) {
    super(message);
    this.name = "PublicChemistryGateError";
  }
}

/** Enforce release controls before a public route can call the internal engine. */
export function assertPublicChemistryAccess(input: Pick<FormulationInput, "oilBlend">): void {
  if (!isPublicChemistryEnabled()) {
    throw new PublicChemistryGateError(
      "PUBLIC_CHEMISTRY_DISABLED",
      "Public formulation chemistry is disabled pending source verification.",
    );
  }

  const blocked = input.oilBlend.find((oil) => !isPubliclyUsable(oil.oilId));
  if (blocked) {
    throw new PublicChemistryGateError(
      "INGREDIENT_NOT_PUBLICLY_VERIFIED",
      `Ingredient is not approved for public chemistry: ${blocked.oilId}`,
    );
  }
}

// ============================================================================
// Input validation schema
// ============================================================================

export const OilInputSchema = z.object({
  oilId: z.string().min(1, "Oil ID is required"),
  percent: z.number().min(0.0001, "Percentage must be > 0").max(100, "Percentage must be ≤ 100"),
});

export const calculateFormulationInputSchema = z.object({
  oilBlend: z.array(OilInputSchema).min(1, "At least one oil is required"),
  targetOilMass: z.number().positive("Target oil mass must be positive"),
  superfatPercent: z.number().min(0, "Superfat must be ≥ 0").max(20, "Superfat must be ≤ 20%"),
  kohPercentOfAlkaliEquivalents: z.number().min(0, "KOH share must be ≥ 0").max(100, "KOH share must be ≤ 100"),
  naOHPurityPercent: z.number().gt(0, "NaOH purity must be > 0").max(100, "NaOH purity must be ≤ 100"),
  kohPurityPercent: z.number().gt(0, "KOH purity must be > 0").max(100, "KOH purity must be ≤ 100"),
  waterMode: z.enum(["water_to_lye_ratio", "lye_concentration", "percent_of_oils"]).default("water_to_lye_ratio"),
  waterToLyeRatio: z.number().min(0.1, "Water-to-lye ratio must be ≥ 0.1").default(2.5),
  lyeConcentrationPercent: z.number().min(1, "Lye concentration must be ≥ 1%").max(100, "Lye concentration must be ≤ 100%").default(33),
  waterAsPercentOfOils: z.number().min(0, "Water percent of oils must be ≥ 0").max(100, "Water percent of oils must be ≤ 100%").default(30),
  fragranceLoadPercent: z.number().min(0, "Fragrance load must be ≥ 0").max(100, "Fragrance load must be ≤ 100%").default(0),
  additivesWeight: z.number().nonnegative("Additives weight must be ≥ 0").default(0),
});

export type OilInput = z.infer<typeof OilInputSchema>;
export type FormulationInput = z.infer<typeof calculateFormulationInputSchema>;

// ============================================================================
// Output types
// ============================================================================

export interface CalculationResult {
  // Oil weights
  oilWeightTotal: number;
  oilWeights: Array<{ oilId: string; percent: number; weight: number }>;

  // Pure alkali demands (discounted by superfat)
  naohPureMass: number;
  kohPureMass: number;

  // As-supplied masses (after purity correction)
  naohAsSuppliedMass: number;
  kohAsSuppliedMass: number;
  totalAlkaliAsSupplied: number;

  // Convenience aliases
  naohMass: number;
  kohMass: number;
  totalAlkaliMass: number;

  // Water and fragrance
  water: number;
  fragranceLoad: number;
  additivesWeight: number;

  // Total batch weight
  totalWeight: number;

  // Version info
  calculatorVersion: string;
  datasetRevision: string;

  // Warnings
  warnings: Array<{
    type: "warning" | "error" | "danger";
    code: string;
    message: string;
  }>;
}

// ============================================================================
// Core calculation engine
// ============================================================================

/**
 * Calculate the deterministic formulation for a soap recipe.
 *
 * Implements CALCULATION-SPEC.md §3.1 formulas with:
 * - Explicit positive oil mass
 * - NaOH/KOH/mixed-alkali split based on KOH share of pure alkali equivalents
 * - One recipe-level superfat multiplier before independent purity correction
 * - Three mutually exclusive water modes
 * - Full precision internally
 *
 * Per CALCULATION-SPEC §3.1.4:
 *   lyeNaOH_pure = fullNaOHPure × naohFraction × discount
 *   lyeKOH_pure = fullKOHPure × kohFraction × discount
 *   purity division follows (asSupplied = pure / purityFraction)
 */
export function calculateFormulation(input: FormulationInput): CalculationResult {
  const parsed = calculateFormulationInputSchema.parse(input);
  const warnings: CalculationResult["warnings"] = [];

  // --- Validate oil percentages sum to 100 ± 0.0001 ---
  const totalOilPercent = parsed.oilBlend.reduce((sum, o) => sum + o.percent, 0);
  if (Math.abs(totalOilPercent - 100) > 0.0001) {
    throw new Error(
      `Oil percentages must sum to 100%. Currently: ${totalOilPercent.toFixed(4)}%`
    );
  }

  // --- Validate all oil IDs are known and available ---
  for (const oil of parsed.oilBlend) {
    if (!isAvailable(oil.oilId)) {
      throw new Error(`Unknown or unavailable ingredient: ${oil.oilId}`);
    }
  }

  // --- Calculate oil weights ---
  const oilWeights = parsed.oilBlend.map(oil => ({
    oilId: oil.oilId,
    percent: oil.percent,
    weight: (oil.percent / 100) * parsed.targetOilMass,
  }));
  const oilWeightTotal = parsed.targetOilMass;

  // --- Get SAP values and calculate full pure alkali demands ---
  const fullNaOHPure = oilWeights.reduce((sum, oil) => {
    const sapKOH = getSapKOH(oil.oilId);
    const sapNaOH = sapKOH * MW_NaOH / MW_KOH;
    return sum + oil.weight * sapNaOH;
  }, 0);

  const fullKOHPure = oilWeights.reduce((sum, oil) => {
    const sapKOH = getSapKOH(oil.oilId);
    return sum + oil.weight * sapKOH;
  }, 0);

  // --- NaOH/KOH fraction based on KOH share of alkali equivalents ---
  const kohFraction = parsed.kohPercentOfAlkaliEquivalents / 100;
  const naohFraction = 1 - kohFraction;

  // --- Superfat discount (recipe-level, applied before purity division) ---
  const superfatMultiplier = 1 - (parsed.superfatPercent / 100);

  // --- Pure alkali demands (discounted by superfat per CALCULATION-SPEC §3.1.4) ---
  const naohPureMass = fullNaOHPure * naohFraction * superfatMultiplier;
  const kohPureMass = fullKOHPure * kohFraction * superfatMultiplier;

  // --- Independent purity correction applied after superfat discount ---
  const naohPurityFraction = parsed.naOHPurityPercent / 100;
  const kohPurityFraction = parsed.kohPurityPercent / 100;

  if (naohPurityFraction <= 0 || kohPurityFraction <= 0) {
    throw new Error("Purity percentages must be > 0");
  }

  const naohAsSupplied = naohPureMass / naohPurityFraction;
  const kohAsSupplied = kohPureMass / kohPurityFraction;
  const totalAlkaliAsSupplied = naohAsSupplied + kohAsSupplied;

  // --- Water calculation based on active mode ---
  let water: number;
  switch (parsed.waterMode) {
    case "water_to_lye_ratio": {
      const ratio = typeof parsed.waterToLyeRatio === "number" ? parsed.waterToLyeRatio : 2.5;
      if (!isFinite(ratio) || ratio <= 0) {
        throw new Error("Water-to-lye ratio must be positive");
      }
      water = totalAlkaliAsSupplied * ratio;
      break;
    }
    case "lye_concentration": {
      const concPercent = typeof parsed.lyeConcentrationPercent === "number" ? parsed.lyeConcentrationPercent : 33;
      const concFraction = concPercent / 100;
      if (concFraction <= 0 || concFraction >= 1) {
        throw new Error("Lye concentration must be between 0 and 100 (exclusive)");
      }
      water = totalAlkaliAsSupplied * ((1 / concFraction) - 1);
      break;
    }
    case "percent_of_oils": {
      const pct = typeof parsed.waterAsPercentOfOils === "number" ? parsed.waterAsPercentOfOils : 30;
      water = oilWeightTotal * (pct / 100);
      break;
    }
    default: {
      // Should never reach here due to Zod schema
      throw new Error(`Unknown water mode: ${parsed.waterMode}`);
    }
  }

  if (!isFinite(water) || water < 0) {
    throw new Error("Calculated water mass must be a positive finite number");
  }

  // --- Fragrance load ---
  const fragranceLoad = (parsed.fragranceLoadPercent / 100) * oilWeightTotal;

  // --- Total batch weight ---
  const totalWeight = oilWeightTotal + naohAsSupplied + kohAsSupplied + water + fragranceLoad + parsed.additivesWeight;

  // --- Build warnings ---
  if (parsed.superfatPercent > 15) {
    warnings.push({
      type: "warning",
      code: "HIGH_SUPERFAT",
      message: `Superfat at ${parsed.superfatPercent}% is outside the currently supported operating range.`,
    });
  }
  if (parsed.superfatPercent < 5) {
    warnings.push({
      type: "warning",
      code: "LOW_SUPERFAT",
      message: `Superfat at ${parsed.superfatPercent}% is outside the currently supported operating range.`,
    });
  }
  if (parsed.fragranceLoadPercent > 6) {
    warnings.push({
      type: "danger",
      code: "HIGH_FRAGRANCE",
      message: `Fragrance load at ${parsed.fragranceLoadPercent}% requires an exact supplier certificate and Category 9 limit check.`,
    });
  }

  return {
    oilWeightTotal,
    oilWeights,
    naohPureMass,
    kohPureMass,
    naohAsSuppliedMass: naohAsSupplied,
    kohAsSuppliedMass: kohAsSupplied,
    totalAlkaliAsSupplied,
    naohMass: naohAsSupplied,
    kohMass: kohAsSupplied,
    totalAlkaliMass: totalAlkaliAsSupplied,
    water,
    fragranceLoad,
    additivesWeight: parsed.additivesWeight,
    totalWeight,
    calculatorVersion: "2.0.0",
    datasetRevision: MANIFEST_REVISION,
    warnings,
  };
}

// Re-export for convenience
export { findIngredient, getSapKOH, isAvailable, MW_NaOH, MW_KOH };
