// ── SLICE-002: Context Manager Tests ──

import { describe, it, expect, beforeEach, vi } from "vitest";
import { RecipeBatchContextManager } from "./RecipeBatchContextV1";
import { LocalContextStorage } from "@/lib/storage/context-storage";
import type { RecipeBatchContextV1 } from "@/lib/schemas/context-schema";

const makeCtx = (overrides: Partial<RecipeBatchContextV1> = {}): RecipeBatchContextV1 => ({
  schemaVersion: 1,
  contextId: "test-ctx",
  sourceTool: "TOOL-COST",
  createdAt: "2026-09-12T00:00:00.000Z",
  updatedAt: "2026-09-12T00:00:00.000Z",
  units: { mass: "g", dimensions: "cm" },
  revisions: {},
  ...overrides,
});

describe("RecipeBatchContextManager", () => {
  let manager: RecipeBatchContextManager;
  let storage: LocalContextStorage;

  beforeEach(() => {
    storage = new LocalContextStorage();
    manager = new RecipeBatchContextManager(storage);
  });

  it("creates a new context", () => {
    const ctx = manager.createContext("TOOL-COST", { mass: "g", dimensions: "cm" });
    expect(ctx.schemaVersion).toBe(1);
    expect(ctx.sourceTool).toBe("TOOL-COST");
    expect(ctx.contextId).toBeTruthy();
    expect(manager.getActiveContext()).toBe(ctx);
    expect(manager.getSaveState()).toBe("memory-only");
  });

  it("saves context to storage", async () => {
    const ctx = manager.createContext("TOOL-COST", { mass: "g", dimensions: "cm" });
    const result = await manager.saveContext();
    expect(result.state).toBe("locally-saved");
    expect(storage.has(ctx.contextId)).toBe(true);
  });

  it("loads context from storage", () => {
    const ctx = manager.createContext("TOOL-COST", { mass: "g", dimensions: "cm" });
    storage.save(ctx);
    const loaded = manager.loadContext(ctx.contextId);
    expect(loaded).toBe(true);
    expect(manager.getActiveContext()?.contextId).toBe(ctx.contextId);
  });

  it("returns false when loading nonexistent context", () => {
    const loaded = manager.loadContext("nonexistent");
    expect(loaded).toBe(false);
  });

  it("resets context", () => {
    const ctx = manager.createContext("TOOL-COST", { mass: "g", dimensions: "cm" });
    manager.resetContext();
    expect(manager.getActiveContext()).toBeNull();
    expect(manager.getSaveState()).toBe("memory-only");
  });

  it("exports context as JSON", async () => {
    const ctx = manager.createContext("TOOL-COST", { mass: "g", dimensions: "cm" });
    const exportObj = await manager.exportContext();
    expect(exportObj).not.toBeNull();
    expect(exportObj!.exportType).toBe("context-json");
    expect(exportObj!.schemaVersion).toBe(1);
    expect(exportObj!.context.contextId).toBe(ctx.contextId);
  });

  it("returns null export when no active context", async () => {
    const exportObj = await manager.exportContext();
    expect(exportObj).toBeNull();
  });

  it("notifies subscribers on create", () => {
    const listener = vi.fn();
    manager.subscribe(listener);
    manager.createContext("TOOL-COST", { mass: "g", dimensions: "cm" });
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ type: "created" }));
  });

  it("updates section", () => {
    const ctx = manager.createContext("TOOL-COST", { mass: "g", dimensions: "cm" });
    const costingSection = {
      sourceTool: "TOOL-COST" as const,
      acceptedAt: "2026-01-01",
      sourceRevision: "1",
      totalCost: 10,
      costPerMadeUnit: 1,
      costPerSaleableUnit: 1,
      ingredientCostTotal: 5,
      fragranceCost: 1,
      packagingCost: 1,
      laborCost: 1,
      overheadCost: 1,
      otherCosts: 1,
      currency: "USD",
      missingCostBasis: [],
      completeness: "complete" as const,
      origin: "manual" as const,
    };
    manager.updateSection("costing", costingSection);
    const active = manager.getActiveContext();
    expect(active?.costing).toEqual(costingSection);
  });
});
