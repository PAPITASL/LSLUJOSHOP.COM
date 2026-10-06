from pathlib import Path
import json
import re
from PIL import Image, ImageChops, ImageStat

SOURCE = Path(r"C:\Users\Dell\OneDrive\Documentos\CATALOGO2026F\FORD_BRONCO_1980-1996 YA")
PUBLIC = Path(__file__).resolve().parents[1] / "public" / "catalogo-editado"

FILES = [
"FORD_BRONCO_FULL_SIZE_1980-1996_AMORTIGUADORES_DELANTEROS_PAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_1980-1996_ANTENA_RADIO_AM-FM_CON_BASE_Y_CABLE.jpg.png",
"FORD_BRONCO_FULL_SIZE_1980-1996_BUJES_SUSPENSION_CON_CASQUILLO_PAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_1980-1996_KIT_ADMISION_AIRE_FRIO_FILTRO_CONICO.jpg.png",
"FORD_BRONCO_FULL_SIZE_1987-1996_KIT_FRENOS_DISCOS_PERFORADOS_Y_PASTILLAS.jpg.png",
"FORD_BRONCO_FULL_SIZE_1987-1996_KIT_FRENOS_DISCOS_PERFORADOS_Y_PASTILLAS_02_POR_CONFIRMAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_1987-1996_STOPS_TRASEROS_EURO_NEGRO-ROJO_PAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_1987-1996_STOPS_TRASEROS_LED_ROJOS_PAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_1987-1996_STOPS_TRASEROS_NEGRO-ROJO_PAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_1987-1996_STOPS_TRASEROS_PHANTOM_SMOKE_PAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_CARATULAS_TABLERO_ILUMINADAS_AZUL-ROJO.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_KIT_FAROLAS_DELANTERAS_AHUMADAS.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_KIT_FAROLAS_DELANTERAS_CON_BOMBILLOS_LED.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_KIT_FAROLAS_DELANTERAS_CON_DRL_LED.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_KIT_FAROLAS_DIRECCIONALES_Y_STOPS_AHUMADOS.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_PARRILLA_BILLET_FRONTAL_CROMADA.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_PARRILLA_BILLET_FRONTAL_NEGRA.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_TERCERA_LUZ_FRENO_LED_AHUMADA_INSTALADA.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_TERCERA_LUZ_FRENO_LED_AHUMADA_PRODUCTO.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_TERCERA_LUZ_FRENO_LED_ROJA_APAGADA.jpg.png",
"FORD_BRONCO_FULL_SIZE_1992-1996_TERCERA_LUZ_FRENO_LED_ROJA_ENCENDIDA.jpg (2).png",
"FORD_BRONCO_FULL_SIZE_1992-1996_TERCERA_LUZ_FRENO_LED_ROJA_ENCENDIDA.jpg.png",
"FORD_BRONCO_FULL_SIZE_1993-1996_TENSOR_CORREA_ACCESORIOS_5.0L-5.8L.jpg.png",
"FORD_BRONCO_FULL_SIZE_F150_1987-1996_STOPS_TRASEROS_LED_AHUMADOS_PAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_F150_1987-1996_STOPS_TRASEROS_LED_GUIA_DE_LUZ_AHUMADOS_PAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_F150_1992-1996_FAROLAS_PROJECTOR_CON_HALO_PAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_F150_1992-1996_FAROLAS_PROJECTOR_HALO_Y_BARRAS_LED_PAR.jpg.png",
"FORD_BRONCO_FULL_SIZE_PAR_RESORTES_HELICOIDALES_DELANTEROS_PAR.jpg.png",
"FORD_BRONCO_INTERRUPTOR_MEMORIA_ASIENTO_POSICIONES_1-2.jpg.png",
"MAZDA_PROTEGE_323_2001-2003_FAROLAS_DELANTERAS_FONDO_NEGRO_PAR.jpg.png",
"TOYOTA_HILUX_REVO_SR5_2015-2017_EXTENSIONES_GUARDABARROS_NEGRO_6IN_4PZ.jpg.png",
"TOYOTA_HILUX_VIGO_2011-2015_PROTECTOR_INFERIOR_BUMPER_DELANTERO_NEGRO_MATE.jpg.png",
]

def slug(s):
    s = s.lower().replace(".jpg", "")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

def category(name):
    if name.startswith("MAZDA_"):
        return "mazda-protege-323-2001-2003", "Mazda Protegé / 323 2001-2003"
    if name.startswith("TOYOTA_HILUX_REVO"):
        return "toyota-hilux-revo-sr5-2015-2017", "Toyota Hilux Revo SR5 2015-2017"
    if name.startswith("TOYOTA_HILUX_VIGO"):
        return "toyota-hilux-vigo-2011-2015", "Toyota Hilux Vigo 2011-2015"
    return "ford-bronco-full-size-1980-1996", "Ford Bronco Full Size 1980-1996"

def title(name):
    stem = name.replace(".jpg.png", "").replace(".png", "")
    stem = re.sub(r"^(FORD_BRONCO_FULL_SIZE_F150|FORD_BRONCO_FULL_SIZE|FORD_BRONCO|MAZDA_PROTEGE_323|TOYOTA_HILUX_REVO_SR5|TOYOTA_HILUX_VIGO)_?", "", stem)
    stem = re.sub(r"^\d{4}-\d{4}_?", "", stem)
    return stem.replace("_", " ").replace(" 02 POR CONFIRMAR", " - variante 2").title()

def bbox_product(im):
    # Las fichas originales colocan el producto a la izquierda y los textos a la derecha.
    left = im.crop((0, 0, int(im.width * .565), im.height)).convert("RGB")
    bg = Image.new("RGB", left.size, (255, 255, 255))
    diff = ImageChops.difference(left, bg).convert("L")
    # Conserva piezas cromadas y sombras tenues sin incluir el fondo casi blanco.
    mask = diff.point(lambda x: 255 if x > 10 else 0)
    box = mask.getbbox()
    if not box:
        return left
    x0, y0, x1, y1 = box
    pad = max(10, int(min(left.size) * .015))
    return left.crop((max(0, x0-pad), max(0, y0-pad), min(left.width, x1+pad), min(left.height, y1+pad)))

def main():
    manifest = []
    missing = []
    for filename in FILES:
        src = SOURCE / filename
        if not src.exists():
            missing.append(filename)
            continue
        cat_slug, vehicle = category(filename)
        out_dir = PUBLIC / cat_slug
        out_dir.mkdir(parents=True, exist_ok=True)
        out_name = slug(filename) + ".webp"
        with Image.open(src) as original:
            product = bbox_product(original)
            product.thumbnail((790, 790), Image.Resampling.LANCZOS)
            canvas = Image.new("RGB", (900, 900), "white")
            canvas.paste(product, ((900-product.width)//2, (900-product.height)//2))
            canvas.save(out_dir / out_name, "WEBP", quality=92, method=6)
        manifest.append({
            "id": slug(filename), "name": title(filename), "vehicle": vehicle,
            "category": cat_slug, "image": f"/catalogo-editado/{cat_slug}/{out_name}"
        })
    (PUBLIC / "ford-bronco-1980-1996-manifest.json").write_text(
        json.dumps({"products": manifest, "missing": missing}, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    if missing:
        raise SystemExit("Faltan archivos: " + ", ".join(missing))

if __name__ == "__main__":
    main()
