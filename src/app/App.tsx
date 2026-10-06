import { BASE_PATH } from "./basePath";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { HomePage } from "./components/HomePage";
import { CatalogoPage } from "./components/CatalogoPage";
import { LegacyProductRedirect, ProductoPage } from "./components/ProductoPage";
import { ConocenosPage } from "./components/ConocenosPage";
import { ContactanosPage } from "./components/ContactanosPage";
import { ScrollReveal } from "./components/ScrollReveal";
import { BrandPage, ModelPage } from "./components/BrandPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d]">
      {/* MARKER-MAKE-KIT-INVOKED */}
      <ScrollToTop />
      <ScrollReveal />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/catalogo" element={<Layout><CatalogoPage /></Layout>} />
      <Route path="/repuestos/:marca/:modelo" element={<Layout><ModelPage /></Layout>} />
      <Route path="/repuestos/:marca" element={<Layout><BrandPage /></Layout>} />
      <Route path="/productos/:slug" element={<Layout><ProductoPage /></Layout>} />
      <Route path="/producto/:id" element={<Layout><LegacyProductRedirect /></Layout>} />
      <Route path="/conocenos" element={<Layout><ConocenosPage /></Layout>} />
      <Route path="/contactanos" element={<Layout><ContactanosPage /></Layout>} />
      <Route path="*" element={<Layout><HomePage /></Layout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <AppRoutes />
    </BrowserRouter>
  );
}
