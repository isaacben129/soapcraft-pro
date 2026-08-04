"use server";

import { db } from "@/lib/db/index";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

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

// ── Logout ──

export async function signOut() {
  // Clear the NextAuth session cookie
  const cookieStore = await cookies();
  cookieStore.delete("__session");
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("next-auth.csrf-token");
  cookieStore.delete("next-auth.callback-url");

  revalidatePath("/");
  redirect("/auth/login");
}

// ── Password Reset ──

export async function resetPasswordRequest(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();

  if (!email) {
    return { error: "Please enter your email address." };
  }

  let existing;
  try {
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

  // Generate reset token and store it
  const resetToken = randomBytes(32).toString("hex");
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db
    .update(users)
    .set({
      resetToken,
      resetTokenExpires,
      updatedAt: new Date(),
    })
    .where(eq(users.email, email));

  // In production, send the reset link via email
  // For now, log it for development
  console.log(`Password reset token for ${email}: ${resetToken}`);

  return {
    success:
      "If an account with that email exists, a password reset link has been sent.",
  };
}

// ── Password Reset Completion ──

export async function resetPasswordComplete(
  prevState: any,
  formData: FormData
) {
  const token = (formData.get("token") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token) {
    return { error: "Invalid or expired reset link." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.resetToken, token),
          eq(users.resetTokenExpires, null),
          // Token not expired
          // Note: resetTokenExpires is stored as a timestamp, compare in code
        )
      )
      .limit(1);

    // Check if token exists and is not expired
    const now = new Date();
    if (!user || !user.resetTokenExpires || user.resetTokenExpires < now) {
      return { error: "Invalid or expired reset link." };
    }

    // Update password and clear reset token
    const passwordHash = hashPassword(password);
    await db
      .update(users)
      .set({
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return {
      success: "Password reset complete. You can now sign in.",
    };
  } catch (err) {
    if (isDatabaseConfigError(err)) {
      return {
        error:
          "Database is not configured. Pull Vercel env vars or add DATABASE_URL/POSTGRES_URL to .env.local, then restart the dev server.",
      };
    }

    console.error("Password reset completion error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

// ── Callback URL Validation ──

export function validateCallbackUrl(url: string): string {
  // Only allow relative URLs or same-origin absolute URLs
  try {
    const parsed = new URL(url, "http://localhost");
    // Block external URLs
    if (parsed.hostname !== "localhost" && !url.startsWith("/")) {
      return "/dashboard";
    }
    // Block auth-related paths that could cause redirect loops
    if (url.startsWith("/auth/")) {
      return "/dashboard";
    }
    return url;
  } catch {
    return "/dashboard";
  }
}

// ── Session-Expired Recovery ──

export async function handleSessionExpired() {
  // Clear any stale session cookies
  const cookieStore = await cookies();
  cookieStore.delete("__session");
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("next-auth.csrf-token");

  revalidatePath("/");
}
