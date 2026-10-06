import { ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router";
import {
  findBrandBySlug,
  findModelBySlug,
  getBrandUrl,
  getModelUrl,
} from "../../data/products";
import {
  BRAND_NOT_FOUND_SEO,
  getBrandSeo,
  getModelSeo,
  MODEL_NOT_FOUND_SEO,
} from "../seo";
import { ProductCard } from "./ProductCard";
import { SeoHead } from "./SeoHead";
import { getBreadcrumbSchema } from "../structuredData";
import { StructuredData } from "./StructuredData";

function TaxonomyNotFound({ type }: { type: "brand" | "model" }) {
  const isBrand = type === "brand";
  const seo = isBrand ? BRAND_NOT_FOUND_SEO : MODEL_NOT_FOUND_SEO;
  const heading = isBrand ? "Marca no encontrada" : "Modelo no encontrado";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d]">
      <SeoHead {...seo} />
      <div className="text-center">
        <h1 className="mb-4 text-white">{heading}</h1>
        <Link to="/catalogo" className="rounded border border-[#c0392b]/40 px-5 py-2 text-[#c0392b]">
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}

export function BrandPage() {
  const { marca: brandSlug } = useParams();
  const brand = findBrandBySlug(brandSlug);

  if (!brand) return <TaxonomyNotFound type="brand" />;
  const visibleProducts = brand.products.slice(0, 12);

  return (
    <div className="min-h-screen bg-[#0d0d0d]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SeoHead {...getBrandSeo(brand)} />
      <StructuredData
        data={getBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Catálogo", path: "/catalogo" },
          { name: brand.name, path: getBrandUrl(brand) },
        ])}
      />

      <div className="border-b border-white/8 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-[#555]" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-[#c0392b]">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/catalogo" className="transition-colors hover:text-[#c0392b]">Catálogo</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#888]">{brand.name}</span>
          </nav>
        </div>
      </div>

      <header className="border-b border-white/8 bg-[#0a0a0a] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="mb-2 block text-sm uppercase tracking-widest text-[#c0392b]">LujoShop</span>
          <h1 className="mb-3 text-white" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Repuestos y accesorios {brand.name}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-[#999]">
            Explora los repuestos, piezas y accesorios {brand.name} disponibles en el catálogo de LujoShop.
            Selecciona un modelo para encontrar productos compatibles y consultar precio y disponibilidad por WhatsApp.
          </p>
          <p className="mt-3 text-sm text-[#777]">
            {brand.products.length} producto{brand.products.length === 1 ? "" : "s"} encontrado{brand.products.length === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10" aria-labelledby="brand-models-title">
          <h2 id="brand-models-title" className="mb-4 text-white">Modelos disponibles</h2>
          <div className="flex flex-wrap gap-2">
            {brand.models.map((model) => (
              <Link
                key={model.slug}
                to={getModelUrl(brand, model)}
                className="rounded border border-white/10 bg-[#161616] px-4 py-2 text-sm text-[#b0b0b0] transition-colors hover:border-[#c0392b]/50 hover:text-white"
              >
                {model.name} <span className="text-[#666]">({model.products.length})</span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="brand-products-title">
          <h2 id="brand-products-title" className="mb-5 text-white">Algunos productos {brand.name}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      </main>
    </div>
  );
}

export function ModelPage() {
  const { marca: brandSlug, modelo: modelSlug } = useParams();
  const brand = findBrandBySlug(brandSlug);
  const model = findModelBySlug(brandSlug, modelSlug);

  if (!brand || !model) return <TaxonomyNotFound type="model" />;

  return (
    <div className="min-h-screen bg-[#0d0d0d]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SeoHead {...getModelSeo(brand, model)} />
      <StructuredData
        data={getBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: brand.name, path: getBrandUrl(brand) },
          { name: model.name, path: getModelUrl(brand, model) },
        ])}
      />

      <div className="border-b border-white/8 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-[#555]" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-[#c0392b]">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={getBrandUrl(brand)} className="transition-colors hover:text-[#c0392b]">{brand.name}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate text-[#888]">{model.name}</span>
          </nav>
        </div>
      </div>

      <header className="border-b border-white/8 bg-[#0a0a0a] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="mb-2 block text-sm uppercase tracking-widest text-[#c0392b]">{brand.name}</span>
          <h1 className="mb-3 text-white" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Repuestos y accesorios {brand.name} {model.name}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-[#999]">
            Consulta los repuestos, piezas y accesorios disponibles para {brand.name} {model.name} en el catálogo de LujoShop.
            Revisa los años y productos disponibles y comunícate por WhatsApp para conocer precio y disponibilidad.
          </p>
          <p className="mt-3 text-sm text-[#777]">
            {model.products.length} producto{model.products.length === 1 ? "" : "s"} encontrado{model.products.length === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8" aria-labelledby="model-years-title">
          <h2 id="model-years-title" className="mb-3 text-white">Años y rangos presentes</h2>
          <div className="flex flex-wrap gap-2">
            {model.years.map((year) => (
              <span key={year} className="rounded border border-white/10 bg-[#161616] px-3 py-1.5 text-sm text-[#999]">
                {year}
              </span>
            ))}
          </div>
        </section>

        <section aria-labelledby="model-products-title">
          <h2 id="model-products-title" className="mb-5 text-white">Productos para {brand.name} {model.name}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {model.products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
