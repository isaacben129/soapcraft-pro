import { describe, expect, it } from "vitest";
import { solvePrice, netRevenue } from "./economics";
describe("economics", () => {
  it("solves gross margin algebraically", () => expect(solvePrice(10, { mode: "gross_margin", value: 50 })).toBe(20));
  it("keeps markup distinct", () => expect(solvePrice(10, { mode: "markup", value: 50 })).toBe(15));
  it("accounts for channel fees", () => expect(netRevenue(10, 2, 10, 1)).toBe(17));
  // REM-002 RED contract: cost $1.00, target margin 40% must return $1.666…
  it("returns $1.666… for cost $1.00 and gross margin 40%", () => {
    expect(solvePrice(1, { mode: "gross_margin", value: 40 })).toBeCloseTo(1.6667, 3);
  });
  // REM-002 RED contract: cost × (1 + margin) is markup, never gross margin
  it("cost × (1 + margin) is markup, NOT gross margin", () => {
    expect(solvePrice(1, { mode: "markup", value: 40 })).toBeCloseTo(1.40, 2);
    expect(solvePrice(1, { mode: "markup", value: 40 })).not.toBeCloseTo(1.6667, 3);
  });
  // REM-002: impossible denominator must block
  it("blocks gross margin at 100% or above", () => {
    expect(() => solvePrice(10, { mode: "gross_margin", value: 100 })).toThrow("Gross margin must be below 100%");
  });
});
