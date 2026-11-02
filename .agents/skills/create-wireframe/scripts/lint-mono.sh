#!/usr/bin/env bash
# lint-mono.sh — prove a wireframe stayed black and white.
#
#   lint-mono.sh <file.html> [more.html ...]
#
# Fails (exit 1) on: colour values other than #000 / #fff / transparent,
# rgb()/hsl() colour functions, grey or tinted named colours, opacity,
# box-shadow, blur, remote asset URLs, and non-Balsamiq font stacks.
set -uo pipefail

[[ $# -ge 1 ]] || { echo "usage: lint-mono.sh <file.html> ..." >&2; exit 2; }

skill_assets=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../assets" 2>/dev/null && pwd)

bad_hex() { grep -nEio '#[0-9a-f]{3,8}\b' "$1" | grep -vEi ':#(fff|ffffff|000|000000)$'; }
named() {
  grep -nEi '(^|[;{[:space:]])(color|background|background-color|background-image|border|border-color|border-top|border-bottom|border-left|border-right|fill|stroke|stop-color|outline|caret-color|text-decoration-color)[[:space:]]*:[^;{}]*\b(red|blue|green|yellow|orange|purple|pink|gray|grey|silver|gold|brown|cyan|magenta|navy|teal|olive|lime|aqua|fuchsia|maroon|violet|indigo|salmon|coral|beige|ivory|khaki|tan|whitesmoke|gainsboro|lavender|plum|orchid|tomato|chocolate|sienna|peru|crimson)\b' "$1"
}
colour_fns() { grep -nEio '\b(rgba?|hsla?|lch|oklch|lab|oklab|color-mix)\(' "$1"; }
opacity() { grep -nEi 'opacity[[:space:]]*:[[:space:]]*(0*\.[0-9]+|0)\b' "$1"; }
shadow() {
  { grep -nEi '(box-shadow|text-shadow)\b[^;{}]*:' "$1" | grep -viE ':\s*(none|0)\s*;'
    grep -nEi '(filter|backdrop-filter)[[:space:]]*:[^;{}]*(blur|drop-shadow|brightness|contrast|saturate)' "$1"
  } | sort -u
}
remote() { grep -nEi 'url\(\s*["'"'"']?(https?:)?//|@import[^;]*https?://|<(link|script)[^>]+(href|src)=["'"'"']https?://' "$1"; }
font_off() {
  grep -nEi 'font-family[[:space:]]*:[^;{}]*' "$1" |
    grep -viE 'font-family[[:space:]]*:[^;{}]*(balsamiq|inherit|var\(|none)' |
    grep -viE '^[0-9]+:[[:space:]]*--font[[:space:]]*:'
}

fail=0
for file in "$@"; do
  [[ -f $file ]] || { echo "no such file: $file" >&2; fail=1; continue; }

  tmp=$(mktemp)
  # scan the file plus any local stylesheet it links (never the remote ones)
  {
    dir=$(cd -- "$(dirname -- "$file")" && pwd)
    grep -oE '<link[^>]+href="[^"]+\.css"' "$file" 2>/dev/null |
      grep -oE '"[^"]+\.css"' | tr -d '"' |
      while read -r href; do
        for cand in "$dir/$href" "$skill_assets/$href"; do
          [[ -f $cand ]] && { cat "$cand"; break; }
        done
      done
    cat "$file"
  } > "$tmp.raw"
  # blank out data: URIs — base64/svg payloads can contain colour-looking runs
  perl -0pe 's{url\(\s*[\x22\x27]?data:[^)]*\)}{URL}g; s{data:[^\s)\x22\x27]*}{DATAURI}g' "$tmp.raw" > "$tmp"
  rm -f "$tmp.raw"

  echo "── $file"
  hits=$(bad_hex "$tmp");            [[ -n $hits ]] && { echo "  ✘ colour other than #000/#fff:"; echo "$hits" | sed 's/^/      /'; fail=1; }
  hits=$(named "$tmp");              [[ -n $hits ]] && { echo "  ✘ named colour (grey/tinted):";   echo "$hits" | sed 's/^/      /'; fail=1; }
  hits=$(colour_fns "$tmp");         [[ -n $hits ]] && { echo "  ✘ colour function:";             echo "$hits" | sed 's/^/      /'; fail=1; }
  hits=$(opacity "$tmp");            [[ -n $hits ]] && { echo "  ✘ opacity (greys by the back door):"; echo "$hits" | sed 's/^/      /'; fail=1; }
  hits=$(shadow "$tmp");             [[ -n $hits ]] && { echo "  ✘ shadow/blur:";                echo "$hits" | sed 's/^/      /'; fail=1; }
  hits=$(remote "$tmp");             [[ -n $hits ]] && { echo "  ✘ remote asset (must render offline):"; echo "$hits" | sed 's/^/      /'; fail=1; }
  hits=$(font_off "$tmp");           [[ -n $hits ]] && { echo "  ✘ font stack without Balsamiq Sans:"; echo "$hits" | sed 's/^/      /'; fail=1; }
  if ! grep -qi 'balsamiq sans' "$tmp"; then
    echo "  ✘ Balsamiq Sans never used in this file"; fail=1
  fi

  rm -f "$tmp"
done

if [[ $fail -eq 0 ]]; then
  echo "✓ monochrome, offline, Balsamiq Sans"
else
  echo ""
  echo "Fix the items above. A wireframe is black ink on white paper — no greys,"
  echo "no tints, no shadows. Use stroke weight, fill style and size for hierarchy."
fi
exit $fail
