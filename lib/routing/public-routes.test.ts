import { describe, expect, it } from "vitest";
import { canBypassAuth } from "./public-routes";

describe("canBypassAuth", () => {
  it.each([
    "/pricing",
    "/subscription",
    "/dashboard",
    "/marketing",
    "/marketing/campaigns",
    "/calculators",
    "/calculators/batch-costing",
  ])("allows retired path %s through middleware so it can redirect", (pathname) => {
    expect(canBypassAuth(pathname)).toBe(true);
  });

  it("does not make private application routes public", () => {
    expect(canBypassAuth("/workspace")).toBe(false);
  });
});
