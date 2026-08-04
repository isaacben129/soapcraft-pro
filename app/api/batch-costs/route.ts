// ── Batch Cost Save API ──────────────────
// R6.3: Persist batch cost results with inherited line items,
// cost-basis selectors, yield, target margin.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/schema";
import { batchCosts, ingredientCostRecords } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      recipeId,
      versionId,
      batchYieldBars,
      targetPricePerBar,
      fragranceCost,
      otherCosts,
      ingredientCosts,
    } = body as {
      recipeId: string;
      versionId: string;
      batchYieldBars: number;
      targetPricePerBar: number;
      fragranceCost: number;
      otherCosts: number;
      ingredientCosts: Array<{
        ingredientId: string;
        costRecordId: string;
        costPerGram: number;
        weightG: number;
        totalCost: number;
      }>;
    };

    // Validate required fields
    if (!recipeId || !versionId || batchYieldBars <= 0) {
      return NextResponse.json(
        { error: "recipeId, versionId, and positive batchYieldBars are required" },
        { status: 400 }
      );
    }

    // Calculate totals
    const ingredientCostTotal = ingredientCosts.reduce(
      (sum, ic) => sum + ic.totalCost,
      0
    );
    const totalCost = ingredientCostTotal + fragranceCost + otherCosts;
    const costPerBar = batchYieldBars > 0 ? totalCost / batchYieldBars : 0;
    const marginPercent =
      targetPricePerBar > 0
        ? ((targetPricePerBar - costPerBar) / targetPricePerBar) * 100
        : 0;

    // Persist batch cost record
    const newBatchCost = {
      id: crypto.randomUUID(),
      batchId: crypto.randomUUID(),
      userId: session.user.id,
      ingredientCosts: ingredientCosts.map((ic) => ({
        ingredientId: ic.ingredientId,
        costRecordId: ic.costRecordId,
        costPerUnit: ic.costPerGram,
        unit: "g",
        quantity: ic.weightG,
        total: ic.totalCost,
      })),
      fragranceCost,
      otherCosts,
      totalCost,
      batchYieldBars,
      costPerBar,
      targetPricePerBar,
      marginPercent,
      costBasisRevision: 1,
      archivedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(batchCosts).values(newBatchCost);

    return NextResponse.json({
      id: newBatchCost.id,
      totalCost,
      costPerBar,
      marginPercent,
      datasetRevision: "1.0.0",
    });
  } catch (error) {
    console.error("Batch cost save error:", error);
    return NextResponse.json(
      { error: "Failed to save batch cost" },
      { status: 500 }
    );
  }
}
