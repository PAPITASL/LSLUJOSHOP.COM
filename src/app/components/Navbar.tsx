import { withBasePath } from "../basePath";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setScrolled(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Conócenos", href: "/conocenos" },
    { label: "Catálogo", href: "/catalogo" },
    { label: "Contacto", href: "/contactanos" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled || menuOpen ? "border-white/10 bg-[#0d0d0d]/70 shadow-lg shadow-black/40 backdrop-blur-xl" : "border-transparent bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center justify-center py-1">
          <Link to="/" className="flex h-52 items-center justify-center overflow-hidden pt-3 sm:h-32" aria-label="Ir al inicio">
            <img src={withBasePath("/animations/lujoshop-llantas.gif")} alt="LujoShop" width="900" height="257" loading="eager" decoding="async" className="h-auto w-72 max-w-none object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.45)] sm:w-80 lg:w-126" />
          </Link>

          <nav className="-mt-2 hidden w-full max-w-3xl items-center justify-center gap-6 rounded-full bg-gradient-to-r from-transparent via-black/35 to-transparent px-8 pb-2 backdrop-blur-lg md:flex lg:gap-10" aria-label="Navegación principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`relative py-3 text-xs uppercase tracking-[0.22em] transition-colors duration-200 after:absolute after:right-0 after:bottom-1 after:left-0 after:h-0.5 after:origin-left after:bg-[#e6313a] after:transition-transform ${location.pathname === item.href ? "text-white after:scale-x-100" : "text-[#b7b7b7] after:scale-x-0 hover:text-white hover:after:scale-x-100"}`}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded border border-white/20 text-white transition-colors hover:border-[#e6313a] hover:text-[#e6313a] md:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <nav
          id="mobile-navigation"
          className={`${menuOpen ? "grid" : "hidden"} gap-1 border-t border-white/10 bg-black/30 py-3 backdrop-blur-xl md:hidden`}
          aria-label="Navegación móvil"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`rounded px-4 py-3 text-sm uppercase tracking-[0.2em] transition-colors ${location.pathname === item.href ? "bg-[#e6313a] text-white" : "text-[#c7c7c7] hover:bg-white/5 hover:text-white"}`}
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
