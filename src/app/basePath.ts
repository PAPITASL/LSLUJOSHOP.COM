// Shared by navigation, prerendered links and public assets.
export const BASE_PATH = import.meta.env.BASE_URL;

export function withBasePath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const prefix = BASE_PATH.replace(/\/$/, '');
  if (prefix && (path === prefix || path.startsWith(prefix + '/'))) return path;
  return prefix + path;
}
