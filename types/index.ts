export type Oil = {
  id: string;
  name: string;
  nameShort: string;
  sapValueNaOH: number;
  sapValueKOH: number;
  hardnessFactor: number;
  latherFactor: number;
  moisturizingFactor: number;
  ifraCategory: string | null;
  maxUsagePercent: number | null;
  source: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RecipeVersion = {
  id: string;
  recipeId: string;
  version: number;
  name: string;
  notes: string | null;
  method: "cp" | "hp" | "mp" | null;
  oilBlend: Array<{
    oilId: string;
    percent: number;
  }>;
  superfatPercent: number;
  lyeConcentrationPercent: number;
  waterToLyeRatio: number;
  calculatedLyeNaOH: number;
  calculatedLyeKOH: number;
  calculatedWater: number;
  calculatedFragranceLoad: number;
  propertyRanges: {
    hardness: { min: number; max: number };
    lather: { min: number; max: number };
    moisturizing: { min: number; max: number };
    cleansing: { min: number; max: number };
    condition: { min: number; max: number };
    bTrace: { min: number; max: number };
    gelPhase: { min: number; max: number };
  } | null;
  warnings: Array<{
    type: "warning" | "danger";
    message: string;
    oilId?: string;
  }>;
  createdAt: Date;
};

export type Batch = {
  id: string;
  recipeVersionId: string;
  status: "draft" | "making" | "curing" | "completed" | "archived";
  batchName: string;
  actualMeasurements: {
    oilWeightG: number;
    lyeWeightG: number;
    waterWeightG: number;
    fragranceWeightG: number;
    otherAdditivesG: number;
  };
  method: "cp" | "hp" | "mp";
  notes: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CureObservation = {
  id: string;
  batchId: string;
  day: number;
  pH: number | null;
  hardness: string | null;
  notes: string | null;
  createdAt: Date;
};

export type BatchCostRecord = {
  id: string;
  batchId: string;
  ingredientCosts: Array<{
    oilId: string;
    costPerGram: number;
    weightUsedG: number;
    totalCost: number;
  }>;
  fragranceCost: number;
  otherCosts: number;
  totalCost: number;
  batchYieldBars: number;
  costPerBar: number;
  targetPricePerBar: number;
  marginPercent: number;
  createdAt: Date;
};

export type User = {
  id: string;
  email: string;
  name: string | null;
  experienceLevel: "beginner" | "intermediate" | "advanced" | null;
  primaryGoal: "hobby" | "sell" | null;
  subscriptionTier: "free" | "pro" | null;
  trialStartsAt: Date | null;
  trialEndsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
