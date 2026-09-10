// ── Public Mold Volume API ─────────────────
// No auth required. Accepts mold dimensions and calculates soap volume in grams.

import { NextRequest, NextResponse } from "next/server";

interface MoldDimensions {
  length: number;
  width: number;
  height: number;
  unit: string; // "cm" or "in"
}

interface MoldVolumeInput {
  dimensions: MoldDimensions;
  density?: number; // soap density in g/cm³ or g/in³
  fragrancePercent?: number; // optional fragrance load percentage
}

// Default soap density: ~0.9 g/cm³, ~0.0523 g/in³
const DEFAULT_DENSITY_CM = 0.9;
const DEFAULT_DENSITY_IN = 0.0523;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dimensions, density, fragrancePercent = 0 } = body as MoldVolumeInput;

    if (!dimensions || !dimensions.length || !dimensions.width || !dimensions.height) {
      return NextResponse.json(
        { error: "Length, width, and height are required" },
        { status: 400 }
      );
    }

    const { length, width, height, unit } = dimensions;

    if (length <= 0 || width <= 0 || height <= 0) {
      return NextResponse.json(
        { error: "All dimensions must be positive numbers" },
        { status: 400 }
      );
    }

    // Calculate volume
    let volume: number;
    let densityValue: number;

    if (unit === "in") {
      volume = length * width * height; // cubic inches
      densityValue = density || DEFAULT_DENSITY_IN;
    } else {
      // Default to cm
      volume = length * width * height; // cubic centimeters
      densityValue = density || DEFAULT_DENSITY_CM;
    }

    const totalWeight = Math.round(volume * densityValue * 100) / 100;
    const fragranceWeight = Math.round(totalWeight * (fragrancePercent / 100) * 100) / 100;
    const baseSoapWeight = Math.round((totalWeight - fragranceWeight) * 100) / 100;

    return NextResponse.json({
      length,
      width,
      height,
      unit,
      volume,
      density: densityValue,
      totalWeight,
      fragrancePercent,
      fragranceWeight,
      baseSoapWeight,
      formula: `Volume (${unit}³) × Density = ${volume} × ${densityValue} = ${totalWeight}g`,
    });
  } catch (error) {
    console.error("Mold volume calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate mold volume" },
      { status: 500 }
    );
  }
}
