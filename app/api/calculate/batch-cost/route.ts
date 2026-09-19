// ── Public Batch Cost Calculation API ──────────
// No auth required. Accepts ingredient costs, batch yield, target margin.
// Returns calculated cost-per-bar and suggested selling price.

import { NextRequest, NextResponse } from "next/server";
import { calculateBatchCost, type BatchCostInput } from "@/lib/calculations/batch-cost";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ingredientCosts,
      fragranceCost = 0,
      otherCosts = 0,
      batchYieldBars,
      targetGrossMargin,
      targetMarkupPercent,
    } = body as {
      ingredientCosts: Array<{
        name: string;
        costPerUnit: number;
        unit: string;
        quantity: number;
      }>;
      fragranceCost?: number;
      otherCosts?: number;
      batchYieldBars: number;
      targetGrossMargin?: number;
      targetMarkupPercent?: number;
    };

    // Validate required fields
    if (!batchYieldBars || batchYieldBars <= 0) {
      return NextResponse.json(
        { error: "batchYieldBars must be a positive number" },
        { status: 400 }
      );
    }

    if (!ingredientCosts || ingredientCosts.length === 0) {
      return NextResponse.json(
        { error: "At least one ingredient cost is required" },
        { status: 400 }
      );
    }

    // Validate target gross margin or markup percent
    if (targetGrossMargin !== undefined && (typeof targetGrossMargin !== "number" || targetGrossMargin < 0 || targetGrossMargin >= 100)) {
      return NextResponse.json(
        { error: "targetGrossMargin must be a number from 0 up to, but not including, 100" },
        { status: 400 }
      );
    }

    if (targetMarkupPercent !== undefined && (typeof targetMarkupPercent !== "number" || targetMarkupPercent < 0)) {
      return NextResponse.json(
        { error: "targetMarkupPercent must be a non-negative number" },
        { status: 400 }
      );
    }

    if (targetGrossMargin === undefined && targetMarkupPercent === undefined) {
      return NextResponse.json(
        { error: "Either targetGrossMargin or targetMarkupPercent is required" },
        { status: 400 }
      );
    }

    // Normalize ingredient costs to BatchCostInput format
    const normalizedCosts = ingredientCosts.map((ic, index) => ({
      ingredientId: `ingredient-${index}`,
      costPerUnit: ic.costPerUnit,
      unit: ic.unit || "g",
      quantity: ic.quantity,
      quantityUnit: ic.unit || "g",
    }));

    const input: BatchCostInput = {
      ingredientCosts: normalizedCosts,
      fragranceCost,
      otherCosts,
      batchYieldBars,
      targetGrossMargin,
      targetMarkupPercent,
      costBasisRevision: 0,
    };

    const result = calculateBatchCost(input);

    const pricingMethod = targetGrossMargin !== undefined ? "target gross margin" : "target markup";

    return NextResponse.json({
      ...result,
      suggestedPrice: result.suggestedPrice,
      pricingMethod,
    });
  } catch (error) {
    console.error("Batch cost calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate batch cost" },
      { status: 500 }
    );
  }
}
