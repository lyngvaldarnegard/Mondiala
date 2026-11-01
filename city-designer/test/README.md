# Mondiala test suite

Headless checks for the city designer — no browser, no dependencies beyond Node ≥ 18.
513 checks, run in one process: the app is loaded from the *shipped* files
(`../mondiala.html` + the five themed data files it references, in browser
script order), given a minimal fake DOM, and exercised end to end:

1. **Roster integrity** — 311 cities, 373 fact entries, 456 info cards, 84 gods and concepts, 61 heart rows, the favourites list, no city placed twice, no heart name on the roster
2. **The authored heart** — ring 1 the six cradle civilisations, ring 2 the twelve ancient cities (Ur at Uruk's side, Athens holding the freed Indus seat), ring 3 Norden (18), ring 4 the inspiration cities with the six goddesses of love on the middles — every hexagon filled
3. **Lattice rules** — the four laws: no god on the green, mirror symmetry inside each of the six sections, six-fold symmetry (every ring's pink set repeats around all six spokes), no two pink districts ever touching; the whole authored heart exempt from the touch rule (the six heart goddesses sit on the ring-4 middles, in three mirror pairs)
4. **Capitals aboard** — every European and >1M-country capital on the map, in the pool, or kept in the data (Prague back on the map at ring 6, Seoul, Dubai, San Francisco, Toronto and Chicago riding the visible pool)
5. **The validator** — 0/0/0 in the fresh state, the valid message, clear flags
6. **Centres** — all three modes land on their verified spots (Bulgaria / Tajikistan / Moldova), pool 185, parks 36 in every mode
7. **The read-only map** — the editing UI is gone (no brush, no save/export/import, no add-city, no inspector Apply button), the viewing controls stay, the pool chips render, clicking a hexagon still shows its card
8. **The ring viewer** — view-only buttons: ring 9 opens with 42 pool cities and 12 pink districts (pool 185 → 143), ring 10 takes 42 more with 18 pink (pool 101), ring 11 takes 54 more with 12 pink and adding stops at the designed horizon with 47 still in the pool; removing unwinds the whole city to bare Metropol (pool 311) and growing it back restores the exact shipped city
8b. **The horizon lattice & the favourites rule** — the grown city obeys every lattice rule: the ring 9/10/11 slot geometry is six-fold and mirror-symmetric, no two pinks touch, no pink on a spoke, every grown hex touches a god (78 parks at the horizon), and the favourites rule has seated the favoured eight innermost
9. **Pan / zoom** — the moved-guard and the zoom-out floor at the full-city view
10. **DATA.md consistency** — the regenerated `../DATA.md` matches the live city in every mode

Running the suite also regenerates `../DATA.md` from the fresh build — if `git diff`
shows a change there after you edited the app data, commit it.

## Files

- `stubs.js` — the fake DOM (elements, classList, innerHTML mini-parser, event firing)
- `loader.js` — loads the shipped app files and exposes the app's internals as `__X`
- `gen_data_md.js` — regenerates `../DATA.md` from the live fresh build
- `asserts.js` — the 513 checks (self-wrapped so the concatenation shares one scope)
- `run.sh` — concatenates the four and runs them: `./run.sh`, exit 0 = all green
- `split_push.py` — rebuilds the six shipped files from the Vibe-side canvas (the
  authored source; the path inside points at the Vibe environment that owns it):
  `mondiala.html` plus the five data files `mondiala-{heart,cities,info,facts,gods}.js`

## Workflow

The app is authored in the Mondiala City Designer canvas (Vibe), split into the six
shipped files by `split_push.py`, and tested here. Never edit `mondiala.html` or the
`mondiala-*.js` data files by hand unless fixing a bug in a hurry — the canvas is the
source of truth, and the next split would overwrite hand edits.
