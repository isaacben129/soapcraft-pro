/** Deterministic sizing, conversion, mold calibration, and bar planning. */
export const UNIT_TO_GRAMS = Object.freeze({ g: 1, kg: 1000, oz: 28.3495, lb: 453.592 } as const);
export type MassUnit = keyof typeof UNIT_TO_GRAMS;
export function toGrams(value: number, unit: MassUnit): number { if (!Number.isFinite(value) || value < 0) throw new Error("Mass must be finite and non-negative"); return value * UNIT_TO_GRAMS[unit]; }
export function convertMass(value: number, from: MassUnit, to: MassUnit): number { return toGrams(value, from) / UNIT_TO_GRAMS[to]; }
export function scaleRecipe<T extends Record<string, number>>(recipe: T, scaleFactor: number): T { if (!Number.isFinite(scaleFactor) || scaleFactor <= 0) throw new Error("Scale factor must be positive"); return Object.fromEntries(Object.entries(recipe).map(([k,v]) => [k, v * scaleFactor])) as T; }
export function rectangularVolume(length: number, width: number, height: number, unit: "cm" | "in" = "cm"): number { const v = length * width * height; return unit === "in" ? v * 16.387064 : v; }
export function cylindricalVolume(radius: number, height: number, unit: "cm" | "in" = "cm"): number { const v = Math.PI * radius * radius * height; return unit === "in" ? v * 16.387064 : v; }
export function calibratedDensity(priorBatterMass: number, priorOccupiedVolumeMl: number): number { if (priorBatterMass <= 0 || priorOccupiedVolumeMl <= 0) throw new Error("Calibration values must be positive"); return priorBatterMass / priorOccupiedVolumeMl; }
export function targetBatterMass(targetVolumeMl: number, density: number): number { if (targetVolumeMl <= 0 || density <= 0) throw new Error("Volume and density must be positive"); return targetVolumeMl * density; }
export function fitRecipeToMold(currentRecipeMass: number, targetMass: number): { scaleFactor: number } { if (currentRecipeMass <= 0 || targetMass <= 0) throw new Error("Recipe and target mass must be positive"); return { scaleFactor: targetMass / currentRecipeMass }; }
export function barsFromMass(totalMass: number, barWeight: number, wastePercent = 0): number { if (totalMass < 0 || barWeight <= 0 || wastePercent < 0 || wastePercent >= 100) throw new Error("Invalid bar planning inputs"); return Math.floor((totalMass * (1 - wastePercent / 100)) / barWeight); }
