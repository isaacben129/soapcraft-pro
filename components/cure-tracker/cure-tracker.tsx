"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CureObservation {
  id: string;
  batchId: string;
  day: number;
  pH: number | null;
  hardness: string | null;
  notes: string | null;
  createdAt: Date;
}

interface CureTrackerProps {
  batchId: string;
  batchName: string;
  observations: CureObservation[];
}

export function CureTracker({ batchId, batchName, observations }: CureTrackerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [day, setDay] = useState("");
  const [pH, setpH] = useState("");
  const [hardness, setHardness] = useState("");
  const [notes, setNotes] = useState("");

  const sorted = [...observations].sort((a, b) => b.day - a.day);
  const latestDay = sorted[0]?.day ?? 0;
  const nextDay = latestDay + 1;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/batches/${batchId}/observations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day: parseInt(day) || nextDay,
        pH: pH ? parseFloat(pH) : null,
        hardness: hardness || null,
        notes: notes || null,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setDay("");
      setpH("");
      setHardness("");
      setNotes("");
      router.refresh();
    }
  }

  return (
    <section className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Cure Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          {showForm ? "Cancel" : "+ Log Observation"}
        </button>
      </div>

      {observations.length > 0 && (
        <div className="mb-6 p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground mb-1">Latest observation</p>
          <p className="text-lg font-medium">Day {sorted[0].day}</p>
          {sorted[0].pH && (
            <p className="text-sm text-muted-foreground">pH: {sorted[0].pH}</p>
          )}
          {sorted[0].hardness && (
            <p className="text-sm text-muted-foreground">Hardness: {sorted[0].hardness}</p>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-lg border bg-card space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Day</label>
            <input
              type="number"
              min="1"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder={String(nextDay)}
              className="w-full text-sm border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">pH</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={pH}
              onChange={(e) => setpH(e.target.value)}
              placeholder="—"
              className="w-full text-sm border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Hardness</label>
            <input
              type="text"
              value={hardness}
              onChange={(e) => setHardness(e.target.value)}
              placeholder="e.g. firm, soft, cracking"
              className="w-full text-sm border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How does it look and feel?"
              rows={3}
              className="w-full text-sm border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Save Observation
          </button>
        </form>
      )}

      {sorted.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Observation History</h3>
          {sorted.map((obs) => (
            <div key={obs.id} className="p-3 rounded-lg border bg-card text-sm">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Day {obs.day}</span>
                <span className="text-muted-foreground">{obs.createdAt.toLocaleDateString()}</span>
              </div>
              {obs.pH && <p className="text-muted-foreground">pH: {obs.pH}</p>}
              {obs.hardness && <p className="text-muted-foreground">Hardness: {obs.hardness}</p>}
              {obs.notes && <p className="text-muted-foreground">{obs.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {observations.length === 0 && !showForm && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-2">No observations yet for this batch.</p>
          <p className="text-sm">Log your first observation to start tracking cure progress.</p>
        </div>
      )}
    </section>
  );
}