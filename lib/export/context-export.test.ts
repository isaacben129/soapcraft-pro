// ── SLICE-002: Export Tests ──

import { describe, it, expect } from "vitest";
import {
  createContextExport,
  serializeContextExport,
  createPrintRecord,
  formatForPrint,
} from "./context-export";
import type { RecipeBatchContextV1 } from "@/lib/schemas/context-schema";

const makeCtx = (): RecipeBatchContextV1 => ({
  schemaVersion: 1,
  contextId: "export-test-ctx",
  sourceTool: "TOOL-COST",
  createdAt: "2026-09-12T00:00:00.000Z",
  updatedAt: "2026-09-12T00:00:00.000Z",
  units: { mass: "g", dimensions: "cm" },
  revisions: { "cost-basis": "1" },
});

describe("context export", () => {
  it("creates a context export with correct fields", () => {
    const ctx = makeCtx();
    const exportObj = createContextExport(ctx, "sha256-test-digest");
    expect(exportObj.exportType).toBe("context-json");
    expect(exportObj.schemaVersion).toBe(1);
    expect(exportObj.exportedAt).toBeTruthy();
    expect(exportObj.context).toEqual(ctx);
    expect(exportObj.digest).toBe("sha256-test-digest");
  });

  it("serializeContextExport produces valid JSON", () => {
    const ctx = makeCtx();
    const exportObj = createContextExport(ctx, "digest");
    const json = serializeContextExport(exportObj);
    const parsed = JSON.parse(json);
    expect(parsed.exportType).toBe("context-json");
    expect(parsed.context.contextId).toBe("export-test-ctx");
  });
});

describe("print record", () => {
  it("creates a print record with all required fields", () => {
    const record = createPrintRecord(
      "TOOL-COST",
      "ctx-123",
      [
        { name: "Costing", sourceTool: "TOOL-COST", acceptedAt: "2026-01-01", origin: "manual", values: { totalCost: 68.0 } },
      ],
      "rev-1",
      ["All inputs validated"],
      ["No warnings"]
    );
    expect(record.toolId).toBe("TOOL-COST");
    expect(record.contextId).toBe("ctx-123");
    expect(record.formulaRevision).toBe("rev-1");
    expect(record.sections).toHaveLength(1);
    expect(record.assumptions).toContain("All inputs validated");
    expect(record.warnings).toContain("No warnings");
  });

  it("formatForPrint produces human-readable output", () => {
    const record = createPrintRecord(
      "TOOL-COST",
      "ctx-123",
      [],
      "rev-1",
      ["Assumption: batch yield is positive"],
      []
    );
    const text = formatForPrint(record);
    expect(text).toContain("TOOL-COST");
    expect(text).toContain("ctx-123");
    expect(text).toContain("rev-1");
    expect(text).toContain("Assumption: batch yield is positive");
    expect(text).toContain("--- Assumptions ---");
  });
});
