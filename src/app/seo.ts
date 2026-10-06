import {
  BRANDS,
  getBrandUrl,
  getModelUrl,
  getProductUrl,
  PRODUCTS,
  slugify,
  type Product,
  type ProductBrand,
  type ProductModel,
} from "../data/products";

export interface SeoMetadata {
  title: string;
  description: string;
  path?: string;
  robots?: string;
}

export const DEFAULT_ROBOTS = "noindex, nofollow";
export const GLOBAL_TITLE = "LujoShop | Repuestos y accesorios para carros";
export const GLOBAL_DESCRIPTION =
  "Catálogo de repuestos y accesorios para carros en LujoShop. Consulta piezas para diferentes marcas y modelos y comunícate directamente por WhatsApp.";

export const HOME_SEO: SeoMetadata = {
  title: GLOBAL_TITLE,
  description:
    "Encuentra repuestos y accesorios para diferentes marcas y modelos de vehículos en el catálogo de LujoShop y consulta disponibilidad por WhatsApp.",
  path: "/",
};

export const CATALOG_SEO: SeoMetadata = {
  title: "Catálogo de repuestos y accesorios | LujoShop",
  description:
    "Explora el catálogo de repuestos y accesorios de LujoShop por marca, modelo, año y tipo de pieza. Consulta cada producto directamente por WhatsApp.",
  path: "/catalogo",
};

export const ABOUT_SEO: SeoMetadata = {
  title: "Conoce LujoShop | Repuestos y accesorios para carros",
  description:
    "Conoce cómo LujoShop ayuda a buscar repuestos, piezas y accesorios para diferentes marcas, modelos y años de vehículos.",
  path: "/conocenos",
};

export const CONTACT_SEO: SeoMetadata = {
  title: "Contacto | LujoShop",
  description: "Comunícate con LujoShop para consultar repuestos y accesorios para tu vehículo.",
  path: "/contactanos",
};

export const PRODUCT_NOT_FOUND_SEO: SeoMetadata = {
  title: "Producto no encontrado | LujoShop",
  description: "El producto solicitado no se encuentra disponible en el catálogo de LujoShop.",
};

export const BRAND_NOT_FOUND_SEO: SeoMetadata = {
  title: "Marca no encontrada | LujoShop",
  description: "La marca solicitada no se encuentra disponible en el catálogo de LujoShop.",
};

export const MODEL_NOT_FOUND_SEO: SeoMetadata = {
  title: "Modelo no encontrado | LujoShop",
  description: "El modelo solicitado no se encuentra disponible para esta marca en el catálogo de LujoShop.",
};

export const PRODUCT_TITLE_MAX_LENGTH = 80;
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 160;

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function sentenceCase(text: string): string {
  const normalized = normalizeWhitespace(text).toLocaleLowerCase("es");
  return normalized ? normalized.charAt(0).toLocaleUpperCase("es") + normalized.slice(1) : "";
}

function truncateAtWord(text: string, maxLength: number): string {
  const normalized = normalizeWhitespace(text);
  if (normalized.length <= maxLength) return normalized;

  const candidate = normalized.slice(0, maxLength - 1);
  const lastSpace = candidate.lastIndexOf(" ");
  const cutAt = lastSpace >= Math.floor(maxLength * 0.65) ? lastSpace : candidate.length;
  return `${candidate.slice(0, cutAt).replace(/[\s,;:.-]+$/g, "")}…`;
}

function nameContainsValue(productName: string, value: string): boolean {
  const normalizedValue = slugify(value);
  return Boolean(normalizedValue) && slugify(productName).includes(normalizedValue);
}

function getProductTitle(product: Product): string {
  const readableName = sentenceCase(product.nombre) || "Producto";
  const details = [product.marca, product.modelo, product.anio].filter(
    (value) => value && !nameContainsValue(product.nombre, value),
  );
  const suffix = `${details.join(" ")} | LujoShop`;
  const fullTitle = normalizeWhitespace(`${readableName} ${suffix}`);

  if (fullTitle.length <= PRODUCT_TITLE_MAX_LENGTH) return fullTitle;

  const availableNameLength = Math.max(12, PRODUCT_TITLE_MAX_LENGTH - suffix.length - 1);
  return normalizeWhitespace(`${truncateAtWord(readableName, availableNameLength)} ${suffix}`);
}

function getProductDescription(product: Product): string {
  const rawDescription = normalizeWhitespace(product.desc ?? "");
  const base = rawDescription
    ? rawDescription.replace(/[.!?]+$/g, "")
    : `Consulta este producto para ${product.marca} ${product.modelo} ${product.anio} en el catálogo de LujoShop`;
  const callToAction = " Consulta precio y disponibilidad con LujoShop por WhatsApp.";
  const baseBudget = PRODUCT_DESCRIPTION_MAX_LENGTH - callToAction.length - 1;
  const compactBase = truncateAtWord(base, baseBudget);
  const separator = compactBase.endsWith("…") ? "" : ".";
  return `${compactBase}${separator}${callToAction}`;
}

export function getProductSeo(product: Product): SeoMetadata {
  return {
    title: getProductTitle(product),
    description: getProductDescription(product),
    path: getProductUrl(product),
  };
}

export function getBrandSeo(brand: ProductBrand): SeoMetadata {
  return {
    title: `Repuestos y accesorios ${brand.name} | LujoShop`,
    description: `Explora repuestos, piezas y accesorios ${brand.name} disponibles en el catálogo de LujoShop. Consulta productos por modelo y comunícate por WhatsApp.`,
    path: getBrandUrl(brand),
  };
}

export function getModelSeo(brand: ProductBrand, model: ProductModel): SeoMetadata {
  const fullTitle = `Repuestos y accesorios ${brand.name} ${model.name} | LujoShop`;
  const title = fullTitle.length <= PRODUCT_TITLE_MAX_LENGTH
    ? fullTitle
    : `Repuestos ${brand.name} ${model.name} | LujoShop`;

  return {
    title,
    description: `Consulta repuestos, piezas y accesorios para ${brand.name} ${model.name} en el catálogo de LujoShop y comunícate por WhatsApp para conocer precio y disponibilidad.`,
    path: getModelUrl(brand, model),
  };
}

export function getCanonicalUrl(path: string | undefined): string | undefined {
  const siteUrl = import.meta.env.VITE_SITE_URL?.trim();
  if (!siteUrl || !path) return undefined;

  try {
    return new URL(path, siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).toString();
  } catch {
    return undefined;
  }
}

const productSeoEntries = PRODUCTS.map((product) => ({
  product,
  seo: getProductSeo(product),
}));

function getLengthExtreme(key: "title" | "description", direction: "shortest" | "longest") {
  return productSeoEntries.reduce((selected, current) => {
    const selectedLength = selected.seo[key].length;
    const currentLength = current.seo[key].length;
    const shouldReplace = direction === "shortest"
      ? currentLength < selectedLength
      : currentLength > selectedLength;
    return shouldReplace ? current : selected;
  });
}

export const PRODUCT_SEO_VALIDATION = Object.freeze({
  total: productSeoEntries.length,
  emptyTitles: productSeoEntries.filter(({ seo }) => !seo.title.trim()).length,
  emptyDescriptions: productSeoEntries.filter(({ seo }) => !seo.description.trim()).length,
  shortestTitle: getLengthExtreme("title", "shortest"),
  longestTitle: getLengthExtreme("title", "longest"),
  shortestDescription: getLengthExtreme("description", "shortest"),
  longestDescription: getLengthExtreme("description", "longest"),
});

const brandSeoEntries = BRANDS.map((brand) => ({ brand, seo: getBrandSeo(brand) }));
const modelSeoEntries = BRANDS.flatMap((brand) =>
  brand.models.map((model) => ({ brand, model, seo: getModelSeo(brand, model) })),
);

export const TAXONOMY_SEO_VALIDATION = Object.freeze({
  totalBrands: brandSeoEntries.length,
  emptyBrandTitles: brandSeoEntries.filter(({ seo }) => !seo.title.trim()).length,
  emptyBrandDescriptions: brandSeoEntries.filter(({ seo }) => !seo.description.trim()).length,
  totalModels: modelSeoEntries.length,
  emptyModelTitles: modelSeoEntries.filter(({ seo }) => !seo.title.trim()).length,
  emptyModelDescriptions: modelSeoEntries.filter(({ seo }) => !seo.description.trim()).length,
});
