import { describe, expect, it } from "vitest";
import { POST } from "./route";

function request(body: unknown) {
  return new Request("http://localhost/api/calculate/batch-cost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/calculate/batch-cost", () => {
  it("solves a target gross margin instead of treating it as markup", async () => {
    const response = await POST(
      request({
        ingredientCosts: [
          { name: "Olive oil", costPerUnit: 1, unit: "g", quantity: 1 },
        ],
        batchYieldBars: 1,
        targetGrossMargin: 40,
      }) as never,
    );

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.costPerBar).toBeCloseTo(1, 8);
    expect(result.suggestedPrice).toBeCloseTo(1 / (1 - 0.4), 8);
    expect(result.pricingMethod).toBe("target gross margin");
  });
});
