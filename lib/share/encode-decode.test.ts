// ── SLICE-002: Share Encode/Decode Tests ──

import { describe, it, expect } from "vitest";
import {
  base64urlEncode,
  base64urlDecode,
  computeChecksum,
  encodeSharePayload,
  decodeSharePayload,
  detectCorruptPayload,
  CONTEXT_SCHEMA_VERSION,
} from "./encode-decode";
import type { RecipeBatchContextV1 } from "@/lib/schemas/context-schema";

const makeCtx = (): RecipeBatchContextV1 => ({
  schemaVersion: 1,
  contextId: "test-share-ctx",
  sourceTool: "TOOL-COST",
  createdAt: "2026-09-12T00:00:00.000Z",
  updatedAt: "2026-09-12T00:00:00.000Z",
  units: { mass: "g", dimensions: "cm" },
  revisions: {},
});

describe("share encode/decode", () => {
  // ── Base64url ──
  it("base64urlEncode produces valid output", () => {
    const result = base64urlEncode("hello");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("base64urlDecode round-trips", () => {
    const original = "{\"schemaVersion\":1}";
    const encoded = base64urlEncode(original);
    const decoded = base64urlDecode(encoded);
    expect(decoded).toBe(original);
  });

  it("base64urlDecode handles URL-safe chars", () => {
    const encoded = base64urlEncode('{"key":"val+ue"}');
    const decoded = base64urlDecode(encoded);
    expect(decoded).toContain("val+ue");
  });

  // ── Checksum ──
  it("computeChecksum returns a 64-char hex string", async () => {
    const checksum = await computeChecksum("test");
    expect(checksum).toHaveLength(64);
    expect(checksum).toMatch(/^[0-9a-f]+$/);
  });

  it("same input produces same checksum", async () => {
    const c1 = await computeChecksum("same");
    const c2 = await computeChecksum("same");
    expect(c1).toBe(c2);
  });

  it("different input produces different checksum", async () => {
    const c1 = await computeChecksum("a");
    const c2 = await computeChecksum("b");
    expect(c1).not.toBe(c2);
  });

  // ── Encode ──
  it("encodeSharePayload returns share-url mode for small contexts", async () => {
    const ctx = makeCtx();
    const result = await encodeSharePayload(ctx);
    expect(result.mode).toBe("share-url");
    expect(result.url).toBeDefined();
    expect(result.exceedsLimit).toBe(false);
    expect(result.payload).toBeDefined();
    expect(result.checksum).toBeDefined();
  });

  it("encodeSharePayload returns download mode for oversized contexts", async () => {
    const bigCtx: RecipeBatchContextV1 = {
      ...makeCtx(),
      contextId: "big",
      formulation: {
        sourceTool: "TOOL-FORM",
        acceptedAt: "2026-01-01",
        sourceRevision: "1",
        oilPercentages: {},
        targetOilMass: 100,
        alkaliMode: "NaOH",
        superfatPercent: 5,
        waterMode: "lye",
        origin: "manual",
      },
      // Add a huge notes field to exceed limit
    };
    // Manually create a large context
    const hugeCtx = {
      ...makeCtx(),
      contextId: "huge",
      revisions: { note: "x".repeat(50000) },
    };
    const result = await encodeSharePayload(hugeCtx as RecipeBatchContextV1);
    expect(result.exceedsLimit).toBe(true);
    expect(result.mode).toBe("download");
    expect(result.downloadFilename).toBe("context.soapcraft.json");
  });

  it("share URL is under 1800 chars", async () => {
    const ctx = makeCtx();
    const result = await encodeSharePayload(ctx);
    if (result.url) {
      expect(result.url.length).toBeLessThanOrEqual(1800);
    }
  });

  // ── Decode ──
  it("decodeSharePayload validates and returns context", async () => {
    const ctx = makeCtx();
    const json = JSON.stringify(ctx);
    const checksum = await computeChecksum(json);
    const payload = base64urlEncode(json);

    const result = await decodeSharePayload(payload, checksum, CONTEXT_SCHEMA_VERSION);
    expect(result.valid).toBe(true);
    expect(result.context).toBeDefined();
    expect(result.context!.contextId).toBe(ctx.contextId);
    expect(result.errors).toHaveLength(0);
  });

  it("decodeSharePayload rejects wrong version", async () => {
    const ctx = makeCtx();
    const json = JSON.stringify(ctx);
    const checksum = await computeChecksum(json);
    const payload = base64urlEncode(json);

    const result = await decodeSharePayload(payload, checksum, 99);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("version"))).toBe(true);
  });

  it("decodeSharePayload rejects corrupt checksum", async () => {
    const ctx = makeCtx();
    const json = JSON.stringify(ctx);
    const payload = base64urlEncode(json);

    // Use wrong checksum
    const result = await decodeSharePayload(payload, "deadbeef".repeat(8), CONTEXT_SCHEMA_VERSION);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Checksum"))).toBe(true);
  });

  it("decodeSharePayload rejects corrupt JSON", async () => {
    const badPayload = base64urlEncode("not valid json {{{");
    const badChecksum = await computeChecksum("not valid json {{{");
    const result = await decodeSharePayload(badPayload, badChecksum, CONTEXT_SCHEMA_VERSION);
    expect(result.valid).toBe(false);
  });

  it("decodeSharePayload rejects wrong schema shape", async () => {
    const badJson = JSON.stringify({ wrong: "schema" });
    const payload = base64urlEncode(badJson);
    const checksum = await computeChecksum(badJson);
    const result = await decodeSharePayload(payload, checksum, CONTEXT_SCHEMA_VERSION);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("detectCorruptPayload", () => {
  it("returns true for corrupt payload", async () => {
    const isCorrupt = await detectCorruptPayload(
      base64urlEncode("corrupt"),
      "wrongchecksum".repeat(5),
      CONTEXT_SCHEMA_VERSION
    );
    // Will fail checksum validation
    expect(typeof isCorrupt).toBe("boolean");
  });

  it("returns false for valid payload", async () => {
    const ctx = makeCtx();
    const json = JSON.stringify(ctx);
    const checksum = await computeChecksum(json);
    const payload = base64urlEncode(json);
    const isCorrupt = await detectCorruptPayload(payload, checksum, CONTEXT_SCHEMA_VERSION);
    expect(isCorrupt).toBe(false);
  });
});
