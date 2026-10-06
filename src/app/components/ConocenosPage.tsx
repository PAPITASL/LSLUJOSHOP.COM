import { Link } from "react-router";
import { Package, CheckCircle, Truck, Phone, MessageCircle, ArrowRight, Search } from "lucide-react";
import { ABOUT_SEO } from "../seo";
import { SeoHead } from "./SeoHead";

const WHATSAPP_URL = "https://wa.me/573009492341?text=Hola%2C%20quiero%20más%20información%20sobre%20LujoShop";

const TRUCK_IMG = "https://images.unsplash.com/photo-1601252300554-4ad551483bd2?w=800&h=600&fit=crop&auto=format";
const JEEP_IMG = "https://images.unsplash.com/photo-1641784001736-78e8fa1d6a82?w=800&h=600&fit=crop&auto=format";
const PARTS_IMG = "https://images.unsplash.com/photo-1702146713870-8cdd7ab983fb?w=800&h=600&fit=crop&auto=format";
const LIGHTS_IMG = "https://images.unsplash.com/photo-1551464484-74a2f25d01a0?w=800&h=600&fit=crop&auto=format";

const SERVICIOS = [
  { icon: <Search className="w-6 h-6" />, title: "Búsqueda de piezas y referencias específicas", desc: "Investigamos la referencia correcta para que puedas encontrar la pieza que tu vehículo necesita." },
  { icon: <CheckCircle className="w-6 h-6" />, title: "Verificación de compatibilidad", desc: "Revisamos marca, modelo y año antes de confirmar que el producto sea el adecuado." },
  { icon: <Package className="w-6 h-6" />, title: "Venta de productos disponibles y piezas por encargo", desc: "Te ayudamos a conseguir piezas en inventario o mediante solicitud especial para casos difíciles." },
  { icon: <MessageCircle className="w-6 h-6" />, title: "Atención personalizada por WhatsApp y redes sociales", desc: "Respondemos rápidamente, escuchamos tu necesidad y te orientamos con claridad." },
  { icon: <Truck className="w-6 h-6" />, title: "Envíos seguros dentro y fuera de Colombia", desc: "Organizamos entrega nacional e internacional con acompañamiento durante todo el proceso." },
  { icon: <Phone className="w-6 h-6" />, title: "Acompañamiento durante toda la compra", desc: "Te apoyamos desde la consulta inicial hasta la entrega final de tu pedido." },
];

const VALORES = [
  "Confianza: brindamos información clara y transparente.",
  "Responsabilidad: verificamos cuidadosamente cada referencia y compatibilidad.",
  "Servicio: acompañamos al cliente antes, durante y después de su compra.",
  "Compromiso: buscamos soluciones incluso cuando una pieza es difícil de encontrar.",
  "Calidad: seleccionamos productos y proveedores que respondan a las necesidades de nuestros clientes.",
];

export function ConocenosPage() {
  return (
    <div className="bg-[#0d0d0d] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SeoHead {...ABOUT_SEO} />

      {/* Header */}
      <section className="relative pt-4 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={TRUCK_IMG} alt="LujoShop" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/80 via-[#0d0d0d]/60 to-[#0d0d0d]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
      </section>

      {/* Presentación */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
              Nuestra empresa
            </span>
            <h1 className="text-white mb-5">Conoce LujoShop</h1>
            <p className="text-[#a0a0a0] text-base leading-relaxed mb-5">
              LujoShop es una empresa colombiana dedicada a la búsqueda, importación y comercialización de repuestos, piezas y accesorios automotrices para diferentes marcas, modelos y años.
            </p>
            <p className="text-[#a0a0a0] text-base leading-relaxed mb-5">
              Desde nuestros inicios en 2017, trabajamos para ayudar a propietarios de vehículos que necesitan encontrar piezas específicas, diseños especiales o repuestos difíciles de conseguir en el mercado nacional. Contamos con productos para camionetas, automóviles clásicos y vehículos modernos de marcas como Chevrolet, Ford, Toyota, Volkswagen, Nissan, Mazda y otras.
            </p>
            <p className="text-[#a0a0a0] text-base leading-relaxed mb-8">
              Más que vender una pieza, buscamos comprender lo que necesita cada cliente. Por eso revisamos fotografías, referencias, modelos y años del vehículo antes de confirmar la compatibilidad del producto, brindando una atención personalizada, clara y responsable.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Desde", value: "2017" },
                { label: "Proveedores internacionales", value: "USA" },
                { label: "Envíos nacionales", value: "✓" },
                { label: "Atención personalizada", value: "✓" },
              ].map((s, i) => (
                <div key={i} className="bg-[#161616] border border-white/8 rounded-lg p-4">
                  <div className="text-[#c0392b]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "28px" }}>
                    {s.value}
                  </div>
                  <div className="text-[#888] text-xs">{s.label}</div>
                </div>
              ))}
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white px-6 py-3 rounded transition-all duration-200"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              Hablar con nosotros
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-56 rounded-lg overflow-hidden bg-[#111]">
              <img src={JEEP_IMG} alt="LujoShop vehículos" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="h-56 rounded-lg overflow-hidden bg-[#111] mt-6">
              <img src={PARTS_IMG} alt="Repuestos" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="h-44 rounded-lg overflow-hidden bg-[#111]">
              <img src={LIGHTS_IMG} alt="Accesorios" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="h-44 rounded-lg overflow-hidden bg-[#111] mt-0">
              <img src={TRUCK_IMG} alt="Camioneta" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="bg-[#0a0a0a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
              Lo que hacemos
            </span>
            <h2 className="text-white">En LujoShop ayudamos a nuestros clientes a encontrar piezas para conservar, reparar o renovar su vehículo.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICIOS.map((s, i) => (
              <div key={i} className="bg-[#161616] border border-white/8 rounded-lg p-6 hover:border-[#c0392b]/30 transition-colors group">
                <div className="w-12 h-12 rounded bg-[#c0392b]/10 border border-[#c0392b]/20 flex items-center justify-center text-[#c0392b] mb-4 group-hover:bg-[#c0392b]/20 transition-colors">
                  {s.icon}
                </div>
                <h4 className="text-white mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "18px" }}>
                  {s.title}
                </h4>
                <p className="text-[#888] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Propósito */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
                Nuestro propósito
              </span>
              <h2 className="text-white mb-4">Queremos facilitar el acceso a piezas automotrices confiables.</h2>
              <p className="text-[#a0a0a0] text-base leading-relaxed mb-4">
                Entendemos que cada vehículo tiene una historia y que encontrar la pieza correcta puede ser complicado. Por eso nuestro propósito es ofrecer soluciones reales, atención cercana y una experiencia de compra transparente.
              </p>
              <p className="text-[#a0a0a0] text-base leading-relaxed">
                Queremos facilitar el acceso a piezas automotrices confiables, especialmente para aquellos vehículos que todavía tienen mucho camino por recorrer y cuyos propietarios desean mantenerlos en buen estado, conservar su estilo original o renovar sus detalles.
              </p>
            </div>
            <div className="bg-[#161616] border border-white/8 rounded-lg p-8">
              <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
                ¿Por qué elegirnos?
              </span>
              <h3 className="text-white mb-4">Más que repuestos, encontramos soluciones</h3>
              <p className="text-[#a0a0a0] text-base leading-relaxed">
                En LujoShop nos caracterizamos por escuchar al cliente, investigar cada solicitud y buscar la alternativa que mejor se adapte a su vehículo y a su necesidad.
              </p>
              <p className="text-[#a0a0a0] text-base leading-relaxed mt-4">
                No buscamos vender cualquier producto. Nuestro compromiso es orientar al cliente para que tome una decisión informada, reduciendo el riesgo de adquirir una pieza incorrecta y ofreciendo respuestas rápidas durante el proceso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión / Visión / Principios */}
      <section className="bg-[#0a0a0a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
              Nuestra razón de ser
            </span>
            <h2 className="text-white">Misión, visión y principios que guían cada decisión.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161616] to-[#111111] border border-white/10 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#c0392b]/50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(192,57,43,0.18),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative h-full">
                <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-5 block"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.15em" }}>
                  Misión
                </span>
                <p className="text-[#a0a0a0] text-base leading-relaxed">
                  Facilitar la búsqueda y adquisición de repuestos, piezas y accesorios automotrices mediante una atención personalizada, productos de calidad y procesos de compra claros, seguros y confiables.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161616] to-[#111111] border border-white/10 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[#c0392b]/50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(192,57,43,0.18),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative h-full">
                <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-5 block"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.15em" }}>
                  Visión
                </span>
                <p className="text-[#a0a0a0] text-base leading-relaxed">
                  Ser una empresa reconocida en Colombia por la búsqueda y comercialización de piezas automotrices especiales y difíciles de conseguir, fortaleciendo nuestra presencia digital y ampliando nuestro catálogo para atender clientes dentro y fuera del país.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 rounded-2xl bg-[#161616] border border-white/10 p-8 transition-all duration-500 hover:border-[#c0392b]/50 flex flex-col justify-between">
              <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-4 block"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.15em" }}>
                Principios
              </span>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[#a0a0a0] text-sm leading-relaxed">
                {VALORES.map((valor, index) => (
                  <li key={index} className="flex gap-3 items-start rounded-lg bg-white/[0.02] px-3 py-2 border border-white/5">
                    <CheckCircle className="w-4 h-4 text-[#c0392b] mt-1 shrink-0" />
                    <span>{valor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a0a0a] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">Tu vehículo todavía tiene mucho camino</h2>
          <p className="text-[#888] text-base mb-8">
            En LujoShop te ayudamos a encontrar los detalles, piezas y accesorios que necesita para continuar su historia.
          </p>
          <p className="text-[#a0a0a0] text-base mb-8 max-w-2xl mx-auto">
            ¿Estás buscando una pieza específica? Contáctanos y cuéntanos la marca, el modelo y el año de tu vehículo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white px-7 py-3.5 rounded transition-all duration-200 hover:scale-105"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Cotizar por WhatsApp
            </a>
            <Link to="/catalogo"
              className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 text-white px-7 py-3.5 rounded transition-all duration-200"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Ver catálogo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
