from pathlib import Path
import math
from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "animations" / "lujoshop-clean.png"
OUTPUT = ROOT / "public" / "animations" / "lujoshop-llantas.gif"


def ease_out_cubic(value: float) -> float:
    return 1 - (1 - value) ** 3


logo = Image.open(SOURCE).convert("RGBA")
alpha = logo.getchannel("A")

# Detect the red fill, then expand the selection enough to include each
# letter's black outline without changing the original artwork.
red = Image.new("L", logo.size)
red.putdata([
    255 if a > 20 and r > 135 and r > g * 1.35 and r > b * 1.20 else 0
    for r, g, b, a in logo.getdata()
])

l_region = Image.new("L", logo.size)
l_region.paste(255, (70, 430, 420, 740))
s_region = Image.new("L", logo.size)
s_region.paste(255, (430, 430, 880, 740))

l_mask = ImageChops.multiply(red, l_region).filter(ImageFilter.MaxFilter(25))
s_mask = ImageChops.multiply(red, s_region).filter(ImageFilter.MaxFilter(25))
l_mask = ImageChops.multiply(l_mask, alpha)
s_mask = ImageChops.multiply(s_mask, alpha)

l_layer = Image.new("RGBA", logo.size)
l_layer.paste(logo, mask=l_mask)
s_layer = Image.new("RGBA", logo.size)
s_layer.paste(logo, mask=s_mask)

base = logo.copy()
moving_mask = ImageChops.lighter(l_mask, s_mask)
base.putalpha(ImageChops.subtract(alpha, moving_mask))

bounds = (58, 423, 1213, 753)
frames = []
durations = []


def draw_wheel(layer: Image.Image, center_x: int, center_y: int, angle: float):
    """Draw a clearly recognizable rolling automotive tire."""
    radius = 46
    draw = ImageDraw.Draw(layer)
    draw.ellipse((center_x - radius, center_y - radius, center_x + radius, center_y + radius), fill=(12, 12, 14, 255), outline=(105, 105, 110, 255), width=5)
    draw.ellipse((center_x - 32, center_y - 32, center_x + 32, center_y + 32), fill=(42, 43, 47, 255), outline=(190, 190, 195, 255), width=4)
    draw.ellipse((center_x - 12, center_y - 12, center_x + 12, center_y + 12), fill=(230, 45, 57, 255), outline=(8, 8, 9, 255), width=3)
    for spoke in range(6):
        radians = angle + spoke * math.pi / 3
        end_x = center_x + int(math.cos(radians) * 29)
        end_y = center_y + int(math.sin(radians) * 29)
        draw.line((center_x, center_y, end_x, end_y), fill=(220, 220, 224, 255), width=5)
    for tread in range(8):
        radians = angle + tread * math.pi / 4
        x = center_x + int(math.cos(radians) * 40)
        y = center_y + int(math.sin(radians) * 40)
        draw.ellipse((x - 4, y - 4, x + 4, y + 4), fill=(95, 95, 100, 255))


def add_frame(l_x: int, s_x: int, wheel_x: int | None = None, wheel_angle: float = 0, duration: int = 45):
    frame = base.copy()
    frame.alpha_composite(l_layer, (l_x, 0))
    frame.alpha_composite(s_layer, (s_x, 0))
    if wheel_x is not None:
        wheel = Image.new("RGBA", logo.size)
        draw_wheel(wheel, wheel_x, 682, wheel_angle)
        frame.alpha_composite(wheel)
    frame = frame.crop(bounds)
    frame.thumbnail((900, 260), Image.Resampling.LANCZOS)
    frames.append(frame)
    durations.append(duration)


# A rolling tire brings the L in from the left and leaves it in place.
for index in range(17):
    progress = ease_out_cubic(index / 16)
    offset = round(-540 * (1 - progress))
    add_frame(offset, 620, 345 + offset, index * 0.55)

for index in range(7):
    add_frame(0, 620, 345 + index * 95, (17 + index) * 0.55)

# A second tire brings the S in from the right and leaves it in the center.
for index in range(17):
    progress = ease_out_cubic(index / 16)
    offset = round(620 * (1 - progress))
    add_frame(0, offset, 845 + offset, -(index * 0.55))

for index in range(7):
    add_frame(0, 0, 845 + index * 95, -(17 + index) * 0.55)

# Hold the completed logo so it remains readable before looping.
for _ in range(18):
    add_frame(0, 0, None, 0, 90)

frames[0].save(
    OUTPUT,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    disposal=2,
    transparency=0,
    optimize=False,
)

print(OUTPUT)
