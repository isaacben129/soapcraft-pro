import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/schema";
import { batchCosts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await db
      .select()
      .from(batchCosts)
      .where(eq(batchCosts.batchId, params.id))
      .limit(1);

    if (!result[0]) {
      return NextResponse.json({ error: "Cost data not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cost data" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { ingredientCosts, fragranceCost, otherCosts, batchYieldBars, targetPricePerBar } = body;

    const totalCost =
      ingredientCosts.reduce((sum: number, ic: any) => sum + ic.totalCost, 0) +
      (fragranceCost ?? 0) +
      (otherCosts ?? 0);

    const costPerBar = batchYieldBars > 0 ? totalCost / batchYieldBars : 0;
    const marginPercent =
      targetPricePerBar > 0 ? ((targetPricePerBar - costPerBar) / targetPricePerBar) * 100 : 0;

    const [result] = await db
      .update(batchCosts)
      .set({
        ingredientCosts,
        fragranceCost: fragranceCost ?? 0,
        otherCosts: otherCosts ?? 0,
        totalCost,
        batchYieldBars: batchYieldBars ?? 0,
        costPerBar,
        targetPricePerBar: targetPricePerBar ?? 0,
        marginPercent,
      })
      .where(eq(batchCosts.batchId, params.id))
      .returning();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update cost data" },
      { status: 500 }
    );
  }
}