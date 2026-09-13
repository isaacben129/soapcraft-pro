const retiredRoutes = ["/pricing", "/subscription", "/dashboard", "/marketing"];
const retiredRoutePrefixes = ["/marketing/"];

const publicRoutes = new Set([
  "/",
  "/tools",
  "/blog",
  "/methodology",
  "/safety",
  "/privacy",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
  "/api/auth",
  "/api/webhooks",
]);

const publicPrefixes = ["/tools/", "/blog/", "/api/auth/", "/api/calculate/"];

export function isRetiredRoute(pathname: string) {
  return retiredRoutes.includes(pathname) || retiredRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
}

export function canBypassAuth(pathname: string) {
  return (
    isRetiredRoute(pathname) ||
    pathname === "/calculators" ||
    pathname.startsWith("/calculators/") ||
    publicRoutes.has(pathname) ||
    publicPrefixes.some((prefix) => pathname.startsWith(prefix))
  );
}

export function isCanonicalRoute(pathname: string): boolean {
  return publicRoutes.has(pathname) || publicPrefixes.some((prefix) => pathname.startsWith(prefix));
}
