import { NextRequest, NextResponse } from "next/server";
interface MoldDimensions { length: number; width: number; height: number; unit: "cm" | "in"; }
interface MoldVolumeInput { dimensions: MoldDimensions; density?: number; priorBatterMass?: number; priorOccupiedVolumeMl?: number; fragrancePercent?: number; }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as MoldVolumeInput;
    const { dimensions, fragrancePercent = 0 } = body;
    if (!dimensions || ![dimensions.length, dimensions.width, dimensions.height].every(v => Number.isFinite(v) && v > 0)) return NextResponse.json({ error: "Positive length, width, and height are required" }, { status: 400 });
    const rawVolume = dimensions.length * dimensions.width * dimensions.height;
    const volumeMl = dimensions.unit === "in" ? rawVolume * 16.387064 : rawVolume;
    const density = body.priorBatterMass && body.priorOccupiedVolumeMl ? body.priorBatterMass / body.priorOccupiedVolumeMl : body.density;
    if (!density || density <= 0) return NextResponse.json({ volumeMl, unit: "ml", mode: "calibration_required", estimate: true, message: "No universal batter density is assumed. Provide prior batter mass and occupied volume to calibrate." });
    const totalWeight = volumeMl * density;
    const fragranceWeight = totalWeight * (fragrancePercent / 100);
    return NextResponse.json({ volumeMl, density, totalWeight, fragrancePercent, fragranceWeight, baseSoapWeight: totalWeight - fragranceWeight, mode: body.priorBatterMass ? "calibrated" : "user_density", estimate: !body.priorBatterMass });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to calculate mold volume" }, { status: 400 }); }
}
