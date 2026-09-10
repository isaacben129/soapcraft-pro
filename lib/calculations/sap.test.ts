import { describe, expect, it } from "vitest";
import { calculateFormulation } from "./chemistry";

describe("legacy SAP entry point", () => {
  it("is superseded by the v2 chemistry engine", () => {
    const result = calculateFormulation({
      oilBlend: [{ oilId: "test-oil-a", percent: 100 }],
      targetOilMass: 1000,
      superfatPercent: 5,
      kohPercentOfAlkaliEquivalents: 0,
      naOHPurityPercent: 100,
      kohPurityPercent: 90,
      waterMode: "water_to_lye_ratio",
      waterToLyeRatio: 2.5,
      lyeConcentrationPercent: 33,
      waterAsPercentOfOils: 30,
      fragranceLoadPercent: 0,
      additivesWeight: 0,
    });
    expect(result.calculatorVersion).toBe("2.0.0");
    expect(result).not.toHaveProperty("propertyRanges");
    expect(result.totalAlkaliMass).toBe(result.naohMass + result.kohMass);
  });
});
