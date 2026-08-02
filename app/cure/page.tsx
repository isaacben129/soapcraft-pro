import { CureTracker } from "@/components/cure-tracker/cure-tracker";

export default function CurePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CureTracker
        batchId="demo-batch"
        batchName="Demo Batch"
        observations={[]}
      />
    </div>
  );
}