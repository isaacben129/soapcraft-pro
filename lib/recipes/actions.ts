// ── Recipe Save Server Action ──────────────
// R3.3: Persist recipe + Version 1 atomically, append activity event.
// Client totals are ignored — server recomputes from oil blend.

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/schema";
import { recipes, recipeVersions, activityEvents } from "@/db/schema";
import { calculateFormulation, type FormulationInput } from "@/lib/calculations/sap";

interface SaveRecipeInput {
  name: string;
  method: "CP" | "HP" | "MP";
  oilBlend: Array<{ oilId: string; percent: number }>;
  superfatPercent: number;
  lyeConcentrationPercent: number;
  waterToLyeRatio: number;
  waterMode: "water-to-lye" | "water-to-oil" | "fixed-water";
  fixedWaterAmount?: number;
  fragranceLoadPercent: number;
  targetWeight: number;
  targetUnit: "g" | "oz" | "lb";
  calculatedResult: {
    lyeNaOH: number;
    lyeKOH: number;
    water: number;
    fragranceLoad: number;
    oilWeightTotal: number;
    lyeWeightTotal: number;
    totalWeight: number;
    propertyRanges: Record<string, { min: number; max: number }>;
    warnings: Array<{ type: string; message: string }>;
  };
}

export async function saveRecipe(input: SaveRecipeInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Validate required fields
  if (!input.name?.trim()) {
    throw new Error("Recipe name is required");
  }

  if (!input.oilBlend || input.oilBlend.length === 0) {
    throw new Error("At least one oil is required");
  }

  // Recompute on the server — client totals are ignored
  const formulationInput: FormulationInput = {
    oilBlend: input.oilBlend,
    superfatPercent: input.superfatPercent,
    lyeConcentrationPercent: input.lyeConcentrationPercent,
    waterToLyeRatio: input.waterToLyeRatio,
    fragranceLoadPercent: input.fragranceLoadPercent,
  };

  const serverResult = calculateFormulation(formulationInput);

  // Check for blocking warnings — invalid/blocking recipe not saved
  const blockingWarnings = serverResult.warnings.filter(
    (w) => w.type === "danger"
  );

  if (blockingWarnings.length > 0) {
    throw new Error(
      `Cannot save recipe with blocking warnings: ${blockingWarnings.map((w) => w.message).join("; ")}`
    );
  }

  // Create Recipe + Version 1 atomically
  const recipeId = crypto.randomUUID();
  const versionId = crypto.randomUUID();

  await db.insert(recipes).values({
    id: recipeId,
    name: input.name.trim(),
    method: input.method,
    createdBy: session.user.id,
    isCurated: 0,
    currentVersionId: versionId,
  });

  await db.insert(recipeVersions).values({
    id: versionId,
    recipeId,
    version: 1,
    name: input.name.trim(),
    method: input.method,
    oilBlend: input.oilBlend,
    superfatPercent: input.superfatPercent,
    lyeConcentrationPercent: input.lyeConcentrationPercent,
    waterToLyeRatio: input.waterToLyeRatio,
    calculatedLyeNaOH: serverResult.lyeNaOH,
    calculatedLyeKOH: serverResult.lyeKOH,
    calculatedWater: serverResult.water,
    calculatedFragranceLoad: serverResult.fragranceLoad,
    propertyRanges: input.calculatedResult.propertyRanges,
    warnings: serverResult.warnings,
    datasetRevision: "1.0.0",
  });

  // Append activity event
  await db.insert(activityEvents).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    action: "created",
    entityType: "recipe",
    entityId: recipeId,
    entityName: input.name.trim(),
    details: { version: 1, warnings: serverResult.warnings.length },
  });

  return {
    id: recipeId,
    name: input.name.trim(),
    version: 1,
    warnings: serverResult.warnings,
    datasetRevision: "1.0.0",
  };
}
