import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/marketing")) {
      const canonicalPath =
        pathname.replace("/marketing", "").replace(/\/$/, "") || "/";
      return NextResponse.rewrite(new URL(canonicalPath, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

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
          publicPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
          pathname.startsWith("/marketing")
        ) {
          return true;
        }

        return Boolean(token);
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
