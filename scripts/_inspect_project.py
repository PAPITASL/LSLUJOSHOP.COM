from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "tmp_project_report.png"


def font(size=18):
    for candidate in (
        Path("C:/Windows/Fonts/consola.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    ):
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


ignored = {"node_modules", ".git", "dist", "build", ".vite"}
files = []
for path in ROOT.rglob("*"):
    if not path.is_file() or any(part in ignored for part in path.parts):
        continue
    rel = path.relative_to(ROOT)
    if rel.suffix.lower() in {".js", ".jsx", ".ts", ".tsx", ".json", ".py", ".css", ".html"}:
        files.append(str(rel))

lines = [f"ROOT: {ROOT}", f"ARCHIVOS RELEVANTES: {len(files)}", ""] + sorted(files)[:180]
fnt = font(17)
line_h = 23
img = Image.new("RGB", (1800, max(800, 50 + len(lines) * line_h)), "white")
draw = ImageDraw.Draw(img)
for i, line in enumerate(lines):
    draw.text((25, 20 + i * line_h), line, fill="black", font=fnt)
img.save(OUT)
