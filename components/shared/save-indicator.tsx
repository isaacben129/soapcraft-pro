// ── SaveIndicator ────────────────────────────────

"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, XCircle } from "lucide-react";

type SaveState = "idle" | "saving" | "saved" | "error";

interface SaveIndicatorProps {
  state: SaveState;
  lastSaved?: Date;
}

export function SaveIndicator({ state, lastSaved }: SaveIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state === "saving") {
      setVisible(true);
    } else if (state === "saved") {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    } else if (state === "error") {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [state]);

  const config = {
    idle: { text: "", icon: null },
    saving: { text: "Saving...", icon: Loader2 },
    saved: { text: lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Saved", icon: Check },
    error: { text: "Save failed", icon: XCircle },
  };

  if (!visible) return null;

  const Icon = config[state].icon;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${
        state === "error" ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      {Icon && (
        <span className={`inline-block ${state === "saving" ? "animate-spin" : ""}`}>
          <Icon className="h-3 w-3" />
        </span>
      )}
      {config[state].text}
    </span>
  );
}