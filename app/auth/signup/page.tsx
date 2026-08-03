"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signUp } from "@/app/auth/actions";

function SignupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, formAction] = useActionState(signUp, { error: "" });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <span className="text-4xl mb-4 block">🧼</span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Start your SoapCraft Pro workspace
        </p>
      </div>

      {state?.error && (
        <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-md border border-success bg-success/10 px-4 py-3 text-sm text-success-foreground">
          {state.success}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-label font-medium text-foreground block"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-label font-medium text-foreground block"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-label font-medium text-foreground block"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            autoComplete="new-password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-label font-medium text-foreground block"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            autoComplete="new-password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create account
        </button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </span>
      </div>
    </div>
  );
}

export default SignupPage;
