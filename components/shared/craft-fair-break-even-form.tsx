// ── Craft Fair Break-Even Form ──────────
// Interactive client-side calculator. No auth required.

"use client";

import { useState } from "react";
import { Calculator, AlertTriangle } from "lucide-react";
import { EmailCaptureModal } from "@/components/shared/email-capture-modal";

interface ExpenseRow {
  name: string;
  amount: string;
}

export function CraftFairBreakEvenForm() {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([
    { name: "Booth Fee", amount: "" },
    { name: "Travel", amount: "" },
  ]);
  const [pricePerBar, setPricePerBar] = useState("");
  const [itemsSold, setItemsSold] = useState("");
  const [result, setResult] = useState<{
    totalExpenses: number;
    breakEvenBars: number;
    revenue: number;
    profit: number;
    profitMargin: number;
    netProfit: number;
  } | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const addExpense = () => {
    setExpenses([...expenses, { name: "", amount: "" }]);
  };

  const removeExpense = (index: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, i) => i !== index));
    }
  };

  const updateExpense = (index: number, field: keyof ExpenseRow, value: string) => {
    const updated = [...expenses];
    updated[index] = { ...updated[index], [field]: value };
    setExpenses(updated);
  };

  const calculate = () => {
    const expValues = expenses
      .map((e) => parseFloat(e.amount))
      .filter((v) => !isNaN(v) && v > 0);
    const totalExpenses = expValues.reduce((a, b) => a + b, 0);
    const price = parseFloat(pricePerBar);
    const sold = parseFloat(itemsSold);

    if (totalExpenses <= 0 || isNaN(price) || price <= 0) {
      setResult(null);
      return;
    }

    const breakEvenBars = Math.ceil(totalExpenses / price);
    const revenue = sold ? sold * price : 0;
    const netProfit = revenue - totalExpenses;
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    setResult({
      totalExpenses,
      breakEvenBars,
      revenue,
      profit: revenue - totalExpenses,
      profitMargin: Math.round(profitMargin * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-ink mb-1">Expenses</label>
        {expenses.map((expense, index) => (
          <div key={index} className="flex gap-2 items-start">
            <input
              type="text"
              placeholder="Expense name"
              value={expense.name}
              onChange={(e) => updateExpense(index, "name", e.target.value)}
              className="flex-1 px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
            />
            <input
              type="number"
              placeholder="Amount"
              value={expense.amount}
              onChange={(e) => updateExpense(index, "amount", e.target.value)}
              className="w-32 px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={() => removeExpense(index)}
              className="px-2 py-2 text-muted-foreground hover:text-danger transition-colors"
            >
              <Calculator className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addExpense}
        className="flex items-center gap-1 text-sm text-action hover:text-action-hover transition-colors"
      >
        <Calculator className="h-4 w-4" />
        Add expense
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Price Per Bar ($)</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 8.00"
            value={pricePerBar}
            onChange={(e) => setPricePerBar(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Items Sold (estimated)</label>
          <input
            type="number"
            placeholder="e.g. 50"
            value={itemsSold}
            onChange={(e) => setItemsSold(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="px-6 py-2 bg-action text-action-text rounded-md font-medium hover:bg-action-hover transition-colors text-sm flex items-center gap-2"
      >
        <Calculator className="h-4 w-4" />
        Calculate Break-Even
      </button>

      {result && (
        <div className="border border-rule rounded-lg p-6 bg-sheet space-y-4">
          <h3 className="font-display font-semibold text-foreground">
            Break-Even Results
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Expenses:</span>
              <span className="font-mono text-foreground ml-2">${result.totalExpenses.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Break-Even Bars:</span>
              <span className="font-mono text-foreground ml-2">{result.breakEvenBars} bars</span>
            </div>
            <div>
              <span className="text-muted-foreground">Estimated Revenue:</span>
              <span className="font-mono text-foreground ml-2">${result.revenue.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Net Profit:</span>
              <span className={`font-mono ${result.netProfit >= 0 ? "text-success" : "text-danger"} ml-2`}>
                ${result.netProfit.toFixed(2)}
              </span>
            </div>
          </div>
          {result.breakEvenBars > 0 && (
            <div className="flex items-center gap-2 p-3 bg-cream/50 rounded-md text-sm">
              <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
              <span className="text-ink-muted">
                You need to sell at least <strong>{result.breakEvenBars} bars</strong> to cover your costs.
              </span>
            </div>
          )}
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
