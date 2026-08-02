import { Costing } from "@/components/costing/costing";

export default function CostingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Costing
        batchName="Demo Batch"
        costData={{
          ingredientCosts: [],
          fragranceCost: 0,
          otherCosts: 0,
          totalCost: 0,
          batchYieldBars: 0,
          costPerBar: 0,
          targetPricePerBar: 0,
          marginPercent: 0,
        }}
      />
    </div>
  );
}