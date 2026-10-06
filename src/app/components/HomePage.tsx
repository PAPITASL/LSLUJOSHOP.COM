import { withBasePath } from "../basePath";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronRight, Star, Package, Truck, Settings, CheckCircle, Search, Phone, ArrowRight } from "lucide-react";
import { BRANDS, findProductById, getBrandUrl, getProductUrl, type ProductStatus } from "../../data/products";
import { HOME_SEO } from "../seo";
import { SeoHead } from "./SeoHead";
import { ProductImage } from "./ProductImage";

const WHATSAPP_URL = "https://wa.me/573009492341?text=Hola%2C%20quiero%20cotizar%20un%20repuesto";
const WHATSAPP_PIEZA = "https://wa.me/573009492341?text=Hola%2C%20estoy%20buscando%20una%20pieza%20específica%20para%20mi%20vehículo.%20Le%20envío%20los%20datos%3A";

// Image URLs from Unsplash
const HERO_IMG = "https://images.unsplash.com/photo-1601252300554-4ad551483bd2?w=1920&h=900&fit=crop&auto=format";
const ABOUT_IMG = "https://images.unsplash.com/photo-1641784001736-78e8fa1d6a82?w=800&h=600&fit=crop&auto=format";
const INTERIOR_IMG = "https://images.unsplash.com/photo-1605437241278-c1806d14a4d9?w=600&h=400&fit=crop&auto=format";
const LIGHTS_IMG = "https://images.unsplash.com/photo-1551464484-74a2f25d01a0?w=600&h=400&fit=crop&auto=format";
const HEADLIGHT_IMG = "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600&h=400&fit=crop&auto=format";
const BUMPER_IMG = "https://images.unsplash.com/photo-1578102176342-dbaecee78bca?w=600&h=400&fit=crop&auto=format";
const ENGINE_IMG = "https://images.unsplash.com/photo-1702146715274-d466e629ecc2?w=600&h=400&fit=crop&auto=format";
const PARTS_IMG = "https://images.unsplash.com/photo-1702146713870-8cdd7ab983fb?w=600&h=400&fit=crop&auto=format";
const TRUCK_IMG = "https://images.unsplash.com/photo-1630028930942-9864e497139a?w=600&h=400&fit=crop&auto=format";
const OFFROAD_IMG = "https://images.unsplash.com/photo-1641784001736-78e8fa1d6a82?w=600&h=400&fit=crop&auto=format";

const MARCAS = [
  { name: "Ford", img: "/Logos/Logo_ford.jpeg", icon: "F" },
  { name: "Chevrolet", img: "/Logos/Logo_chevrolet.jpeg", icon: "C" },
  { name: "Toyota", img: "/Logos/Logo_toyota.jpeg", icon: "T" },
  { name: "Mazda", img: "/Logos/Logo_mazda.jpeg", icon: "M" },
  { name: "Nissan", img: "/Logos/Logo_nissan.jpeg", icon: "N" },
  { name: "Volkswagen", img: "/Logos/Logo_VW.jpeg", icon: "VW" },
  { name: "Honda", img: "/Logos/Logo_honda.jpeg", icon: "H" },
  { name: "Kia", img: "/Logos/Logo_kia.jpeg", icon: "K" },
  { name: "Renault", img: "/Logos/Logo_renault.jpeg", icon: "R" },
  { name: "BYD", img: "/Logos/Logo_BYD.jpeg", icon: "BYD" },
  { name: "Tesla", img: "/Logos/Logo_tesla.jpeg", icon: "T" },
  { name: "Universal", img: "/Logos/Logo_uni.jpeg", icon: "★" },
];

const SEO_BRANDS_BY_NAME = new Map(BRANDS.map((brand) => [brand.name.toLocaleLowerCase("es"), brand]));

const CATEGORIAS = [
  { name: "Repuestos", img: "/Categorias/01_REPUESTOS.png", icon: "⚙️" },
  { name: "Farolas y luces", img: "/Categorias/02_FAROLAS_Y_LUCES.png", icon: "💡" },
  { name: "Pesianas", img: "/Categorias/03_PARRILLAS.png", icon: "🔲" },
  { name: "Bumpers y defensas", img: "/Categorias/04_BUMPERS_Y_DEFENSAS.png", icon: "🛡️" },
  { name: "Estribos", img: "/Categorias/05_ESTRIBOS.png", icon: "➕" },
  { name: "Accesorios interiores", img: "/Categorias/06_ACCESORIOS_INTERIORES.png", icon: "🪑" },
  { name: "Accesorios exteriores", img: "/Categorias/07_ACCESORIOS_EXTERIORES.png", icon: "🚗" },
  { name: "Partes difíciles", img: "/Categorias/08_PIEZAS_DIFICILES.png", icon: "🔍" },
];

const PRODUCTOS = BRANDS.flatMap((brand) => brand.models).slice(0, 6).map((model) => {
  const product = model.products.find((product) => /FAROLAS|PERSIANA|STOPS/.test(product.nombre)) ?? model.products[0];
  return { ...product, marca: product.marca + ' ' + product.modelo, years: product.anio };
});

const BENEFICIOS = [
  {
    icon: <Phone className="w-7 h-7" />,
    title: "Atención personalizada",
    desc: "Te asesoramos para encontrar el repuesto o accesorio exacto que tu vehículo necesita.",
  },
  {
    icon: <Truck className="w-7 h-7" />,
    title: "Envíos a toda Colombia",
    desc: "Despachamos a cualquier ciudad del país con empresas de transporte confiables.",
  },
  {
    icon: <Package className="w-7 h-7" />,
    title: "Productos por pedido",
    desc: "Si no tenemos el producto en stock, lo conseguimos especialmente para ti.",
  },
  {
    icon: <CheckCircle className="w-7 h-7" />,
    title: "Compatibilidad verificada",
    desc: "Confirmamos que el producto sea compatible con la marca, modelo y año de tu vehículo.",
  },
];

const REVIEWS = [
  {
    name: "Carlos Rodríguez",
    vehicle: "Ford Ranger 2021",
    rating: 5,
    text: "Excelente servicio. Conseguí la farola que buscaba hace meses. La atención fue muy rápida y el producto llegó perfecto a Medellín.",
  },
  {
    name: "Laura Martínez",
    vehicle: "Toyota Hilux 2020",
    rating: 5,
    text: "Muy buena calidad en los accesorios. Los estribos quedaron perfectos. Lo recomiendo para quien busque piezas difíciles de encontrar.",
  },
  {
    name: "Andrés Gómez",
    vehicle: "Mazda CX-5 2022",
    rating: 5,
    text: "Los contacté por WhatsApp y en pocos minutos me dieron respuesta. El bumper llegó en perfectas condiciones y a buen precio.",
  },
];

const GALERIA = [
  { img: HEADLIGHT_IMG, alt: "Farola LED instalada" },
  { img: TRUCK_IMG, alt: "Camioneta con accesorios" },
  { img: INTERIOR_IMG, alt: "Interior de vehículo" },
  { img: BUMPER_IMG, alt: "Bumper frontal" },
  { img: ENGINE_IMG, alt: "Repuestos de motor" },
  { img: OFFROAD_IMG, alt: "Jeep con accesorios" },
];

const HERO_SLIDES = [
  { img: HERO_IMG, alt: "Camioneta 4x4 negra" },
  { img: TRUCK_IMG, alt: "Camioneta con accesorios" },
  { img: ENGINE_IMG, alt: "Repuestos de motor" },
  { img: OFFROAD_IMG, alt: "Jeep con accesorios" },
];

function StatusBadge({ status }: { status: ProductStatus }) {
  const styles: Record<ProductStatus, string> = {
    "Disponible": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    "Por pedido": "bg-amber-500/15 text-amber-400 border-amber-500/30",
    "Reservado": "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs border ${styles[status]}`}
      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.05em" }}>
      {status}
    </span>
  );
}

function ProductCard({ product }: { product: typeof PRODUCTOS[0] }) {
  const msg = encodeURIComponent(`Hola, me interesa el producto: ${product.nombre} para ${product.marca} (${product.years}). ¿Cuál es el precio?`);
  const catalogProduct = findProductById(product.id);
  if (!catalogProduct) return null;
  const productUrl = getProductUrl(catalogProduct);
  return (
    <div
      className="bg-[#161616] border border-white/8 rounded-lg overflow-hidden group hover:border-[#c0392b]/40 transition-all duration-300 cursor-pointer"
    >
      <Link to={productUrl} className="block">
        <div className="relative h-48 overflow-hidden bg-white">
          <ProductImage
            src={product.img}
            variant="card"
            alt={product.nombre}
            className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent opacity-60" />
          <div className="absolute top-3 left-3">
            <StatusBadge status={product.estado} />
          </div>
        </div>
        <div className="px-4 pt-4">
          <h4 className="text-white mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "18px" }}>
            {product.nombre}
          </h4>
          <p className="text-[#888] text-sm mb-0.5">{product.marca}</p>
          <p className="text-[#666] text-xs mb-4">Años: {product.years}</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#c0392b] text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.04em" }}>
              Consultar precio
            </span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <a
          href={`https://wa.me/573009492341?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#1e1e1e] hover:bg-[#c0392b] border border-white/10 hover:border-[#c0392b] text-[#d0d0d0] hover:text-white py-2.5 rounded transition-all duration-200 text-sm"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}

export function HomePage() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [tipo, setTipo] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (marca) params.set("marca", marca);
    if (modelo) params.set("modelo", modelo);
    if (anio) params.set("anio", anio);
    if (tipo) params.set("tipo", tipo);
    navigate(`/catalogo?${params.toString()}`);
  };

  return (
    <div className="bg-[#0d0d0d] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SeoHead {...HOME_SEO} />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100svh-216px)] items-center justify-center overflow-hidden md:min-h-[calc(100svh-190px)]">
        <div className="absolute inset-0 bg-[#0a0a0a]">
          {HERO_SLIDES.map((slide, index) => (
            <img
              key={`${slide.alt}-${index}`}
              src={slide.img}
              alt={slide.alt}
              width={index === 0 ? 1920 : 600}
              height={index === 0 ? 900 : 400}
              loading={index === 0 ? "eager" : "lazy"}
              decoding={index === 0 ? "sync" : "async"}
              {...(index === 0 ? { fetchpriority: "high" } : {})}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === activeSlide ? "opacity-40" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 sm:mb-5">
              <div className="h-px w-8 bg-[#c0392b]" />
              <span className="text-[#c0392b] text-sm tracking-widest uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
                Envíos a toda Colombia
              </span>
            </div>
            <h1 className="mb-3 text-white sm:mb-4" style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.75rem)", lineHeight: 1.02 }}>
              Encuentra repuestos, piezas y accesorios para tu vehículo
            </h1>
            <p className="mb-5 text-base leading-relaxed text-[#a0a0a0] sm:mb-6 sm:text-lg" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
              Productos para diferentes marcas y modelos, disponibles en Colombia o por pedido. Atención personalizada por WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/catalogo"
                className="flex items-center justify-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white px-7 py-3.5 rounded transition-all duration-200 hover:scale-105"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                Ver catálogo
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-transparent border border-white/30 hover:border-white/60 text-white px-7 py-3.5 rounded transition-all duration-200"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Cotizar por WhatsApp
              </a>
            </div>

            <div className="mt-4 flex items-center gap-2 sm:mt-5">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={`dot-${slide.alt}-${index}`}
                  type="button"
                  aria-label={`Ver slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${index === activeSlide ? "w-8 bg-[#c0392b]" : "w-2.5 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 opacity-40 xl:flex">
          <div className="w-px h-8 bg-white animate-pulse" />
          <span className="text-white text-xs tracking-widest uppercase" style={{ fontSize: "10px" }}>Scroll</span>
        </div>
      </section>

      {/* ─── MARCAS ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
            Marcas disponibles
          </span>
          <h2 className="text-white">Marcas destacadas</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MARCAS.map((marca) => (
            <Link
              key={marca.name}
              to={SEO_BRANDS_BY_NAME.has(marca.name.toLocaleLowerCase("es"))
                ? getBrandUrl(SEO_BRANDS_BY_NAME.get(marca.name.toLocaleLowerCase("es"))!)
                : `/catalogo?marca=${marca.name}`}
              className="flex flex-col items-center gap-2 bg-[#161616] border border-white/8 hover:border-[#c0392b]/40 rounded-lg p-4 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#1e1e1e] border border-white/10 flex items-center justify-center text-[#c0392b] group-hover:bg-[#c0392b]/10 transition-colors overflow-hidden"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "16px" }}>
                {marca.img ? (
                  <img
                    src={withBasePath(marca.img)}
                    alt={marca.name}
                    width="900"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  marca.icon
                )}
              </div>
              <span className="text-[#888] group-hover:text-white text-xs text-center transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.04em" }}>
                {marca.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-[#666]">Explorar catálogo por marca:</span>
          {BRANDS.map((brand) => (
            <Link
              key={`seo-brand-${brand.slug}`}
              to={getBrandUrl(brand)}
              className="text-[#999] transition-colors hover:text-[#c0392b]"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CATEGORÍAS ───────────────────────────────────── */}
      <section className="bg-[#0a0a0a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
              Lo que ofrecemos
            </span>
            <h2 className="text-white">Categorías de productos</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat.name}
                to={`/catalogo?tipo=${encodeURIComponent(cat.name)}`}
                className="relative h-44 rounded-lg overflow-hidden group cursor-pointer border border-white/8 hover:border-[#c0392b]/50 transition-all duration-300"
              >
                <img src={withBasePath(cat.img)} alt={cat.name} width="1254" height="1254" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                    {cat.name}
                  </p>
                </div>
                <div className="absolute inset-0 bg-[#c0392b]/0 group-hover:bg-[#c0392b]/10 transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTOS DESTACADOS ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
              Selección especial
            </span>
            <h2 className="text-white">Productos destacados</h2>
          </div>
          <Link to="/catalogo"
            className="hidden sm:flex items-center gap-1.5 text-[#c0392b] hover:text-[#e74c3c] transition-colors text-sm"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTOS.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-10">
          <Link to="/catalogo"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-[#c0392b] text-white hover:text-[#c0392b] px-8 py-3 rounded transition-all duration-200"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Ver catálogo completo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── PIEZA DIFÍCIL ────────────────────────────────── */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <img src={PARTS_IMG} alt="Piezas difíciles" width="600" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] to-[#0d0d0d]/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#c0392b]/15 border border-[#c0392b]/30 rounded-full px-4 py-1.5 mb-6">
              <Search className="w-4 h-4 text-[#c0392b]" />
              <span className="text-[#c0392b] text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.08em" }}>
                Buscamos lo que nadie tiene
              </span>
            </div>
            <h2 className="text-white mb-4">¿Buscas una pieza difícil de conseguir?</h2>
            <p className="text-[#a0a0a0] text-base leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Envíanos la marca, el modelo, el año y una fotografía de la pieza que necesitas. Hacemos todo lo posible por conseguirla.
            </p>
            <a
              href={WHATSAPP_PIEZA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white px-8 py-3.5 rounded transition-all duration-200 hover:scale-105"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              Solicitar una pieza
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── CONOCE LUJOSHOP ──────────────────────────────── */}
      <section className="bg-[#0a0a0a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden h-80 lg:h-96 bg-[#111]">
                <img src={ABOUT_IMG} alt="LujoShop" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a]/60 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#c0392b] rounded-lg p-5 hidden lg:flex items-center gap-3">
                <div className="text-center">
                  <div className="text-white text-3xl" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}>100%</div>
                  <div className="text-red-200 text-xs" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" }}>Compatibilidad<br/>verificada</div>
                </div>
              </div>
            </div>
            <div>
              <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
                Quiénes somos
              </span>
              <h2 className="text-white mb-5">Conoce LujoShop</h2>
              <p className="text-[#a0a0a0] text-base leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                LujoShop ayuda a sus clientes a encontrar repuestos, piezas y accesorios para diferentes marcas y modelos, incluyendo productos difíciles de conseguir. Nuestro equipo se encarga de verificar la compatibilidad y garantizar que recibas exactamente lo que necesitas.
              </p>
              <Link
                to="/conocenos"
                className="inline-flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white px-6 py-3 rounded transition-all duration-200"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                Conocer más
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BENEFICIOS ───────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
              ¿Por qué elegirnos?
            </span>
            <h2 className="text-white">Nuestros beneficios</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFICIOS.map((b, i) => (
              <div key={i} className="bg-[#161616] border border-white/8 rounded-lg p-6 hover:border-[#c0392b]/30 transition-colors group">
                <div className="w-12 h-12 rounded bg-[#c0392b]/10 border border-[#c0392b]/20 flex items-center justify-center text-[#c0392b] mb-4 group-hover:bg-[#c0392b]/20 transition-colors">
                  {b.icon}
                </div>
                <h4 className="text-white mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "18px" }}>
                  {b.title}
                </h4>
                <p className="text-[#888] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALERÍA ──────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
              Nuestros trabajos
            </span>
            <h2 className="text-white">Galería</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALERIA.map((item, i) => (
              <div key={i} className={`relative overflow-hidden rounded-lg bg-[#111] ${i === 0 ? "md:row-span-2 md:h-full" : "h-44"}`}>
                <img src={item.img} alt={item.alt} width="600" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OPINIONES ────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
              Lo que dicen nuestros clientes
            </span>
            <h2 className="text-white">Opiniones</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-[#161616] border border-white/8 rounded-lg p-6">
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-[#c0c0c0] text-sm leading-relaxed mb-5 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                  "{r.text}"
                </p>
                <div>
                  <p className="text-white text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px" }}>
                    {r.name}
                  </p>
                  <p className="text-[#666] text-xs">{r.vehicle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ────────────────────────────────────── */}
      <section className="bg-[#c0392b] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            ¿No encontraste la pieza que buscas?
          </h2>
          <p className="text-red-100 text-base mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            Envíanos los datos de tu vehículo y te ayudaremos a encontrarla.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-[#c0392b] px-8 py-3.5 rounded transition-all duration-200 hover:scale-105"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Hablar por WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
}
