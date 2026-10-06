from __future__ import annotations

import json
import re
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\Dell\OneDrive\Documentos\CATALOGO2026F\FORD_LOBO_2008 YA")
OUTPUT = ROOT / "public" / "catalogo-editado" / "ford-lobo-2008"
CATALOG = ROOT / "src" / "data" / "catalogo_ford_lobo_2008.json"
CANVAS_SIZE = 900
MAX_PRODUCT_SIZE = 790


def normalized(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^A-Z0-9]+", "", value.upper())


def best_source(requested: str, sources: list[Path]) -> Path:
    requested_key = normalized(requested)
    exact = [path for path in sources if normalized(path.name) == requested_key]
    if exact:
        return exact[0]
    return max(
        sources,
        key=lambda path: SequenceMatcher(None, requested_key, normalized(path.name)).ratio(),
    )


def remove_white_background(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    rgb = image.convert("RGB")
    difference = ImageChops.difference(rgb, Image.new("RGB", rgb.size, "white")).convert("L")
    alpha = difference.point(lambda value: 0 if value < 7 else min(255, (value - 7) * 15))
    image.putalpha(alpha.filter(ImageFilter.GaussianBlur(0.45)))
    return image


def product_crop(source: Path) -> Image.Image:
    image = Image.open(source).convert("RGBA")
    width, height = image.size

    # Las fichas entregadas sitúan el producto a la izquierda y los datos a la derecha.
    # El recorte queda antes del divisor para que no sobreviva texto en la imagen final.
    split_ratio = 0.585 if width >= height else 0.605
    image = image.crop((0, 0, int(width * split_ratio), height))
    image = remove_white_background(image)

    bounds = image.getchannel("A").getbbox()
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
    similarity = SequenceMatcher(
        None, normalized(requested_name), normalized(source.name)
    ).ratio()
    destination = OUTPUT / requested_name

    product_crop(source).save(destination, "PNG", optimize=True)
    product["img"] = f"/catalogo-editado/ford-lobo-2008/{requested_name}"
    report.append((product["id"], requested_name, source.name, similarity))

CATALOG.write_text(
    json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)

for product_id, requested, matched, similarity in report:
    print(f"{product_id:02d} {similarity:.3f} {requested} <- {matched}")
print(f"Processed {len(report)} products into {OUTPUT}")
