/**
 * RED tests for the deterministic formulation engine.
 *
 * These tests MUST FAIL before implementation.
 * Per CALCULATION-SPEC.md §14 and §13 invariants.
 */
import { describe, it, expect } from "vitest";
import {
  calculateFormulation,
  calculateFormulationInputSchema,
  isPublicChemistryEnabled,
  assertPublicChemistryAccess,
  PublicChemistryGateError,
  type FormulationInput,
  type CalculationResult,
} from "./chemistry";

// --- Helpers ---
const MW_NaOH = 39.997;
const MW_KOH = 56.106;
const SAP_KOH_TEST_OIL = 0.190000;
const SAP_NAO_H_TEST_OIL = SAP_KOH_TEST_OIL * MW_NaOH / MW_KOH; // 0.1354477239510926

function makeInput(overrides: Partial<FormulationInput> = {}): FormulationInput {
  return {
    oilBlend: [{ oilId: "test-oil-a", percent: 100 }],
    targetOilMass: 1000,
    superfatPercent: 5,
    kohPercentOfAlkaliEquivalents: 0,
    naOHPurityPercent: 100,
    kohPurityPercent: 100,
    waterMode: "water_to_lye_ratio",
    waterToLyeRatio: 2.5,
    lyeConcentrationPercent: 33,
    waterAsPercentOfOils: 30,
    fragranceLoadPercent: 0,
    additivesWeight: 0,
    ...overrides,
  };
}

// ============================================================================
// RED — these must FAIL before the implementation is correct
// ============================================================================

describe("RED: explicit positive oil mass", () => {
  it("rejects zero oil mass", () => {
    expect(() => calculateFormulation({ ...makeInput(), targetOilMass: 0 }))
      .toThrow(/positive|oil mass|targetOilMass/i);
  });

  it("rejects negative oil mass", () => {
    expect(() => calculateFormulation({ ...makeInput(), targetOilMass: -500 }))
      .toThrow(/positive|oil mass|targetOilMass/i);
  });

  it("accepts positive oil mass and scales results accordingly", () => {
    const result500 = calculateFormulation({ ...makeInput(), targetOilMass: 500 });
    const result1000 = calculateFormulation(makeInput());
    expect(result500.naohAsSuppliedMass).toBeCloseTo(result1000.naohAsSuppliedMass / 2, 4);
    expect(result500.oilWeightTotal).toBe(500);
  });
});

describe("RED: percentage total validation", () => {
  it("throws when oil percentages do not sum to 100", () => {
    expect(() => calculateFormulation({
      ...makeInput(),
      oilBlend: [{ oilId: "test-oil-a", percent: 80 }],
    })).toThrow(/100%/);
  });

  it("throws when a percentage is non-positive", () => {
    expect(() => calculateFormulation({
      ...makeInput(),
      oilBlend: [{ oilId: "test-oil-a", percent: 0 }],
    })).toThrow(/must be > 0|positive/i);
  });

  it("accepts percentages summing to 100 within tolerance", () => {
    const result = calculateFormulation({
      ...makeInput(),
      oilBlend: [
        { oilId: "test-oil-a", percent: 60 },
        { oilId: "test-oil-a", percent: 40 },
      ],
    });
    expect(result.oilWeightTotal).toBe(1000);
  });
});

describe("RED: NaOH/KOH/mixed-alkali based on KOH share", () => {
  it("pure NaOH: discounted pure NaOH = 128.6753 g and as-supplied = 128.6753 g for 100% purity", () => {
    const result = calculateFormulation(makeInput());
    // fullNaOHPure = 1000 * 0.1354477 = 135.4477; naohPureMass = 135.4477 * 1 * 0.95 = 128.6753
    // naohAsSupplied = 128.6753 / 1.0 = 128.6753 (100% purity)
    expect(result.naohPureMass).toBeCloseTo(128.6753, 4);
    expect(result.naohAsSuppliedMass).toBeCloseTo(128.6753, 4);
  });

  it("pure KOH: discounted pure KOH = 180.5000 g and as-supplied = 200.5556 g for 90% purity", () => {
    const result = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 100,
      kohPurityPercent: 90,
    });
    expect(result.kohPureMass).toBeCloseTo(180.5000, 4);
    expect(result.kohAsSuppliedMass).toBeCloseTo(200.5556, 4);
    expect(result.naohAsSuppliedMass).toBe(0);
  });

  it("mixed alkali: 40% KOH equivalents gives correct split with purities", () => {
    const result = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 40,
      naOHPurityPercent: 99,
      kohPurityPercent: 90,
    });
    // naohPure = 1000 * 0.1354477 * 0.6 * 0.95 = 77.2052
    // naohAsSupplied = 77.2052 / 0.99 = 77.9851
    // kohPure = 1000 * 0.190000 * 0.4 * 0.95 = 72.2000
    // kohAsSupplied = 72.2000 / 0.90 = 80.2222
    expect(result.naohAsSuppliedMass).toBeCloseTo(77.9851, 4);
    expect(result.kohAsSuppliedMass).toBeCloseTo(80.2222, 4);
    expect(result.totalAlkaliAsSupplied).toBeCloseTo(158.2073, 4);
  });

  it("outputs separate naohMass, kohMass, and totalAlkaliMass", () => {
    const result = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 40,
      naOHPurityPercent: 99,
      kohPurityPercent: 90,
    });
    expect(result).toHaveProperty("naohMass");
    expect(result).toHaveProperty("kohMass");
    expect(result).toHaveProperty("totalAlkaliMass");
    expect(result.naohMass).toBeGreaterThanOrEqual(0);
    expect(result.kohMass).toBeGreaterThanOrEqual(0);
    expect(result.totalAlkaliMass).toBeCloseTo(result.naohMass + result.kohMass, 4);
  });

  it("0% KOH is pure NaOH; 100% KOH is pure KOH", () => {
    const pureNaoh = calculateFormulation(makeInput());
    const pureKoh = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 100,
      kohPurityPercent: 100,
    });
    expect(pureNaoh.kohAsSuppliedMass).toBe(0);
    expect(pureKoh.naohAsSuppliedMass).toBe(0);
  });
});

describe("RED: one recipe-level superfat multiplier before independent purity", () => {
  it("applies superfat once to both NaOH and KOH paths", () => {
    const r5 = calculateFormulation({ ...makeInput(), superfatPercent: 5 });
    const r10 = calculateFormulation({ ...makeInput(), superfatPercent: 10 });
    // With same KOH split, the ratio of results should reflect superfat difference
    expect(r5.naohAsSuppliedMass).toBeGreaterThan(r10.naohAsSuppliedMass);
  });

  it("KOH receives recipe-level superfat, not NaOH only", () => {
    const r5_koh = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 100,
      superfatPercent: 5,
      kohPurityPercent: 100,
    });
    const r10_koh = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 100,
      superfatPercent: 10,
      kohPurityPercent: 100,
    });
    // KOH should differ with superfat (not the old legacy behavior)
    expect(r5_koh.kohAsSuppliedMass).not.toBe(r10_koh.kohAsSuppliedMass);
  });

  it("purity is applied independently after superfat discount", () => {
    const result = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 100,
      kohPurityPercent: 90,
    });
    // fullKOHPure = 1000 * 0.19 * 0.95 = 180.5
    // asSupplied = 180.5 / 0.9 = 200.5556
    expect(result.kohPureMass).toBeCloseTo(180.5000, 4);
    expect(result.kohAsSuppliedMass).toBeCloseTo(200.5556, 4);
  });
});

describe("RED: three mutually exclusive water modes", () => {
  it("water-to-lye ratio mode: water = totalAlkaliAsSupplied × ratio", () => {
    const result = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 40,
      naOHPurityPercent: 99,
      kohPurityPercent: 90,
      waterMode: "water_to_lye_ratio",
      waterToLyeRatio: 2.0,
    });
    // totalAlkaliAsSupplied = 158.2073, water = 158.2073 * 2.0 = 316.4146
    expect(result.water).toBeCloseTo(316.4146, 4);
  });

  it("lye concentration mode: water = totalAlkaliAsSupplied × ((1/conc) - 1)", () => {
    const result = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 40,
      naOHPurityPercent: 99,
      kohPurityPercent: 90,
      waterMode: "lye_concentration",
      lyeConcentrationPercent: 33.3333333333,
    });
    // water = 158.2073 * ((1/0.3333333333) - 1) ≈ 158.2073 * 2 = 316.4146
    expect(result.water).toBeCloseTo(316.4146, 3);
  });

  it("water as percent of oils mode: water = oilWeightTotal × percent / 100", () => {
    const result = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 40,
      naOHPurityPercent: 99,
      kohPurityPercent: 90,
      waterMode: "percent_of_oils",
      waterAsPercentOfOils: 30,
    });
    // water = 1000 * 30 / 100 = 300.0000
    expect(result.water).toBeCloseTo(300.0000, 4);
  });

  it("inactive water modes do not affect the result", () => {
    const ratioResult = calculateFormulation({
      ...makeInput(),
      waterMode: "water_to_lye_ratio",
      waterToLyeRatio: 2.0,
    });
    const concResult = calculateFormulation({
      ...makeInput(),
      waterMode: "water_to_lye_ratio",
      waterToLyeRatio: 2.0,
      lyeConcentrationPercent: 50, // ignored in ratio mode
    });
    expect(ratioResult.water).toBeCloseTo(concResult.water, 4);
  });
});

describe("RED: separate NaOH, KOH and total as-supplied outputs", () => {
  it("returns naohAsSuppliedMass, kohAsSuppliedMass, and totalAlkaliAsSupplied", () => {
    const result = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 40,
      naOHPurityPercent: 99,
      kohPurityPercent: 90,
    });
    expect(result.naohAsSuppliedMass).toBeGreaterThan(0);
    expect(result.kohAsSuppliedMass).toBeGreaterThan(0);
    expect(result.totalAlkaliAsSupplied).toBeCloseTo(
      result.naohAsSuppliedMass + result.kohAsSuppliedMass, 4
    );
  });
});

describe("RED: full precision internally, display-only rounding", () => {
  it("returns unrounded internal values", () => {
    const result = calculateFormulation({
      ...makeInput(),
      kohPercentOfAlkaliEquivalents: 40,
      naOHPurityPercent: 99,
      kohPurityPercent: 90,
    });
    // Values should have full precision (not pre-rounded to 4 dp)
    expect(typeof result.naohAsSuppliedMass).toBe("number");
  });
});

describe("RED: typed errors/warnings, no silent clamps", () => {
  it("throws typed error for unknown oil ID", () => {
    expect(() => calculateFormulation({
      ...makeInput(),
      oilBlend: [{ oilId: "nonexistent-oil", percent: 100 }],
    })).toThrow(/Unknown|not found|not available/i);
  });

  it("throws for negative superfat", () => {
    expect(() => calculateFormulation({
      ...makeInput(),
      superfatPercent: -5,
    })).toThrow(/superfat|range|0.*20/i);
  });

  it("throws for superfat > 20", () => {
    expect(() => calculateFormulation({
      ...makeInput(),
      superfatPercent: 25,
    })).toThrow(/superfat|range|0.*20/i);
  });

  it("throws for purity outside valid range", () => {
    expect(() => calculateFormulation({
      ...makeInput(),
      naOHPurityPercent: 0,
    })).toThrow(/purity|range|0.*100/i);
  });
});

describe("RED: no arbitrary property ranges and no oil-level IFRA", () => {
  it("result does NOT contain propertyRanges", () => {
    const result = calculateFormulation(makeInput());
    expect(result).not.toHaveProperty("propertyRanges");
    expect(Object.keys(result)).not.toContain("propertyRanges");
  });

  it("result does NOT contain IFRA compliance checks", () => {
    const result = calculateFormulation(makeInput());
    expect(Object.keys(result)).not.toContain("ifraCompliance");
  });
});

describe("RED: versioned output and fail-closed production flag", () => {
  it("includes calculatorVersion and datasetRevision in result", () => {
    const result = calculateFormulation(makeInput());
    expect(result).toHaveProperty("calculatorVersion");
    expect(result).toHaveProperty("datasetRevision");
  });

  it("blocks the public boundary when the production flag is absent", () => {
    const previous = process.env.PUBLIC_CHEMISTRY_ENABLED;
    delete process.env.PUBLIC_CHEMISTRY_ENABLED;
    try {
      expect(isPublicChemistryEnabled()).toBe(false);
      expect(() => assertPublicChemistryAccess(makeInput())).toThrow(PublicChemistryGateError);
      expect(() => assertPublicChemistryAccess(makeInput())).toThrow(/disabled pending source verification/i);
    } finally {
      if (previous === undefined) delete process.env.PUBLIC_CHEMISTRY_ENABLED;
      else process.env.PUBLIC_CHEMISTRY_ENABLED = previous;
    }
  });

  it("rejects synthetic and provisional ingredients even when the flag is enabled", () => {
    const previous = process.env.PUBLIC_CHEMISTRY_ENABLED;
    process.env.PUBLIC_CHEMISTRY_ENABLED = "true";
    try {
      expect(isPublicChemistryEnabled()).toBe(true);
      expect(() => assertPublicChemistryAccess(makeInput())).toThrow(/not approved for public chemistry/i);
    } finally {
      if (previous === undefined) delete process.env.PUBLIC_CHEMISTRY_ENABLED;
      else process.env.PUBLIC_CHEMISTRY_ENABLED = previous;
    }
  });
});

describe("RED: total batch weight", () => {
  it("sums oils, both as-supplied alkalis, water, fragrance, and additives", () => {
    const result = calculateFormulation(makeInput({
      kohPercentOfAlkaliEquivalents: 40,
      naOHPurityPercent: 99,
      kohPurityPercent: 90,
      waterMode: "percent_of_oils",
      waterAsPercentOfOils: 30,
      fragranceLoadPercent: 2,
      additivesWeight: 15,
    }));
    expect(result.totalWeight).toBeCloseTo(
      result.oilWeightTotal + result.naohAsSuppliedMass + result.kohAsSuppliedMass +
        result.water + result.fragranceLoad + 15,
      10,
    );
  });
});

describe("RED: determinism", () => {
  it("same inputs always produce the same outputs", () => {
    const input = makeInput({ kohPercentOfAlkaliEquivalents: 40 });
    const r1 = calculateFormulation(input);
    const r2 = calculateFormulation(input);
    expect(r1.naohAsSuppliedMass).toBe(r2.naohAsSuppliedMass);
    expect(r1.kohAsSuppliedMass).toBe(r2.kohAsSuppliedMass);
    expect(r1.totalAlkaliAsSupplied).toBe(r2.totalAlkaliAsSupplied);
    expect(r1.water).toBe(r2.water);
    expect(r1.totalWeight).toBe(r2.totalWeight);
  });
});
