// ── SaveIndicator ────────────────────────────────

"use client";

import { useEffect, useState } from "react";

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
    idle: { text: "", icon: "" },
    saving: { text: "Saving...", icon: "⟳" },
    saved: { text: lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Saved", icon: "✓" },
    error: { text: "Save failed", icon: "✕" },
  };

  if (!visible) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${
        state === "error" ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      <span
        className={`inline-block ${state === "saving" ? "animate-spin" : ""}`}
      >
        {config[state].icon}
      </span>
      {config[state].text}
    </span>
  );
}
