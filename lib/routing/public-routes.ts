const retiredRoutes = ["/pricing", "/subscription", "/dashboard", "/marketing"];
const retiredRoutePrefixes = ["/marketing/"];

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
  "/privacy-pinterest",
  "/terms-pinterest",
  "/api/auth",
  "/api/webhooks",
]);

const publicPrefixes = ["/blog/", "/guides/", "/compare/", "/tools/", "/api/auth/"];

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
