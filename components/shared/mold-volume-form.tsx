"use client";

import { useState } from "react";
import { AlertTriangle, Calculator } from "lucide-react";
import { estimateMoldCapacity } from "@/lib/calculations/sizing";

type Shape = "rectangle" | "cylinder";
type Unit = "cm" | "in";
type Result = ReturnType<typeof estimateMoldCapacity>;

function fieldLabel(shape: Shape, field: "length" | "width" | "height", unit: Unit) {
  if (shape === "cylinder" && field === "width") return `Diameter (${unit})`;
  if (shape === "cylinder" && field === "length") return `Diameter (${unit})`;
  return `${field.charAt(0).toUpperCase()}${field.slice(1)} (${unit})`;
}

export function MoldVolumeForm() {
  const [shape, setShape] = useState<Shape>("rectangle");
  const [unit, setUnit] = useState<Unit>("cm");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [fillPercent, setFillPercent] = useState("95");
  const [density, setDensity] = useState("0.9");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    const parsedLength = Number(length);
    const parsedWidth = Number(width);
    const parsedHeight = Number(height);
    const parsedDensity = Number(density);
    const parsedFill = Number(fillPercent);
    try {
      const calculated = estimateMoldCapacity({
        shape,
        length: shape === "cylinder" ? parsedWidth : parsedLength,
        width: parsedWidth,
        height: parsedHeight,
        unit,
        density: parsedDensity,
        fillPercent: parsedFill,
      });
      setResult(calculated);
      setError(null);
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : "Check the mold inputs and try again.");
    }
  };

  const dimensionFields = shape === "rectangle"
    ? [
        { id: "length", value: length, setValue: setLength },
        { id: "width", value: width, setValue: setWidth },
        { id: "height", value: height, setValue: setHeight },
      ]
    : [
        { id: "width", value: width, setValue: setWidth },
        { id: "height", value: height, setValue: setHeight },
      ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
      <section className="space-y-5" aria-labelledby="mold-inputs-heading">
        <div>
          <h2 id="mold-inputs-heading" className="font-display text-xl font-semibold text-foreground">Mold inputs</h2>
          <p className="mt-1 text-sm text-muted-foreground">Use inside dimensions. The mass result is an estimate, not a formulation or safety claim.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-ink">
            Shape
            <select value={shape} onChange={(event) => { setShape(event.target.value as Shape); setResult(null); }} className="mt-1 w-full rounded-md border border-rule bg-sheet px-3 py-2.5 text-foreground">
              <option value="rectangle">Rectangular mold</option>
              <option value="cylinder">Round / cylinder mold</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-ink">
            Dimension unit
            <select value={unit} onChange={(event) => { setUnit(event.target.value as Unit); setResult(null); }} className="mt-1 w-full rounded-md border border-rule bg-sheet px-3 py-2.5 text-foreground">
              <option value="cm">Centimetres (cm)</option>
              <option value="in">Inches (in)</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {dimensionFields.map(({ id, value, setValue }) => (
            <label key={id} className="block text-sm font-medium text-ink">
              {fieldLabel(shape, id as "length" | "width" | "height", unit)}
              <input aria-label={fieldLabel(shape, id as "length" | "width" | "height", unit)} type="number" min="0" step="any" inputMode="decimal" value={value} onChange={(event) => { setValue(event.target.value); setResult(null); }} className="mt-1 w-full rounded-md border border-rule bg-sheet px-3 py-2.5 text-foreground" />
            </label>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-ink">
            Fill percentage
            <input aria-describedby="fill-help" type="number" min="1" max="100" step="1" inputMode="decimal" value={fillPercent} onChange={(event) => { setFillPercent(event.target.value); setResult(null); }} className="mt-1 w-full rounded-md border border-rule bg-sheet px-3 py-2.5 text-foreground" />
            <span id="fill-help" className="mt-1 block text-xs font-normal text-muted-foreground">Leave headspace by using less than 100%.</span>
          </label>
          <label className="block text-sm font-medium text-ink">
            Fresh-batter density (g/cm³)
            <input aria-describedby="density-help" type="number" min="0.01" step="0.01" inputMode="decimal" value={density} onChange={(event) => { setDensity(event.target.value); setResult(null); }} className="mt-1 w-full rounded-md border border-rule bg-sheet px-3 py-2.5 text-foreground" />
            <span id="density-help" className="mt-1 block text-xs font-normal text-muted-foreground">0.90 is a planning assumption. Calibrate against your own filled mold for precision.</span>
          </label>
        </div>

        {error && <p role="alert" className="flex gap-2 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
        <button type="button" onClick={calculate} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-action px-5 py-2.5 text-sm font-medium text-action-text transition-colors hover:bg-action-hover">
          <Calculator className="h-4 w-4" />Calculate mold capacity
        </button>
      </section>

      <section aria-live="polite" className="h-fit rounded-md border border-rule bg-sheet p-5">
        <h2 className="font-display text-xl font-semibold text-foreground">Capacity result</h2>
        <p className="mt-1 text-sm text-muted-foreground">Volume first, then your stated fill and density assumptions.</p>
        {result ? (
          <dl className="mt-5 space-y-4 text-sm">
            <div className="border-b border-rule pb-3"><dt className="text-muted-foreground">Mold volume</dt><dd className="mt-1 font-mono text-lg text-foreground">{result.volumeCm3.toFixed(1)} cm³</dd></div>
            <div className="border-b border-rule pb-3"><dt className="text-muted-foreground">Target fill volume</dt><dd className="mt-1 font-mono text-lg text-foreground">{result.targetFillVolumeCm3.toFixed(1)} cm³</dd></div>
            <div><dt className="text-muted-foreground">Estimated fresh batter</dt><dd className="mt-1 font-mono text-lg text-foreground">{result.freshBatterMassG.toFixed(1)} g</dd><p className="mt-1 text-xs text-muted-foreground">Based on {fillPercent}% fill and {density} g/cm³. A recommended oil weight requires a formulation context and is intentionally not invented here.</p></div>
          </dl>
        ) : (
          <dl className="mt-5 space-y-4 text-sm text-muted-foreground">
            <div className="border-b border-rule pb-3"><dt>Mold volume</dt><dd className="mt-1 font-mono">Calculated from inside dimensions</dd></div>
            <div className="border-b border-rule pb-3"><dt>Target fill volume</dt><dd className="mt-1 font-mono">Your headspace assumption applied</dd></div>
            <div><dt>Estimated fresh batter</dt><dd className="mt-1 font-mono">Your density assumption applied</dd></div>
          </dl>
        )}
      </section>
    </div>
  );
}
