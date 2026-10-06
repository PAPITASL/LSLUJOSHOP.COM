import type { Product } from "../data/products";
import { BUSINESS_NAME, getAbsoluteSiteUrl, LOGO_PATH } from "./siteConfig";

export type StructuredDataValue = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]): StructuredDataValue {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const absoluteUrl = getAbsoluteSiteUrl(item.path);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(absoluteUrl ? { item: absoluteUrl } : {}),
      };
    }),
  };
}

export function getOrganizationSchema(): StructuredDataValue | undefined {
  const url = getAbsoluteSiteUrl("/");
  const logo = getAbsoluteSiteUrl(LOGO_PATH);
  if (!url || !logo) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS_NAME,
    url,
    logo,
  };
}

export interface ProductSchemaOptions {
  verifiedAbsoluteImageUrl?: string;
}

// Prepared for future use. This conceptual Schema.org Product is deliberately
// not rendered until real Offer, review or aggregateRating data exists.
export function getProductSchema(
  product: Product,
  { verifiedAbsoluteImageUrl }: ProductSchemaOptions = {},
): StructuredDataValue {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nombre,
    description: product.desc,
    sku: product.referencia,
    category: product.categoria,
    ...(verifiedAbsoluteImageUrl ? { image: verifiedAbsoluteImageUrl } : {}),
  };
}
