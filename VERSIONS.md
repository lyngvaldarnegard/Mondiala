# Mondiala — version history

Every push to git is a permanent snapshot: nothing is ever overwritten or lost, and any
version below can be browsed in full or restored. This file is the human-readable index of
the shipped states. [GitHub Releases](https://github.com/lyngvaldarnegard/Mondiala/releases)
are the named milestones on top (with notes and a downloadable zip of the whole state) —
the commits themselves are the real archive.

| Version | Commit | State |
|---|---|---|
| **v1.1.1 — the test toolchain joins the repo** | `main` (this push) | current · no app changes; the 453-check headless suite versioned in `city-designer/test/` |
| **v1.1 — the corrected heart** | `41645f0` | bookmark branch `archive/v1.1-the-corrected-heart` |
| **v1.0 — the ancient heart** | `d4c84c1` | superseded by v1.1 |

## v1.1.1 — the test toolchain joins the repo

No app changes — the city is exactly as v1.1 shipped it. What's new is where the tests live:

- The headless test suite now lives in the repository itself, under **`city-designer/test/`**:
  the DOM stubs, the loader (which loads the *shipped* `mondiala.html` + `mondiala-data.js`
  the way a browser would), the `DATA.md` generator, the 453 assertions, `run.sh` and the
  canvas splitter. Rebuilt from scratch and expanded — every outer ring of all three centre
  modes is now checked cell by cell against `DATA.md`, not just the heart
- **453 checks, all green**: roster integrity, the authored heart (rings 0–4, hex by hex),
  the three lattice rules and the validator, the fill-later god flow (hand-placing all
  twelve gods, auto-pinking, survival across mode switches, imports, resets and ring 9),
  the three centres at 0.000 km, pools, the capital audit, save/load, arm-and-place, paint,
  inspector, pan/zoom and the full `DATA.md` consistency pass
- Run it with `sh city-designer/test/run.sh` (Node ≥ 18, no dependencies)

## v1.1 — the corrected heart (`41645f0`)

The heart rebuilt to the corrected design:

- **Ring 2 — the eight cradle civilisations**, no "Ancient" prefixes: China, the Indus Valley,
  Mesopotamia, Egypt, the Andes, Mesoamerica on the spokes, Greece and Phoenicia between
- **Ring 3 — the cradle cities and the classics**: Chang'an, Mohenjo-daro, Uruk, Memphis,
  Cusco, Tenochtitlan on the spokes; Athens, Constantinople, Rome, Carthage between
- **Ring 4 — Norden, all 24 hexes**: every Nordic country and autonomous land represented,
  with Stavanger, Kristiansand, Narva, Tórshavn, Nuuk and Mariehamn
- **The twelve heart gods deliberately unplaced** — the empty heart hexes wait to be filled
  in by hand; typing a god's name turns the hex pink, and hand-placed gods survive every
  re-flow, mode switch, import and reset
- **The three lattice rules**, enforced by the checker: no god on the green metro spokes;
  the pink set mirror-symmetric about the north–south axis; every ordinary hexagon outside
  Norden touching a god. (The old invented "no two parks adjacent" rule is retired.)
- **The ancient kin return to the roster** (318 cities — Aleppo, Diyarbakır, Jerusalem,
  Babylon, Mecca, Aksum flow onto the outer rings by compass; Cusco and Constantinople live
  in the heart instead of the roster)
- **New centres**: the upper Tundzha valley by Kalofer, Bulgaria (geo) · the Turkistan steppe
  south-east of the Shardara reservoir, Kazakhstan (pop) · the western Budjak, Moldova (great)
- Headless test suite: 203 checks green (at the time; expanded to 453 in v1.1.1)

Browse this version: <https://github.com/lyngvaldarnegard/Mondiala/tree/41645f0cc6def91f6dbcb23bb795576c46d1dc50>

## v1.0 — the ancient heart (`d4c84c1`)

The first authored heart, kept here for reference:

- Civilisations with "Ancient" prefixes (Ancient China, Ancient Egypt, the Ancient Andes)
- The cradle goddesses **Zhinü, Rati, Inanna, Hathor, Cavillaca, Xochiquetzal** placed in
  ring 2's mids; the six great love gods **Freyja, Aphrodite, Ishtar, Venus, Eros, Kama**
  on ring 3's spokes
- Ålesund in the Nordic ring; Cusco and Constantinople on the roster rather than in the heart
- The old invented lattice rule ("no two parks adjacent"), since retired
- Capital-complete roster with the twelve newest megacities added

Browse this version: <https://github.com/lyngvaldarnegard/Mondiala/tree/d4c84c141c9c21f5cdc7aa47f2657f6253cc5671>

## Earlier milestones

Before the heart was authored, the map grew ring by ring:

- `e8391dd` — the map gets hosted: root landing page for GitHub Pages, live links in the READMEs
- `ced807a` — capital-complete roster: every European capital and every >1M-country capital
- `f072cef` — the roster grows to 214, centre re-lands on the Low Tatras / Kyzylkum / Volhynia

## How to go back

- **Browse**: use the links above — GitHub shows the whole repository exactly as it was at
  that commit, file by file.
- **Restore**: say the word and any version's files can be brought back as a new commit —
  restoring an old version never destroys the newer ones; history only grows.
- **Mark a Release** (recommended for milestones): *Releases → Draft a new release →
  Choose a tag* (e.g. `v1.1`) → *Target: the commit listed above* → paste that version's
  notes from this file → *Publish release*. The release page then offers the entire state
  as a downloadable zip — handy as a stable link even before Pages is switched on.

## Going forward

Each shipped redesign gets an entry in this file and an `archive/vX.Y-name` bookmark branch,
created **before** the next change lands, so every state stays one click away.
