# Mondiala test suite

Headless checks for the city designer — no browser, no dependencies beyond Node ≥ 18.
453 checks, run in one process: the app is loaded from the *shipped* files
(`../mondiala.html` + `../mondiala-data.js`, in browser script order), given a minimal
fake DOM, and exercised end to end:

1. **Roster integrity** — 318 cities, 372 fact entries, 418 info cards, 42 gods, no city placed twice, no heart name on the roster
2. **The authored heart** — rings 0–4 exactly as designed, including densities
3. **Lattice rules** — no god on the green, mirror symmetry, exactly the 18 empty heart mids waiting for the twelve hand-placed gods
4. **Capitals aboard** — every European and >1M-country capital on the map or in the pool
5. **The validator** — 18 orange in the fresh state, the guide message, clear flags
6. **The fill-later flow** — placing all twelve gods by hand (inspector → auto-pink), 0/0/0, survival across mode switches, export/import, add-ring, reset; removing a god breaks symmetry; a god on a green spoke is flagged
7. **Centres** — all three modes land on their verified spots (Bulgaria / Kazakhstan / Moldova), pool 192 each
8. **Save / load / export / import / add-remove city** — byte-identical round-trips, removing an added city restores the exact map
9. **Pool, paint, inspector** — arming pool cities, painting types, inspector edits, PCODE labels
10. **Pan / zoom** — the moved-guard and the zoom-out floor at the full-city view
11. **DATA.md consistency** — the regenerated `../DATA.md` matches the live city in every mode

Running the suite also regenerates `../DATA.md` from the fresh build — if `git diff`
shows a change there after you edited the app data, commit it.

## Files

- `stubs.js` — the fake DOM (elements, classList, innerHTML mini-parser, event firing)
- `loader.js` — loads the shipped app files and exposes the app's internals as `__X`
- `gen_data_md.js` — regenerates `../DATA.md` from the live fresh build
- `asserts.js` — the 453 checks (self-wrapped so the concatenation shares one scope)
- `run.sh` — concatenates the four and runs them: `./run.sh`, exit 0 = all green
- `split_push.py` — rebuilds the two shipped files from the Vibe-side canvas
  (the authored source; the path inside points at the Vibe environment that owns it)

## Workflow

The app is authored in the Mondiala City Designer canvas (Vibe), split into the two
shipped files by `split_push.py`, and tested here. Never edit `mondiala.html` or
`mondiala-data.js` by hand unless fixing a bug in a hurry — the canvas is the
source of truth, and the next split would overwrite hand edits.
