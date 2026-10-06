import { hasCatalogImage, resolveProductImage } from "../app/productImage";

export type ProductStatus = "Disponible" | "Por pedido" | "Reservado";

export interface CatalogProduct {
  id: number;
  marca: string;
  modelo: string;
  anio: string;
  referencia?: string;
  categoria: string;
  subcategoria?: string;
  nombre: string;
  img: string;
  desc: string;
  estado?: ProductStatus;
}

export interface Product extends Omit<CatalogProduct, "estado"> {
  estado: ProductStatus;
  hasImage: boolean;
  slug: string;
}

export interface ProductModel {
  name: string;
  slug: string;
  brand: string;
  products: Product[];
  years: string[];
}

export interface ProductBrand {
  name: string;
  slug: string;
  products: Product[];
  models: ProductModel[];
}

type CatalogModule = { default: CatalogProduct[] };

const catalogModules = import.meta.glob("./catalogo*.json", { eager: true }) as Record<string, CatalogModule>;

export function slugify(text: string): string {
  return text
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getProductBaseSlug(product: CatalogProduct): string {
  return slugify(`${product.nombre} ${product.marca} ${product.modelo} ${product.anio}`);
}

const catalogEntries = Object.entries(catalogModules).flatMap(([catalogPath, module]) =>
  (module.default ?? []).map((product) => ({ product, catalogPath })),
);

const baseSlugCounts = catalogEntries.reduce((counts, { product }) => {
  const slug = getProductBaseSlug(product);
  counts.set(slug, (counts.get(slug) ?? 0) + 1);
  return counts;
}, new Map<string, number>());

export const PRODUCT_BASE_SLUG_COLLISION_COUNT = Array.from(baseSlugCounts.values()).filter(
  (count) => count > 1,
).length;

const usedSlugs = new Set<string>();

function createUniqueProductSlug(product: CatalogProduct): string {
  const baseSlug = getProductBaseSlug(product);
  let slug = baseSlug;

  if ((baseSlugCounts.get(baseSlug) ?? 0) > 1 && product.referencia) {
    slug = `${baseSlug}-${slugify(product.referencia)}`;
  }

  if (!slug || usedSlugs.has(slug)) {
    slug = `${baseSlug || "producto"}-${product.id}`;
  }

  usedSlugs.add(slug);
  return slug;
}

export const PRODUCTS: Product[] = catalogEntries.map(({ product, catalogPath }) => ({
  ...product,
  estado: product.estado ?? "Disponible",
  img: resolveProductImage(product.img),
  hasImage: Boolean(product.img) && hasCatalogImage(catalogPath, product.id),
  slug: createUniqueProductSlug(product),
}));

const productsById = new Map(PRODUCTS.map((product) => [product.id, product]));
const productsBySlug = new Map(PRODUCTS.map((product) => [product.slug, product]));

export function getProductSlug(product: CatalogProduct | Product): string {
  return productsById.get(product.id)?.slug ?? getProductBaseSlug(product);
}

export function getProductUrl(product: CatalogProduct | Product): string {
  return `/productos/${getProductSlug(product)}`;
}

export function findProductById(id: number | string | undefined): Product | undefined {
  if (id === undefined || id === "") return undefined;
  const numericId = typeof id === "number" ? id : Number(id);
  if (!Number.isInteger(numericId)) return undefined;
  return productsById.get(numericId);
}

export function findProductBySlug(slug: string | undefined): Product | undefined {
  return slug ? productsBySlug.get(slug) : undefined;
}

const brandNames = Array.from(new Set(PRODUCTS.map((product) => product.marca))).sort((a, b) =>
  a.localeCompare(b, "es"),
);
const usedBrandSlugs = new Set<string>();

function createUniqueBrandSlug(brand: string, products: Product[]): string {
  const baseSlug = slugify(brand);
  if (baseSlug && !usedBrandSlugs.has(baseSlug)) {
    usedBrandSlugs.add(baseSlug);
    return baseSlug;
  }

  const slug = `${baseSlug || "marca"}-${Math.min(...products.map((product) => product.id))}`;
  usedBrandSlugs.add(slug);
  return slug;
}

export const BRANDS: ProductBrand[] = brandNames.map((brandName) => {
  const brandProducts = PRODUCTS.filter((product) => product.marca === brandName);
  const brandSlug = createUniqueBrandSlug(brandName, brandProducts);
  const modelNames = Array.from(new Set(brandProducts.map((product) => product.modelo))).sort((a, b) =>
    a.localeCompare(b, "es"),
  );
  const usedModelSlugs = new Set<string>();

  const models = modelNames.map((modelName): ProductModel => {
    const modelProducts = brandProducts.filter((product) => product.modelo === modelName);
    const baseSlug = slugify(modelName);
    const modelSlug = baseSlug && !usedModelSlugs.has(baseSlug)
      ? baseSlug
      : `${baseSlug || "modelo"}-${Math.min(...modelProducts.map((product) => product.id))}`;
    usedModelSlugs.add(modelSlug);

    return {
      name: modelName,
      slug: modelSlug,
      brand: brandName,
      products: modelProducts,
      years: Array.from(new Set(modelProducts.map((product) => product.anio))).sort((a, b) =>
        a.localeCompare(b, "es", { numeric: true }),
      ),
    };
  });

  return {
    name: brandName,
    slug: brandSlug,
    products: brandProducts,
    models,
  };
});

const brandsBySlug = new Map(BRANDS.map((brand) => [brand.slug, brand]));

export function getBrandSlug(brand: string): string {
  return BRANDS.find((entry) => entry.name === brand)?.slug ?? slugify(brand);
}

export function getModelSlug(brand: string, model: string): string {
  return BRANDS.find((entry) => entry.name === brand)?.models.find((entry) => entry.name === model)?.slug
    ?? slugify(model);
}

export function getBrandUrl(brand: string | ProductBrand): string {
  const slug = typeof brand === "string" ? getBrandSlug(brand) : brand.slug;
  return `/repuestos/${slug}`;
}

export function getModelUrl(brand: string | ProductBrand, model: string | ProductModel): string {
  const brandName = typeof brand === "string" ? brand : brand.name;
  const brandSlug = typeof brand === "string" ? getBrandSlug(brand) : brand.slug;
  const modelSlug = typeof model === "string" ? getModelSlug(brandName, model) : model.slug;
  return `/repuestos/${brandSlug}/${modelSlug}`;
}

export function getProductsByBrand(brand: string): Product[] {
  return BRANDS.find((entry) => entry.name === brand)?.products ?? [];
}

export function getProductsByModel(brand: string, model: string): Product[] {
  return BRANDS.find((entry) => entry.name === brand)?.models.find((entry) => entry.name === model)?.products ?? [];
}

export function getModelsByBrand(brand: string): ProductModel[] {
  return BRANDS.find((entry) => entry.name === brand)?.models ?? [];
}

export function findBrandBySlug(slug: string | undefined): ProductBrand | undefined {
  return slug ? brandsBySlug.get(slug) : undefined;
}

export function findModelBySlug(
  brandSlug: string | undefined,
  modelSlug: string | undefined,
): ProductModel | undefined {
  return findBrandBySlug(brandSlug)?.models.find((model) => model.slug === modelSlug);
}

const allModels = BRANDS.flatMap((brand) => brand.models);

export const CATALOG_TAXONOMY_VALIDATION = Object.freeze({
  totalBrands: BRANDS.length,
  uniqueBrandSlugs: new Set(BRANDS.map((brand) => brand.slug)).size,
  emptyBrandSlugs: BRANDS.filter((brand) => !brand.slug).length,
  brandsWithoutProducts: BRANDS.filter((brand) => brand.products.length === 0).length,
  totalModels: allModels.length,
  emptyModelSlugs: allModels.filter((model) => !model.slug).length,
  modelsWithoutProducts: allModels.filter((model) => model.products.length === 0).length,
  duplicateModelSlugsWithinBrand: BRANDS.reduce(
    (total, brand) => total + brand.models.length - new Set(brand.models.map((model) => model.slug)).size,
    0,
  ),
});

export const PRODUCT_DATA_VALIDATION = Object.freeze({
  total: PRODUCTS.length,
  uniqueIds: productsById.size,
  uniqueSlugs: productsBySlug.size,
  emptySlugs: PRODUCTS.filter((product) => !product.slug).length,
  baseSlugCollisions: PRODUCT_BASE_SLUG_COLLISION_COUNT,
  unresolvedSlugCollisions: PRODUCTS.length - productsBySlug.size,
});
