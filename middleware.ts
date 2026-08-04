import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ token, req }) {
      const { pathname } = req.nextUrl;

      // Redirect old /marketing/** paths to canonical routes
      if (pathname.startsWith("/marketing")) {
        const canonicalPath = pathname
          .replace("/marketing", "")
          .replace(/\/$/, "") || "/";
        return NextResponse.rewrite(new URL(canonicalPath, req.url));
      }

      // Public routes — always accessible
      const publicRoutes = new Set([
        "/",
        "/pricing",
        "/blog",
        "/auth/login",
        "/auth/signup",
        "/auth/reset-password",
        "/api/auth",
        "/api/webhooks",
      ]);
      const publicPrefixes = ["/blog/", "/api/auth/"];

      if (
        publicRoutes.has(pathname) ||
        publicPrefixes.some((prefix) => pathname.startsWith(prefix))
      ) {
        return true;
      }

      // Authenticated users can access app routes
      if (token) {
        return true;
      }

      return false;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
