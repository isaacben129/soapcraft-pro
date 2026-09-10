import { describe, expect, it } from "vitest";
import { craftFairBreakEven, wholesalePrice } from "./markets";
describe("markets", () => { it("calculates craft fair break-even", () => expect(craftFairBreakEven(100, { units: 20, pricePerUnit: 10, costPerUnit: 5 }).breakEvenUnits).toBe(20)); it("uses margin pricing when requested", () => expect(wholesalePrice(10, "gross_margin", 50)).toBe(20)); });
