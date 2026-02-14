from PIL import Image, ImageDraw
import os
import math

# Output paths
LOGO_PATH = r"C:\Users\USER-PC\Desktop\appintoss-project\daily-idiom\logo.png"
APP_LOGOS_PATH = r"C:\Users\USER-PC\Desktop\appintoss-project\app-logos\daily-idiom.png"

SIZE = 600
BG_COLOR = (185, 28, 28)       # #B91C1C deep red (traditional seal)
WHITE = (255, 255, 255)
CREAM = (255, 253, 247)         # warm ivory
DARK_INK = (28, 25, 23)         # #1C1917 deep ink


def draw_rounded_rect(draw, bbox, radius, fill):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = bbox
    draw.rounded_rectangle(bbox, radius=radius, fill=fill)


def draw_thick_line(d, start, end, width, color):
    """Draw a thick line with round caps."""
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    length = math.sqrt(dx * dx + dy * dy)
    if length == 0:
        return
    px = -dy / length * (width / 2)
    py = dx / length * (width / 2)
    poly = [
        (start[0] + px, start[1] + py),
        (start[0] - px, start[1] - py),
        (end[0] - px, end[1] - py),
        (end[0] + px, end[1] + py),
    ]
    d.polygon(poly, fill=color)
    d.ellipse([start[0] - width / 2, start[1] - width / 2,
               start[0] + width / 2, start[1] + width / 2], fill=color)
    d.ellipse([end[0] - width / 2, end[1] - width / 2,
               end[0] + width / 2, end[1] + width / 2], fill=color)


def create_daily_idiom_logo():
    img = Image.new('RGBA', (SIZE, SIZE), BG_COLOR)
    cx, cy = SIZE // 2, SIZE // 2

    # =========================================================
    # SEAL STAMP - Traditional square seal (인장/도장)
    # A white/cream square with slightly rounded corners
    # representing a carved stone seal — the hero element
    # =========================================================

    seal_layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    seal_draw = ImageDraw.Draw(seal_layer)

    # Outer seal square
    seal_size = 280
    seal_x1 = cx - seal_size // 2
    seal_y1 = cy - seal_size // 2 - 10  # slightly above center
    seal_x2 = seal_x1 + seal_size
    seal_y2 = seal_y1 + seal_size

    seal_draw.rounded_rectangle(
        [seal_x1, seal_y1, seal_x2, seal_y2],
        radius=16,
        fill=CREAM
    )

    img = Image.alpha_composite(img, seal_layer)

    # =========================================================
    # INNER BORDER - Double-line seal border (전통 인장 테두리)
    # Traditional seals have a carved border frame
    # =========================================================

    border_layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    border_draw = ImageDraw.Draw(border_layer)

    # Inner border (carved line effect — red on cream)
    border_margin = 18
    border_width = 5
    bx1 = seal_x1 + border_margin
    by1 = seal_y1 + border_margin
    bx2 = seal_x2 - border_margin
    by2 = seal_y2 - border_margin

    border_color = (185, 28, 28, 180)  # semi-transparent red

    # Top
    border_draw.rectangle([bx1, by1, bx2, by1 + border_width], fill=border_color)
    # Bottom
    border_draw.rectangle([bx1, by2 - border_width, bx2, by2], fill=border_color)
    # Left
    border_draw.rectangle([bx1, by1, bx1 + border_width, by2], fill=border_color)
    # Right
    border_draw.rectangle([bx2 - border_width, by1, bx2, by2], fill=border_color)

    img = Image.alpha_composite(img, border_layer)

    # =========================================================
    # CHARACTER "文" - Simplified bold geometric character
    # Represents 사자성어 (Chinese characters / literature)
    # Drawn as bold geometric strokes in dark ink color
    # but rendered in red to match seal carving aesthetic
    # =========================================================

    char_layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    char_draw = ImageDraw.Draw(char_layer)

    char_color = BG_COLOR  # red on cream = traditional seal carving look
    stroke_w = 18

    # Center of character area
    ch_cx = cx
    ch_cy = cy - 10

    # "文" character - geometric abstraction
    # Stroke 1: Top horizontal dot/short stroke (亠 top part)
    draw_thick_line(char_draw,
                    (ch_cx - 8, ch_cy - 90),
                    (ch_cx + 8, ch_cy - 90),
                    stroke_w + 4, char_color)

    # Stroke 2: Long horizontal stroke
    draw_thick_line(char_draw,
                    (ch_cx - 80, ch_cy - 48),
                    (ch_cx + 80, ch_cy - 48),
                    stroke_w, char_color)

    # Stroke 3: Left-falling stroke (撇 piě) — diagonal left
    draw_thick_line(char_draw,
                    (ch_cx + 5, ch_cy - 48),
                    (ch_cx - 75, ch_cy + 85),
                    stroke_w, char_color)

    # Stroke 4: Right-falling stroke (捺 nà) — diagonal right
    draw_thick_line(char_draw,
                    (ch_cx - 5, ch_cy - 48),
                    (ch_cx + 75, ch_cy + 85),
                    stroke_w, char_color)

    img = Image.alpha_composite(img, char_layer)

    # =========================================================
    # SCROLL EDGE - Small decorative scroll curl at bottom
    # Suggests the 두루마리 (scroll) worldview element
    # =========================================================

    scroll_layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    scroll_draw = ImageDraw.Draw(scroll_layer)

    scroll_color = (255, 255, 255, 100)

    # Small scroll curl below the seal
    scroll_y = seal_y2 + 22
    scroll_w = 160
    scroll_h = 8

    scroll_draw.rounded_rectangle(
        [cx - scroll_w // 2, scroll_y, cx + scroll_w // 2, scroll_y + scroll_h],
        radius=4,
        fill=scroll_color
    )

    # Scroll end curls (small circles at each end)
    curl_r = 7
    scroll_draw.ellipse(
        [cx - scroll_w // 2 - curl_r, scroll_y - curl_r + scroll_h // 2,
         cx - scroll_w // 2 + curl_r, scroll_y + curl_r + scroll_h // 2],
        fill=scroll_color
    )
    scroll_draw.ellipse(
        [cx + scroll_w // 2 - curl_r, scroll_y - curl_r + scroll_h // 2,
         cx + scroll_w // 2 + curl_r, scroll_y + curl_r + scroll_h // 2],
        fill=scroll_color
    )

    img = Image.alpha_composite(img, scroll_layer)

    # =========================================================
    # DECORATIVE CORNER MARKS
    # Traditional seal often has small marks at canvas corners
    # =========================================================

    accent_layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    accent_draw = ImageDraw.Draw(accent_layer)

    accent_color = (255, 255, 255, 35)
    dot_r = 4
    for pos in [(60, 60), (540, 60), (60, 540), (540, 540)]:
        accent_draw.ellipse(
            [pos[0] - dot_r, pos[1] - dot_r,
             pos[0] + dot_r, pos[1] + dot_r],
            fill=accent_color
        )

    img = Image.alpha_composite(img, accent_layer)

    # =========================================================
    # SAVE
    # =========================================================

    final = img.convert('RGB')

    os.makedirs(os.path.dirname(LOGO_PATH), exist_ok=True)
    final.save(LOGO_PATH, 'PNG')
    print(f"Logo saved to: {LOGO_PATH}")

    os.makedirs(os.path.dirname(APP_LOGOS_PATH), exist_ok=True)
    final.save(APP_LOGOS_PATH, 'PNG')
    print(f"Logo copied to: {APP_LOGOS_PATH}")

    print(f"Size: {final.size[0]}x{final.size[1]}px")


if __name__ == '__main__':
    create_daily_idiom_logo()
