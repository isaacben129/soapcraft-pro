import { calculateBatchCost, type BatchCostInput, type BatchCostResult } from "./batch-cost";
export type { BatchCostInput, BatchCostResult };
export interface PricingScenario { mode: "markup" | "gross_margin"; value: number; }
export function solvePrice(costPerUnit: number, scenario: PricingScenario): number { if (costPerUnit < 0 || scenario.value < 0) throw new Error("Cost and target must be non-negative"); if (scenario.mode === "markup") return costPerUnit * (1 + scenario.value / 100); if (scenario.value >= 100) throw new Error("Gross margin must be below 100%"); return costPerUnit / (1 - scenario.value / 100); }
export function netRevenue(price: number, units: number, percentageFee = 0, fixedFeePerTransaction = 0): number { if (price < 0 || units < 0 || percentageFee < 0 || percentageFee >= 100 || fixedFeePerTransaction < 0) throw new Error("Invalid revenue inputs"); return price * units * (1 - percentageFee / 100) - fixedFeePerTransaction; }
export function contributionPerUnit(price: number, costPerUnit: number, percentageFee = 0, fixedFeePerTransaction = 0, units = 1): number { return netRevenue(price, units, percentageFee, fixedFeePerTransaction) / Math.max(units, 1) - costPerUnit; }
export { calculateBatchCost };
