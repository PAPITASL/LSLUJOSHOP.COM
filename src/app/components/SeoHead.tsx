import { useEffect } from "react";
import { DEFAULT_ROBOTS, getCanonicalUrl, type SeoMetadata } from "../seo";

function upsertMeta(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

export function SeoHead({ title, description, path, robots = DEFAULT_ROBOTS }: SeoMetadata) {
  useEffect(() => {
    document.title = title;
    upsertMeta("description", description);
    upsertMeta("robots", robots);

    const canonicalUrl = getCanonicalUrl(path);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"][data-lujoshop-seo]');

    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        canonical.dataset.lujoshopSeo = "true";
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    } else {
      canonical?.remove();
    }
  }, [description, path, robots, title]);

  return null;
}
