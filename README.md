# Mondiala

Worldbuilding project for **Mondiala**, the new world capital — centred on the interactive city map.

**Try it live: <https://lyngvaldarnegard.github.io/Mondiala/>** — served by GitHub Pages, updated with every push to `main`.

## The city map

The interactive hex-grid map lives in [`city-designer/`](city-designer/). Open
[`city-designer/mondiala.html`](city-designer/mondiala.html) in any browser —
no build step, no dependencies.

- **Rings 0–8: 217 hexagons, every one named.** The authored heart — Metropol, ring 1 the six cradle civilisations (China, the Indus Valley, Egypt, Mesopotamia, the Andes, Mesoamerica), ring 2 the twelve ancient cities (hexes 1–9 sorted by apex — the time each city was greatest, newest first: Constantinople, Rome, Alexandria, Carthage, Athens, Babylon, Ur, Uruk, Jericho — and Cusco, Tenochtitlan, Chang'an pinned at 10–12), ring 3 Norden with every Nordic country and autonomous land represented — the capitals, Göteborg and Kaunas down to Tórshavn, Nuuk and Mariehamn — and ring 4 the inspiration cities, seated by direction (v1.8): the six originals Paris, Barcelona, Moscow, Singapore, Vancouver and New York hold the green spokes — which spoke decided by each one's true bearing — the six favourite gods of love take the middles facing their homelands, and the twelve other inspiration cities keep their ring-4 seats, exact hex by bearing (Prague, Seoul, Dubai, San Francisco, Toronto and Chicago once stepped off the heart and stayed aboard: Prague rides the map again at ring 6, the far five ride the visible pool out to rings 9–11) — rings 0–3 are set forever, ring 4 follows the compass
- **All the pink tiles are equal — one allocation list, the favourites at the top**: the six favourites (Eros, Aphrodite, Venus, Freyja, Cupid, Kama) hold the ring-4 middles, each facing her homeland by compass; Milda — not a favourite — rides the lattice again from ring 7. The six cradle goddesses wait unplaced, to be seated by editing the data — a hex named for a god turns pink. **Check lattice** guards the four rules: no god on the green metro spokes, the pink set six-fold around the spokes and mirror-symmetric inside each section, no two pink districts ever touching, every ordinary hexagon of the outer city touching a god
- **Rings 5–8 are placed by real geography**: Mondiala sits at the centre of the world's 270 great cities — modern, classical and simply famous, with the ancient kin (Aleppo, Diyarbakır, Jerusalem, Mecca) flowing back onto the outer rings by compass. The roster is capital-complete: every European capital but his two v1.7 exceptions (Vatican City and San Marino) and every capital of a country with more than a million people. And the heart pulls too: every city tiled on the map — the ancient heart and Norden included — pulls the centre by its real-life location, and the seating iterates until the centre settles. The compass decides the seating (v1.8): a city's true bearing picks its angle — green spokes included — its real distance orders its direction's chain (near = inner), and crowded directions flow continuously into the neighbouring free tiles, so only the outmost ring ever holds empty city hexes. Three switchable centre modes — geographic (the Kemenesalja foothills near Celldömölk, Hungary), population-weighted (the Volhynian uplands near Mizoch, Ukraine) and greatness-weighted (the Sárvíz valley south of Székesfehérvár, Hungary) — and adding a city to the roster data moves the centre and re-flows the whole map
- **Pink free-use districts** in a ring lattice that is six-fold symmetric around the spokes and mirror-symmetric inside each of the six sections, no two pink districts ever touching, named after gods of love and sexuality, never on the green spokes — 36 ship in the fresh city (six favourites on ring 4 + twelve on ring 6, twelve on ring 7 and six on ring 8), growing to 96 at the frontier (twelve on ring 9, eighteen on ring 10, twelve on ring 11, eighteen on ring 12 — the frontier's pink districts wait as free-use parks, their gods not yet arrived). No god is hand-seated any more: the favourites rule seats the favoured eight (Eros, Aphrodite, Venus, Freyja, Cupid, Kama, Parvati, Lakshmi) close to the centre, the rest take the reserved lattice **by compass** — each facing their homeland, re-shuffling when the centre moves — and the mixed horizon rings carry concepts of eros in authored order alongside the deities
- **Smooth zoom that can never lose the map**: zooming out stops exactly at the full-city view, with the rim touching the screen edges
- The browser map is a **read-only viewer** — pan, zoom, switch centre modes, flip the grid between **flat-side-up and pointy-side-up** (the compass re-flows live), click hexagons for their cards, and grow or unwind the rings with **+ Next ring / − Remove ring** (view-only, nothing saves) — every change happens in the data files — and a headless test suite of **737 checks** keeps it all honest. The suite is versioned right here in the repo, in [`city-designer/test/`](city-designer/test/)

The worldbuilding data lives in five themed files in
[`city-designer/`](city-designer/) — `mondiala-heart.js` (the authored heart: rings 0–3 fixed by hand, ring 4 city and density rows authored with seats decided by the compass),
`mondiala-cities.js` (the roster, coordinates, countries, centre spots),
`mondiala-info.js` (the info cards), `mondiala-facts.js` (the real-city facts) and
`mondiala-gods.js` (the god lattice and homelands) — so a change means editing one small
file, not a monolith. They can be edited directly on GitHub; the map reads them as-is,
nothing to regenerate.
[`city-designer/DATA.md`](city-designer/DATA.md) is a human-readable,
copy-into-Notion-friendly copy of all of it.

Full documentation: [city-designer/README.md](city-designer/README.md)

## Data

Hexagon data (names, circles, hexagon numbers, densities) is sourced from the
*Hexagons of Mondiala* database in Notion; the city roster extends the database
with the world's great cities.

**Version history**: every push is a saved snapshot — [VERSIONS.md](VERSIONS.md) indexes
the shipped versions, what changed in each, and how to browse or restore any of them.
