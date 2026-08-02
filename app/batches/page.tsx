import { BatchLog } from "@/components/batch-log/batch-log";

export default function BatchesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Batches</h1>
      <BatchLog />
    </div>
  );
}