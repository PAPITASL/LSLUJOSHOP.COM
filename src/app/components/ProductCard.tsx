import { Link } from "react-router";
import { getProductUrl, type Product, type ProductStatus } from "../../data/products";
import { whatsappProducto } from "../whatsapp";
import { ProductImage } from "./ProductImage";

function StatusBadge({ status }: { status: ProductStatus }) {
  const styles: Record<ProductStatus, string> = {
    Disponible: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    "Por pedido": "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Reservado: "bg-red-500/15 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs border ${styles[status]}`}
      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.05em" }}
    >
      {status}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const message = encodeURIComponent(
    `Hola, me interesa: ${product.nombre} para ${product.marca} ${product.modelo} (${product.anio}). ¿Cuál es el precio?`,
  );

  return (
    <div className="bg-[#161616] border border-white/8 rounded-lg overflow-hidden group hover:border-[#c0392b]/40 transition-all duration-300 cursor-pointer">
      <Link to={getProductUrl(product)} className="block">
        <div className="relative h-44 overflow-hidden bg-white">
          <ProductImage
            src={product.hasImage ? product.img : "/log.png"}
            variant="card"
            alt={product.nombre}
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute top-3 left-3">
            <StatusBadge status={product.estado} />
          </div>
        </div>
        <div className="px-4 pt-4">
          <p
            className="text-[#666] text-xs mb-0.5"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            {product.categoria}
          </p>
          <h4
            className="text-white mb-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "18px" }}
          >
            {product.nombre}
          </h4>
          <p className="text-[#888] text-sm mb-0.5">{product.marca} {product.modelo}</p>
          <p className="text-[#555] text-xs mb-4">Años: {product.anio}</p>
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[#c0392b] text-sm"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.04em" }}
            >
              Consultar precio
            </span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <a
          href={whatsappProducto(product.id, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#1e1e1e] hover:bg-[#c0392b] border border-white/10 hover:border-[#c0392b] text-[#d0d0d0] hover:text-white py-2.5 rounded transition-all duration-200 text-sm"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
