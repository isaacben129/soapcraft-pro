import { describe, it, expect } from "vitest";
import {
  derivNaOH,
  findIngredient,
  getSapKOH,
  isAvailable,
  isPubliclyUsable,
  isVerified,
  LEGACY_OILS,
  SYNTHETIC_OIL,
  MW_NaOH,
  MW_KOH,
  type IngredientRecord,
} from "./ingredient-dataset";

describe("ingredient-dataset", () => {
  it("should find synthetic oil", () => {
    const ing = findIngredient("test-oil-a");
    expect(ing).toBeDefined();
    expect(ing?.sapKOH).toBe(0.19);
  });
  it("should get sapKOH", () => {
    const sap = getSapKOH("test-oil-a");
    expect(sap).toBe(0.19);
  });
  it("should derive NaOH from KOH using molecular weights", () => {
    const expectedNaOH = 0.19 * MW_NaOH / MW_KOH;
    const naoh = derivNaOH(0.19);
    expect(naoh).toBeCloseTo(expectedNaOH, 10);
  });

  it("every legacy record has subtype and sapKOHRange", () => {
    for (const oil of LEGACY_OILS) {
      expect(oil.subtype).toBeDefined();
      expect(oil.sapKOHRange).not.toBeNull();
      expect(oil.sapKOHRange!.min).toBeLessThanOrEqual(oil.sapKOH);
      expect(oil.sapKOHRange!.max).toBeGreaterThanOrEqual(oil.sapKOH);
    }
  });

  it("coconut-oil has explicit note that 0.273 is NOT an approved ordinary value", () => {
    const coconut = LEGACY_OILS.find(o => o.id === "coconut-oil");
    expect(coconut).toBeDefined();
    expect(coconut?.sourceMethod).toContain("rejected");
    expect(coconut?.status).toBe("estimated");
    expect(coconut?.reviewerState).toBe("pending");
  });

  it("keeps synthetic, estimated, and unknown records out of public chemistry", () => {
    expect(isAvailable("test-oil-a")).toBe(true);
    expect(isAvailable("olive-oil")).toBe(true);
    expect(isAvailable("missing-oil")).toBe(false);
    expect(isVerified("test-oil-a")).toBe(false);
    expect(isVerified("olive-oil")).toBe(false);
    expect(isVerified("missing-oil")).toBe(false);
    expect(isPubliclyUsable("test-oil-a")).toBe(false);
    expect(isPubliclyUsable("olive-oil")).toBe(false);
    expect(isPubliclyUsable("missing-oil")).toBe(false);
  });

  it("SYNTHETIC_OIL has subtype 'synthetic' and null sapKOHRange", () => {
    expect(SYNTHETIC_OIL.subtype).toBe("synthetic");
    expect(SYNTHETIC_OIL.sapKOHRange).toBeNull();
  });

  it("all records have required provenance fields", () => {
    const allRecords: IngredientRecord[] = [...LEGACY_OILS, SYNTHETIC_OIL];
    for (const oil of allRecords) {
      expect(oil.sourceTitle).toBeTruthy();
      expect(oil.sourceUrl).toBeTruthy();
      expect(oil.publicationDate).toBeTruthy();
      expect(oil.retrievalDate).toBeTruthy();
      expect(oil.status).toBeTruthy();
      expect(oil.reviewerState).toBeTruthy();
    }
  });
});
