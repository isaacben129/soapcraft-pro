import { describe, expect, it } from "vitest";
import { calibratedDensity, fitRecipeToMold, rectangularVolume, scaleRecipe } from "./sizing";
describe("sizing", () => { it("normalizes rectangular volume", () => expect(rectangularVolume(10, 10, 10)).toBe(1000)); it("calibrates and scales", () => { const density = calibratedDensity(900, 1000); expect(density).toBeCloseTo(.9); expect(fitRecipeToMold(1000, 1800).scaleFactor).toBeCloseTo(1.8); }); it("scales every component", () => expect(scaleRecipe({ oil: 100, water: 50 }, 2)).toEqual({ oil: 200, water: 100 })); });
