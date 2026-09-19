// ── Public Wholesale Pricing API ───────────
// No auth required. Accepts production cost and desired margin.
// Returns wholesale prices per bar/batch.

import { NextRequest, NextResponse } from "next/server";

interface WholesalePricingInput {
  productionCostPerBar: number;
  batchSize: number;
  desiredMargin: number; // percentage
  retailMultiplier?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productionCostPerBar,
      batchSize,
      desiredMargin,
      retailMultiplier = 2.0,
    } = body as WholesalePricingInput;

    if (!productionCostPerBar || productionCostPerBar <= 0) {
      return NextResponse.json(
        { error: "Production cost per bar must be a positive number" },
        { status: 400 }
      );
    }

    if (!batchSize || batchSize <= 0) {
      return NextResponse.json(
        { error: "Batch size must be a positive number" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(desiredMargin) || desiredMargin < 0 || desiredMargin >= 100) {
      return NextResponse.json(
        { error: "Target gross margin must be from 0% up to, but not including, 100%" },
        { status: 400 }
      );
    }

    // Gross margin is profit ÷ selling price. Keep full precision until display.
    const wholesalePricePerBar = Math.round(
      (productionCostPerBar / (1 - desiredMargin / 100)) * 100
    ) / 100;
    const wholesalePricePerBatch = Math.round(wholesalePricePerBar * batchSize * 100) / 100;
    const retailPricePerBar = Math.round(wholesalePricePerBar * retailMultiplier * 100) / 100;
    const retailPricePerBatch = Math.round(retailPricePerBar * batchSize * 100) / 100;
    const marginPerBar = Math.round((retailPricePerBar - productionCostPerBar) * 100) / 100;
    const marginPercent = Math.round(((retailPricePerBar - productionCostPerBar) / retailPricePerBar) * 100 * 10) / 10;
    const totalProductionCost = Math.round(productionCostPerBar * batchSize * 100) / 100;
    const totalWholesaleRevenue = Math.round(wholesalePricePerBatch * 100) / 100;
    const totalRetailRevenue = Math.round(retailPricePerBatch * 100) / 100;
    const wholesaleProfit = Math.round((totalWholesaleRevenue - totalProductionCost) * 100) / 100;
    const retailProfit = Math.round((totalRetailRevenue - totalProductionCost) * 100) / 100;

    return NextResponse.json({
      productionCostPerBar,
      batchSize,
      desiredMargin,
      wholesalePricePerBar,
      wholesalePricePerBatch,
      retailPricePerBar,
      retailPricePerBatch,
      marginPerBar,
      marginPercent,
      totalProductionCost,
      totalWholesaleRevenue,
      totalRetailRevenue,
      wholesaleProfit,
      retailProfit,
      formula: `Wholesale floor = Cost ÷ (1 − Target gross margin) = ${productionCostPerBar} ÷ (1 − ${desiredMargin}/100) = ${wholesalePricePerBar}`,
    });
  } catch (error) {
    console.error("Wholesale pricing calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate wholesale pricing" },
      { status: 500 }
    );
  }
}
