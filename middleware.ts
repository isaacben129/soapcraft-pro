import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";

const retiredRoutes = ["/pricing", "/subscription", "/dashboard", "/marketing"];
const retiredRoutePrefixes = ["/marketing/", "/calculators/", "/calculators"];

function isRetiredRoute(pathname: string) {
  if (retiredRoutes.includes(pathname)) return true;
  for (const prefix of retiredRoutePrefixes) {
    // Specific legacy calculator paths have canonical tool destinations.
    if (prefix === "/calculators/" && pathname.startsWith(prefix)) continue;
    if (pathname.startsWith(prefix)) return true;
  }
  return false;
}

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Redirect retired routes to /tools
    if (isRetiredRoute(pathname)) {
      return NextResponse.redirect(new URL("/tools", req.url));
    }

    // Redirect legacy /calculators/* to canonical /tools/<tool-slug>
    const calculatorMatch = pathname.match(/^\/calculators\/(.+)$/);
    if (calculatorMatch) {
      const legacySlug = calculatorMatch[1];
      const canonicalMap: Record<string, string> = {
        "batch-costing": "/tools/batch-cost",
        "recipe-scaling": "/tools/recipe-scaling",
        "mold-volume": "/tools/mold-volume",
        "craft-fair-break-even": "/tools/craft-fair-break-even",
        "soap-cost-calculator": "/tools/batch-cost",
        "wholesale-pricing": "/tools/batch-cost",
      };
      const canonicalPath = canonicalMap[legacySlug] || "/tools";
      return NextResponse.redirect(new URL(canonicalPath, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        const publicRoutes = new Set([
          "/",
          "/blog",
          "/auth/login",
          "/auth/signup",
          "/auth/reset-password",
          "/robots.txt",
          "/sitemap.xml",
          "/tools",
          "/methodology",
          "/safety",
          "/privacy",
          "/terms",
          "/api/auth",
          "/api/webhooks",
        ]);
        const publicPrefixes = [
          "/blog/",
          "/guides/",
          "/compare/",
          "/tools/",
          "/api/auth/",
        ];

        if (
          publicRoutes.has(pathname) ||
          publicPrefixes.some((prefix) => pathname.startsWith(prefix))
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
