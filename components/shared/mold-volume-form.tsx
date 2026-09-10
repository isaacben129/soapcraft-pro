// ── Mold Volume Form ────────────────
// Interactive client-side calculator. No auth required.

"use client";

import { useState } from "react";
import { Calculator, AlertTriangle } from "lucide-react";
import { EmailCaptureModal } from "@/components/shared/email-capture-modal";

export function MoldVolumeForm() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [shape, setShape] = useState("rectangle");
  const [result, setResult] = useState<{
    volume: number;
    estimatedWeight: number;
    barCount: number;
    recommendedWeight: number;
  } | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
      setResult(null);
      return;
    }

    const volume = shape === "rectangle" ? l * w * h : (Math.PI * Math.pow(w / 2, 2) * h);
    const estimatedWeight = volume * 0.9; // ~90% fill factor for soap
    const barCount = Math.max(1, Math.round(estimatedWeight / 100)); // ~100g per bar
    const recommendedWeight = estimatedWeight * 0.95; // 5% shrinkage margin

    setResult({
      volume: Math.round(volume * 100) / 100,
      estimatedWeight: Math.round(estimatedWeight * 100) / 100,
      barCount,
      recommendedWeight: Math.round(recommendedWeight * 100) / 100,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Shape</label>
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground"
          >
            <option value="rectangle">Rectangle</option>
            <option value="cylinder">Cylinder</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Length (cm)</label>
          <input
            type="number"
            placeholder="e.g. 25"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Width (cm)</label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Height (cm)</label>
          <input
            type="number"
            placeholder="e.g. 7"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="px-6 py-2 bg-action text-action-text rounded-md font-medium hover:bg-action-hover transition-colors text-sm flex items-center gap-2"
      >
        <Calculator className="h-4 w-4" />
        Calculate Mold Volume
      </button>

      {result && (
        <div className="border border-rule rounded-lg p-6 bg-sheet space-y-4">
          <h3 className="font-display font-semibold text-foreground">
            Mold Volume Results
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Volume:</span>
              <span className="font-mono text-foreground ml-2">{result.volume.toFixed(1)} cm³</span>
            </div>
            <div>
              <span className="text-muted-foreground">Estimated Weight:</span>
              <span className="font-mono text-foreground ml-2">{result.estimatedWeight}g</span>
            </div>
            <div>
              <span className="text-muted-foreground">Estimated Bars (100g):</span>
              <span className="font-mono text-foreground ml-2">{result.barCount}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Recommended Batch:</span>
              <span className="font-mono text-foreground ml-2">{result.recommendedWeight}g</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Weight estimate assumes ~0.9 g/cm³ soap density and a 95% fill factor to account for shrinkage. Actual weight may vary with formula.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEmailCapture(true)}
              className="px-4 py-2 border border-rule rounded-md text-sm font-medium text-ink hover:bg-ledger transition-colors"
            >
              Save as Worksheet
            </button>
          </div>
        </div>
      )}

      {showEmailCapture && <EmailCaptureModal isOpen={showEmailCapture} onClose={() => setShowEmailCapture(false)} />}
    </div>
  );
}
