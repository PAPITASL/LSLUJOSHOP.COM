import { getCatalogYearRanges, formatYearRange, matchesProductYear } from "../../data/catalogYears";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { Search, SlidersHorizontal, X, ChevronDown, ArrowRight } from "lucide-react";
import { whatsappProducto } from "../whatsapp";
import { PRODUCTS as ALL_PRODUCTS, type Product, type ProductStatus } from "../../data/products";
import { CATALOG_SEO } from "../seo";
import { ProductCard } from "./ProductCard";
import { SeoHead } from "./SeoHead";

const DISPLAY_PRODUCTS = ALL_PRODUCTS.filter((product) => product.hasImage);
const PENDING_PRODUCTS = ALL_PRODUCTS.filter((product) => !product.hasImage);

const MARCAS = Array.from(new Set(ALL_PRODUCTS.map((p) => p.marca))).sort();
const MODELOS_BY_BRAND: Record<string, string[]> = MARCAS.reduce((acc, marca) => {
  acc[marca] = Array.from(new Set(ALL_PRODUCTS.filter((p) => p.marca === marca).map((p) => p.modelo))).sort();
  return acc;
}, {} as Record<string, string[]>);
const CATEGORIAS = Array.from(new Set(ALL_PRODUCTS.map((p) => p.categoria))).sort();
const ANIOS = getCatalogYearRanges(ALL_PRODUCTS);
const ESTADOS: ProductStatus[] = ["Disponible", "Por pedido", "Reservado"];

function matchOption(value: string | null, options: string[]) {
  if (!value) return "";
  return options.find((option) => option.localeCompare(value, "es", { sensitivity: "accent" }) === 0) ?? "";
}

export function CatalogoPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filterMarca, setFilterMarca] = useState(() => matchOption(searchParams.get("marca"), MARCAS));
  const [filterModelo, setFilterModelo] = useState(searchParams.get("modelo") || "");
  const [filterCategoria, setFilterCategoria] = useState(searchParams.get("tipo") || "");
  const [filterEstado, setFilterEstado] = useState<ProductStatus | "">("");
  const [filterAnio, setFilterAnio] = useState(() => matchOption(searchParams.get("anio"), ANIOS));
  const [sortBy, setSortBy] = useState("default");
  const [showCount, setShowCount] = useState(9);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const availableYears = getCatalogYearRanges(ALL_PRODUCTS.filter((product) =>
    (!filterMarca || product.marca === filterMarca) &&
    (!filterModelo || product.modelo === filterModelo),
  ));
  const selectedYear = availableYears.includes(filterAnio) ? filterAnio : "";

  const matchesFilters = (p: Product) => {
    const q = query.toLowerCase();
    if (q && !p.nombre.toLowerCase().includes(q) && !p.marca.toLowerCase().includes(q) && !p.modelo.toLowerCase().includes(q)) return false;
    if (filterMarca && p.marca !== filterMarca) return false;
    if (filterModelo && p.modelo !== filterModelo) return false;
    if (filterCategoria && p.categoria !== filterCategoria) return false;
    if (filterEstado && p.estado !== filterEstado) return false;
    if (!matchesProductYear(p.anio, selectedYear)) return false;
    return true;
  };

  const filtered = DISPLAY_PRODUCTS.filter(matchesFilters);
  const pendingFiltered = PENDING_PRODUCTS.filter(matchesFilters);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "az") return a.nombre.localeCompare(b.nombre);
    if (sortBy === "estado") return a.estado.localeCompare(b.estado);
    return 0;
  });

  const visible = sorted.slice(0, showCount);
  const hasMore = showCount < sorted.length;

  const clearFilters = () => {
    setQuery("");
    setFilterMarca("");
    setFilterModelo("");
    setFilterCategoria("");
    setFilterEstado("");
    setFilterAnio("");
    setShowCount(8);
    setShowMoreFilters(false);
  };

  const hasActiveFilters = filterMarca || filterCategoria || filterEstado || filterAnio || filterModelo || query;

  const FiltersPanel = () => (
    <div className="bg-[#161616] border border-white/8 rounded-lg p-5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "18px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Filtros
          </h3>
          <p className="text-[#888] text-xs mt-1">Usa los filtros para encontrar repuestos por marca, modelo, categoría y año.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-[#c0392b] text-xs hover:text-[#e74c3c] transition-colors flex items-center gap-1">
              <X className="w-3 h-3" />
              Limpiar
            </button>
          )}
          <button
            onClick={() => setShowMoreFilters((open) => !open)}
            className="inline-flex items-center gap-2 bg-[#1e1e1e] border border-white/10 text-[#d0d0d0] rounded px-4 py-2.5 text-sm hover:border-[#c0392b] hover:text-white transition-all duration-200"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.04em" }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showMoreFilters ? "Ocultar filtros" : "Ver filtros"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <p className="text-[#888] text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}>Marca</p>
          <select
            value={filterMarca}
            onChange={(e) => {
              const value = e.target.value;
              setFilterMarca(value);
              setFilterModelo("");
              setFilterAnio("");
              setShowCount(9);
            }}
            className="w-full bg-[#1e1e1e] border border-white/10 text-[#d0d0d0] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#c0392b]/50"
          >
            <option value="">Todas las marcas</option>
            {MARCAS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-[#888] text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}>Modelo</p>
          <select
            value={filterModelo}
            onChange={(e) => { setFilterModelo(e.target.value); setFilterAnio(""); setShowCount(9); }}
            className="w-full bg-[#1e1e1e] border border-white/10 text-[#d0d0d0] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#c0392b]/50"
          >
            <option value="">Todos los modelos</option>
            {(filterMarca ? MODELOS_BY_BRAND[filterMarca] ?? [] : Array.from(new Set(ALL_PRODUCTS.map((p) => p.modelo))).sort()).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-[#888] text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}>Categoría</p>
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-white/10 text-[#d0d0d0] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#c0392b]/50"
          >
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-[#888] text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}>Año</p>
          <select
            aria-label="Año"
            value={selectedYear}
            onChange={(e) => { setFilterAnio(e.target.value); setShowCount(9); }}
            className="w-full bg-[#1e1e1e] border border-white/10 text-[#d0d0d0] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#c0392b]/50"
          >
            <option value="">Todos los años</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>{formatYearRange(year)}</option>
            ))}
          </select>
        </div>
      </div>

      {showMoreFilters && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <p className="text-[#888] text-xs uppercase tracking-widest mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}>Estado</p>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value as ProductStatus | "")}
              className="w-full bg-[#1e1e1e] border border-white/10 text-[#d0d0d0] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#c0392b]/50"
            >
              <option value="">Todos los estados</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end justify-end">
            <button
              onClick={clearFilters}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white px-4 py-2.5 rounded text-sm transition-all duration-200"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.06em" }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#0d0d0d] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SeoHead {...CATALOG_SEO} />
      {/* Header */}
      <div className="relative bg-[#0a0a0a] border-b border-white/8 pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-2 block"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
            LujoShop
          </span>
          <h1 className="text-white mb-2" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Catálogo de repuestos, piezas y accesorios
          </h1>
          <p className="text-[#888] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Searchbar + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca o modelo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 text-[#d0d0d0] placeholder-[#555] rounded pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#c0392b]/50 transition-colors"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#161616] border border-white/10 text-[#d0d0d0] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#c0392b]/50 min-w-40"
          >
            <option value="default">Ordenar por</option>
            <option value="az">Nombre A–Z</option>
            <option value="estado">Estado</option>
          </select>
        </div>

        <div className="mb-6">
          <FiltersPanel />
        </div>

        <div className="flex-1 min-w-0">
            {visible.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-[#333] mx-auto mb-4" />
                <h3 className="text-[#888] mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "22px" }}>
                  Sin resultados
                </h3>
                <p className="text-[#555] text-sm mb-6">Prueba con otros filtros o contáctanos directamente.</p>
                <button onClick={clearFilters}
                  className="text-[#c0392b] border border-[#c0392b]/40 hover:bg-[#c0392b]/10 px-5 py-2 rounded text-sm transition-colors">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {visible.map((p) => <ProductCard key={`${p.id}-${p.referencia ?? p.modelo}`} product={p} />)}
                </div>
                {hasMore && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowCount((c) => c + 9)}
                      className="inline-flex items-center gap-2 border border-white/20 hover:border-[#c0392b] text-white hover:text-[#c0392b] px-8 py-3 rounded transition-all duration-200"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                      Cargar más productos
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        {pendingFiltered.length > 0 && (
          <details className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-[#121212]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[#b0b0b0] transition-colors hover:text-white">
              <span>
                <strong className="block text-sm text-white">Productos disponibles por consulta</strong>
                <span className="text-xs text-[#777]">
                  {pendingFiltered.length} producto{pendingFiltered.length !== 1 ? "s" : ""} pendiente{pendingFiltered.length !== 1 ? "s" : ""} de fotografía
                </span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-[#c0392b]" />
            </summary>

            <div className="max-h-96 overflow-y-auto border-t border-white/8 p-3 sm:p-4">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {pendingFiltered.map((product) => {
                  const message = encodeURIComponent(
                    `Hola, quiero consultar: ${product.nombre} para ${product.marca} ${product.modelo} (${product.anio}).`,
                  );

                  return (
                    <a
                      key={`pending-${product.id}-${product.referencia ?? product.modelo}`}
                      href={whatsappProducto(product.id, message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-white/8 bg-[#181818] p-3 transition-colors hover:border-[#c0392b]/50"
                    >
                      <span className="block text-sm font-medium text-[#d5d5d5]">{product.nombre}</span>
                      <span className="mt-1 block text-xs text-[#777]">
                        {product.marca} {product.modelo} · {product.anio}
                      </span>
                      <span className="mt-2 block text-xs font-semibold uppercase tracking-wider text-[#c0392b]">
                        Consultar por WhatsApp
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </details>
        )}
        </div>
      </div>
  );
}
