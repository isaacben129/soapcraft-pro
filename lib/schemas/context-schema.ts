// ── RecipeBatchContextV1 Schema ──────────────
// SLICE-002: Anonymous context continuity through batch cost.
// Normative source: product/TOOL-IMPLEMENTATION-CONTRACT.md §2.3
// Canonical JSON with schemaVersion: 1. Contains only calculation/planning
// data explicitly entered or accepted by the user.

export const CONTEXT_SCHEMA_VERSION = 1 as const;
export const CONTEXT_NAMESPACE_PREFIX = "soapcraft:context:v1:";
export const MAX_SHARE_URL_LENGTH = 1800;

export type ToolId =
  | "TOOL-FORM"
  | "TOOL-MOLD"
  | "TOOL-SCALE"
  | "TOOL-COST"
  | "TOOL-WHOLESALE"
  | "TOOL-EVENT"
  | "TOOL-READY"
  | "TOOL-PURCHASE";

export type SourceTool = ToolId;

export type FieldOrigin = "manual" | "imported" | "calculated";

export interface FormulationContext {
  sourceTool: SourceTool;
  acceptedAt: string;
  sourceRevision: string;
  oilPercentages: Record<string, number>;
  targetOilMass: number;
  alkaliMode: "NaOH" | "KOH" | "mixed";
  superfatPercent: number;
  waterMode: string;
  fragranceLoadPercent?: number;
  origin: FieldOrigin;
}

export interface MoldContext {
  sourceTool: SourceTool;
  acceptedAt: string;
  sourceRevision: string;
  volume?: number;
  targetBatterMass?: number;
  calibratedDensity?: number;
  origin: FieldOrigin;
}

export interface ScalingContext {
  sourceTool: SourceTool;
  acceptedAt: string;
  sourceRevision: string;
  scaleFactor: number;
  mode: "copy_quantities" | "recalculate_formulation";
  origin: FieldOrigin;
}

export interface YieldContext {
  sourceTool: SourceTool;
  acceptedAt: string;
  sourceRevision: string;
  madeUnits: number;
  saleableYield: number;
  origin: FieldOrigin;
}

export interface CostingContext {
  sourceTool: SourceTool;
  acceptedAt: string;
  sourceRevision: string;
  totalCost: number;
  costPerMadeUnit: number;
  costPerSaleableUnit: number;
  ingredientCostTotal: number;
  fragranceCost: number;
  packagingCost: number;
  laborCost: number;
  overheadCost: number;
  otherCosts: number;
  currency: string;
  missingCostBasis: Array<{ ingredientId: string; reason: string }>;
  completeness: "complete" | "incomplete";
  origin: FieldOrigin;
}

export interface PricingContext {
  sourceTool: SourceTool;
  acceptedAt: string;
  sourceRevision: string;
  costPerSaleableUnit: number;
  listPrice?: number;
  invoicePrice?: number;
  markupPercent?: number;
  grossMarginPercent?: number;
  currency: string;
  origin: FieldOrigin;
}

export interface EventContext {
  sourceTool: SourceTool;
  acceptedAt: string;
  sourceRevision: string;
  fixedCosts: Record<string, number>;
  weightedContribution: number;
  breakEvenUnits: number;
  targetProfitUnits: number;
  currency: string;
  origin: FieldOrigin;
}

export interface ProductionContext {
  sourceTool: SourceTool;
  acceptedAt: string;
  sourceRevision: string;
  batchesRequired: number;
  latestPourDate: string;
  scheduleFeasible: boolean;
  origin: FieldOrigin;
}

export interface PurchasingContext {
  sourceTool: SourceTool;
  acceptedAt: string;
  sourceRevision: string;
  baseRequirement: number;
  grossRequirement: number;
  netNeed: number;
  currency: string;
  origin: FieldOrigin;
}

export interface RecipeBatchContextV1 {
  readonly schemaVersion: 1;
  contextId: string;
  sourceTool: SourceTool;
  createdAt: string;
  updatedAt: string;
  units: { mass: "g" | "kg" | "oz" | "lb"; dimensions: "cm" | "in" };
  currency?: string;
  revisions: Record<string, string>;
  formulation?: FormulationContext;
  mold?: MoldContext;
  scaling?: ScalingContext;
  yield?: YieldContext;
  costing?: CostingContext;
  pricing?: PricingContext;
  event?: EventContext;
  production?: ProductionContext;
  purchasing?: PurchasingContext;
}

// ── Validation ───────────────────────────────

export function isValidContextVersion(value: unknown): boolean {
  return typeof value === "number" && value === CONTEXT_SCHEMA_VERSION;
}

export function isValidToolId(value: unknown): boolean {
  const validTools: ToolId[] = [
    "TOOL-FORM", "TOOL-MOLD", "TOOL-SCALE", "TOOL-COST",
    "TOOL-WHOLESALE", "TOOL-EVENT", "TOOL-READY", "TOOL-PURCHASE",
  ];
  return typeof value === "string" && validTools.includes(value as ToolId);
}

export function isValidFieldOrigin(value: unknown): boolean {
  return typeof value === "string" && ["manual", "imported", "calculated"].includes(value);
}

export function isValidContextId(value: unknown): boolean {
  return typeof value === "string" && value.length > 0 && value.length <= 128;
}

export function validateContextShape(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["Context must be a non-null object"] };
  }
  const ctx = data as Record<string, unknown>;
  if (!isValidContextVersion(ctx.schemaVersion)) {
    errors.push(`schemaVersion must be ${CONTEXT_SCHEMA_VERSION}`);
  }
  if (!isValidContextId(ctx.contextId)) {
    errors.push("contextId must be a non-empty string <= 128 chars");
  }
  if (!isValidToolId(ctx.sourceTool)) {
    errors.push("sourceTool must be a valid ToolId");
  }
  if (typeof ctx.createdAt !== "string" || !ctx.createdAt) {
    errors.push("createdAt must be a non-empty string");
  }
  if (typeof ctx.updatedAt !== "string" || !ctx.updatedAt) {
    errors.push("updatedAt must be a non-empty string");
  }
  if (!ctx.units || typeof ctx.units !== "object") {
    errors.push("units must be an object");
  } else {
    const validMassUnits = ["g", "kg", "oz", "lb"];
    const validDimUnits = ["cm", "in"];
    const u = ctx.units as Record<string, unknown>;
    if (!validMassUnits.includes(u.mass as string)) errors.push("units.mass must be g, kg, oz, or lb");
    if (!validDimUnits.includes(u.dimensions as string)) errors.push("units.dimensions must be cm or in");
  }
  if (ctx.currency && typeof ctx.currency !== "string") {
    errors.push("currency must be a string if present");
  }
  if (ctx.revisions && typeof ctx.revisions !== "object") {
    errors.push("revisions must be an object");
  }
  // Unknown top-level sections are rejected
  const knownSections = [
    "schemaVersion", "contextId", "sourceTool", "createdAt", "updatedAt",
    "units", "currency", "revisions", "formulation", "mold", "scaling",
    "yield", "costing", "pricing", "event", "production", "purchasing",
  ];
  for (const key of Object.keys(ctx)) {
    if (!knownSections.includes(key)) {
      errors.push(`Unknown top-level section: ${key}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

// ── Helpers ──────────────────────────────────

export function createContextId(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // Node.js fallback
    const { randomFillSync } = require("crypto");
    randomFillSync(bytes);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function getContextStorageKey(contextId: string): string {
  return `${CONTEXT_NAMESPACE_PREFIX}${contextId}`;
}
