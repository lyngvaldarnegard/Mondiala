# Mondiala

Worldbuilding project for **Mondiala**, the new world capital — centred on the interactive city map.

**Try it live: <https://lyngvaldarnegard.github.io/Mondiala/>** — served by GitHub Pages, updated with every push to `main`.

## The city map

The interactive hex-grid map lives in [`city-designer/`](city-designer/). Open
[`city-designer/mondiala.html`](city-designer/mondiala.html) in any browser —
no build step, no dependencies.

- **Rings 0–8: 217 hexagons, every one named.** The authored heart — Metropol, ring 1 the six cradle civilisations (China, the Indus Valley, Mesopotamia, Egypt, the Andes, Mesoamerica), ring 2 the twelve ancient cities (each cradle's first great city behind its civilisation, with Constantinople, Athens, Babylon, Rome, Tyre and Carthage between them), ring 3 Norden with every Nordic country and autonomous land represented — the capitals, Göteborg and Kaunas down to Tórshavn, Nuuk and Mariehamn — and ring 4 the inspiration cities (the six originals Paris, Barcelona, Moscow, Singapore, Vancouver and New York on the spokes, with a world tour between them: London, Amsterdam, Madrid, Berlin, Vienna, Prague, Seoul, Tokyo, Hong Kong, Dubai, Sydney, San Francisco, Toronto, Chicago, Mexico City, Rio de Janeiro, Cape Town, Lisbon) — is set forever
- **No gods ship in the heart — only cities**: the twelve gods of love wait unplaced, to be seated by editing the data — a hex named for a god turns pink. **Check lattice** guards the rules: no god on the green metro spokes, the pink set mirror-symmetric, every ordinary hexagon of the outer city touching a god
- **Rings 5–8 are placed by real geography**: Mondiala sits at the centre of the world's 305 great cities — modern, classical and simply famous, with the ancient kin (Aleppo, Diyarbakır, Jerusalem, Mecca, Aksum) flowing back onto the outer rings by compass. The roster is capital-complete: all 50 European capitals (Vatican City and San Marino included) and every capital of a country with more than a million people. A city's bearing from that centre picks its hexagon and its real distance picks its ring. Three switchable centre modes — geographic (the Thracian plain at Plovdiv's eastern edge, southern Bulgaria), population-weighted (the Babatag range, arid border hills of south-western Tajikistan) and greatness-weighted (the Dobruja steppe of south-eastern Romania) — and adding a city to the roster data moves the centre and re-flows the whole map
- **Pink free-use districts** in a mirror-symmetric lattice named after gods of love and sexuality, never on the green spokes — 42 once the twelve heart gods are seated in the data; the shipped outer thirty sitting **by compass**: each takes the reserved pink hex facing their homeland (eastern gods with the eastern cities, African gods to the south, the Norse and Baltic ones to the north), re-shuffling when the centre moves but never giving up their slots
- **Smooth zoom that can never lose the map**: zooming out stops exactly at the full-city view, with the rim touching the screen edges
- The browser map is a **read-only viewer** — pan, zoom, switch centre modes, click hexagons for their cards, and watch the pool settle onto ring 9 with **+ Next ring** (view-only, nothing saves) — every change happens in the data files — and a headless test suite of **451 checks** keeps it all honest. The suite is versioned right here in the repo, in [`city-designer/test/`](city-designer/test/)

The worldbuilding data lives in five themed files in
[`city-designer/`](city-designer/) — `mondiala-heart.js` (the authored rings 0–4),
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
