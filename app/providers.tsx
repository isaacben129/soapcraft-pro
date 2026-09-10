"use client";

import { SessionProvider } from "next-auth/react";
import { initPostHog } from "@/lib/analytics/posthog";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}