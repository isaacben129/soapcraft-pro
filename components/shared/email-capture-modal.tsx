"use client";
// ── Email Capture Modal ────────────────────────
// Appears after calculation. No auth required.
// User enters email → immediate value delivery → CRM integration.

import { useState } from "react";
import { Check, Mail, Loader2 } from "lucide-react";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculationData?: {
    costPerBar: number;
    suggestedPrice: number;
    totalCost: number;
  };
}

export function EmailCaptureModal({
  isOpen,
  onClose,
  calculationData,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/email/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "batch-cost-calculator", calculationData }),
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(onClose, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70">
      <div className="bg-sheet rounded-lg border border-rule p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          {status === "success" ? (
            <>
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2">You&rsquo;re in!</h2>
              <p className="text-muted-foreground mb-4">Check your email for the batch-costing worksheet.</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-action text-action-text rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-action/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-action" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2">Get your free worksheet</h2>
              <p className="text-muted-foreground mb-4">
                Enter your email and we&rsquo;ll send you the batch-costing worksheet
                and our pricing guide. No account needed.
              </p>
              {calculationData && (
                <div className="bg-ledger rounded-md p-3 mb-4 text-sm">
                  <span className="text-ink-muted">Cost per bar:</span>{" "}
                  <span className="font-mono font-medium text-ink">${calculationData.costPerBar.toFixed(2)}</span>
                  <span className="text-ink-muted ml-3">Suggested price:</span>{" "}
                  <span className="font-mono font-medium text-ink">${calculationData.suggestedPrice.toFixed(2)}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-canvas border border-rule rounded-md text-ink placeholder-muted-foreground focus:outline-none focus:border-action transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full px-6 py-3 bg-action text-action-text rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Worksheet"
                  )}
                </button>
                {status === "error" && (
                  <p className="text-sm text-destructive text-center">Something went wrong. Try again.</p>
                )}
              </form>
              <button
                onClick={onClose}
                className="mt-4 text-sm text-muted-foreground hover:text-ink transition-colors"
              >
                Skip, just let me calculate
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
