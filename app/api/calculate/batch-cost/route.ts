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
      targetMargin = 0,
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
      targetMargin?: number;
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
      targetPricePerBar: 0,
      costBasisRevision: 0,
    };

    const result = calculateBatchCost(input);

    // Calculate suggested price based on target margin
    const suggestedPrice = result.costPerBar * (1 + (targetMargin / 100));

    return NextResponse.json({
      ...result,
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      targetMargin,
    });
  } catch (error) {
    console.error("Batch cost calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate batch cost" },
      { status: 500 }
    );
  }
}
