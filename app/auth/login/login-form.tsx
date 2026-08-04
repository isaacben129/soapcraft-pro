"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const DEFAULT_REDIRECT = "/dashboard";

function getSafeRedirectPath(value: FormDataEntryValue | string | null) {
  if (typeof value !== "string" || !value) {
    return DEFAULT_REDIRECT;
  }

  try {
    const url = value.startsWith("/")
      ? new URL(value, "https://soapcraft.local")
      : new URL(value);
    const path = `${url.pathname}${url.search}${url.hash}`;

    if (path.startsWith("//") || url.pathname.startsWith("/auth")) {
      return DEFAULT_REDIRECT;
    }

    return path === "/" ? DEFAULT_REDIRECT : path;
  } catch {
    return DEFAULT_REDIRECT;
  }
}

function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = getSafeRedirectPath(formData.get("callbackUrl"));

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
      window.location.href = callbackUrl;
    }
    return { error: "An unexpected error occurred." };
  });
}

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, { error: "" });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <span className="text-4xl mb-4 block">ðŸ§¼</span>
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
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

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
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
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
