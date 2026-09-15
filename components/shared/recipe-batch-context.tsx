"use client";

// ── SLICE-002: Context Manager Component ──
// React component for managing context lifecycle in the batch-cost tool.
// Provides save, reset, share, and export functionality.

import { useState, useCallback, useEffect, useRef } from "react";
import {
  RecipeBatchContextManager,
  type ManagerState,
} from "@/lib/context/RecipeBatchContextV1";
import {
  type RecipeBatchContextV1,
  type SourceTool,
} from "@/lib/schemas/context-schema";
import { SaveIndicator } from "./save-indicator";

interface ContextManagerProps {
  sourceTool: SourceTool;
  units: RecipeBatchContextV1["units"];
  onContextChange?: (ctx: RecipeBatchContextV1 | null) => void;
  onManagerReady?: (manager: RecipeBatchContextManager) => void;
}

export function RecipeBatchContextManagerComponent({
  sourceTool,
  units,
  onContextChange,
  onManagerReady,
}: ContextManagerProps) {
  const managerRef = useRef<RecipeBatchContextManager | null>(null);
  const [saveState, setSaveState] = useState<string>("memory-only");
  const [contextId, setContextId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    managerRef.current = new RecipeBatchContextManager();
    onManagerReady?.(managerRef.current);
    const ctx = managerRef.current.createContext(sourceTool, units);
    setContextId(ctx.contextId);
    onContextChange?.(ctx);

    const unsub = managerRef.current.subscribe((state: ManagerState) => {
      setSaveState(state.state ?? managerRef.current?.getSaveState() ?? "memory-only");
      if (state.context) {
        onContextChange?.(state.context);
      }
    });
    return unsub;
  }, [sourceTool, units.mass, units.dimensions, onContextChange, onManagerReady]);

  const handleSave = useCallback(async () => {
    if (!managerRef.current) return;
    const result = await managerRef.current.saveContext();
    setSaveState(result.state);
    setFeedback(result.state === "locally-saved" ? "Saved on this device" : result.state === "save-failed" ? "Save failed" : "Saving…");
  }, []);

  const handleReset = useCallback(() => {
    if (!confirm("Are you sure you want to reset this context? All unsaved data will be lost.")) {
      return;
    }
    managerRef.current?.resetContext();
    setSaveState("memory-only");
    setContextId(null);
    setFeedback("Context reset");
    onContextChange?.(null);
  }, [onContextChange]);

  const handleExport = useCallback(async () => {
    const exportObj = await managerRef.current?.exportContext();
    if (!exportObj) return;
    // Trigger download via the export module
    const json = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `context-${exportObj.context.contextId}.soapcraft.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedback("JSON downloaded");
  }, []);

  const handleShare = useCallback(async () => {
    try {
      const result = await managerRef.current?.shareContext();
      if (!result) return;
      if (result.exceedsLimit) {
        // Trigger download of .soapcraft.json file
        const json = JSON.stringify(managerRef.current?.getActiveContext(), null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "context.soapcraft.json";
        a.click();
        URL.revokeObjectURL(url);
        setFeedback("Context too large for a link. JSON downloaded");
      } else {
        // Copy share URL to clipboard
        if (result.url && navigator.clipboard) {
          await navigator.clipboard.writeText(result.url);
          setFeedback("Share link copied");
        } else {
          setFeedback("Share link ready");
        }
      }
    } catch (err) {
      console.error("Share failed:", err);
      setFeedback("Share failed. Try again");
    }
  }, []);

  return (
    <div className="context-manager" data-testid="context-manager">
      <div className="flex items-center gap-3">
        <SaveIndicator state={saveState as any} />
        {feedback && <span className="text-xs text-muted-foreground" role="status">{feedback}</span>}
        {contextId && (
          <span className="text-xs text-muted-foreground" data-testid="context-id">
            Context: {contextId.slice(0, 8)}…
          </span>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={handleSave}
          className="px-3 py-1.5 text-sm bg-card border border-rule rounded-md hover:bg-ledger transition-colors"
          data-testid="btn-save-context"
        >
          Save Context
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="px-3 py-1.5 text-sm bg-card border border-rule rounded-md hover:bg-ledger transition-colors"
          data-testid="btn-export-context"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="px-3 py-1.5 text-sm bg-card border border-rule rounded-md hover:bg-ledger transition-colors"
          data-testid="btn-share-context"
        >
          Share
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1.5 text-sm border border-destructive/30 text-destructive rounded-md hover:bg-destructive/10 transition-colors"
          data-testid="btn-reset-context"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
