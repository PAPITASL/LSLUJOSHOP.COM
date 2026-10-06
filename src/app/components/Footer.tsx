import { Link } from "react-router";
import { Instagram, Facebook, MessageCircle, MapPin, Clock, Mail } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/573009492341?text=Hola%2C%20quiero%20cotizar%20un%20repuesto";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/lg.png" alt="LujoShop" width="900" height="257" loading="lazy" decoding="async" className="h-50 w-auto" />
            </Link>
            <p className="text-[#888] text-sm leading-relaxed mb-5">
              Repuestos, piezas y accesorios para diferentes marcas y modelos. Atención personalizada y envíos a toda Colombia.
            </p>
            <div className="flex items-center gap-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-[#1e1e1e] border border-white/10 flex items-center justify-center text-[#888] hover:text-[#25d366] hover:border-[#25d366]/30 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="https://instagram.com/lujoshop.accesorios" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-[#1e1e1e] border border-white/10 flex items-center justify-center text-[#888] hover:text-[#e1306c] hover:border-[#e1306c]/30 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/Lujoshop.LS" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-[#1e1e1e] border border-white/10 flex items-center justify-center text-[#888] hover:text-[#1877f2] hover:border-[#1877f2]/30 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="text-white uppercase tracking-widest mb-5 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.12em" }}>
              Navegación
            </h5>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Inicio", to: "/" },
                { label: "Catálogo", to: "/catalogo" },
                { label: "Conócenos", to: "/conocenos" },
                { label: "Contáctanos", to: "/contactanos" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[#888] text-sm hover:text-[#c0392b] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-white uppercase tracking-widest mb-5 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.12em" }}>
              Categorías
            </h5>
            <ul className="flex flex-col gap-2.5">
              {[
                "Repuestos",
                "Farolas y luces",
                "Parrillas",
                "Bumpers y defensas",
                "Estribos",
                "Accesorios interiores",
                "Accesorios exteriores",
                "Piezas difíciles",
              ].map((cat) => (
                <li key={cat}>
                  <Link to="/catalogo" className="text-[#888] text-sm hover:text-[#c0392b] transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-white uppercase tracking-widest mb-5 text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.12em" }}>
              Contacto
            </h5>
            <ul className="flex flex-col gap-3">
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[#888] text-sm hover:text-[#c0392b] transition-colors">
                  <MessageCircle className="w-4 h-4 shrink-0 text-[#c0392b]" />
                  WhatsApp: (+57) 300 9492341
                </a>
              </li>
              <li>
                <a href="https://instagram.com/lujoshop.accesorios" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[#888] text-sm hover:text-[#c0392b] transition-colors">
                  <Instagram className="w-4 h-4 shrink-0 text-[#c0392b]" />
                  @lujoshop.accesorios
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[#888] text-sm">
                <MapPin className="w-4 h-4 shrink-0 text-[#c0392b]" />
                Bogotá, Colombia
              </li>
              <li className="flex items-start gap-2.5 text-[#888] text-sm">
                <Clock className="w-4 h-4 shrink-0 text-[#c0392b] mt-0.5" />
                <span>Lunes a viernes: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#555] text-sm">
            © 2026 LujoShop. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            <button className="text-[#555] text-sm hover:text-[#888] transition-colors">Política de privacidad</button>
            <button className="text-[#555] text-sm hover:text-[#888] transition-colors">Política de envíos</button>
            <button className="text-[#555] text-sm hover:text-[#888] transition-colors">Términos y condiciones</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
