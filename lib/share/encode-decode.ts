// ── SLICE-002: Share Encode/Decode ──
// Share payload is canonical JSON encoded as UTF-8 base64url with SHA-256 checksum
// and explicit schema version. Decoding validates size, checksum, JSON shape,
// enums, numbers, and version before any value enters a form.
// Share URLs longer than 1,800 characters are not created; oversized payload
// offers a downloadable .soapcraft.json file instead.

import {
  CONTEXT_SCHEMA_VERSION,
  MAX_SHARE_URL_LENGTH,
  type RecipeBatchContextV1,
  validateContextShape,
} from "@/lib/schemas/context-schema";

export { CONTEXT_SCHEMA_VERSION } from "@/lib/schemas/context-schema";

export interface SharePayload {
  readonly version: 1;
  readonly checksum: string;
  readonly payload: string; // base64url-encoded JSON
}

export interface EncodeResult {
  mode: "share-url" | "download";
  url?: string;
  downloadFilename?: string;
  payload: string;
  checksum: string;
  exceedsLimit: boolean;
}

export interface DecodeResult {
  valid: boolean;
  context?: RecipeBatchContextV1;
  errors: string[];
}

// ── SHA-256 checksum ──

export async function computeChecksum(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  try {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    // fall through to Node.js path
  }
  const { createHash } = await import("crypto");
  const hash = createHash("sha256").update(payload).digest();
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Base64url encode/decode ──

export function base64urlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const base64 = typeof btoa === "function" ? btoa(binary) : Buffer.from(bytes).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64urlDecode(str: string): string {
  let padded = str.replace(/-/g, "+").replace(/_/g, "/");
  while (padded.length % 4) {
    padded += "=";
  }
  const binary = typeof atob === "function" ? atob(padded) : Buffer.from(padded, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// ── Encode ──

export async function encodeSharePayload(ctx: RecipeBatchContextV1): Promise<EncodeResult> {
  const json = JSON.stringify(ctx);
  const checksum = await computeChecksum(json);
  const payload = base64urlEncode(json);
  const exceedsLimit = payload.length > MAX_SHARE_URL_LENGTH;

  if (exceedsLimit) {
    return {
      mode: "download",
      payload,
      checksum,
      exceedsLimit: true,
      downloadFilename: "context.soapcraft.json",
    };
  }

  const url = `/share?ctx=${payload}&ck=${checksum}&v=${CONTEXT_SCHEMA_VERSION}`;
  return {
    mode: "share-url",
    url,
    payload,
    checksum,
    exceedsLimit: false,
  };
}

// ── Decode ──

export async function decodeSharePayload(
  payload: string,
  checksum: string,
  version: number
): Promise<DecodeResult> {
  const errors: string[] = [];

  // Validate version
  if (version !== CONTEXT_SCHEMA_VERSION) {
    errors.push(`Unsupported context version: ${version}`);
    return { valid: false, errors };
  }

  // Validate payload size
  if (payload.length > MAX_SHARE_URL_LENGTH * 2) {
    errors.push("Payload exceeds maximum size");
    return { valid: false, errors };
  }

  // Decode
  let json: string;
  try {
    json = base64urlDecode(payload);
  } catch {
    errors.push("Failed to decode base64url payload");
    return { valid: false, errors };
  }

  // Validate checksum
  const computedChecksum = await computeChecksum(json);
  if (computedChecksum !== checksum) {
    errors.push("Checksum mismatch: payload may be corrupt");
    return { valid: false, errors };
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    errors.push("Invalid JSON in payload");
    return { valid: false, errors };
  }

  // Validate shape
  const shapeValidation = validateContextShape(parsed);
  if (!shapeValidation.valid) {
    errors.push(...shapeValidation.errors);
    return { valid: false, errors };
  }

  return { valid: true, context: parsed as RecipeBatchContextV1, errors: [] };
}

// ── Corrupt payload detection ──

export async function detectCorruptPayload(
  payload: string,
  checksum: string,
  version: number = CONTEXT_SCHEMA_VERSION,
): Promise<boolean> {
  try {
    const result = await decodeSharePayload(payload, checksum, version);
    return !result.valid;
  } catch {
    return true;
  }
}
