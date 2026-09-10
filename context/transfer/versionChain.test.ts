import { describe, expect, it } from "vitest";
import { appendVersion } from "./versionChain";
describe("version chain", () => { it("creates immutable incrementing snapshots", () => { const one = appendVersion([], "r1", { oil: 1 }); const two = appendVersion(one, "r2", { oil: 2 }); expect(two[1].version).toBe(2); expect(two[1].previousVersionId).toBe("r1"); expect(two[0].immutable).toEqual({ oil: 1 }); }); });
