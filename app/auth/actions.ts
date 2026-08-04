"use server";

import { db } from "@/lib/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { signIn } from "next-auth/react";

function isDatabaseConfigError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes("DATABASE_URL") ||
      error.message.includes("POSTGRES_URL"))
  );
}

// ── Signup ──

export async function signUp(prevState: any, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  if (!email || !password || !confirmPassword) {
    return { error: "Please fill in all required fields." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    // Check if user already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return { error: "An account with this email already exists." };
    }

    // Hash password and create user
    const passwordHash = hashPassword(password);
    const userId = crypto.randomUUID();

    await db.insert(users).values({
      id: userId,
      email,
      name: name || undefined,
      passwordHash,
    });

    // Auto sign in after signup
    await signIn("credentials", { email, password, redirect: false });

    return { success: "Account created! Welcome to SoapCraft Pro." };
  } catch (err) {
    if (isDatabaseConfigError(err)) {
      return {
        error:
          "Database is not configured. Pull Vercel env vars or add DATABASE_URL/POSTGRES_URL to .env.local, then restart the dev server.",
      };
    }

    console.error("Signup error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

// ── Password Reset ──

export async function resetPassword(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();

  if (!email) {
    return { error: "Please enter your email address." };
  }

  let existing;
  try {
    // Check if user exists
    existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  } catch (err) {
    if (isDatabaseConfigError(err)) {
      return {
        error:
          "Database is not configured. Pull Vercel env vars or add DATABASE_URL/POSTGRES_URL to .env.local, then restart the dev server.",
      };
    }

    console.error("Password reset error:", err);
    return { error: "Something went wrong. Please try again." };
  }

  // Always return success to prevent email enumeration
  if (existing.length === 0) {
    return {
      success:
        "If an account with that email exists, a password reset link has been sent.",
    };
  }

  // TODO: Generate reset token, store it, and send email
  // For now, return a placeholder success message
  return {
    success:
      "If an account with that email exists, a password reset link has been sent.",
  };
}
