// ── Public Craft Fair Break-Even API ───────
// No auth required. Accepts booth cost, item costs, selling prices.
// Returns break-even quantities and profit analysis.

import { NextRequest, NextResponse } from "next/server";

interface BreakEvenInput {
  boothCost: number;
  itemCostPerUnit: number;
  sellingPricePerUnit: number;
  itemCount: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { boothCost, itemCostPerUnit, sellingPricePerUnit, itemCount } = body as BreakEvenInput;

    if (!boothCost || boothCost < 0) {
      return NextResponse.json(
        { error: "Booth cost must be a non-negative number" },
        { status: 400 }
      );
    }

    if (!itemCostPerUnit || itemCostPerUnit < 0) {
      return NextResponse.json(
        { error: "Item cost per unit must be a non-negative number" },
        { status: 400 }
      );
    }

    if (!sellingPricePerUnit || sellingPricePerUnit <= 0) {
      return NextResponse.json(
        { error: "Selling price per unit must be a positive number" },
        { status: 400 }
      );
    }

    if (!itemCount || itemCount <= 0) {
      return NextResponse.json(
        { error: "Item count must be a positive number" },
        { status: 400 }
      );
    }

    const profitPerUnit = sellingPricePerUnit - itemCostPerUnit;

    if (profitPerUnit <= 0) {
      return NextResponse.json(
        {
          error: "Selling price must exceed item cost to break even",
          profitPerUnit: 0,
        },
        { status: 400 }
      );
    }

    const breakEvenQuantity = Math.ceil(boothCost / profitPerUnit);
    const totalCost = boothCost + itemCostPerUnit * itemCount;
    const totalRevenue = sellingPricePerUnit * itemCount;
    const totalProfit = totalRevenue - totalCost;
    const profitAtBreakEven = breakEvenQuantity * profitPerUnit - boothCost;
    const profitAtItemCount = itemCount * profitPerUnit - boothCost;
    const percentageOfInventory = (breakEvenQuantity / itemCount) * 100;

    // Calculate profit at various quantities
    const profitAnalysis = [10, 25, 50, 75, 100]
      .filter((q) => q <= itemCount)
      .map((q) => ({
        quantity: q,
        revenue: q * sellingPricePerUnit,
        cost: boothCost + q * itemCostPerUnit,
        profit: q * profitPerUnit - boothCost,
      }));

    return NextResponse.json({
      boothCost,
      itemCostPerUnit,
      sellingPricePerUnit,
      profitPerUnit,
      breakEvenQuantity,
      totalCost,
      totalRevenue,
      totalProfit,
      profitAtBreakEven,
      profitAtItemCount,
      percentageOfInventory: Math.round(percentageOfInventory * 10) / 10,
      profitAnalysis,
    });
  } catch (error) {
    console.error("Craft fair break-even calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate break-even" },
      { status: 500 }
    );
  }
}
