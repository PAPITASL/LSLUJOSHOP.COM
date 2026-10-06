from __future__ import annotations

import json
import re
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\Dell\OneDrive\Documentos\CATALOGO2026F\VOLKSWAGEN_MK4_GOLF_99_2006 YA")
OUTPUT = ROOT / "public" / "catalogo-editado" / "volkswagen-golf-mk4"
CATALOG = ROOT / "src" / "data" / "catalogo_VW_golfmk4_99_06.json"
CANVAS_SIZE = 900
MAX_PRODUCT_SIZE = 790

# These source files already contain only the product and need no panel crop.
PRODUCT_ONLY = {
    "VOLKSWAGEN_MK4_GOLF_99_2006_FAROLA_TRASERA_LED_ROJA_BLANCA.png",
    "VOLKSWAGEN_MK4_GOLF_99_2006_PERILLA_CAMBIOS_5_VELOCIDADES_FUELLE_NEGRO.png",
    "VOLKSWAGEN_MK4_GOLF_99_2006_PERILLA_CAMBIOS_5_VELOCIDADES_FUELLE_ROJO.png",
    "VOLKSWAGEN_MK4_GOLF_99_2006_SEMIEJE_DELANTERO_COMPLETO.png",
    "VOLKSWAGEN_MK4_GOLF_99_2006_TAPA_PLASTICA_INTERIOR_PUERTA.png",
}


def normalized(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = value.upper().replace("ANGLE", "ANGEL")
    value = value.replace("INOXIDABLE", "").replace("MAESTRO", "")
    value = value.replace("LIP_DELANTERO_", "")
    return re.sub(r"[^A-Z0-9]+", "", value)


def best_source(requested: str, sources: list[Path]) -> Path:
    requested_key = normalized(requested)
    exact = [path for path in sources if normalized(path.name) == requested_key]
    if exact:
        return exact[0]
    return max(sources, key=lambda path: SequenceMatcher(None, requested_key, normalized(path.name)).ratio())


def remove_white_background(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    rgb = image.convert("RGB")

    # Distance from white retains dark/light product details and soft shadows.
    white = Image.new("RGB", rgb.size, "white")
    difference = ImageChops.difference(rgb, white).convert("L")
    alpha = difference.point(lambda value: 0 if value < 7 else min(255, (value - 7) * 15))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.45))
    image.putalpha(alpha)
    return image


def product_crop(source: Path) -> Image.Image:
    image = Image.open(source).convert("RGBA")
    width, height = image.size

    if source.name not in PRODUCT_ONLY:
        # All supplied catalog sheets place the product on the left and the
        # information panel on the right. The small inset excludes its divider.
        split_ratio = 0.585 if width >= height else 0.605
        image = image.crop((0, 0, int(width * split_ratio), height))

    image = remove_white_background(image)
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if not bounds:
        raise RuntimeError(f"No foreground detected in {source.name}")
    image = image.crop(bounds)

    scale = min(MAX_PRODUCT_SIZE / image.width, MAX_PRODUCT_SIZE / image.height)
    resized = image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (255, 255, 255, 255))
    position = ((CANVAS_SIZE - resized.width) // 2, (CANVAS_SIZE - resized.height) // 2)
    canvas.alpha_composite(resized, position)
    return canvas


OUTPUT.mkdir(parents=True, exist_ok=True)
sources = sorted(SOURCE.glob("*.png"))
catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
report = []

for product in catalog:
    requested_name = Path(product["img"]).name
    source = best_source(requested_name, sources)
    similarity = SequenceMatcher(None, normalized(requested_name), normalized(source.name)).ratio()
    destination = OUTPUT / requested_name

    product_crop(source).save(destination, "PNG", optimize=True)

    product["img"] = f"/catalogo-editado/volkswagen-golf-mk4/{requested_name}"
    report.append((product["id"], requested_name, source.name, similarity))

CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

for product_id, requested, matched, similarity in report:
    print(f"{product_id:02d} {similarity:.3f} {requested} <- {matched}")
print(f"Processed {len(report)} products into {OUTPUT}")
