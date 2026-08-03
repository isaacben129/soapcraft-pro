"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signIn } from "next-auth/react";

function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please fill in all fields." };
  }

  return signIn("credentials", {
    email,
    password,
    redirect: false,
  }).then((result) => {
    if (result?.error) {
      return { error: "Invalid email or password." };
    }
    if (result?.ok) {
      window.location.href = "/";
    }
    return { error: "An unexpected error occurred." };
  });
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, { error: "" });

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
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Sign in to your SoapCraft Pro workspace
        </p>
      </div>

      {state?.error && (
        <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
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
            autoComplete="current-password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sign in
        </button>
      </form>

      <div className="flex flex-col gap-3 text-center text-sm">
        <Link
          href="/auth/reset-password"
          className="text-primary hover:underline"
        >
          Forgot your password?
        </Link>
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-primary hover:underline font-medium"
          >
            Create one
          </Link>
        </span>
      </div>
    </div>
  );
}
