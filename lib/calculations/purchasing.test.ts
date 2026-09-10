import { describe, expect, it } from "vitest";
import { purchasePlan } from "./purchasing";
describe("purchasing", () => { it("subtracts stock and rounds packs", () => expect(purchasePlan({ ingredientId: "olive-oil", required: 9, onHand: 2, packSize: 5, unit: "kg"})).toMatchObject({ shortage: 7, packsRequired: 2, quantityToBuy: 10 })); });
