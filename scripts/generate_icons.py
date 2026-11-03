from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

INK = (16, 18, 12)
PAPER = (233, 222, 197)
RED = (169, 52, 39)


def font(size: int) -> ImageFont.FreeTypeFont:
    for candidate in ("impact.ttf", "arialbd.ttf", "arial.ttf"):
        path = Path("C:/Windows/Fonts") / candidate
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def make(size: int, maskable: bool = False) -> Image.Image:
    image = Image.new("RGB", (size, size), INK if not maskable else RED)
    draw = ImageDraw.Draw(image)
    if not maskable:
        margin = round(size * 0.11)
        draw.rectangle(
            (margin, margin, size - margin, size - margin),
            fill=RED,
            outline=PAPER,
            width=max(2, round(size * 0.012)),
        )
    label = font(round(size * 0.62))
    box = draw.textbbox((0, 0), "W", font=label)
    x = (size - (box[2] - box[0])) / 2 - box[0]
    y = (size - (box[3] - box[1])) / 2 - box[1]
    draw.text((x, y), "W", font=label, fill=PAPER)
    return image


for size in (192, 512):
    make(size).save(PUBLIC / f"icon-{size}.png", optimize=True)

make(512, maskable=True).save(PUBLIC / "icon-maskable-512.png", optimize=True)
print("icons generated")
