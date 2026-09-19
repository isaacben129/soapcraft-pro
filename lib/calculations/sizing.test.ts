import { describe, expect, it } from "vitest";
import { calibratedDensity, estimateMoldCapacity, fitRecipeToMold, rectangularVolume, scaleRecipe } from "./sizing";

describe("sizing", () => { it("normalizes rectangular volume", () => expect(rectangularVolume(10, 10, 10)).toBe(1000)); it("calibrates and scales", () => { const density = calibratedDensity(900, 1000); expect(density).toBeCloseTo(.9); expect(fitRecipeToMold(1000, 1800).scaleFactor).toBeCloseTo(1.8); }); it("scales every component", () => expect(scaleRecipe({ oil: 100, water: 50 }, 2)).toEqual({ oil: 200, water: 100 })); });

describe("estimateMoldCapacity", () => {
  it("converts a 12 × 3 × 3 inch mold before estimating fresh-batter mass", () => {
    const result = estimateMoldCapacity({ shape: "rectangle", length: 12, width: 3, height: 3, unit: "in", density: 0.9, fillPercent: 100 });
    expect(result.volumeCm3).toBeCloseTo(1769.803, 2);
    expect(result.freshBatterMassG).toBeCloseTo(1592.823, 2);
  });
});
