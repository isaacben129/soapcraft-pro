import { describe, expect, it } from "vitest";
import { batchesRequired, cureReady, readyByPourDate } from "./production";
describe("production", () => { it("back-plans batches", () => expect(batchesRequired(25, 10)).toBe(3)); it("back-plans ready-by", () => expect(readyByPourDate("2026-10-31", 42).toISOString().slice(0,10)).toBe("2026-09-19")); it("detects cure readiness", () => expect(cureReady("2026-01-01", 30, new Date("2026-02-01"))).toBe(true)); });
