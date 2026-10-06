import type { ReactNode } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router";
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { whatsappProducto } from "../whatsapp";
import {
  findProductById,
  findProductBySlug,
  getBrandUrl,
  getModelUrl,
  getProductUrl,
  type ProductStatus,
} from "../../data/products";
import { getProductSeo, PRODUCT_NOT_FOUND_SEO } from "../seo";
import { SeoHead } from "./SeoHead";
import { ProductImage } from "./ProductImage";
import { getBreadcrumbSchema } from "../structuredData";
import { StructuredData } from "./StructuredData";

function StatusBadge({ status }: { status: ProductStatus }) {
  const config: Record<ProductStatus, { label: string; classes: string; icon: ReactNode }> = {
    "Disponible": { label: "Disponible", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: <CheckCircle className="w-4 h-4" /> },
    "Por pedido": { label: "Por pedido", classes: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: <Clock className="w-4 h-4" /> },
    "Reservado": { label: "Reservado", classes: "bg-red-500/15 text-red-400 border-red-500/30", icon: <AlertCircle className="w-4 h-4" /> },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${c.classes}`}
      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.05em" }}>
      {c.icon}
      {c.label}
    </span>
  );
}

function ProductNotFound() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0d0d0d] min-h-screen flex items-center justify-center">
      <SeoHead {...PRODUCT_NOT_FOUND_SEO} />
      <div className="text-center">
        <h1 className="text-white mb-4">Producto no encontrado</h1>
        <button onClick={() => navigate("/catalogo")}
          className="text-[#c0392b] border border-[#c0392b]/40 px-5 py-2 rounded">
          Volver al catálogo
        </button>
      </div>
    </div>
  );
}

export function LegacyProductRedirect() {
  const { id } = useParams();
  const product = findProductById(id);

  return product ? <Navigate to={getProductUrl(product)} replace /> : <ProductNotFound />;
}

export function ProductoPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = findProductBySlug(slug);

  if (!product) return <ProductNotFound />;

  const msg = encodeURIComponent(`Hola, me interesa el producto: *${product.nombre}* para ${product.marca} ${product.modelo} (${product.anio}). ¿Cuál es el precio y disponibilidad?`);
  const WHATSAPP_URL = whatsappProducto(product.id, msg);
  const productSeo = getProductSeo(product);

  return (
    <div className="bg-[#0d0d0d] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SeoHead {...productSeo} />
      <StructuredData
        data={getBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: product.marca, path: getBrandUrl(product.marca) },
          { name: product.modelo, path: getModelUrl(product.marca, product.modelo) },
          { name: product.nombre, path: getProductUrl(product) },
        ])}
      />
      {/* Breadcrumb */}
      <div className="bg-[#0a0a0a] border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-[#555]">
            <Link to="/" className="hover:text-[#c0392b] transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={getBrandUrl(product.marca)} className="hover:text-[#c0392b] transition-colors">{product.marca}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={getModelUrl(product.marca, product.modelo)} className="hover:text-[#c0392b] transition-colors">{product.modelo}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#888] truncate max-w-48">{product.nombre}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#888] hover:text-white transition-colors text-sm mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al catálogo
        </button>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image gallery */}
          <div>
            <div className="relative mb-3 h-80 overflow-hidden rounded-lg bg-white sm:h-96">
              <ProductImage
                src={product.hasImage ? product.img : "/log.png"}
                variant="large"
                critical
                alt={product.nombre}
                className="h-full w-full object-contain p-5 sm:p-7"
              />
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-[#c0392b] text-xs uppercase tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.12em" }}>
                {product.categoria}
              </span>
            </div>
            <h1 className="text-white mb-4" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
              {product.nombre}
            </h1>
            <div className="mb-5">
              <StatusBadge status={product.estado} />
            </div>

            {/* Specs */}
            <div className="bg-[#161616] border border-white/8 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#555] text-xs uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
                    Marca compatible
                  </p>
                  <p className="text-white text-sm">{product.marca}</p>
                </div>
                <div>
                  <p className="text-[#555] text-xs uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
                    Modelo
                  </p>
                  <p className="text-white text-sm">{product.modelo}</p>
                </div>
                <div>
                  <p className="text-[#555] text-xs uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
                    Año
                  </p>
                  <p className="text-white text-sm">{product.anio}</p>
                </div>
                <div>
                  <p className="text-[#555] text-xs uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
                    Referencia
                  </p>
                  <p className="text-white text-sm">{product.referencia ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[#555] text-xs uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
                    Categoría
                  </p>
                  <p className="text-white text-sm">{product.categoria}</p>
                </div>
                <div>
                  <p className="text-[#555] text-xs uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
                    Subcategoría
                  </p>
                  <p className="text-white text-sm">{product.subcategoria ?? "—"}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="text-white mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Descripción
              </h4>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">{product.desc}</p>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mb-6">
              <h4 className="text-amber-400 mb-1.5 flex items-center gap-1.5" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                <AlertCircle className="w-4 h-4" />
                Observaciones
              </h4>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">Confirma la compatible con tu vehículo antes de confirmar el pedido; la referencia del producto y el año del modelo ayudarán a validar la compra.</p>
            </div>

            {/* Price & CTA */}
            <div className="bg-[#161616] border border-white/8 rounded-lg p-5 mb-4">
              <p className="text-[#888] text-xs uppercase tracking-widest mb-1"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>
                Precio
              </p>
              <p className="text-[#c0392b] mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "26px" }}>
                Consultar precio
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white py-3.5 rounded transition-all duration-200 hover:scale-[1.02]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </div>

            {/* Compatibility note */}
            <div className="bg-[#c0392b]/8 border border-[#c0392b]/20 rounded-lg p-4">
              <p className="text-[#d0a0a0] text-xs leading-relaxed flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#c0392b] shrink-0 mt-0.5" />
                Confirma la compatibilidad enviándonos la marca, el modelo y el año de tu vehículo antes de confirmar el pedido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
