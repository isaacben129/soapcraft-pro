// ── Wholesale Pricing Form ──────────
// Interactive client-side calculator. No auth required.

"use client";

import { useState } from "react";
import { Calculator, AlertTriangle } from "lucide-react";
import { EmailCaptureModal } from "@/components/shared/email-capture-modal";

export function WholesalePricingForm() {
  const [costPerBar, setCostPerBar] = useState("");
  const [batchExpenses, setBatchExpenses] = useState("");
  const [barsPerBatch, setBarsPerBatch] = useState("");
  const [wholesaleMargin, setWholesaleMargin] = useState("30");
  const [retailMargin, setRetailMargin] = useState("40");
  const [caseSize, setCaseSize] = useState("12");
  const [result, setResult] = useState<{
    totalCostPerBar: number;
    wholesalePricePerBar: number;
    wholesalePricePerCase: number;
    retailPricePerBar: number;
    suggestedCasePrice: number;
    wholesaleMarginPercent: number;
    recommendedCasePrice: number;
  } | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const calculate = () => {
    const cost = parseFloat(costPerBar);
    const batchExp = parseFloat(batchExpenses) || 0;
    const bars = parseFloat(barsPerBatch) || 0;
    const wholesaleMarginPercent = parseFloat(wholesaleMargin) || 0;
    const retailMarginPercent = parseFloat(retailMargin) || 0;
    const caseSizeNum = parseInt(caseSize) || 12;

    if (isNaN(cost) || cost <= 0 || bars <= 0) {
      setResult(null);
      return;
    }

    const totalCostPerBar = cost + (batchExp / bars);
    const wholesalePricePerBar = totalCostPerBar / (1 - wholesaleMarginPercent / 100);
    const wholesalePricePerCase = wholesalePricePerBar * caseSizeNum;
    const retailPricePerBar = totalCostPerBar / (1 - retailMarginPercent / 100);
    const suggestedCasePrice = retailPricePerBar * caseSizeNum;
    const recommendedCasePrice = wholesalePricePerCase * 1.15; // 15% buffer for wholesale

    setResult({
      totalCostPerBar: Math.round(totalCostPerBar * 100) / 100,
      wholesalePricePerBar: Math.round(wholesalePricePerBar * 100) / 100,
      wholesalePricePerCase: Math.round(wholesalePricePerCase * 100) / 100,
      retailPricePerBar: Math.round(retailPricePerBar * 100) / 100,
      suggestedCasePrice: Math.round(suggestedCasePrice * 100) / 100,
      wholesaleMarginPercent: Math.round(wholesaleMarginPercent * 100) / 100,
      recommendedCasePrice: Math.round(recommendedCasePrice * 100) / 100,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Cost Per Bar ($)</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 1.50"
            value={costPerBar}
            onChange={(e) => setCostPerBar(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Batch Expenses ($)</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 25.00"
            value={batchExpenses}
            onChange={(e) => setBatchExpenses(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Bars Per Batch</label>
          <input
            type="number"
            placeholder="e.g. 20"
            value={barsPerBatch}
            onChange={(e) => setBarsPerBatch(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Case Size (bars)</label>
          <input
            type="number"
            placeholder="e.g. 12"
            value={caseSize}
            onChange={(e) => setCaseSize(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Wholesale Target Margin (%)</label>
          <input
            type="number"
            placeholder="e.g. 30"
            value={wholesaleMargin}
            onChange={(e) => setWholesaleMargin(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Retail Target Margin (%)</label>
          <input
            type="number"
            placeholder="e.g. 40"
            value={retailMargin}
            onChange={(e) => setRetailMargin(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="px-6 py-2 bg-action text-action-text rounded-md font-medium hover:bg-action-hover transition-colors text-sm flex items-center gap-2"
      >
        <Calculator className="h-4 w-4" />
        Calculate Wholesale Prices
      </button>

      {result && (
        <div className="border border-rule rounded-lg p-6 bg-sheet space-y-4">
          <h3 className="font-display font-semibold text-foreground">
            Wholesale Pricing Results
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Cost/Bar:</span>
              <span className="font-mono text-foreground ml-2">${result.totalCostPerBar.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Wholesale Price/Bar:</span>
              <span className="font-mono text-foreground ml-2">${result.wholesalePricePerBar.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Wholesale Price/Case:</span>
              <span className="font-mono text-foreground ml-2">${result.wholesalePricePerCase.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Retail Price/Bar:</span>
              <span className="font-mono text-foreground ml-2">${result.retailPricePerBar.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Suggested Case Price:</span>
              <span className="font-mono text-action font-semibold ml-2">${result.recommendedCasePrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Your Wholesale Margin:</span>
              <span className="font-mono text-success ml-2">{result.wholesaleMarginPercent}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-cream/50 rounded-md text-sm">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
            <span className="text-ink-muted">
              Recommended wholesale case price (${result.recommendedCasePrice.toFixed(2)}) includes a 15% buffer above bare-bones wholesale pricing.
            </span>
          </div>
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
