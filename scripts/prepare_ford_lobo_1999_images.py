from __future__ import annotations

import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\Dell\OneDrive\Documentos\CATALOGO2026F\FORD_LOBO_1999 YA")
OUTPUT = ROOT / "public" / "catalogo-editado" / "ford-lobo-1999"
DATA = ROOT / "src" / "data"
CANVAS = 900
MARGIN = 58


def find_divider(image: Image.Image) -> int:
    """Locate the long vertical divider between product and text panels."""
    arr = np.asarray(image.convert("L"))
    h, w = arr.shape
    best_x, best_score = int(w * 0.60), 0
    for x in range(int(w * 0.50), int(w * 0.72)):
        band = arr[:, max(0, x - 1) : min(w, x + 2)]
        dark = np.min(band, axis=1) < 215
        score = 0
        run = 0
        for value in dark:
            run = run + 1 if value else 0
            score = max(score, run)
        if score > best_score:
            best_x, best_score = x, score
    return best_x if best_score > h * 0.34 else int(w * 0.61)


def product_bbox(panel: Image.Image) -> tuple[int, int, int, int]:
    rgb = panel.convert("RGB")
    diff = ImageChops.difference(rgb, Image.new("RGB", rgb.size, "white")).convert("L")
    mask = diff.point(lambda p: 255 if p > 13 else 0).filter(ImageFilter.MedianFilter(3))
    arr = np.asarray(mask, dtype=np.uint8)
    h, w = arr.shape

    # Ignore decorative rules at the outer edges of some source sheets.
    arr[: max(3, h // 150), :] = 0
    arr[h - max(3, h // 150) :, :] = 0
    arr[:, : max(2, w // 250)] = 0
    arr[:, w - max(2, w // 250) :] = 0

    try:
        import cv2

        count, labels, stats, _ = cv2.connectedComponentsWithStats(arr, 8)
        keep = np.zeros_like(arr)
        min_area = max(45, int(w * h * 0.000035))
        for label in range(1, count):
            x, y, cw, ch, area = stats[label]
            if area < min_area:
                continue
            if ch <= max(5, h // 180) and cw > w * 0.55:
                continue
            if cw <= max(5, w // 180) and ch > h * 0.55:
                continue
            keep[labels == label] = 255
        ys, xs = np.where(keep > 0)
    except ImportError:
        ys, xs = np.where(arr > 0)

    if len(xs) == 0:
        return (0, 0, w, h)
    pad = max(8, int(min(w, h) * 0.018))
    return (
        max(0, int(xs.min()) - pad),
        max(0, int(ys.min()) - pad),
        min(w, int(xs.max()) + pad + 1),
        min(h, int(ys.max()) + pad + 1),
    )


def prepare(source: Path, destination: Path) -> None:
    with Image.open(source) as original:
        image = original.convert("RGB")
    divider = find_divider(image)
    panel = image.crop((0, 0, divider, image.height))
    product = panel.crop(product_bbox(panel))
    max_side = CANVAS - 2 * MARGIN
    scale = min(max_side / product.width, max_side / product.height)
    size = (max(1, round(product.width * scale)), max(1, round(product.height * scale)))
    product = product.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (CANVAS, CANVAS), "white")
    canvas.paste(product, ((CANVAS - size[0]) // 2, (CANVAS - size[1]) // 2))
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, "PNG", optimize=True)


def update_catalog(files: list[Path]) -> tuple[int, list[str]]:
    replacements = 0
    matched: set[str] = set()
    data_files = [p for p in DATA.rglob("*") if p.suffix.lower() in {".json", ".js", ".ts"}]
    for data_file in data_files:
        text = data_file.read_text(encoding="utf-8")
        updated = text
        for source in files:
            target = f"/catalogo-editado/ford-lobo-1999/{source.name}"
            pattern = re.compile(r'(["\'])([^"\']*' + re.escape(source.name) + r')\1', re.IGNORECASE)
            updated, count = pattern.subn(lambda m: f'{m.group(1)}{target}{m.group(1)}', updated)
            if count:
                replacements += count
                matched.add(source.name)
        if updated != text:
            data_file.write_text(updated, encoding="utf-8")
    return replacements, sorted({p.name for p in files} - matched)


def main() -> None:
    files = sorted(p for p in SOURCE.iterdir() if p.suffix.lower() == ".png")
    if len(files) != 86:
        raise SystemExit(f"Expected 86 source images, found {len(files)}")
    for index, source in enumerate(files, 1):
        prepare(source, OUTPUT / source.name)
        print(f"[{index:02d}/{len(files)}] {source.name}")
    replacements, missing = update_catalog(files)
    print(f"Generated: {len(files)}")
    print(f"Catalog replacements: {replacements}")
    print(f"Unmatched source names: {len(missing)}")
    for name in missing:
        print(f"UNMATCHED {name}")


if __name__ == "__main__":
    main()
