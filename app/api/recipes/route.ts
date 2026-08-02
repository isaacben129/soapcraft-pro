import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/schema";
import { recipes, recipeVersions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allRecipes = await db.select().from(recipes).orderBy(recipes.createdAt);
    return NextResponse.json(allRecipes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, method, oilBlend, superfatPercent, lyeConcentrationPercent, waterToLyeRatio, fragranceLoad, propertyRanges } = body;

    if (!name || !oilBlend || oilBlend.length === 0) {
      return NextResponse.json(
        { error: "Name and oil blend are required" },
        { status: 400 }
      );
    }

    const calculated = calculateSAP(oilBlend, lyeConcentrationPercent, waterToLyeRatio);

    const [recipe] = await db.insert(recipes).values({
      id: crypto.randomUUID(),
      name,
      method,
      createdBy: "user",
      isCurated: 0,
    }).returning();

    await db.insert(recipeVersions).values({
      id: crypto.randomUUID(),
      recipeId: recipe.id,
      version: 1,
      name,
      method,
      oilBlend,
      superfatPercent,
      lyeConcentrationPercent,
      waterToLyeRatio,
      calculatedLyeNaOH: calculated.lyeNaOH,
      calculatedLyeKOH: calculated.lyeKOH,
      calculatedWater: calculated.water,
      calculatedFragranceLoad: calculated.fragranceLoad,
      propertyRanges,
      warnings: [],
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

function calculateSAP(
  oilBlend: Array<{ oilId: string; percent: number }>,
  lyeConcentrationPercent: number,
  waterToLyeRatio: number
) {
  const totalSapNaOH = oilBlend.reduce((sum, oil) => {
    const oilData = DEFAULT_OILS.find((o) => o.id === oil.oilId);
    return sum + (oilData?.sapValueNaOH ?? 0) * oil.percent;
  }, 0) / 100;

  const totalSapKOH = oilBlend.reduce((sum, oil) => {
    const oilData = DEFAULT_OILS.find((o) => o.id === oil.oilId);
    return sum + (oilData?.sapValueKOH ?? 0) * oil.percent;
  }, 0) / 100;

  const lyeNaOH = totalSapNaOH * (1 + superfatPercent / 100);
  const lyeKOH = totalSapKOH * (1 + superfatPercent / 100);
  const water = lyeNaOH * waterToLyeRatio;
  const fragranceLoad = oilBlend.reduce((sum, oil) => {
    const oilData = DEFAULT_OILS.find((o) => o.id === oil.oilId);
    return sum + (oilData?.maxFragranceLoad ?? 0) * oil.percent;
  }, 0) / 100;

  return { lyeNaOH, lyeKOH, water, fragranceLoad };
}