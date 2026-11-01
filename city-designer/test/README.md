# Mondiala test suite

Headless checks for the city designer — no browser, no dependencies beyond Node ≥ 18.
437 checks, run in one process: the app is loaded from the *shipped* files
(`../mondiala.html` + the five themed data files it references, in browser
script order), given a minimal fake DOM, and exercised end to end:

1. **Roster integrity** — 305 cities, 373 fact entries, 419 info cards, 42 gods, 61 heart rows, no city placed twice, no heart name on the roster
2. **The authored heart** — ring 1 the six cradle civilisations, ring 2 the twelve ancient cities, ring 3 Norden (18), ring 4 the inspiration cities (24) — every hexagon filled
3. **Lattice rules** — no god on the green, mirror symmetry, the whole authored heart exempt from the pink-touch rule (no gods ship in the heart)
4. **Capitals aboard** — every European and >1M-country capital on the map or in the pool
5. **The validator** — 0/0/0 in the fresh state, the valid message, clear flags
6. **Centres** — all three modes land on their verified spots (Bulgaria / Tajikistan / Romania), pool 179, parks 30 in every mode
7. **The read-only map** — the editing UI is gone (no add-ring, no brush, no save/export/import, no add-city, no inspector Apply button), the viewing controls stay, the pool chips render, clicking a hexagon still shows its card
8. **Pan / zoom** — the moved-guard and the zoom-out floor at the full-city view
9. **DATA.md consistency** — the regenerated `../DATA.md` matches the live city in every mode

Running the suite also regenerates `../DATA.md` from the fresh build — if `git diff`
shows a change there after you edited the app data, commit it.

## Files

- `stubs.js` — the fake DOM (elements, classList, innerHTML mini-parser, event firing)
- `loader.js` — loads the shipped app files and exposes the app's internals as `__X`
- `gen_data_md.js` — regenerates `../DATA.md` from the live fresh build
- `asserts.js` — the 437 checks (self-wrapped so the concatenation shares one scope)
- `run.sh` — concatenates the four and runs them: `./run.sh`, exit 0 = all green
- `split_push.py` — rebuilds the six shipped files from the Vibe-side canvas (the
  authored source; the path inside points at the Vibe environment that owns it):
  `mondiala.html` plus the five data files `mondiala-{heart,cities,info,facts,gods}.js`

## Workflow

The app is authored in the Mondiala City Designer canvas (Vibe), split into the six
shipped files by `split_push.py`, and tested here. Never edit `mondiala.html` or the
`mondiala-*.js` data files by hand unless fixing a bug in a hurry — the canvas is the
source of truth, and the next split would overwrite hand edits.
