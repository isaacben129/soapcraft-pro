import { describe, expect, it } from "vitest";
import { solvePrice, netRevenue } from "./economics";
describe("economics", () => { it("solves gross margin algebraically", () => expect(solvePrice(10, { mode: "gross_margin", value: 50 })).toBe(20)); it("keeps markup distinct", () => expect(solvePrice(10, { mode: "markup", value: 50 })).toBe(15)); it("accounts for channel fees", () => expect(netRevenue(10, 2, 10, 1)).toBe(17)); });
