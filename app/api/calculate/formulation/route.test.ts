import { afterEach, describe, expect, it } from "vitest";
import { POST } from "./route";

const originalFlag = process.env.PUBLIC_CHEMISTRY_ENABLED;

afterEach(() => {
  if (originalFlag === undefined) delete process.env.PUBLIC_CHEMISTRY_ENABLED;
  else process.env.PUBLIC_CHEMISTRY_ENABLED = originalFlag;
});

function request() {
  return new Request("http://localhost/api/calculate/formulation", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      oilBlend: [{ oilId: "test-oil-a", percent: 100 }],
      targetOilMass: 1000,
      superfatPercent: 5,
      kohPercentOfAlkaliEquivalents: 0,
      naOHPurityPercent: 100,
      kohPurityPercent: 90,
      waterMode: "water_to_lye_ratio",
      waterToLyeRatio: 2.5,
      lyeConcentrationPercent: 33,
      waterAsPercentOfOils: 30,
      fragranceLoadPercent: 0
    })
  });
}

describe("POST /api/calculate/formulation", () => {
  it("returns a typed 503 while public chemistry is disabled", async () => {
    delete process.env.PUBLIC_CHEMISTRY_ENABLED;
    const response = await POST(request());
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "PUBLIC_CHEMISTRY_DISABLED" }
    });
  });

  it("returns a typed 422 for unverified ingredients even when enabled", async () => {
    process.env.PUBLIC_CHEMISTRY_ENABLED = "true";
    const response = await POST(request());
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "INGREDIENT_NOT_PUBLICLY_VERIFIED" }
    });
  });
});
