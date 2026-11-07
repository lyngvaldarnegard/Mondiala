# Mondiala

Three things under one roof: a **personal manifesto** for a rule-driven welfare state, the interactive hex-grid map of **Mondiala**, the new world capital — and a **society simulator** to test the ideas from the bottom up.

**Try it live: <https://lyngvaldarnegard.github.io/Mondiala/>** — served by GitHub Pages, updated with every push to `main`. The front page links all three.

## The manifesto — Autopilot

[`policy/`](policy/) is the readable one: an illustrated, interactive manifesto for a country that runs on rules instead of yearly budget fights. The core is the two income-tax plans — Plan A, the staircase (marginal 0/10/20/30/40/50 % per 1 G bracket) and Plan B, the flat template (half of everything above 3 G, with the welfare floor sitting exactly under the tax line) — each with an interactive illustration, plus a five-lives comparison against today's system. The deeper models (pension queue, food card, budget Sankey, municipal grants, electoral system, constitution builder) are one click away as workbench pages, all reading the same visible data layer (SSB statistics with offline fallback).

## The society simulator

[`simulator/`](simulator/) is a Primer-style sandbox: blobs gather, trade, organise and vote under different economic and political systems. Turn the tax sliders up and watch inequality and poverty respond — the manifesto's rules, tested from the bottom up. One self-contained HTML file, no build step. Version history lives in the [politics-economics-sim repository](https://github.com/lyngvaldarnegard/politics-economics-sim).

## The city map

The interactive hex-grid map lives in [`city-designer/`](city-designer/). Open
[`city-designer/mondiala.html`](city-designer/mondiala.html) in any browser —
no build step, no dependencies.

- **Rings 0–10: 331 hexagons, every one named** (v3.5, the cleanup — 210 world cities aboard, 55 fame-cut with data kept; the pool is empty, nothing beyond ring 10). The authored heart — Metropol, ring 1 the six cradle civilisations (China, the Indus Valley, Egypt, Mesopotamia, the Andes, Mesoamerica), ring 2 the twelve ancient cities (hexes 1–9 sorted by apex — the time each city was greatest, newest first: Constantinople, Rome, Alexandria, Carthage, Athens, Babylon, Ur, Uruk, Jericho — and Cusco, Tenochtitlan, Chang'an pinned at 10–12), ring 3 the Nordics with every Nordic country and autonomous land represented — the capitals, Göteborg and Kaunas down to Tórshavn, Nuuk and Mariehamn — and ring 4 the inspiration cities, seated by direction (v1.8): the six originals Paris, Barcelona, Moscow, Singapore, Vancouver and New York hold the green spokes — which spoke decided by each one's true bearing — the six favourite gods of love take the middles facing their homelands, and the twelve other inspiration cities keep their ring-4 seats, exact hex by bearing (Prague, Seoul, Dubai, San Francisco, Toronto and Chicago once stepped off the heart and stayed aboard: Prague rides the map again at ring 6, the far five ride the visible pool out to rings 9–11) — rings 0–3 are set forever, ring 4 follows the compass
- **All the pink tiles are equal — one allocation list, the favourites at the top**: the six favourites (Eros, Aphrodite, Venus, Freyja, Cupid, Kama) hold the ring-4 middles, each facing her homeland by compass; Milda — not a favourite — rides the lattice again from ring 7. The six cradle goddesses wait unplaced, to be seated by editing the data — a hex named for a god turns pink. **Check lattice** guards the four rules: no god on the green metro spokes, the pink set six-fold around the spokes and mirror-symmetric inside each section, no two pink districts ever touching, every ordinary hexagon of the outer city touching a god
- **Rings 5+ are placed by real geography** (v3.0): the world's 265 great cities — modern, classical and simply famous — are seated by deterministic formulas over real great-circle km between cities, with a compass sense (each city's eye-true direction from the world centre, from lon/lat deltas, matched against its hex's direction from the heart — never great-circle bearing, which lies at extreme range). Three placement modes: **Neighbours** (default — greedy closest-city score, every old-ring city borders one of its six closest remaining), **Hexagonal** (the centre placed so all six 60° sectors fill; each section takes its closest remaining cities) and **Hand-picked** (the authored world map — every region in its true wedge: Europe north-west, Asia east, Africa south, the Americas west, Oceania south-east; authored data in `mondiala-handpicked.js`, edited by hand, never recomputed — roster edits leave it alone, new cities wait in the pool). Mondiala sits at the geographic midpoint of heart + roster (≈ 48.3°N 22.5°E, western Ukraine); the hexagonal mode places its own centre. Adding a city to the roster means re-running the generator (`sh city-designer/test/regen.sh`) and committing the regenerated table.
- **The map opens instantly** (v3.0): the seating ships as a formula-generated table (`mondiala-seating.js`, one table per mode per orientation, generated to the full depth of the roster) — the page only reads it; «+ Next ring» reveals precomputed rows and nothing is recomputed at load or at click. The generator lives in the test suite, which also asserts the committed table matches the formulas.
- **Continent view** (v3.0, the default): every hexagon is coloured by its city's continent in the Olympic ring colours — Europe blue, Asia yellow, Africa black, Americas red, Oceania green; the pink free-use districts stay pink in every view; the ring view and the type view remain one click away.
- **Pink free-use districts** in a ring lattice that is six-fold symmetric around the spokes and mirror-symmetric inside each of the six sections, no two pink districts ever touching, named after gods of love and sexuality, never on the green spokes — 36 ship in the fresh city (six favourites on ring 4 + twelve on ring 6, twelve on ring 7 and six on ring 8), growing to 96 at the frontier (twelve on ring 9, eighteen on ring 10, twelve on ring 11, eighteen on ring 12 — the frontier's pink districts wait as free-use parks, their gods not yet arrived). No god is hand-seated any more: the favourites rule seats the favoured eight (Eros, Aphrodite, Venus, Freyja, Cupid, Kama, Parvati, Lakshmi) close to the centre, the rest take the reserved lattice **by compass** — each facing their homeland, re-shuffling when the centre moves — and the mixed horizon rings carry concepts of eros in authored order alongside the deities
- **Smooth zoom that can never lose the map**: zooming out stops exactly at the full-city view, with the rim touching the screen edges
- The browser map is a **read-only viewer** — pan, zoom, switch centre modes, flip the grid between **flat-side-up and pointy-side-up** (the compass re-flows live), click hexagons for their cards, and grow or unwind the rings with **+ Next ring / − Remove ring** (view-only, nothing saves) — every change happens in the data files — and a headless test suite of **665 checks** keeps it all honest. The suite is versioned right here in the repo, in [`city-designer/test/`](city-designer/test/)

The worldbuilding data lives in five themed files in
[`city-designer/`](city-designer/) — `mondiala-heart.js` (the authored heart: rings 0–3 fixed by hand, ring 4 city and density rows authored with seats decided by the compass),
`mondiala-cities.js` (the roster, coordinates, countries, the country→continent map),
`mondiala-info.js` (the info cards), `mondiala-facts.js` (the real-city facts) and
`mondiala-gods.js` (the god lattice and homelands) — plus `mondiala-seating.js`, the
generated seating tables (never hand-edit: `sh city-designer/test/regen.sh` regenerates
them from the formulas after a roster edit). Editing the data files works directly on
GitHub; the seating table is the one file that needs the regeneration step.
[`city-designer/DATA.md`](city-designer/DATA.md) is a human-readable,
copy-into-Notion-friendly copy of all of it.

Full documentation: [city-designer/README.md](city-designer/README.md)

## Data

Hexagon data (names, circles, hexagon numbers, densities) is sourced from the
*Hexagons of Mondiala* database in Notion; the city roster extends the database
with the world's great cities.

**Version history**: every push is a saved snapshot — [VERSIONS.md](VERSIONS.md) indexes
the shipped versions, what changed in each, and how to browse or restore any of them.
