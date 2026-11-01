# Mondiala

Worldbuilding project for **Mondiala**, the new world capital — centred on the interactive city map.

**Try it live: <https://lyngvaldarnegard.github.io/Mondiala/>** — served by GitHub Pages, updated with every push to `main`.

## The city map

The interactive hex-grid map lives in [`city-designer/`](city-designer/). Open
[`city-designer/mondiala.html`](city-designer/mondiala.html) in any browser —
no build step, no dependencies.

- **Rings 0–8: 217 hexagons.** The authored heart — Metropol, the six inspiration cities (Paris, Barcelona, Moscow, Singapore, Vancouver, New York), the cradle civilisations of ring 2 (China, the Indus Valley, Mesopotamia, Egypt, the Andes, Mesoamerica — with Greece and Phoenicia beside them), the cradle cities of ring 3 (Chang'an, Mohenjo-daro, Uruk, Memphis, Cusco, Tenochtitlan, plus the classics Athens, Constantinople, Rome and Carthage), and the Nordic ring 4 — every Nordic country and autonomous land represented, from the five capitals and Göteborg down through the Baltic cities to Stavanger, Kristiansand, Narva, Tórshavn, Nuuk and Mariehamn — is set forever
- **The twelve gods of love are deliberately unplaced**: the heart's empty hexes wait to be filled in by hand — type a god's name and the hex turns pink, surviving every re-flow, switch and reset. **Check lattice** guides the fill: no god on the green metro spokes, the pink set mirror-symmetric, every ordinary hexagon touching a god
- **Rings 5–8 are placed by real geography**: Mondiala sits at the centre of the world's 318 great cities — modern, classical and simply famous, with the ancient kin (Aleppo, Diyarbakır, Jerusalem, Babylon, Mecca, Aksum) flowing back onto the outer rings by compass. The roster is capital-complete: all 50 European capitals (Vatican City and San Marino included) and every capital of a country with more than a million people. A city's bearing from that centre picks its hexagon and its real distance picks its ring. Three switchable centre modes — geographic (the upper Tundzha valley, Bulgaria's Rose Valley under the central Stara Planina), population-weighted (Kazakhstan's Turkistan steppe, south-east of the Shardara reservoir) and greatness-weighted (the western Budjak of southern Moldova) — and adding a city moves the centre and re-flows the whole map
- **42 pink free-use districts** in a mirror-symmetric lattice named after gods of love and sexuality, never on the green spokes — twelve of them hand-placed in the heart once the gods move in, the outer thirty sitting **by compass**: each takes the reserved pink hex facing their homeland (eastern gods with the eastern cities, African gods to the south, the Norse and Baltic ones to the north), re-shuffling when the centre moves but never giving up their slots
- **Smooth zoom that can never lose the map**: zooming out stops exactly at the full-city view, with the rim touching the screen edges
- Save to browser storage, JSON export/import, add rings beyond circle 8 — and a headless test suite of **453 checks** keeps it all honest. The suite is versioned right here in the repo, in [`city-designer/test/`](city-designer/test/)

The worldbuilding data lives in its own file,
[`city-designer/mondiala-data.js`](city-designer/mondiala-data.js) — the roster, coordinates,
info cards, real-city facts, the god lattice and each god's homeland coordinates. It can be
edited directly on GitHub; the map reads it as-is, nothing to regenerate.
[`city-designer/DATA.md`](city-designer/DATA.md) is a human-readable,
copy-into-Notion-friendly copy of all of it.

Full documentation: [city-designer/README.md](city-designer/README.md)

## Data

Hexagon data (names, circles, hexagon numbers, densities) is sourced from the
*Hexagons of Mondiala* database in Notion; the city roster extends the database
with the world's great cities.

**Version history**: every push is a saved snapshot — [VERSIONS.md](VERSIONS.md) indexes
the shipped versions, what changed in each, and how to browse or restore any of them.
