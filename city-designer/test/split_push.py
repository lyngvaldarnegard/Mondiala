#!/usr/bin/env python3
# split_push.py — split the Mondiala City Designer canvas into the shippable web app.
#
# The canvas authors everything in ONE script (so the canvas preview renders standalone).
# This script carves the data into five THEMED files, so a change means editing one small
# file instead of a monolith:
#   mondiala-heart.js  — the hand-authored rings 0–4 (RAW)
#   mondiala-cities.js — the 305-city roster, real coordinates, countries, centre spots
#   mondiala-info.js   — the info cards ([flag, style description] per hex)
#   mondiala-facts.js  — the real-city facts (population, livability, Walk Score)
#   mondiala-gods.js  — the gods of love (pink slot lattice, waiting gods, homelands, name set)
# mondiala.html        — the app, referencing the five files by <script src> in order
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

# ---- carve the single authored script into themed blocks ----
i_heart  = src.index("// ---------- Source data")          # RAW — the authored heart
i_cities = src.index("// ---------- The great cities")     # roster, coords, countries, centre spots
i_gods   = src.index("// the pink free-use district lattice")  # pink slots, waiting gods, origins
i_mode   = src.index('let centerMode = "geo";')            # app tail starts here

heart_js  = src[i_heart:i_cities].rstrip()
cities_js = src[i_cities:i_gods].rstrip()
gods_js   = src[i_gods:i_mode].rstrip()
post      = src[i_mode:]

i_info  = post.index("// ---------- What each hex copies")     # CITY_INFO block
i_facts = post.index("// ---------- Real-city facts")           # CITY_FACTS block
i_sex   = post.index("const SEX_GODS")                         # the god-name set (one line)

info_js   = post[i_info:i_facts].rstrip()
facts_js  = post[i_facts:i_sex].rstrip()
sex_line  = post[i_sex:post.index("\n", i_sex)].rstrip()
sex_end   = post.index("\n", i_sex)

gods_js = gods_js + "\n\n" + sex_line
post_js = post[:i_info].rstrip() + "\n\n" + post[sex_end:].lstrip()

# ---- assemble the shippable html: app head, five data files, app tail ----
out_html = (pre_html
    + "<script>\n" + src[:i_heart].rstrip() + "\n</script>\n"
    + '<script src="mondiala-heart.js"></script>\n'
    + '<script src="mondiala-cities.js"></script>\n'
    + '<script src="mondiala-info.js"></script>\n'
    + '<script src="mondiala-facts.js"></script>\n'
    + '<script src="mondiala-gods.js"></script>\n'
    + "<script>\n" + post_js + "\n</script>\n"
    + post_html)

# ---- sanity gates: every block landed in exactly its own file ----
assert out_html.lstrip().lower().startswith("<!doctype html>"), "html must start with doctype"
assert out_html.rstrip().lower().endswith("</html>"), "html must end with </html>"
assert "const RAW" in heart_js and "const RAW" not in cities_js, "RAW must live in the heart file"
for c in ["const WORLD_CITIES", "const CITY_COORDS", "const CITY_COUNTRY", "const CENTER_SPOTS"]:
    assert c in cities_js and c not in heart_js and c not in gods_js, c + " must live in the cities file"
assert "const CITY_INFO" in info_js and "const CITY_INFO" not in post_js, "CITY_INFO must be carved out"
assert "const CITY_FACTS" in facts_js and "const CITY_FACTS" not in post_js, "CITY_FACTS must be carved out"
for c in ["const PINK_SLOTS", "const PINK_GODS", "const GOD_ORIGINS", "const SEX_GODS"]:
    assert c in gods_js and c not in post_js, c + " must live in the gods file"
assert 'let centerMode = "geo";' in post_js and "const SQ3" in post_js
assert "function factsFor" in post_js

HEADER = ("// Mondiala City Designer — data {n}/5: {title}.\n"
          "// Generated from the Mondiala City Designer canvas; edit there and re-split.\n")
files = {
    "mondiala-heart.js":  (HEADER.format(n=1, title="the heart — the hand-authored rings 0–4 (Metropol,\n// the cradle civilisations, the ancient cities, Norden and the inspiration cities)"), heart_js),
    "mondiala-cities.js": (HEADER.format(n=2, title="the world's great cities — the 311-city roster with real\n// coordinates and countries, and the three verified centre spots"), cities_js),
    "mondiala-info.js":   (HEADER.format(n=3, title="the info cards — [flag, style description] for every hex's\n// real-world model"), info_js),
    "mondiala-facts.js":  (HEADER.format(n=4, title="the real-city facts — [population, source, livability,\n// source, Walk Score?] per city"), facts_js),
    "mondiala-gods.js":   (HEADER.format(n=5, title="the gods of love — the pink slot lattice, the waiting gods\n// per ring, each god's homeland coordinates, and the full name set"), gods_js),
}
for name, (head, body) in files.items():
    (OUT / name).write_text(head + body + "\n", encoding="utf-8")
    print(name + ":", (OUT / name).stat().st_size, "bytes")
(OUT / "mondiala.html").write_text(out_html, encoding="utf-8")
print("mondiala.html:   ", (OUT / "mondiala.html").stat().st_size, "bytes")
