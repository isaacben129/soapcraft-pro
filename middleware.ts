import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { canBypassAuth, isRetiredRoute } from "./lib/routing/public-routes";
import { canonicalPaths } from "./lib/routing/canonical-routes";

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
        "wholesale-pricing": "/tools/wholesale-pricing",
      };
      const canonicalPath = canonicalMap[legacySlug] || "/tools";
      return NextResponse.redirect(new URL(canonicalPath, req.url));
    }

    // Ensure canonical tool paths are recognized
    if (canonicalPaths.has(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;
        return canBypassAuth(pathname) || Boolean(token);
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
