import { z } from "zod";

// --- Input validation schema ---
export const OilInputSchema = z.object({
  oilId: z.string().min(1, "Oil ID is required"),
  percent: z.number().min(0, "Percentage must be ≥ 0").max(100, "Percentage must be ≤ 100"),
});

export const FormulationInputSchema = z.object({
  oilBlend: z.array(OilInputSchema).min(1, "At least one oil is required"),
  superfatPercent: z.number().min(0, "Superfat must be ≥ 0").max(20, "Superfat must be ≤ 20%"),
  lyeConcentrationPercent: z.number().min(10, "Lye concentration must be ≥ 10%").max(50, "Lye concentration must be ≤ 50%"),
  waterToLyeRatio: z.number().min(0.5, "Water-to-lye ratio must be ≥ 0.5").max(3, "Water-to-lye ratio must be ≤ 3"),
  fragranceLoadPercent: z.number().min(0, "Fragrance load must be ≥ 0").max(10, "Fragrance load must be ≤ 10%").optional().default(0),
});

export type OilInput = z.infer<typeof OilInputSchema>;
export type FormulationInput = z.infer<typeof FormulationInputSchema>;

// --- Output types ---
export interface CalculationResult {
  lyeNaOH: number;
  lyeKOH: number;
  water: number;
  fragranceLoad: number;
  oilWeightTotal: number;
  lyeWeightTotal: number;
  totalWeight: number;
  propertyRanges: {
    hardness: { min: number; max: number };
    lather: { min: number; max: number };
    moisturizing: { min: number; max: number };
    cleansing: { min: number; max: number };
    condition: { min: number; max: number };
    bTrace: { min: number; max: number };
    gelPhase: { min: number; max: number };
  };
  warnings: Array<{
    type: "warning" | "danger";
    message: string;
    oilId?: string;
  }>;
}

// --- Factor ranges ( SoapCalc-compatible ) ---
const PROPERTY_RANGES = {
  hardness: { min: 29, max: 54, weight: 0.4 },
  lather: { min: 12, max: 22, weight: 0.3 },
  moisturizing: { min: 35, max: 70, weight: 0.15 },
  cleansing: { min: 12, max: 22, weight: 0.1 },
  condition: { min: 29, max: 54, weight: 0.05 },
  bTrace: { min: 29, max: 54, weight: 0 },
  gelPhase: { min: 29, max: 54, weight: 0 },
};

// --- Core calculation engine ---
export function calculateFormulation(input: FormulationInput): CalculationResult {
  const {
    oilBlend,
    superfatPercent,
    lyeConcentrationPercent,
    waterToLyeRatio,
    fragranceLoadPercent,
  } = FormulationInputSchema.parse(input);

  // Validate total oil percentage
  const totalOilPercent = oilBlend.reduce((sum, o) => sum + o.percent, 0);
  if (Math.abs(totalOilPercent - 100) > 0.01) {
    throw new Error(`Oil percentages must sum to 100%. Currently: ${totalOilPercent.toFixed(2)}%`);
  }

  // Build lookup map from DEFAULT_OILS
  const oilLookup = new Map(DEFAULT_OILS.map(o => [o.id, o]));

  // Calculate total oil weight (assume 1000g batch for percentage-based calculation)
  const oilWeightTotal = 1000;

  // Calculate lye needed (NaOH) — deterministic, authoritative
  let lyeNaOH = 0;
  let lyeKOH = 0;
  for (const oil of oilBlend) {
    const oilData = oilLookup.get(oil.oilId);
    if (!oilData) {
      throw new Error(`Unknown oil: ${oil.oilId}`);
    }
    const oilWeight = (oil.percent / 100) * oilWeightTotal;
    lyeNaOH += oilWeight * oilData.sapValueNaOH;
    lyeKOH += oilWeight * oilData.sapValueKOH;
  }

  // Apply superfat reduction (NaOH only for cold process)
  const superfatMultiplier = 1 - (superfatPercent / 100);
  lyeNaOH *= superfatMultiplier;

  // Calculate water
  const water = lyeNaOH * waterToLyeRatio;

  // Calculate fragrance load
  const fragranceLoad = (fragranceLoadPercent / 100) * oilWeightTotal;

  // Total batch weight
  const lyeWeightTotal = lyeNaOH + (lyeKOH - lyeNaOH); // KOH portion for hybrid recipes
  const totalWeight = oilWeightTotal + lyeNaOH + water + fragranceLoad;

  // Calculate property ranges (weighted blend of oil properties)
  let hardness = 0, lather = 0, moisturizing = 0, cleansing = 0, condition = 0;
  for (const oil of oilBlend) {
    const oilData = oilLookup.get(oil.oilId)!;
    const weight = oil.percent / 100;
    hardness += oilData.hardnessFactor * weight;
    lather += oilData.latherFactor * weight;
    moisturizing += oilData.moisturizingFactor * weight;
    cleansing += oilData.cleansingFactor * weight;
    condition += oilData.conditionFactor * weight;
  }

  const propertyRanges = {
    hardness: { min: Math.round(hardness * 0.8 * 10) / 10, max: Math.round(hardness * 1.2 * 10) / 10 },
    lather: { min: Math.round(lather * 0.8 * 10) / 10, max: Math.round(lather * 1.2 * 10) / 10 },
    moisturizing: { min: Math.round(moisturizing * 0.8 * 10) / 10, max: Math.round(moisturizing * 1.2 * 10) / 10 },
    cleansing: { min: Math.round(cleansing * 0.8 * 10) / 10, max: Math.round(cleansing * 1.2 * 10) / 10 },
    condition: { min: Math.round(condition * 0.8 * 10) / 10, max: Math.round(condition * 1.2 * 10) / 10 },
    bTrace: { min: Math.round(hardness * 0.7 * 10) / 10, max: Math.round(hardness * 1.3 * 10) / 10 },
    gelPhase: { min: Math.round(hardness * 0.6 * 10) / 10, max: Math.round(hardness * 1.4 * 10) / 10 },
  };

  // Generate warnings
  const warnings: CalculationResult["warnings"] = [];

  for (const oil of oilBlend) {
    const oilData = oilLookup.get(oil.oilId);
    if (oil.percent > 80) {
      warnings.push({
        type: "danger",
        message: `${oilData?.nameShort ?? oil.oilId} is ${oil.percent}% of the blend — single oil above 80% can cause separation`,
        oilId: oil.oilId,
      });
    }
  }

  if (superfatPercent < 5) {
    warnings.push({
      type: "warning",
      message: `Superfat at ${superfatPercent}% is low — bars may be harder and less moisturizing`,
    });
  }

  if (superfatPercent > 15) {
    warnings.push({
      type: "warning",
      message: `Superfat at ${superfatPercent}% is high — bars may be soft and prone to rancidity`,
    });
  }

  if (lyeConcentrationPercent < 20) {
    warnings.push({
      type: "warning",
      message: `Lye concentration at ${lyeConcentrationPercent}% is low — longer cure time expected`,
    });
  }

  if (waterToLyeRatio > 2) {
    warnings.push({
      type: "warning",
      message: `Water-to-lye ratio at ${waterToLyeRatio}:1 is high — extended cure time, risk of soda ash`,
    });
  }

  if (fragranceLoadPercent > 6) {
    warnings.push({
      type: "danger",
      message: `Fragrance load at ${fragranceLoadPercent}% exceeds 6% — may cause acceleration or separation`,
    });
  }

  return {
    lyeNaOH: Math.round(lyeNaOH * 10000) / 10000,
    lyeKOH: Math.round(lyeKOH * 10000) / 10000,
    water: Math.round(water * 10000) / 10000,
    fragranceLoad: Math.round(fragranceLoad * 10000) / 10000,
    oilWeightTotal,
    lyeWeightTotal: Math.round(lyeNaOH * 10000) / 10000,
    totalWeight: Math.round(totalWeight * 10000) / 10000,
    propertyRanges,
    warnings,
  };
}

// --- Oil database (top 20 by community usage) ---
export const DEFAULT_OILS: Array<{
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
}> = [
  { id: "olive-oil", name: "Olive Oil", nameShort: "Olive", sapValueNaOH: 0.1340, sapValueKOH: 0.1920, hardnessFactor: 10, latherFactor: 10, moisturizingFactor: 80, cleansingFactor: 10, conditionFactor: 80, ifraCategory: null, maxUsagePercent: null },
  { id: "coconut-oil", name: "Coconut Oil", nameShort: "Coconut", sapValueNaOH: 0.1900, sapValueKOH: 0.2730, hardnessFactor: 90, latherFactor: 90, moisturizingFactor: 10, cleansingFactor: 90, conditionFactor: 10, ifraCategory: null, maxUsagePercent: 80 },
  { id: "palm-oil", name: "Palm Oil", nameShort: "Palm", sapValueNaOH: 0.1410, sapValueKOH: 0.2020, hardnessFactor: 50, latherFactor: 45, moisturizingFactor: 40, cleansingFactor: 45, conditionFactor: 40, ifraCategory: null, maxUsagePercent: null },
  { id: "shea-butter", name: "Shea Butter", nameShort: "Shea", sapValueNaOH: 0.1280, sapValueKOH: 0.1830, hardnessFactor: 20, latherFactor: 15, moisturizingFactor: 90, cleansingFactor: 15, conditionFactor: 90, ifraCategory: null, maxUsagePercent: null },
  { id: "castor-oil", name: "Castor Oil", nameShort: "Castor", sapValueNaOH: 0.1270, sapValueKOH: 0.1810, hardnessFactor: 5, latherFactor: 85, moisturizingFactor: 90, cleansingFactor: 85, conditionFactor: 90, ifraCategory: null, maxUsagePercent: 100 },
  { id: "sweet-almond-oil", name: "Sweet Almond Oil", nameShort: "Almond", sapValueNaOH: 0.1360, sapValueKOH: 0.1960, hardnessFactor: 15, latherFactor: 15, moisturizingFactor: 80, cleansingFactor: 15, conditionFactor: 80, ifraCategory: null, maxUsagePercent: null },
  { id: "avocado-oil", name: "Avocado Oil", nameShort: "Avocado", sapValueNaOH: 0.1330, sapValueKOH: 0.1910, hardnessFactor: 10, latherFactor: 10, moisturizingFactor: 85, cleansingFactor: 10, conditionFactor: 85, ifraCategory: null, maxUsagePercent: null },
  { id: "sunflower-oil", name: "Sunflower Oil", nameShort: "Sunflower", sapValueNaOH: 0.1350, sapValueKOH: 0.1940, hardnessFactor: 10, latherFactor: 15, moisturizingFactor: 75, cleansingFactor: 15, conditionFactor: 75, ifraCategory: null, maxUsagePercent: null },
  { id: "rice-bran-oil", name: "Rice Bran Oil", nameShort: "Rice Bran", sapValueNaOH: 0.1340, sapValueKOH: 0.1920, hardnessFactor: 10, latherFactor: 15, moisturizingFactor: 75, cleansingFactor: 15, conditionFactor: 75, ifraCategory: null, maxUsagePercent: null },
  { id: "canola-oil", name: "Canola Oil", nameShort: "Canola", sapValueNaOH: 0.1340, sapValueKOH: 0.1930, hardnessFactor: 10, latherFactor: 15, moisturizingFactor: 70, cleansingFactor: 15, conditionFactor: 70, ifraCategory: null, maxUsagePercent: null },
  { id: "cocoa-butter", name: "Cocoa Butter", nameShort: "Cocoa", sapValueNaOH: 0.1370, sapValueKOH: 0.1970, hardnessFactor: 60, latherFactor: 15, moisturizingFactor: 50, cleansingFactor: 15, conditionFactor: 50, ifraCategory: null, maxUsagePercent: null },
  { id: "mango-butter", name: "Mango Butter", nameShort: "Mango", sapValueNaOH: 0.1370, sapValueKOH: 0.1970, hardnessFactor: 40, latherFactor: 15, moisturizingFactor: 60, cleansingFactor: 15, conditionFactor: 60, ifraCategory: null, maxUsagePercent: null },
  { id: "jojoba-oil", name: "Jojoba Oil", nameShort: "Jojoba", sapValueNaOH: 0.1360, sapValueKOH: 0.1960, hardnessFactor: 10, latherFactor: 10, moisturizingFactor: 80, cleansingFactor: 10, conditionFactor: 80, ifraCategory: null, maxUsagePercent: null },
  { id: "argan-oil", name: "Argan Oil", nameShort: "Argan", sapValueNaOH: 0.1360, sapValueKOH: 0.1960, hardnessFactor: 10, latherFactor: 10, moisturizingFactor: 80, cleansingFactor: 10, conditionFactor: 80, ifraCategory: null, maxUsagePercent: null },
  { id: "hemp-seed-oil", name: "Hemp Seed Oil", nameShort: "Hemp", sapValueNaOH: 0.1350, sapValueKOH: 0.1940, hardnessFactor: 5, latherFactor: 10, moisturizingFactor: 85, cleansingFactor: 10, conditionFactor: 85, ifraCategory: null, maxUsagePercent: null },
  { id: "flaxseed-oil", name: "Flaxseed Oil", nameShort: "Flax", sapValueNaOH: 0.1340, sapValueKOH: 0.1930, hardnessFactor: 3, latherFactor: 5, moisturizingFactor: 90, cleansingFactor: 5, conditionFactor: 90, ifraCategory: null, maxUsagePercent: null },
  { id: "pomace-oil", name: "Olive Pomace Oil", nameShort: "Pomace", sapValueNaOH: 0.1340, sapValueKOH: 0.1920, hardnessFactor: 10, latherFactor: 10, moisturizingFactor: 75, cleansingFactor: 10, conditionFactor: 75, ifraCategory: null, maxUsagePercent: null },
  { id: "babassu-oil", name: "Babassu Oil", nameShort: "Babassu", sapValueNaOH: 0.1890, sapValueKOH: 0.2710, hardnessFactor: 85, latherFactor: 85, moisturizingFactor: 10, cleansingFactor: 85, conditionFactor: 10, ifraCategory: null, maxUsagePercent: null },
  { id: "kyrgyz-kernel-oil", name: "Kyrgyz Kernel Oil", nameShort: "Kyrgyz", sapValueNaOH: 0.1340, sapValueKOH: 0.1920, hardnessFactor: 10, latherFactor: 10, moisturizingFactor: 70, cleansingFactor: 10, conditionFactor: 70, ifraCategory: null, maxUsagePercent: null },
  { id: "safflower-oil", name: "Safflower Oil", nameShort: "Safflower", sapValueNaOH: 0.1350, sapValueKOH: 0.1940, hardnessFactor: 5, latherFactor: 10, moisturizingFactor: 75, cleansingFactor: 10, conditionFactor: 75, ifraCategory: null, maxUsagePercent: null },
];

// --- Validation helpers ---
export function validateOilPercentages(oilBlend: OilInput[]): string | null {
  const total = oilBlend.reduce((sum, o) => sum + o.percent, 0);
  if (Math.abs(total - 100) > 0.01) {
    return `Oil percentages sum to ${total.toFixed(2)}%, not 100%`;
  }
  for (const oil of oilBlend) {
    if (oil.percent <= 0) return `${oil.oilId} has ${oil.percent}% — must be > 0`;
    if (oil.percent > 100) return `${oil.oilId} has ${oil.percent}% — must be ≤ 100`;
  }
  return null;
}

export function checkIFRACompliance(oilBlend: OilInput[], ingredients: Map<string, { ifraCategory: string | null; maxUsagePercent: number | null }>): Array<{ type: "warning" | "danger"; message: string; oilId: string }> {
  const violations: Array<{ type: "warning" | "danger"; message: string; oilId: string }> = [];
  for (const oil of oilBlend) {
    const ingredient = ingredients.get(oil.oilId);
    if (ingredient && ingredient.maxUsagePercent !== null && oil.percent > ingredient.maxUsagePercent) {
      violations.push({
        type: "danger",
        message: `${oil.oilId} exceeds IFRA max usage of ${ingredient.maxUsagePercent}%`,
        oilId: oil.oilId,
      });
    }
  }
  return violations;
}
