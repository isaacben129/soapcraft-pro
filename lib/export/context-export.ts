// ── SLICE-002: Context Export/Print ──
// JSON context export containing inputs, unrounded canonical result values,
// revisions, assumptions, warnings, and generated timestamp.
// Accessible print output containing human-readable inputs, displayed results,
// assumptions, warnings, formula revision, and dataset revision.

import type { RecipeBatchContextV1 } from "@/lib/schemas/context-schema";
import { CONTEXT_SCHEMA_VERSION } from "@/lib/schemas/context-schema";

export interface ContextExport {
  exportType: "context-json";
  schemaVersion: number;
  exportedAt: string;
  context: RecipeBatchContextV1;
  digest: string;
}

export interface PrintRecord {
  toolId: string;
  generatedAt: string;
  contextId: string;
  sections: PrintSection[];
  formulaRevision: string;
  datasetRevision?: string;
  assumptions: string[];
  warnings: string[];
}

export interface PrintSection {
  name: string;
  sourceTool: string;
  acceptedAt: string;
  origin: string;
  values: Record<string, unknown>;
}

// ── JSON Export ──

export function createContextExport(
  ctx: RecipeBatchContextV1,
  digest: string
): ContextExport {
  return {
    exportType: "context-json",
    schemaVersion: CONTEXT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    context: ctx,
    digest,
  };
}

export function serializeContextExport(exportObj: ContextExport): string {
  return JSON.stringify(exportObj, null, 2);
}

export function downloadContextExport(ctx: RecipeBatchContextV1, digest: string): void {
  const exportObj = createContextExport(ctx, digest);
  const json = serializeContextExport(exportObj);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `context-${ctx.contextId}.soapcraft.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Print Record ──

export function createPrintRecord(
  toolId: string,
  contextId: string,
  sections: PrintSection[],
  formulaRevision: string,
  assumptions: string[],
  warnings: string[],
  datasetRevision?: string
): PrintRecord {
  return {
    toolId,
    generatedAt: new Date().toISOString(),
    contextId,
    sections,
    formulaRevision,
    datasetRevision,
    assumptions,
    warnings,
  };
}

export function formatForPrint(record: PrintRecord): string {
  const lines: string[] = [];
  lines.push(`SoapCraft Pro — ${record.toolId}`);
  lines.push(`Context ID: ${record.contextId}`);
  lines.push(`Generated: ${record.generatedAt}`);
  lines.push(`Formula Revision: ${record.formulaRevision}`);
  if (record.datasetRevision) {
    lines.push(`Dataset Revision: ${record.datasetRevision}`);
  }
  lines.push("");
  lines.push("--- Assumptions ---");
  for (const a of record.assumptions) {
    lines.push(`• ${a}`);
  }
  lines.push("");
  lines.push("--- Warnings ---");
  for (const w of record.warnings) {
    lines.push(`• ${w}`);
  }
  lines.push("");
  lines.push("--- Sections ---");
  for (const section of record.sections) {
    lines.push(`\n${section.name} (source: ${section.sourceTool}, origin: ${section.origin})`);
    for (const [key, value] of Object.entries(section.values)) {
      lines.push(`  ${key}: ${value}`);
    }
  }
  lines.push("");
  lines.push("--- End of Record ---");
  return lines.join("\n");
}
