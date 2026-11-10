#!/usr/bin/env bash
# render.sh — render a wireframe HTML file to a trimmed PNG.
#
#   render.sh <input.html> [output.png] [options]
#
# Options:
#   --width N     layout width in CSS px (default 1600)
#   --height N    capture height in CSS px (default 6000, trimmed afterwards)
#   --scale N     device scale factor (default 2 = retina-crisp)
#   --inline      write a self-contained copy next to the PNG (<name>.standalone.html)
#   --html-only   do not render, only write the self-contained copy
#   --open        open the PNG when done (default on macOS/Linux desktop)
#
# The HTML may <link rel="stylesheet" href="wireframe.css">; that link is
# resolved against the HTML's own directory first, then this skill's assets/,
# and inlined so the output never depends on a missing file.
set -euo pipefail

usage() { sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'; exit 2; }

[[ $# -ge 1 ]] || usage
in_html=$1; shift
out_png=""
if [[ $# -ge 1 && ${1:-} != --* ]]; then out_png=$1; shift; fi

width=1600
height=6000
scale=2
inline=0
html_only=0
open_after=0

while [[ $# -gt 0 ]]; do
  case $1 in
    --width)   width=$2; shift 2 ;;
    --height)  height=$2; shift 2 ;;
    --scale)   scale=$2; shift 2 ;;
    --inline)  inline=1; shift ;;
    --html-only) html_only=1; shift ;;
    --open)    open_after=1; shift ;;
    -h|--help) usage ;;
    *) echo "unknown option: $1" >&2; usage ;;
  esac
done

[[ -f $in_html ]] || { echo "no such file: $in_html" >&2; exit 1; }

skill_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
in_dir=$(cd -- "$(dirname -- "$in_html")" && pwd)
in_base=$(basename -- "$in_html" .html)
if [[ -z $out_png ]]; then out_png="${in_html%.html}.png"; fi
out_png_dir=$(cd -- "$(dirname -- "$out_png")" && pwd)
out_png="$out_png_dir/$(basename -- "$out_png")"

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# ── 1. inline every local stylesheet so the file is self-contained ──────────
python3 - "$in_html" "$in_dir" "$skill_dir/assets" "$work" <<'PY'
import os, re, sys
src, in_dir, asset_dir, work = sys.argv[1:5]
html = open(src, encoding="utf-8").read()
missing = []

def inline_css(m):
    href = m.group(1)
    if re.match(r"^(https?:)?//", href):
        return m.group(0)          # leave remote links as they are
    for base in (in_dir, asset_dir, os.getcwd()):
        p = os.path.join(base, href)
        if os.path.isfile(p):
            return "<style>\n" + open(p, encoding="utf-8").read() + "\n</style>"
    missing.append(href)
    return m.group(0)

html = re.sub(r'<link[^>]+rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*>',
              inline_css, html)
html = re.sub(r'<link[^>]+href=["\']([^"\']+\.css)["\'][^>]*rel=["\']stylesheet["\'][^>]*>',
              inline_css, html)

if missing:
    sys.stderr.write("warning: stylesheet(s) not found, left as links: " + ", ".join(missing) + "\n")

open(os.path.join(work, "page.html"), "w", encoding="utf-8").write(html)
PY

standalone="$out_png_dir/$in_base.standalone.html"
if [[ $inline -eq 1 || $html_only -eq 1 ]]; then
  cp "$work/page.html" "$standalone"
  echo "html: $standalone"
fi
[[ $html_only -eq 1 ]] && exit 0

# ── 2. screenshot with headless Chromium ───────────────────────────────────
browser=""
for c in chromium chromium-browser google-chrome google-chrome-stable \
         "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
  if command -v "$c" >/dev/null 2>&1 || [[ -x $c ]]; then browser=$c; break; fi
done
[[ -n $browser ]] || { echo "error: no Chromium/Chrome found (set PATH or install chromium)" >&2; exit 1; }

shot="$work/shot.png"
"$browser" \
  --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --user-data-dir="$work/profile" \
  --force-device-scale-factor="$scale" \
  --window-size="$width,$height" \
  --virtual-time-budget=4000 \
  --run-all-compositor-stages-before-draw \
  --default-background-color=ffffffff \
  --screenshot="$shot" \
  "file://$work/page.html" >/dev/null 2>&1 || {
    echo "error: headless render failed (try running the browser command by hand)" >&2; exit 1; }

[[ -s $shot ]] || { echo "error: no screenshot produced" >&2; exit 1; }

# ── 3. trim the empty canvas, keep a 32px paper margin ─────────────────────
if command -v magick >/dev/null 2>&1; then trim=(magick); elif command -v convert >/dev/null 2>&1; then trim=(convert); else trim=(); fi
if [[ ${#trim[@]} -gt 0 ]]; then
  "${trim[@]}" "$shot" -bordercolor white -border 1 -trim +repage \
    -bordercolor white -border $((32 * scale)) "$out_png"
else
  cp "$shot" "$out_png"
fi

dims=$(identify -format '%wx%h' "$out_png" 2>/dev/null || echo '?')
echo "png: $out_png ($dims)"

# ink check: a monochrome capture carries no chroma channels
if command -v identify >/dev/null 2>&1; then
  channels=$(identify -format '%[channels]' "$out_png" 2>/dev/null || echo '?')
  case $channels in
    *gray*|*Gray*) echo "ink: grayscale only ✓" ;;
    *) echo "ink: ⚠ capture has colour channels ($channels) — run scripts/lint-mono.sh" ;;
  esac
fi

if [[ $open_after -eq 1 ]] && command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$out_png" >/dev/null 2>&1 &
fi
