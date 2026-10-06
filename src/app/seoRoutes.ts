import { BRANDS, PRODUCTS, getBrandUrl, getModelUrl, getProductUrl } from "../data/products";
import {
  ABOUT_SEO,
  CATALOG_SEO,
  CONTACT_SEO,
  HOME_SEO,
  getBrandSeo,
  getModelSeo,
  getProductSeo,
  type SeoMetadata,
} from "./seo";

export type SeoRouteKind = "main" | "brand" | "model" | "product";

export interface SeoRoute {
  path: string;
  kind: SeoRouteKind;
  seo: SeoMetadata;
  productId?: number;
  brand?: string;
  model?: string;
}

const MAIN_ROUTES: SeoRoute[] = [
  { path: "/", kind: "main", seo: HOME_SEO },
  { path: "/catalogo", kind: "main", seo: CATALOG_SEO },
  { path: "/conocenos", kind: "main", seo: ABOUT_SEO },
  { path: "/contactanos", kind: "main", seo: CONTACT_SEO },
];

export function getSeoRoutes(): SeoRoute[] {
  const brandRoutes: SeoRoute[] = BRANDS.map((brand) => ({
    path: getBrandUrl(brand),
    kind: "brand",
    seo: getBrandSeo(brand),
    brand: brand.name,
  }));

  const modelRoutes: SeoRoute[] = BRANDS.flatMap((brand) =>
    brand.models.map((model) => ({
      path: getModelUrl(brand, model),
      kind: "model" as const,
      seo: getModelSeo(brand, model),
      brand: brand.name,
      model: model.name,
    })),
  );

  const productRoutes: SeoRoute[] = PRODUCTS.map((product) => ({
    path: getProductUrl(product),
    kind: "product",
    seo: getProductSeo(product),
    productId: product.id,
    brand: product.marca,
    model: product.modelo,
  }));

  return [...MAIN_ROUTES, ...brandRoutes, ...modelRoutes, ...productRoutes];
}
