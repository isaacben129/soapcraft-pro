// ── Cost Portfolio ────────────────────────
// R6.3: Dashboard view of all batch costs, comparison, incomplete queue.

import Link from "next/link";

// Mock data — in production this comes from the API
const batchCosts = [
  {
    id: "1",
    batchName: "Olive & Coconut — Batch 1",
    recipeName: "Simple Castile",
    version: 1,
    totalCost: 12.5,
    costPerBar: 1.25,
    targetPricePerBar: 15.0,
    marginPercent: 91.7,
    status: "complete",
    date: "2026-07-20",
  },
  {
    id: "2",
    batchName: "Shea Butter Blend — Batch 3",
    recipeName: "Luxury Shea",
    version: 2,
    totalCost: 18.75,
    costPerBar: 1.88,
    targetPricePerBar: 20.0,
    marginPercent: 90.6,
    status: "complete",
    date: "2026-07-18",
  },
  {
    id: "3",
    batchName: "Coconut & Palm — Batch 1",
    recipeName: "Hard Bar",
    version: 1,
    totalCost: 0,
    costPerBar: 0,
    targetPricePerBar: 12.0,
    marginPercent: 0,
    status: "incomplete",
    date: "2026-07-22",
  },
];

export default function CostPortfolioPage() {
  const incomplete = batchCosts.filter((b) => b.status === "incomplete");
  const complete = batchCosts.filter((b) => b.status === "complete");

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <ObjectHeader
            title="Cost Portfolio"
            breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Cost Portfolio" }]}
          />

          {/* Incomplete queue */}
          {incomplete.length > 0 && (
            <section className="mt-8" aria-label="Incomplete batches">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Incomplete Cost Data
              </h2>
              <div className="space-y-3">
                {incomplete.map((batch) => (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-warning/30 bg-warning/5"
                  >
                    <div>
                      <span className="font-medium text-foreground">
                        {batch.batchName}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        v{batch.version} — {batch.recipeName}
                      </span>
                    </div>
                    <Link
                      href={`/batches/${batch.id}/cost`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Add costs →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Complete batches */}
          <section className="mt-8" aria-label="Completed batch costs">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Completed Batches
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">
                      Batch
                    </th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">
                      Recipe
                    </th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">
                      Total Cost
                    </th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">
                      Cost/Bar
                    </th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">
                      Target
                    </th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">
                      Margin
                    </th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complete.map((batch) => (
                    <tr key={batch.id} className="border-b border-border">
                      <td className="py-2 px-3">
                        <Link
                          href={`/batches/${batch.id}`}
                          className="font-medium text-foreground hover:underline"
                        >
                          {batch.batchName}
                        </Link>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {batch.recipeName}
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums text-foreground">
                        ${batch.totalCost.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums text-foreground">
                        ${batch.costPerBar.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">
                        ${batch.targetPricePerBar.toFixed(2)}
                      </td>
                      <td
                        className={`py-2 px-3 text-right tabular-nums font-medium ${
                          batch.marginPercent >= 50
                            ? "text-green-600"
                            : batch.marginPercent >= 30
                            ? "text-yellow-600"
                            : "text-destructive"
                        }`}
                      >
                        {batch.marginPercent.toFixed(1)}%
                      </td>
                      <td className="py-2 px-3 text-right">
                        <StatusLabel status="active" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Comparison view */}
          {complete.length >= 2 && (
            <section className="mt-8" aria-label="Cost comparison">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Cost Comparison
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complete.map((batch) => (
                  <div
                    key={batch.id}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <h3 className="font-semibold text-foreground mb-2">
                      {batch.batchName}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost/Bar</span>
                        <span className="font-medium tabular-nums">
                          ${batch.costPerBar.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Margin</span>
                        <span
                          className={`font-medium tabular-nums ${
                            batch.marginPercent >= 50
                              ? "text-green-600"
                              : batch.marginPercent >= 30
                              ? "text-yellow-600"
                              : "text-destructive"
                          }`}
                        >
                          {batch.marginPercent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-medium">v{batch.version}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {batchCosts.length === 0 && (
            <EmptyState
              title="No batch costs yet"
              description="Start a batch from a recipe to track your costs here."
              action={
                <Link
                  href="/batches/new"
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Start a Batch
                </Link>
              }
            />
          )}
        </div>
      </div>
    </main>
  );
}

// ── Re-export shared components used above ──
import { ObjectHeader } from "@/components/shared/object-header";
import { StatusLabel } from "@/components/shared/status-label";
import { EmptyState } from "@/components/shared/empty-state";