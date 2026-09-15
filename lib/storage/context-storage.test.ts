// ── SLICE-002: Context Storage Tests ──

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  LocalContextStorage,
  getSaveStateLabel,
  createSaveResult,
  isTruthfulSaveState,
  type SaveState,
} from "./context-storage";
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

describe("LocalContextStorage", () => {
  let localStore: Map<string, string>;
  let mockStorage: { getItem: ReturnType<typeof vi.fn>; setItem: ReturnType<typeof vi.fn>; removeItem: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStore = new Map();
    mockStorage = {
      getItem: vi.fn((key: string) => localStore.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => localStore.set(key, value)),
      removeItem: vi.fn((key: string) => localStore.delete(key)),
    };
    vi.stubGlobal("window", { localStorage: mockStorage });
  });

  it("saves and loads a context", () => {
    const storage = new LocalContextStorage();
    const ctx = makeCtx();
    const result = storage.save(ctx);
    expect(result.state).toBe("locally-saved");
    const loaded = storage.load(ctx.contextId);
    expect(loaded).not.toBeNull();
    expect(loaded!.contextId).toBe(ctx.contextId);
    expect(loaded!.sourceTool).toBe("TOOL-COST");
  });

  it("returns null for missing context", () => {
    const storage = new LocalContextStorage();
    const loaded = storage.load("nonexistent");
    expect(loaded).toBeNull();
  });

  it("removes a context", () => {
    const storage = new LocalContextStorage();
    const ctx = makeCtx();
    storage.save(ctx);
    expect(storage.has(ctx.contextId)).toBe(true);
    storage.remove(ctx.contextId);
    expect(storage.has(ctx.contextId)).toBe(false);
  });

  it("returns save-failed for invalid context", () => {
    const storage = new LocalContextStorage();
    const ctx = makeCtx({ contextId: "", sourceTool: "TOOL-UNKNOWN" as unknown as RecipeBatchContextV1["sourceTool"] });
    const result = storage.save(ctx);
    expect(result.state).toBe("save-failed");
  });

  it("returns save-failed when storage throws", () => {
    mockStorage.setItem = vi.fn(() => { throw new Error("Quota exceeded"); });
    const storage = new LocalContextStorage();
    const ctx = makeCtx();
    const result = storage.save(ctx);
    expect(result.state).toBe("save-failed");
    expect(result.error).toBeDefined();
  });

  it("load returns null for corrupt payload", () => {
    localStore.set("soapcraft:context:v1:bad", "not-valid-json");
    const storage = new LocalContextStorage();
    const loaded = storage.load("bad");
    expect(loaded).toBeNull();
  });

  it("load returns null for payload with wrong schemaVersion", () => {
    localStore.set("soapcraft:context:v1:badver", JSON.stringify({ schemaVersion: 99 }));
    const storage = new LocalContextStorage();
    const loaded = storage.load("badver");
    expect(loaded).toBeNull();
  });
});

// ── Pure function tests ──

describe("save state helpers", () => {
  it("getSaveStateLabel returns correct labels", () => {
    expect(getSaveStateLabel("memory-only")).toBe("Memory only");
    expect(getSaveStateLabel("saving")).toBe("Saving…");
    expect(getSaveStateLabel("locally-saved")).toBe("Locally saved");
    expect(getSaveStateLabel("save-failed")).toBe("Save failed");
  });

  it("createSaveResult creates correct result", () => {
    const result = createSaveResult("locally-saved", "abc");
    expect(result.state).toBe("locally-saved");
    expect(result.contextId).toBe("abc");
  });

  it("isTruthfulSaveState validates states", () => {
    expect(isTruthfulSaveState("memory-only", false)).toBe(true);
    expect(isTruthfulSaveState("locally-saved", true)).toBe(true);
    expect(isTruthfulSaveState("save-failed", true)).toBe(true);
    expect(isTruthfulSaveState("saving", true)).toBe(true);
  });
});
