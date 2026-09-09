import { describe, it, expect } from "vitest";
import {
  derivNaOH,
  findIngredient,
  getSapKOH,
  isAvailable,
  isPubliclyUsable,
  isVerified,
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
  it("should derive NaOH", () => {
    const naoh = derivNaOH(0.19);
    expect(naoh).toBeCloseTo(0.1354477239510926, 10);
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
});
