import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// ── Password hashing (uses Node.js built-in crypto — no extra dependency) ──

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(
  password: string,
  storedHash: string
): boolean {
  const [salt, keyHex] = storedHash.split(":");
  if (!salt || !keyHex) return false;
  const derivedKey = scryptSync(password, salt, 64);
  const storedKey = Buffer.from(keyHex, "hex");
  return timingSafeEqual(derivedKey, storedKey);
}

// ── NextAuth.js configuration ──

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();

        let result;
        try {
          // Look up user in database
          result = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        } catch (error) {
          if (
            error instanceof Error &&
            (error.message.includes("DATABASE_URL") ||
              error.message.includes("POSTGRES_URL"))
          ) {
            console.error(
              "Login database config error: pull Vercel env vars or add DATABASE_URL/POSTGRES_URL to .env.local and restart the dev server."
            );
            return null;
          }

          throw error;
        }

        const user = result[0];
        if (!user) {
          return null;
        }

        // Verify password hash
        if (!user.passwordHash) {
          return null;
        }

        const isValid = verifyPassword(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
