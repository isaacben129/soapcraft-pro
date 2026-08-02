import { describe, it, expect } from "vitest";
import { calculateFormulation, validateOilPercentages, checkIFRACompliance, DEFAULT_OILS } from "./sap";

describe("calculateFormulation", () => {
  it("calculates lye NaOH for a simple 100% olive oil recipe", () => {
    const result = calculateFormulation({
      oilBlend: [{ oilId: "olive-oil", percent: 100 }],
      superfatPercent: 5,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2.5,
      fragranceLoadPercent: 0,
    });

    // SAP NaOH for olive oil = 0.1340
    // 1000g * 100% * 0.1340 * (1 - 0.05) = 127.3g NaOH
    expect(result.lyeNaOH).toBeCloseTo(127.3, 1);
    expect(result.water).toBeCloseTo(127.3 * 2.5, 1);
  });

  it("calculates lye for a coconut-oil-heavy recipe", () => {
    const result = calculateFormulation({
      oilBlend: [
        { oilId: "coconut-oil", percent: 50 },
        { oilId: "olive-oil", percent: 50 },
      ],
      superfatPercent: 5,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2.5,
      fragranceLoadPercent: 0,
    });

    // Coconut: 500g * 0.1900 * 0.95 = 90.25g NaOH
    // Olive: 500g * 0.1340 * 0.95 = 63.65g NaOH
    // Total: 153.9g NaOH
    expect(result.lyeNaOH).toBeCloseTo(153.9, 1);
  });

  it("throws when oil percentages do not sum to 100", () => {
    expect(() => {
      calculateFormulation({
        oilBlend: [{ oilId: "olive-oil", percent: 80 }],
        superfatPercent: 5,
        lyeConcentrationPercent: 33,
        waterToLyeRatio: 2.5,
        fragranceLoadPercent: 0,
      });
    }).toThrow(/100%/);
  });

  it("generates a warning when a single oil exceeds 80%", () => {
    const result = calculateFormulation({
      oilBlend: [
        { oilId: "coconut-oil", percent: 85 },
        { oilId: "olive-oil", percent: 15 },
      ],
      superfatPercent: 5,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2.5,
      fragranceLoadPercent: 0,
    });

    expect(result.warnings.some((w) => w.type === "danger")).toBe(true);
  });

  it("generates a warning when superfat is below 5%", () => {
    const result = calculateFormulation({
      oilBlend: [{ oilId: "olive-oil", percent: 100 }],
      superfatPercent: 2,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2.5,
      fragranceLoadPercent: 0,
    });

    expect(result.warnings.some((w) => w.type === "warning")).toBe(true);
  });

  it("calculates property ranges for a balanced recipe", () => {
    const result = calculateFormulation({
      oilBlend: [
        { oilId: "olive-oil", percent: 50 },
        { oilId: "coconut-oil", percent: 30 },
        { oilId: "shea-butter", percent: 20 },
      ],
      superfatPercent: 8,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2.5,
      fragranceLoadPercent: 3,
    });

    expect(result.propertyRanges).toBeDefined();
    expect(result.propertyRanges.hardness.min).toBeLessThan(result.propertyRanges.hardness.max);
    expect(result.propertyRanges.moisturizing.min).toBeLessThan(result.propertyRanges.moisturizing.max);
  });

  it("calculates fragrance load correctly", () => {
    const result = calculateFormulation({
      oilBlend: [{ oilId: "olive-oil", percent: 100 }],
      superfatPercent: 5,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2.5,
      fragranceLoadPercent: 3,
    });

    // Fragrance load = 3% of 1000g = 30g
    expect(result.fragranceLoad).toBeCloseTo(30, 0);
  });

  it("matches SoapCalc for a known recipe (olive 100%, 5% superfat, 33% lye, 2.5:1 water)", () => {
    const result = calculateFormulation({
      oilBlend: [{ oilId: "olive-oil", percent: 100 }],
      superfatPercent: 5,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2.5,
      fragranceLoadPercent: 0,
    });

    // SoapCalc reference for 100% olive oil, 5% superfat, 33% lye, 2.5:1 water ratio:
    // NaOH: ~127.3g per 1000g oils
    // Water: 318.25g
    expect(result.lyeNaOH).toBeCloseTo(127.3, 1);
    expect(result.water).toBeCloseTo(318.25, 2);
  });

  it("returns zero warnings for a well-balanced recipe", () => {
    const result = calculateFormulation({
      oilBlend: [
        { oilId: "olive-oil", percent: 40 },
        { oilId: "coconut-oil", percent: 30 },
        { oilId: "shea-butter", percent: 15 },
        { oilId: "castor-oil", percent: 15 },
      ],
      superfatPercent: 8,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2,
      fragranceLoadPercent: 3,
    });

    // No single oil > 80%, superfat in range, lye concentration in range, water ratio in range
    expect(result.warnings).toHaveLength(0);
  });
});

describe("validateOilPercentages", () => {
  it("returns null for valid percentages", () => {
    const result = validateOilPercentages([
      { oilId: "olive-oil", percent: 60 },
      { oilId: "coconut-oil", percent: 40 },
    ]);
    expect(result).toBeNull();
  });

  it("returns an error when percentages do not sum to 100", () => {
    const result = validateOilPercentages([
      { oilId: "olive-oil", percent: 70 },
      { oilId: "coconut-oil", percent: 20 },
    ]);
    expect(result).toMatch(/100%/);
  });

  it("returns an error for zero percentage", () => {
    const result = validateOilPercentages([
      { oilId: "olive-oil", percent: 0 },
      { oilId: "coconut-oil", percent: 100 },
    ]);
    expect(result).toMatch(/must be > 0/);
  });
});

describe("checkIFRACompliance", () => {
  it("returns no violations for oils without IFRA limits", () => {
    const ingredients = new Map([
      ["olive-oil", { ifraCategory: null, maxUsagePercent: null }],
      ["coconut-oil", { ifraCategory: null, maxUsagePercent: null }],
    ]);

    const result = checkIFRACompliance(
      [{ oilId: "olive-oil", percent: 100 }],
      ingredients
    );
    expect(result).toHaveLength(0);
  });

  it("returns a danger violation when IFRA max is exceeded", () => {
    const ingredients = new Map([
      ["castor-oil", { ifraCategory: "Category 1", maxUsagePercent: 100 }],
    ]);

    const result = checkIFRACompliance(
      [{ oilId: "castor-oil", percent: 101 }],
      ingredients
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].type).toBe("danger");
  });
});
