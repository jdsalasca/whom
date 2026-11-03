from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og.png"

INK = (16, 18, 12)
PAPER = (233, 222, 197)
RED = (169, 52, 39)
OLIVE = (92, 102, 71)


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = Path("C:/Windows/Fonts") / name
    return ImageFont.truetype(str(path), size)


W, H = 1200, 630
image = Image.new("RGB", (W, H), INK)
draw = ImageDraw.Draw(image)

# grid
for x in range(0, W, 80):
    draw.line((x, 0, x, H), fill=(24, 27, 18), width=1)
for y in range(0, H, 80):
    draw.line((0, y, W, y), fill=(24, 27, 18), width=1)
for y in range(0, H, 4):
    draw.line((0, y, W, y), fill=(12, 14, 9), width=1)

draw.rectangle((0, 0, W, 34), fill=RED)
draw.text(
    (70, 10), "ARCHIVO ABIERTO · COLOMBIA", font=font("consola.ttf", 15), fill=PAPER
)
draw.text(
    (W - 70, 10),
    "PROYECTO INDEPENDIENTE · NO ESTATAL",
    font=font("consola.ttf", 15),
    fill=PAPER,
    anchor="ra",
)

draw.text((70, 95), "¿DE QUIÉN", font=font("impact.ttf", 104), fill=PAPER)
draw.text((70, 190), "ES LO QUE LEE?", font=font("impact.ttf", 104), fill=RED)

draw.text(
    (72, 330),
    "Medios, marcas y los grupos que están detrás.",
    font=font("arial.ttf", 27),
    fill=(196, 186, 163),
)
draw.text(
    (72, 372),
    "Cada vínculo con fuente, tipo de control y fecha de corte.",
    font=font("arial.ttf", 21),
    fill=(150, 145, 126),
)

draw.line((72, 500, 600, 500), fill=(70, 72, 58), width=1)
draw.text(
    (72, 520),
    "EL CORRAL → NUTRESA → GILINSKI → SEMANA",
    font=font("consola.ttf", 17),
    fill=PAPER,
)
draw.text((72, 560), "whom-colombia.eridu.top", font=font("consola.ttf", 19), fill=RED)

# card
card = Image.new("RGBA", (390, 350), (0, 0, 0, 0))
cd = ImageDraw.Draw(card)
cd.rectangle((0, 0, 389, 349), fill=PAPER + (255,), outline=INK + (255,), width=2)
cd.line((20, 54, 370, 54), fill=INK + (255,), width=1)
cd.text((20, 22), "FORMULARIO 04-B", font=font("consola.ttf", 12), fill=INK)
cd.text((370, 22), "WH-0001", font=font("consola.ttf", 12), fill=INK, anchor="ra")
cd.text((20, 72), "SOLICITUD DE", font=font("impact.ttf", 28), fill=INK)
cd.text((20, 102), "CONSULTA", font=font("impact.ttf", 28), fill=INK)

rows = [
    ("NOMBRE CONSULTADO", "El Corral"),
    ("PROPIETARIO DIRECTO", "Grupo Nutresa"),
    ("CONTROL ÚLTIMO", "Familia Gilinski"),
    ("VÍNCULO CON MEDIOS", "Semana · Dinero · SoHo"),
]
y = 148
for label, value in rows:
    cd.text((20, y), label, font=font("consola.ttf", 10), fill=(80, 78, 64))
    cd.text((20, y + 16), value, font=font("arialbd.ttf", 15), fill=INK)
    cd.line((20, y + 42, 370, y + 42), fill=(160, 150, 125), width=1)
    y += 44

stamp = Image.new("RGBA", (176, 40), (0, 0, 0, 0))
sd = ImageDraw.Draw(stamp)
sd.rectangle((1, 1, 174, 38), outline=RED + (255,), width=3)
sd.text(
    (88, 19), "CONSULTA APROBADA", font=font("consola.ttf", 11), fill=RED, anchor="mm"
)
stamp = stamp.rotate(-7, expand=True, resample=Image.BICUBIC)
card.alpha_composite(stamp, (196, 302))

card = card.rotate(1.5, expand=True, resample=Image.BICUBIC)
shadow = Image.new("RGBA", (card.width + 16, card.height + 16), (0, 0, 0, 0))
sh = ImageDraw.Draw(shadow)
sh.rectangle((16, 16, card.width + 8, card.height + 8), fill=(0, 0, 0, 120))
image.paste(shadow, (720, 120), shadow)
image.paste(card, (712, 112), card)

draw.rectangle((0, H - 6, W, H), fill=RED)
image.save(OUT, optimize=True)
print(OUT)
