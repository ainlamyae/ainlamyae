# LinkedIn round QR code

A circle-style QR code to use as a profile picture (GitHub, Google Scholar, and other sites) in place of a real photo.
Scanning it opens https://www.linkedin.com/in/ainlamyae/

## Setup
```
python -m pip install "qrcode[pil]" zxing-cpp
```

## Run
```
python make_qr.py --out-dir "C:/Users/AlanKay/Downloads"
```
Options: `--url`, `--color "#0A66C2"` (keep it dark), `--bg "#FFFFFF"`, `--size 1200`.

Outputs:
- `linkedin-qr-round.png`: circular badge with a transparent background outside the circle (the profile-picture version)
- `linkedin-qr-square-dots.png`: square version with round dots (prints well)

The script test-scans each image with ZXing after making it.
Error correction is level H, so the code still scans if up to about 30% of it is damaged.
