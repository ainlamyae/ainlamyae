"""
Round / circle-style QR code generator.

Makes a circular badge QR code (dot modules, rounded finder "eyes",
decorative dots filling the circle) that is suitable as a profile picture
on GitHub, Google Scholar, etc. Also makes a plain square dot-style version.

Requirements:
    python -m pip install "qrcode[pil]" zxing-cpp

Usage:
    python make_qr.py
    python make_qr.py --url https://example.com --out-dir . --color "#0A66C2"
"""

import argparse
import os
import random

import qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image, ImageDraw

DEFAULT_URL = "https://www.linkedin.com/in/ainlamyae/"


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def get_matrix(url):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, border=0)
    qr.add_data(url)
    qr.make(fit=True)
    return qr.get_matrix()  # list of lists of bool, no border


def in_finder(r, c, n):
    """True if (r, c) is inside one of the three 7x7 finder patterns."""
    return (r < 7 and c < 7) or (r < 7 and c >= n - 7) or (r >= n - 7 and c < 7)


def draw_eye(d, x, y, m, color, bg):
    """Rounded finder pattern at top-left pixel (x, y), module size m."""
    d.rounded_rectangle([x, y, x + 7 * m, y + 7 * m], radius=int(2.2 * m), fill=color)
    d.rounded_rectangle([x + m, y + m, x + 6 * m, y + 6 * m], radius=int(1.5 * m), fill=bg)
    d.rounded_rectangle([x + 2 * m, y + 2 * m, x + 5 * m, y + 5 * m], radius=int(1.0 * m), fill=color)


def draw_qr_modules(d, matrix, ox, oy, m, color, bg, dot_scale=0.88):
    n = len(matrix)
    pad = m * (1 - dot_scale) / 2
    for r in range(n):
        for c in range(n):
            if matrix[r][c] and not in_finder(r, c, n):
                x, y = ox + c * m, oy + r * m
                d.ellipse([x + pad, y + pad, x + m - pad, y + m - pad], fill=color)
    for (fr, fc) in [(0, 0), (0, n - 7), (n - 7, 0)]:
        draw_eye(d, ox + fc * m, oy + fr * m, m, color, bg)


def make_round(url, path, size=1200, color="#0A66C2", bg="#FFFFFF", seed=7):
    """Circular badge: QR in the middle, decorative dots filling the circle."""
    color, bg = hex_to_rgb(color), hex_to_rgb(bg)
    matrix = get_matrix(url)
    n = len(matrix)
    quiet = 3                                   # clear modules around the real QR
    grid = int((n + 2 * quiet) * 1.414) + 4      # module grid that covers the circle
    if (grid - n) % 2:
        grid += 1
    ss = 4                                       # supersampling for smooth edges
    S = size * ss
    m = S / (grid + 2)                           # +2 modules for the outer ring margin
    cx = cy = S / 2
    R = S / 2 - m * 0.4                          # outer ring radius
    inner_R = R - m * 1.3                        # dots stay inside this

    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=bg + (255,))
    ring_w = int(m * 0.55)
    d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=color + (255,), width=ring_w)

    off = (grid - n) // 2                        # QR offset (in modules) inside grid
    ox0 = cx - grid * m / 2
    oy0 = cy - grid * m / 2
    rnd = random.Random(seed)
    pad = m * 0.06
    for r in range(grid):
        for c in range(grid):
            qr_r, qr_c = r - off, c - off
            if -quiet <= qr_r < n + quiet and -quiet <= qr_c < n + quiet:
                continue                         # real QR + quiet zone, drawn below
            x, y = ox0 + c * m, oy0 + r * m
            mx, my = x + m / 2, y + m / 2
            if ((mx - cx) ** 2 + (my - cy) ** 2) ** 0.5 > inner_R - m / 2:
                continue
            if rnd.random() < 0.45:
                d.ellipse([x + pad, y + pad, x + m - pad, y + m - pad], fill=color + (255,))

    draw_qr_modules(d, matrix, ox0 + off * m, oy0 + off * m, m, color + (255,), bg + (255,))
    img = img.resize((size, size), Image.LANCZOS)
    img.save(path)
    return path


def make_square(url, path, size=1200, color="#0A66C2", bg="#FFFFFF"):
    """Plain square QR with round dots and rounded eyes (most robust)."""
    color, bg = hex_to_rgb(color), hex_to_rgb(bg)
    matrix = get_matrix(url)
    n = len(matrix)
    border = 4
    ss = 4
    S = size * ss
    m = S / (n + 2 * border)
    img = Image.new("RGB", (S, S), bg)
    d = ImageDraw.Draw(img)
    draw_qr_modules(d, matrix, border * m, border * m, m, color, bg)
    img = img.resize((size, size), Image.LANCZOS)
    img.save(path)
    return path


def verify(path, expected):
    """Scan test with ZXing (same decoder family many phone scanners use).
    Note: OpenCV's basic QRCodeDetector cannot read dot-style codes, so it is not used."""
    try:
        import zxingcpp
    except ImportError:
        print("  (zxing-cpp not installed, skipping scan test)")
        return None
    im = Image.open(path).convert("RGBA")
    white = Image.new("RGBA", im.size, (255, 255, 255, 255))
    white.alpha_composite(im)
    white = white.convert("RGB")
    ok_all = True
    for s in (1200, 400, 150):
        res = zxingcpp.read_barcodes(white.resize((s, s), Image.LANCZOS))
        ok = any(r.text == expected for r in res)
        ok_all &= ok
        print(f"  scan @ {s}px: {'OK' if ok else 'FAILED'}")
    return ok_all


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--url", default=DEFAULT_URL)
    p.add_argument("--out-dir", default=r"C:\Users\AlanKay\Downloads")
    p.add_argument("--color", default="#0A66C2", help="dot colour (keep it dark)")
    p.add_argument("--bg", default="#FFFFFF")
    p.add_argument("--size", type=int, default=1200)
    a = p.parse_args()
    os.makedirs(a.out_dir, exist_ok=True)

    round_path = make_round(a.url, os.path.join(a.out_dir, "linkedin-qr-round.png"),
                            a.size, a.color, a.bg)
    square_path = make_square(a.url, os.path.join(a.out_dir, "linkedin-qr-square-dots.png"),
                              a.size, a.color, a.bg)
    for pth in (round_path, square_path):
        print(pth)
        verify(pth, a.url)


if __name__ == "__main__":
    main()
