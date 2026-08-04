import { LoginForm } from "./login-form";

const DEFAULT_REDIRECT = "/dashboard";

function getSafeRedirectPath(value: string | string[] | null | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return DEFAULT_REDIRECT;
  }

  try {
    const url = rawValue.startsWith("/")
      ? new URL(rawValue, "https://soapcraft.local")
      : new URL(rawValue);
    const path = `${url.pathname}${url.search}${url.hash}`;

    if (path.startsWith("//") || url.pathname.startsWith("/auth")) {
      return DEFAULT_REDIRECT;
    }

    return path === "/" ? DEFAULT_REDIRECT : path;
  } catch {
    return DEFAULT_REDIRECT;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const params = await searchParams;

  return <LoginForm callbackUrl={getSafeRedirectPath(params.callbackUrl)} />;
}
