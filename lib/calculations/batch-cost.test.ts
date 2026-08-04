// ── Batch Cost Calculation RED Tests ──────────
// R6.2: RED fixtures for batch cost calculation contract.

import { describe, it, expect } from "vitest";
import { calculateBatchCost } from "./batch-cost";

// ── RED Fixtures ──────────────────────────
// RED = Real, Exhaustive, Deterministic

const BASE_INGREDIENT_COSTS = [
  {
    ingredientId: "olive-oil",
    costPerUnit: 0.05, // $0.05 per gram
    unit: "g",
    quantity: 500,
    quantityUnit: "g",
  },
  {
    ingredientId: "coconut-oil",
    costPerUnit: 0.08, // $0.08 per gram
    unit: "g",
    quantity: 300,
    quantityUnit: "g",
  },
  {
    ingredientId: "shea-butter",
    costPerUnit: 0.12, // $0.12 per gram
    unit: "g",
    quantity: 100,
    quantityUnit: "g",
  },
];

const FRAGRANCE_COST = 5.0;
const OTHER_COSTS = 2.0;
const BATCH_YIELD_BARS = 10;
const TARGET_PRICE_PER_BAR = 15.0;
const COST_BASIS_REVISION = 1;

// ── Test 1: Basic cost calculation ──────

describe("calculateBatchCost", () => {
  it("calculates total cost from ingredient costs + fragrance + other", () => {
    const result = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    // Olive: 500g * $0.05 = $25.00
    // Coconut: 300g * $0.08 = $24.00
    // Shea: 100g * $0.12 = $12.00
    // Subtotal: $61.00
    // + Fragrance: $5.00
    // + Other: $2.00
    // Total: $68.00
    expect(result.ingredientCostTotal).toBeCloseTo(61.0, 2);
    expect(result.totalCost).toBeCloseTo(68.0, 2);
  });

  it("calculates cost per bar correctly", () => {
    const result = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    // $68.00 / 10 bars = $6.80 per bar
    expect(result.costPerBar).toBeCloseTo(6.8, 2);
  });

  it("calculates cost per unit (per gram) correctly", () => {
    const result = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    // Total grams: 500 + 300 + 100 = 900g
    // $68.00 / 900g = $0.0755... per gram
    expect(result.costPerUnit).toBeCloseTo(0.0756, 4);
  });

  it("calculates margin percent from target price", () => {
    const result = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    // ($15.00 - $6.80) / $15.00 = 54.67%
    expect(result.marginPercent).toBeCloseTo(54.67, 2);
  });

  it("returns suggested price equal to target price when set", () => {
    const result = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    expect(result.suggestedPrice).toBeCloseTo(15.0, 2);
  });

  // ── Test 2: Missing cost basis ──────────

  it("flags missing cost basis and excludes from total", () => {
    const costsWithMissing = [
      ...BASE_INGREDIENT_COSTS,
      {
        ingredientId: "castor-oil",
        costPerUnit: 0, // Missing cost basis
        unit: "g",
        quantity: 50,
        quantityUnit: "g",
      },
    ];

    const result = calculateBatchCost({
      ingredientCosts: costsWithMissing,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    // Castor oil with $0 cost should be excluded, not zeroed out
    expect(result.missingCostBasis).toHaveLength(1);
    expect(result.missingCostBasis[0].ingredientId).toBe("castor-oil");
    expect(result.missingCostBasis[0].reason).toContain("castor-oil");

    // Ingredient cost total should NOT include castor oil
    // Olive: $25 + Coconut: $24 + Shea: $12 = $61 (same as before)
    expect(result.ingredientCostTotal).toBeCloseTo(61.0, 2);
  });

  it("does NOT use zero-cost fallback for missing ingredients", () => {
    const costsWithZero = [
      ...BASE_INGREDIENT_COSTS,
      {
        ingredientId: "coconut-oil",
        costPerUnit: 0, // Zero cost — should be treated as missing
        unit: "g",
        quantity: 300,
        quantityUnit: "g",
      },
    ];

    const result = calculateBatchCost({
      ingredientCosts: costsWithZero,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    // Coconut oil excluded, only Olive + Shea
    // Olive: $25 + Shea: $12 = $37
    expect(result.ingredientCostTotal).toBeCloseTo(37.0, 2);
    expect(result.missingCostBasis).toHaveLength(1);
    expect(result.missingCostBasis[0].ingredientId).toBe("coconut-oil");
  });

  it("missing cost basis remains visible in warnings", () => {
    const result = calculateBatchCost({
      ingredientCosts: [
        {
          ingredientId: "missing-oil",
          costPerUnit: 0,
          unit: "g",
          quantity: 100,
          quantityUnit: "g",
        },
      ],
      fragranceCost: 0,
      otherCosts: 0,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    expect(result.missingCostBasis).toHaveLength(1);
    expect(result.warnings.some((w) => w.type === "warning")).toBe(true);
  });

  // ── Test 3: Zero/missing yield ──────────

  it("blocks calculation when batch yield is zero", () => {
    const result = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: 0,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    expect(result.costPerBar).toBe(0);
    expect(result.warnings.some((w) => w.type === "blocking")).toBe(true);
  });

  it("blocks calculation when batch yield is missing (undefined treated as zero)", () => {
    const result = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: -1,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    expect(result.costPerBar).toBe(0);
    expect(result.warnings.some((w) => w.type === "blocking")).toBe(true);
  });

  // ── Test 4: Unit normalization ──────────

  it("normalizes kg to grams correctly", () => {
    const result = calculateBatchCost({
      ingredientCosts: [
        {
          ingredientId: "olive-oil",
          costPerUnit: 50, // $50 per kg
          unit: "kg",
          quantity: 0.5, // 0.5 kg
          quantityUnit: "kg",
        },
      ],
      fragranceCost: 0,
      otherCosts: 0,
      batchYieldBars: 1,
      targetPricePerBar: 100,
      costBasisRevision: COST_BASIS_REVISION,
    });

    // 0.5 kg = 500g, $50/kg = $0.05/g
    // 500g * $0.05 = $25.00
    expect(result.totalCost).toBeCloseTo(25.0, 2);
  });

  it("normalizes oz to grams correctly", () => {
    const result = calculateBatchCost({
      ingredientCosts: [
        {
          ingredientId: "olive-oil",
          costPerUnit: 1.42, // $1.42 per oz
          unit: "oz",
          quantity: 17.64, // ~500g
          quantityUnit: "oz",
        },
      ],
      fragranceCost: 0,
      otherCosts: 0,
      batchYieldBars: 1,
      targetPricePerBar: 100,
      costBasisRevision: COST_BASIS_REVISION,
    });

    // 17.64 oz * 28.3495 g/oz = ~500g
    // $1.42/oz / 28.3495 g/oz = $0.05/g
    // 500g * $0.05 = $25.00
    expect(result.totalCost).toBeCloseTo(25.0, 2);
  });

  it("normalizes lb to grams correctly", () => {
    const result = calculateBatchCost({
      ingredientCosts: [
        {
          ingredientId: "olive-oil",
          costPerUnit: 2.27, // $2.27 per lb
          unit: "lb",
          quantity: 1.102, // ~500g
          quantityUnit: "lb",
        },
      ],
      fragranceCost: 0,
      otherCosts: 0,
      batchYieldBars: 1,
      targetPricePerBar: 100,
      costBasisRevision: COST_BASIS_REVISION,
    });

    // 1.102 lb * 453.592 g/lb = ~500g
    // $2.27/lb / 453.592 g/lb = $0.005/g
    // 500g * $0.005 = $2.50
    expect(result.totalCost).toBeCloseTo(2.5, 2);
  });

  // ── Test 5: Historical cost basis / recalculation ──

  it("produces different results for different cost basis revisions", () => {
    const revision1 = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: 1,
    });

    const revision2 = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS.map((c) => ({
        ...c,
        costPerUnit: c.costPerUnit * 1.1, // 10% price increase
      })),
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: 2,
    });

    // Revision 2 should have higher costs
    expect(revision2.totalCost).toBeGreaterThan(revision1.totalCost);
  });

  it("preserves historical records by accepting cost basis revision as input", () => {
    const result = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: 1,
    });

    expect(result.costBasisRevision).toBe(1);
  });

  // ── Test 6: Edge cases ──────────────────

  it("handles empty ingredient costs array", () => {
    const result = calculateBatchCost({
      ingredientCosts: [],
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: TARGET_PRICE_PER_BAR,
      costBasisRevision: COST_BASIS_REVISION,
    });

    expect(result.ingredientCostTotal).toBe(0);
    expect(result.totalCost).toBeCloseTo(FRAGRANCE_COST + OTHER_COSTS, 2);
    expect(result.warnings.some((w) => w.type === "warning")).toBe(true);
  });

  it("handles negative margin when target price is below cost", () => {
    const result = calculateBatchCost({
      ingredientCosts: BASE_INGREDIENT_COSTS,
      fragranceCost: FRAGRANCE_COST,
      otherCosts: OTHER_COSTS,
      batchYieldBars: BATCH_YIELD_BARS,
      targetPricePerBar: 5.0, // Below cost per bar of $6.80
      costBasisRevision: COST_BASIS_REVISION,
    });

    expect(result.marginPercent).toBeLessThan(0);
    expect(result.warnings.some((w) => w.type === "warning")).toBe(true);
  });
});
