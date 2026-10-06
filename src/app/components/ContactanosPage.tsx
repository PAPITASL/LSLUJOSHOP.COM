import { useState, useRef } from "react";
import { Instagram, Facebook, MessageCircle, MapPin, Clock, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { CONTACT_SEO } from "../seo";
import { SeoHead } from "./SeoHead";

const WHATSAPP_URL = "https://wa.me/573192382976?text=Hola%2C%20quiero%20cotizar%20un%20repuesto";

interface FormData {
  nombre: string;
  telefono: string;
  correo: string;
  marca: string;
  modelo: string;
  anio: string;
  producto: string;
  mensaje: string;
}

const INITIAL: FormData = {
  nombre: "",
  telefono: "",
  correo: "",
  marca: "",
  modelo: "",
  anio: "",
  producto: "",
  mensaje: "",
};

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  className = "",
  autoComplete = "off",
  inputMode = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[#a0a0a0] text-xs uppercase tracking-widest mb-1.5"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}>
        {label}{required && <span className="text-[#c0392b] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        style={{ fontSize: "16px" }}
        className={`w-full bg-[#1e1e1e] border rounded px-4 py-3 text-[#d0d0d0] placeholder-[#555] text-base md:text-sm focus:outline-none transition-colors ${
          error ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-[#c0392b]/50"
        }`}
      />
      {error && (
        <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactanosPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.nombre.trim()) e.nombre = "Campo requerido";
    if (!form.telefono.trim()) e.telefono = "Campo requerido";
    if (!form.producto.trim()) e.producto = "Campo requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    // Build WhatsApp message from form
    const msg = [
      `*Consulta desde LujoShop*`,
      `Nombre: ${form.nombre}`,
      `Teléfono: ${form.telefono}`,
      form.correo ? `Correo: ${form.correo}` : "",
      form.marca ? `Marca: ${form.marca}` : "",
      form.modelo ? `Modelo: ${form.modelo}` : "",
      form.anio ? `Año: ${form.anio}` : "",
      `Producto: ${form.producto}`,
      form.mensaje ? `Mensaje: ${form.mensaje}` : "",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/573192382976?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
    setForm(INITIAL);
    setFileName("");
  };



  return (
    <div className="bg-[#0d0d0d] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SeoHead {...CONTACT_SEO} />
      {/* Header */}
      <div className="bg-[#0a0a0a] border-b border-white/8 pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#c0392b] text-sm tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}>
            Estamos para ayudarte
          </span>
          <h1 className="text-white mb-2" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Contáctanos
          </h1>
          <p className="text-[#888] text-sm">Cuéntanos qué necesitas y te respondemos lo antes posible.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#161616] border border-white/8 rounded-lg p-6 sm:p-8">
              <h3 className="text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "22px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Formulario de contacto
              </h3>

              {submitted && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-400 text-sm font-medium">¡Mensaje enviado a WhatsApp!</p>
                    <p className="text-emerald-400/70 text-xs mt-0.5">Te redirigimos a WhatsApp para completar tu consulta.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField
                    label="Nombre"
                    value={form.nombre}
                    onChange={set("nombre")}
                    placeholder="Tu nombre completo"
                    required
                    autoComplete="name"
                    inputMode="text"
                    error={errors.nombre}
                  />
                  <InputField
                    label="Teléfono"
                    value={form.telefono}
                    onChange={set("telefono")}
                    type="tel"
                    placeholder="Tu número de WhatsApp"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    error={errors.telefono}
                  />
                </div>

                <InputField
                  label="Correo electrónico (opcional)"
                  value={form.correo}
                  onChange={set("correo")}
                  type="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  inputMode="email"
                  error={errors.correo}
                />

                <div className="border-t border-white/8 pt-5">
                  <p className="text-[#888] text-xs uppercase tracking-widest mb-4"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}>
                    Datos del vehículo
                  </p>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[#a0a0a0] text-xs uppercase tracking-widest mb-1.5"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}>
                        Marca
                      </label>
                      <select
                        name="marca"
                        value={form.marca}
                        onChange={set("marca")}
                        style={{ fontSize: "16px" }}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded px-4 py-2.5 text-[#d0d0d0] text-base md:text-sm focus:outline-none focus:border-[#c0392b]/50 transition-colors"
                      >
                        <option value="">Seleccionar</option>
                        {["Ford", "Chevrolet", "Toyota", "Mazda", "Nissan", "Volkswagen", "Honda", "Otra"].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label="Modelo"
                      value={form.modelo}
                      onChange={set("modelo")}
                      placeholder="Ej: Ranger, Hilux"
                      error={errors.modelo}
                    />
                    <InputField
                      label="Año"
                      value={form.anio}
                      onChange={set("anio")}
                      placeholder="Ej: 2021"
                      inputMode="numeric"
                      error={errors.anio}
                    />
                  </div>
                </div>

                <InputField
                  label="Producto que busca"
                  value={form.producto}
                  onChange={set("producto")}
                  placeholder="Describe el repuesto, pieza o accesorio"
                  required
                  error={errors.producto}
                />

                <div>
                  <label className="block text-[#a0a0a0] text-xs uppercase tracking-widest mb-1.5"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}>
                    Mensaje adicional
                  </label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={set("mensaje")}
                    placeholder="Información adicional sobre lo que necesitas..."
                    rows={6}
                    style={{ fontSize: "16px" }}
                    className="w-full min-h-[150px] bg-[#1e1e1e] border border-white/10 rounded px-4 py-3 text-[#d0d0d0] placeholder-[#555] text-base md:text-sm focus:outline-none focus:border-[#c0392b]/50 transition-colors resize-y"
                  />
                </div>

                {/* Photo upload */}
                <div>
                  <label className="block text-[#a0a0a0] text-xs uppercase tracking-widest mb-1.5"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: "0.1em" }}>
                    Fotografía de la pieza (opcional)
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border border-dashed border-white/15 hover:border-[#c0392b]/40 rounded-lg p-5 text-center cursor-pointer transition-colors group"
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                    />
                    {fileName ? (
                      <p className="text-[#d0d0d0] text-sm">{fileName}</p>
                    ) : (
                      <>
                        <p className="text-[#555] text-sm group-hover:text-[#888] transition-colors">
                          Haz clic para adjuntar una foto de la pieza
                        </p>
                        <p className="text-[#444] text-xs mt-1">JPG, PNG, HEIC — máx. 10MB</p>
                      </>
                    )}
                  </div>
                  <p className="text-[#555] text-xs mt-1.5">
                    * La foto se enviará directamente por WhatsApp al confirmar el formulario.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white py-3.5 rounded transition-all duration-200 hover:scale-[1.01]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "16px", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enviar consulta por WhatsApp
                </button>
              </form>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-5">
            {/* WhatsApp */}
            <div className="bg-[#161616] border border-white/8 rounded-lg p-5">
              <h4 className="text-white mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "17px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Contacto directo
              </h4>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#25d366]/10 border border-[#25d366]/20 rounded-lg hover:bg-[#25d366]/15 transition-colors group mb-3"
              >
                <div className="w-10 h-10 bg-[#25d366] rounded-full flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>WhatsApp</p>
                  <p className="text-[#888] text-xs">[Número de contacto]</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#555] ml-auto group-hover:text-[#25d366] transition-colors" />
              </a>

              <a
                href="https://instagram.com/lujoshop.accesorios"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#e1306c]/10 border border-[#e1306c]/20 rounded-lg hover:bg-[#e1306c]/15 transition-colors group mb-3"
              >
                <div className="w-10 h-10 bg-gradient-to-tr from-[#f09433] via-[#e1306c] to-[#833ab4] rounded-full flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>Instagram</p>
                  <p className="text-[#888] text-xs">@lujoshop.accesorios</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#555] ml-auto group-hover:text-[#e1306c] transition-colors" />
              </a>

              <a
                href="https://www.facebook.com/Lujoshop.LS"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#1877f2]/10 border border-[#1877f2]/20 rounded-lg hover:bg-[#1877f2]/15 transition-colors group"
              >
                <div className="w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center shrink-0">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>Facebook</p>
                  <p className="text-[#888] text-xs">LujoShop</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#555] ml-auto group-hover:text-[#1877f2] transition-colors" />
              </a>
            </div>

            {/* Info */}
            <div className="bg-[#161616] border border-white/8 rounded-lg p-5 space-y-4">
              <h4 className="text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "17px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Información
              </h4>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c0392b] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#a0a0a0] text-sm" style={{ fontWeight: 600 }}>Ciudad</p>
                  <p className="text-[#888] text-xs mt-0.5">Colombia</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#c0392b] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#a0a0a0] text-sm" style={{ fontWeight: 600 }}>Horario de atención</p>
                  <p className="text-[#888] text-xs mt-0.5">[Horario de atención]</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-[#c0392b]/8 border border-[#c0392b]/20 rounded-lg p-4">
              <p className="text-[#d0a0a0] text-xs leading-relaxed">
                Para consultas urgentes, escríbenos directamente por WhatsApp. Respondemos en el menor tiempo posible durante nuestros horarios de atención.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
