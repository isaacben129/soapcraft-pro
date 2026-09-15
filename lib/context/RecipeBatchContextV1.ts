// ── SLICE-002: RecipeBatchContextV1 Manager ──
// Manages context lifecycle: create, save, load, reset, export, share.
// Wire the existing /tools/batch-cost journey through the real interface.

import {
  CONTEXT_SCHEMA_VERSION,
  CONTEXT_NAMESPACE_PREFIX,
  type RecipeBatchContextV1,
  type SourceTool,
  validateContextShape,
  createContextId,
  nowISO,
} from "@/lib/schemas/context-schema";
import { LocalContextStorage, type SaveState } from "@/lib/storage/context-storage";
import { encodeSharePayload, decodeSharePayload, type EncodeResult, type DecodeResult } from "@/lib/share/encode-decode";
import { createContextExport, type ContextExport } from "@/lib/export/context-export";

// ── Context Manager ──

export class RecipeBatchContextManager {
  private storage: LocalContextStorage;
  private activeContext: RecipeBatchContextV1 | null = null;
  private saveState: SaveState = "memory-only";
  private listeners: Set<(state: ManagerState) => void> = new Set();

  constructor(storage?: LocalContextStorage) {
    this.storage = storage ?? new LocalContextStorage();
  }

  getSaveState(): SaveState {
    return this.saveState;
  }

  getActiveContext(): RecipeBatchContextV1 | null {
    return this.activeContext;
  }

  subscribe(listener: (state: ManagerState) => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notify(state: ManagerState): void {
    for (const listener of this.listeners) {
      listener(state);
    }
  }

  // Create a new context for a tool
  createContext(sourceTool: SourceTool, units: RecipeBatchContextV1["units"]): RecipeBatchContextV1 {
    const contextId = createContextId();
    const now = nowISO();
    const ctx: RecipeBatchContextV1 = {
      schemaVersion: CONTEXT_SCHEMA_VERSION,
      contextId,
      sourceTool,
      createdAt: now,
      updatedAt: now,
      units,
      revisions: {},
    };
    this.activeContext = ctx;
    this.saveState = "memory-only";
    this.notify({ type: "created", context: ctx });
    return ctx;
  }

  // Load a context by ID
  loadContext(contextId: string): boolean {
    const ctx = this.storage.load(contextId);
    if (!ctx) {
      this.activeContext = null;
      this.saveState = "memory-only";
      this.notify({ type: "load-failed" });
      return false;
    }
    this.activeContext = ctx;
    this.saveState = "locally-saved";
    this.notify({ type: "loaded", context: ctx });
    return true;
  }

  // Save the active context
  async saveContext(): Promise<{ state: SaveState; error?: string }> {
    if (!this.activeContext) {
      return { state: "memory-only" };
    }
    this.saveState = "saving";
    this.notify({ type: "saving" });

    const result = this.storage.save(this.activeContext);
    this.saveState = result.state;
    this.notify({ type: "saved", state: result.state, error: result.error });
    return { state: result.state, error: result.error };
  }

  // Reset the active context (requires confirmation per contract)
  resetContext(): void {
    if (this.activeContext) {
      this.storage.remove(this.activeContext.contextId);
      this.activeContext = null;
      this.saveState = "memory-only";
      this.notify({ type: "reset" });
    }
  }

  // Export context as JSON
  async exportContext(): Promise<ContextExport | null> {
    if (!this.activeContext) return null;
    const encoded = await encodeSharePayload(this.activeContext);
    const digest = `sha256-${encoded.checksum}`;
    return createContextExport(this.activeContext, digest);
  }

  // Encode context for sharing
  async shareContext(): Promise<EncodeResult> {
    if (!this.activeContext) {
      throw new Error("No active context to share");
    }
    return encodeSharePayload(this.activeContext);
  }

  // Decode and load from share payload
  async loadFromShare(payload: string, checksum: string, version: number): Promise<DecodeResult> {
    const result = await decodeSharePayload(payload, checksum, version);
    if (result.valid && result.context) {
      this.activeContext = result.context;
      this.saveState = "locally-saved";
      this.notify({ type: "loaded-from-share", context: result.context });
    }
    return result;
  }

  // Update a section of the context
  updateSection<K extends keyof RecipeBatchContextV1>(
    section: K,
    value: RecipeBatchContextV1[K]
  ): void {
    if (!this.activeContext) return;
    this.activeContext = {
      ...this.activeContext,
      [section]: value,
      updatedAt: nowISO(),
    };
    this.notify({ type: "updated", context: this.activeContext });
  }
}

export interface ManagerState {
  type: "created" | "loaded" | "saved" | "reset" | "saving" | "load-failed" | "loaded-from-share" | "updated";
  context?: RecipeBatchContextV1;
  state?: SaveState;
  error?: string;
}
