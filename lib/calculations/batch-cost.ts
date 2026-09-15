// ── Batch Cost Calculation Contract ──────────
// R6.2: Calculate batch costs from ingredient cost records.
// Missing cost basis remains visible. No zero-cost fallback.

export interface BatchCostInput {
  ingredientCosts: Array<{
    ingredientId: string;
    costPerUnit: number;
    unit: string;
    quantity: number;
    quantityUnit: string;
  }>;
  fragranceCost: number;
  otherCosts: number;
  batchYieldBars: number;
  targetPricePerBar?: number;
  targetGrossMargin?: number;
  targetMarkupPercent?: number;
  currency?: string;
  trim?: number;
  samples?: number;
  defects?: number;
  testingUnits?: number;
  costBasisRevision: number;
}

export interface BatchCostResult {
  totalCost: number;
  costPerBar: number;
  costPerUnit: number; // per gram
  ingredientCostTotal: number;
  fragranceCost: number;
  otherCosts: number;
  marginPercent: number;
  markupPercent: number;
  grossMarginPercent: number;
  saleableYield: number;
  costPerSaleableUnit: number;
  suggestedPrice: number | null;
  currency: string;
  netRevenuePerUnit: number;
  contributionPerUnit: number;
  costBasisRevision: number;
  missingCostBasis: Array<{
    ingredientId: string;
    reason: string;
  }>;
  warnings: Array<{
    type: "warning" | "blocking";
    message: string;
  }>;
}

// ── Unit normalization ──────────────────────

const UNIT_TO_GRAMS: Record<string, number> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
};

export function normalizeToGrams(
  quantity: number,
  unit: string
): number {
  const gramsPerUnit = UNIT_TO_GRAMS[unit];
  if (!gramsPerUnit) {
    throw new Error(`Unknown unit: ${unit}. Supported: g, kg, oz, lb`);
  }
  return quantity * gramsPerUnit;
}

function normalizeCostPerGram(costPerUnit: number, unit: string): number {
  const gramsPerUnit = UNIT_TO_GRAMS[unit];
  if (!gramsPerUnit) {
    throw new Error(`Unknown unit: ${unit}. Supported: g, kg, oz, lb`);
  }
  return costPerUnit / gramsPerUnit;
}

// ── Calculate batch cost ────────────────────

export function calculateBatchCost(input: BatchCostInput): BatchCostResult {
  const warnings: Array<{ type: "warning" | "blocking"; message: string }> = [];
  const missingCostBasis: Array<{ ingredientId: string; reason: string }> = [];

  // 1. Calculate ingredient cost total
  let ingredientCostTotal = 0;
  const costRows = Array.from(
    new Map(input.ingredientCosts.map((cost) => [cost.ingredientId, cost])).values()
  );

  for (const cost of costRows) {
    // Missing cost basis — remains visible, not hidden
    if (cost.costPerUnit <= 0) {
      missingCostBasis.push({
        ingredientId: cost.ingredientId,
        reason: `Missing or zero cost basis for ${cost.ingredientId}`,
      });
      continue; // Skip this ingredient, do NOT use zero-cost fallback
    }

    const quantityInGrams = normalizeToGrams(cost.quantity, cost.quantityUnit);
    const costForIngredient =
      normalizeCostPerGram(cost.costPerUnit, cost.unit) * quantityInGrams;
    ingredientCostTotal += costForIngredient;
  }

  // 2. Calculate total cost
  const totalCost = ingredientCostTotal + input.fragranceCost + input.otherCosts;

  // 3. Calculate cost per bar
  // Guard against zero/missing yield
  if (input.batchYieldBars <= 0) {
    warnings.push({
      type: "blocking",
      message: "Batch yield is zero or missing — cost per bar cannot be calculated",
    });
  }

  const saleableYield = Math.max(0, input.batchYieldBars - (input.trim ?? 0) - (input.samples ?? 0) - (input.defects ?? 0) - (input.testingUnits ?? 0));
  const costPerBar = input.batchYieldBars > 0 ? totalCost / input.batchYieldBars : 0;
  const costPerSaleableUnit = saleableYield > 0 ? totalCost / saleableYield : 0;

  // 4. Calculate cost per unit (per gram)
  const totalQuantityGrams = costRows.reduce((sum, cost) => {
    return sum + normalizeToGrams(cost.quantity, cost.quantityUnit);
  }, 0);

  const costPerUnit = totalQuantityGrams > 0 ? totalCost / totalQuantityGrams : 0;

  const targetPrice = input.targetPricePerBar ?? 0;
  const markupPercent = input.targetMarkupPercent !== undefined
    ? input.targetMarkupPercent
    : (targetPrice > 0 && costPerBar > 0 ? ((targetPrice - costPerBar) / costPerBar) * 100 : 0);
  const grossMarginPercent = input.targetGrossMargin !== undefined
    ? input.targetGrossMargin
    : (targetPrice > 0 ? ((targetPrice - costPerBar) / targetPrice) * 100 : 0);
  const targetGrossMargin = input.targetGrossMargin;
  const suggestedPrice = targetGrossMargin !== undefined && targetGrossMargin >= 0 && targetGrossMargin < 100 && costPerBar > 0
    ? costPerBar / (1 - targetGrossMargin / 100)
    : input.targetMarkupPercent !== undefined && input.targetMarkupPercent >= 0 && costPerBar > 0
    ? costPerBar * (1 + input.targetMarkupPercent / 100)
    : targetPrice > 0 ? targetPrice : null;
  const currency = input.currency ?? "USD";
  const netRevenuePerUnit = targetPrice;
  const contributionPerUnit = netRevenuePerUnit - costPerSaleableUnit;

  // 7. Additional warnings
  if (input.ingredientCosts.length === 0) {
    warnings.push({
      type: "warning",
      message: "No ingredient costs provided — batch cost will be zero",
    });
  }

  if (missingCostBasis.length > 0) {
    warnings.push({
      type: "warning",
      message: `${missingCostBasis.length} ingredient(s) have missing cost basis — excluded from total`,
    });
  }

  if (markupPercent < 0) {
    warnings.push({
      type: "warning",
      message: `Target price ${targetPrice.toFixed(2)} is below cost per bar ${costPerBar.toFixed(2)} — negative margin`,
    });
  }

  return {
    totalCost,
    costPerBar,
    costPerUnit,
    ingredientCostTotal,
    fragranceCost: input.fragranceCost,
    otherCosts: input.otherCosts,
    marginPercent: grossMarginPercent,
    markupPercent,
    grossMarginPercent,
    saleableYield,
    costPerSaleableUnit,
    suggestedPrice,
    currency,
    netRevenuePerUnit,
    contributionPerUnit,
    costBasisRevision: input.costBasisRevision,
    missingCostBasis,
    warnings,
  };
}
