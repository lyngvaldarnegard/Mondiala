# Mondiala test suite

Headless checks for the city designer — no browser, no dependencies beyond Node ≥ 18.
737 checks, run in one process: the app is loaded from the *shipped* files
(`../mondiala.html` + the five themed data files it references, in browser
script order), given a minimal fake DOM, and exercised end to end:

1. **Roster integrity** — 217 hexagons in the fresh city, 270 roster cities, 332 fact entries, 415 info cards, 84 gods and concepts, the eight-entry favourites list, 55 heart rows, pool 144 fresh, no city placed twice, no heart name on the roster, every roster city carrying coordinates — plus the v1.7 deletion audit (the forty retired cities stay gone from every data trace) and the six returned cities (Prague and the far five) keeping their coordinates, cards and facts
2. **The authored heart** — Metropol, ring 1 the six cradle civilisations, ring 2 the twelve ancient cities (Ur at Uruk's side), ring 3 Norden (18), ring 4 direction-seated: the six originals on the spokes their bearings pick, the six favourites on the middles, the twelve regulars compass-ordered; ring-4 densities are the density campaign's core figures and every one is preserved on its seat
3. **Lattice rules (shipped state)** — the four laws: no god on the green, mirror symmetry inside each of the six sections, six-fold symmetry (rings 4, 6, 7 and 8 all pinned), no two pink districts ever touching; the favourites hold the ring-4 middles (Kama, Aphrodite, Eros, Cupid, Venus, Freyja), the originals hold the spokes (Vancouver, Moscow, Singapore, Barcelona, Paris, New York — which spoke decided by true bearing), nothing uncovered, 36 parks fresh; the all-pinks-equal cascade pinned: Parvati and Lakshmi on ring 6, Pothos filling Cupid's vacated seat, Milda back on the ring-7 lattice, Ishtar keeping hers, Aizen-Myōō sliding to ring 8, Astghik riding outward
4. **Capitals aboard** — every European and >1M-country capital on the map, in the pool, or kept in the data (Prague back on the map at ring 6, Seoul, Dubai, San Francisco, Toronto and Chicago riding the visible pool)
5. **The validator** — 0/0/0 in the fresh state, the valid message, clear flags
6. **Centres** — all three modes land on their verified spots (Hungary 47.20695633/17.24118554, Ukraine 50.28842947/25.56782284, Hungary 47.03804177/18.49706772), pool 144 and parks 36 in every mode
6b. **The compass decides (direction-first seating)** — in all three centre modes: no empty city tile in rings 4–7 and ring 8 fully seated, bearing error under 50° on average and 140° at worst, and Africa pinned to its southern band — no African city in the eastern sector
7. **The read-only map** — the editing UI is gone (no brush, no save/export/import, no add-city, no inspector Apply button), the viewing controls stay, the pool chips render (144), mode switch rebuilds the fresh state
7b. **The ring viewer** — view-only buttons: ring 9 opens with 42 pool cities and 12 pink districts (pool 144 → 102), ring 10 takes 42 more with 18 pink (→ 60), ring 11 takes 54 more with 12 pink (→ 6), and ring 12 tiles the last six — the pool runs dry, every city on the map, adding stops; removing unwinds the whole city to bare Metropol (pool 270) and growing back re-seats the same city by the same rules
7c. **The horizon lattice & the favourites rule** — grown past the old horizon to ring 12: every ring's pink set pinned and six-fold (ring 9 {2,7} diagonal, ring 10 spoke-flanking + midline, ring 11 {3,8} diagonal, ring 12 the {2,6,10} frontier lattice), mirror-symmetric, no two pinks touching, no pink on a spoke, nothing uncovered, 96 parks at the frontier with the pool empty — every city tiled; the dormant gods wake on their lattice seats and the validator says valid
8. **Pan / zoom / click-guard** — the moved-guard and the zoom-out floor at the full-city view
8b. **The orientation toggle** — flat-side-up is the default, the button turns the grid 30° to pointy-side-up (viewBox extents swap, seating re-flows with bearing error still bounded), the validator stays valid, and the round trip is identity
9. **DATA.md consistency** — the regenerated `../DATA.md` matches the live city in every mode

Running the suite also regenerates `../DATA.md` from the fresh build — if `git diff`
shows a change there after you edited the app data, commit it.

## Files

- `stubs.js` — the fake DOM (elements, classList, innerHTML mini-parser, event firing)
- `loader.js` — loads the shipped app files and exposes the app's internals as `__X` (including `GRID_ROT` and `compassSeat`)
- `gen_data_md.js` — regenerates `../DATA.md` from the live fresh build
- `asserts.js` — the 737 checks (self-wrapped so the concatenation shares one scope)
- `run.sh` — concatenates the four and runs them: `./run.sh`, exit 0 = all green
- `split_push.py` — rebuilds the six shipped files from the Vibe-side canvas (the
  authored source; the path inside points at the Vibe environment that owns it):
  `mondiala.html` plus the five data files `mondiala-{heart,cities,info,facts,gods}.js`

## Workflow

The app is authored in the Mondiala City Designer canvas (Vibe), split into the six
shipped files by `split_push.py`, and tested here. Never edit `mondiala.html` or the
`mondiala-*.js` data files by hand unless fixing a bug in a hurry — the canvas is the
source of truth, and the next split would overwrite hand edits.
