import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  assertPublicChemistryAccess,
  calculateFormulation,
  calculateFormulationInputSchema,
  PublicChemistryGateError,
} from "@/lib/calculations/chemistry";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = calculateFormulationInputSchema.parse(await request.json());
    assertPublicChemistryAccess(input);
    return NextResponse.json({ data: calculateFormulation(input) });
  } catch (error) {
    if (error instanceof PublicChemistryGateError) {
      const status = error.code === "PUBLIC_CHEMISTRY_DISABLED" ? 503 : 422;
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status, headers: { "cache-control": "no-store" } },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_FORMULATION_INPUT",
            message: "The formulation input is invalid.",
            fields: error.issues,
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: { code: "INVALID_JSON", message: "Request body must be valid JSON." } },
        { status: 400 },
      );
    }

    console.error("Formulation calculation failed", error);
    return NextResponse.json(
      { error: { code: "FORMULATION_CALCULATION_FAILED", message: "The formulation could not be calculated." } },
      { status: 500 },
    );
  }
}
