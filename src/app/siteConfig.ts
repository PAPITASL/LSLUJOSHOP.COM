export const SITE_NAME = "LujoShop";
export const BUSINESS_NAME = "LujoShop";
export const LOGO_PATH = "/log.png";

export function getSiteUrl(): string | undefined {
  const value = import.meta.env.VITE_SITE_URL?.trim();
  if (!value) return undefined;

  try {
    return new URL(value.endsWith("/") ? value : `${value}/`).toString();
  } catch {
    return undefined;
  }
}

export function getAbsoluteSiteUrl(path: string): string | undefined {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return undefined;

  try {
    return new URL(path.replace(/^\//, ""), siteUrl).toString();
  } catch {
    return undefined;
  }
}
