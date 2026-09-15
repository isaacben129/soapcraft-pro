// ── SLICE-002: RecipeBatchContextV1 Schema Tests ──

import { describe, it, expect } from "vitest";
import {
  validateContextShape,
  isValidContextVersion,
  isValidToolId,
  isValidFieldOrigin,
  isValidContextId,
  CONTEXT_SCHEMA_VERSION,
  CONTEXT_NAMESPACE_PREFIX,
  MAX_SHARE_URL_LENGTH,
  createContextId,
  getContextStorageKey,
} from "./context-schema";
import type { RecipeBatchContextV1 } from "./context-schema";

const validCtx = (overrides: Partial<RecipeBatchContextV1> = {}): RecipeBatchContextV1 => ({
  schemaVersion: 1,
  contextId: "test-context-id",
  sourceTool: "TOOL-COST",
  createdAt: "2026-09-12T00:00:00.000Z",
  updatedAt: "2026-09-12T00:00:00.000Z",
  units: { mass: "g", dimensions: "cm" },
  revisions: {},
  ...overrides,
});

describe("context-schema", () => {
  // ── Version ──
  it("has schemaVersion 1", () => {
    expect(CONTEXT_SCHEMA_VERSION).toBe(1);
  });

  it("isValidContextVersion returns true for 1", () => {
    expect(isValidContextVersion(1)).toBe(true);
  });

  it("isValidContextVersion returns false for non-1", () => {
    expect(isValidContextVersion(0)).toBe(false);
    expect(isValidContextVersion(2)).toBe(false);
    expect(isValidContextVersion("1")).toBe(false);
  });

  // ── ToolId ──
  it("isValidToolId accepts valid tools", () => {
    expect(isValidToolId("TOOL-COST")).toBe(true);
    expect(isValidToolId("TOOL-FORM")).toBe(true);
    expect(isValidToolId("TOOL-PURCHASE")).toBe(true);
  });

  it("isValidToolId rejects invalid tools", () => {
    expect(isValidToolId("TOOL-UNKNOWN")).toBe(false);
    expect(isValidToolId("")).toBe(false);
    expect(isValidToolId(123)).toBe(false);
  });

  // ── FieldOrigin ──
  it("isValidFieldOrigin accepts valid origins", () => {
    expect(isValidFieldOrigin("manual")).toBe(true);
    expect(isValidFieldOrigin("imported")).toBe(true);
    expect(isValidFieldOrigin("calculated")).toBe(true);
  });

  it("isValidFieldOrigin rejects invalid origins", () => {
    expect(isValidFieldOrigin("unknown")).toBe(false);
    expect(isValidFieldOrigin("")).toBe(false);
  });

  // ── ContextId ──
  it("isValidContextId accepts valid ids", () => {
    expect(isValidContextId("abc")).toBe(true);
    expect(isValidContextId("a".repeat(128))).toBe(true);
  });

  it("isValidContextId rejects invalid ids", () => {
    expect(isValidContextId("")).toBe(false);
    expect(isValidContextId("a".repeat(129))).toBe(false);
    expect(isValidContextId(123)).toBe(false);
  });

  // ── Namespace ──
  it("getContextStorageKey uses soapcraft:context:v1:<id> namespace", () => {
    expect(getContextStorageKey("abc123")).toBe("soapcraft:context:v1:abc123");
  });

  it("CONTEXT_NAMESPACE_PREFIX is correct", () => {
    expect(CONTEXT_NAMESPACE_PREFIX).toBe("soapcraft:context:v1:");
  });

  it("MAX_SHARE_URL_LENGTH is 1800", () => {
    expect(MAX_SHARE_URL_LENGTH).toBe(1800);
  });

  // ── createContextId ──
  it("createContextId returns a non-empty string", () => {
    const id = createContextId();
    expect(typeof id).toBe("string");
    expect(id.length).toBe(32);
  });

  it("createContextId returns unique ids", () => {
    const ids = new Set(Array.from({ length: 10 }, () => createContextId()));
    expect(ids.size).toBe(10);
  });

  // ── validateContextShape ──
  it("validates a complete valid context", () => {
    const ctx = validCtx();
    const result = validateContextShape(ctx);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects null", () => {
    const result = validateContextShape(null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Context must be a non-null object");
  });

  it("rejects wrong schemaVersion", () => {
    const result = validateContextShape({ ...validCtx(), schemaVersion: 2 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("schemaVersion"))).toBe(true);
  });

  it("rejects missing contextId", () => {
    const result = validateContextShape({ ...validCtx(), contextId: "" });
    expect(result.valid).toBe(false);
  });

  it("rejects invalid sourceTool", () => {
    const result = validateContextShape({ ...validCtx(), sourceTool: "TOOL-UNKNOWN" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("sourceTool"))).toBe(true);
  });

  it("rejects missing units", () => {
    const result = validateContextShape({ ...validCtx(), units: undefined });
    expect(result.valid).toBe(false);
  });

  it("rejects unknown top-level sections", () => {
    const result = validateContextShape({ ...validCtx(), unknownField: "bad" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Unknown top-level"))).toBe(true);
  });

  it("accepts valid mass units", () => {
    for (const unit of ["g", "kg", "oz", "lb"]) {
      const result = validateContextShape({ ...validCtx(), units: { mass: unit as any, dimensions: "cm" } });
      expect(result.valid).toBe(true);
    }
  });

  it("rejects invalid mass units", () => {
    const result = validateContextShape({ ...validCtx(), units: { mass: "meter", dimensions: "cm" } });
    expect(result.valid).toBe(false);
  });

  it("rejects unknown fields inside known sections silently after validation", () => {
    // Unknown fields inside known sections are allowed by validation
    // (only unknown top-level sections are rejected)
    const ctx = {
      ...validCtx(),
      formulation: { sourceTool: "TOOL-COST", acceptedAt: "2026-01-01", sourceRevision: "1", oilPercentages: {}, targetOilMass: 100, alkaliMode: "NaOH", superfatPercent: 5, waterMode: "lye", origin: "manual" as const, unknownField: "should be allowed" },
    };
    const result = validateContextShape(ctx);
    // Top-level validation passes; section-level validation is separate
    expect(result.valid).toBe(true);
  });
});
