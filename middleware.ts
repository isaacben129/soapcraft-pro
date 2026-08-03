import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      const { pathname } = req.nextUrl;

      // Public routes — always accessible
      const publicPaths = [
        "/",
        "/marketing",
        "/auth/login",
        "/auth/signup",
        "/auth/reset-password",
        "/api/auth",
      ];

      if (publicPaths.some((p) => pathname.startsWith(p))) {
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
