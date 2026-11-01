#!/usr/bin/env python3
# split_push.py — split the Mondiala City Designer canvas into the shippable web app:
#   mondiala-data.js = the data section (Notion source → GOD_ORIGINS)
#   mondiala.html    = the app with the data section replaced by <script src="mondiala-data.js">
# Output: the city-designer directory (the parent of this test/ directory).
# The canvas path below points at the Vibe-side source of truth; it is only reachable
# from the Vibe environment that authors the canvas.
import pathlib

CANVAS = "/home/user/canvases/mondiala-city-designer/CANVAS.md"
OUT = pathlib.Path(__file__).resolve().parent.parent

t = open(CANVAS, encoding="utf-8").read()
fm_end = t.index("---", 3)          # end of the canvas frontmatter
html = t[fm_end + 3:].lstrip()      # the pure HTML document

a = html.index("<script>")
b = html.rindex("</script>")
pre_html = html[:a]
src = html[a + 8:b]
post_html = html[b + 9:]

data_start = src.index("// ---------- Source data")
center_start = src.index('let centerMode = "geo";')
data_js = src[data_start:center_start].rstrip() + "\n"
pre_js = src[:data_start].rstrip()
post_js = src[center_start:].lstrip()

out_html = (pre_html
    + "<script>\n" + pre_js + "\n</script>\n"
    + '<script src="mondiala-data.js"></script>\n'
    + "<script>\n" + post_js + "\n</script>\n"
    + post_html)

# sanity gates
assert out_html.lstrip().lower().startswith("<!doctype html>"), "html must start with doctype"
assert out_html.rstrip().lower().endswith("</html>"), "html must end with </html>"
assert "const GOD_ORIGINS" in data_js, "data module lost GOD_ORIGINS"
assert "const RAW" in data_js and "const WORLD_CITIES" in data_js and "const CENTER_SPOTS" in data_js
assert 'let centerMode = "geo";' in post_js and 'let centerMode = "geo";' not in data_js

(OUT / "mondiala-data.js").write_text(
    "// Mondiala City Designer — data module.\n"
    "// Generated from the Mondiala City Designer canvas; edit there and re-split.\n"
    + data_js, encoding="utf-8")
(OUT / "mondiala.html").write_text(out_html, encoding="utf-8")

print("mondiala-data.js:", (OUT / "mondiala-data.js").stat().st_size, "bytes")
print("mondiala.html:   ", (OUT / "mondiala.html").stat().st_size, "bytes")
