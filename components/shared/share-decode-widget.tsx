// ── SLICE-002: Share Decode Component ──
// Handles decoding and validating shared context payloads.
// Corrupt/incompatible state produces an informative empty state.

"use client";

import { useState, useCallback } from "react";
import { decodeSharePayload, type DecodeResult } from "@/lib/share/encode-decode";
import { CONTEXT_SCHEMA_VERSION } from "@/lib/schemas/context-schema";
import { FieldError } from "./field-error";

interface ShareDecodeResult {
  success: boolean;
  context?: unknown;
  errors: string[];
}

export function ShareDecodeWidget() {
  const [payload, setPayload] = useState("");
  const [checksum, setChecksum] = useState("");
  const [version, setVersion] = useState(CONTEXT_SCHEMA_VERSION.toString());
  const [result, setResult] = useState<ShareDecodeResult | null>(null);

  const handleDecode = useCallback(async () => {
    if (!payload || !checksum) {
      setResult({ success: false, errors: ["Payload and checksum are required"] });
      return;
    }
    const decodeResult: DecodeResult = await decodeSharePayload(payload, checksum, parseInt(version, 10));
    setResult({
      success: decodeResult.valid,
      context: decodeResult.context,
      errors: decodeResult.errors,
    });
  }, [payload, checksum, version]);

  return (
    <div className="share-decode-widget" data-testid="share-decode-widget">
      <h3>Import Shared Context</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Payload (base64url)</label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full px-3 py-2 bg-sheet border border-rule rounded-md text-foreground text-sm focus:outline-none focus:border-action"
            rows={4}
            placeholder="Paste base64url-encoded context payload"
            data-testid="share-payload-input"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">SHA-256 Checksum</label>
          <input
            type="text"
            value={checksum}
            onChange={(e) => setChecksum(e.target.value)}
            className="w-full px-3 py-2 bg-sheet border border-rule rounded-md text-foreground text-sm focus:outline-none focus:border-action"
            placeholder="SHA-256 checksum"
            data-testid="share-checksum-input"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Schema Version</label>
          <input
            type="number"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-20 px-3 py-2 bg-sheet border border-rule rounded-md text-foreground text-sm focus:outline-none focus:border-action"
            data-testid="share-version-input"
          />
        </div>
        <button
          type="button"
          onClick={handleDecode}
          className="px-4 py-2 bg-action text-action-text rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
          data-testid="btn-decode-share"
        >
          Decode and Validate
        </button>
        {result && (
          <div data-testid="share-decode-result">
            {result.success ? (
              <div className="text-success text-sm">Context decoded successfully</div>
            ) : (
              <div>
                {result.errors.map((err, i) => (
                  <FieldError key={i} message={err} />
                ))}
                <p className="text-sm text-muted-foreground mt-2">
                  Corrupt or incompatible context failed safely. No data was executed.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
