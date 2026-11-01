# Mondiala

Worldbuilding project for **Mondiala**, the new world capital — centred on the interactive city map.

## The city map

The interactive hex-grid map lives in [`city-designer/`](city-designer/). Open
[`city-designer/mondiala.html`](city-designer/mondiala.html) in any browser —
no build step, no dependencies.

- **Rings 0–8: 217 named hexagons.** The fixed heart — Metropol, the six cradle civilisations (Ancient China, the Indus Valley, Mesopotamia, Ancient Egypt, the Ancient Andes, Mesoamerica), each with its first great city and its goddess of love beside it, and the Nordic ring — is set forever
- **Rings 4–8 are placed by real geography**: Mondiala sits at the centre of the world's 214 great cities — modern, classical and simply famous (Rome, Athens, Babylon, Ur and Tikal flow onto the outer rings by compass near the civilisations they grew from; the holy cities Mecca, Medina, Gaza and Damascus cluster on their bearing; the Silk Road runs out through Isfahan and Samarkand; Mogadishu joins the African arc and Cap-Haïtien the far western rim). A city's bearing from that centre picks its hexagon and its real distance picks its ring. Three switchable centre modes — geographic (the Low Tatras of central Slovakia), population-weighted (Kazakhstan's Kyzylkum steppe) and greatness-weighted (northwest Volhynia, Ukraine) — and adding a city moves the centre and re-flows the whole map
- **36 pink free-use districts** in a proven-minimal, mirror-symmetric lattice named after gods of love and sexuality — every non-green hexagon touches one and no two touch each other. The cradle six (Zhinü, Rati, Inanna, Hathor, Cavillaca, Xochiquetzal) are authored beside their civilisations; the outer gods sit **by compass**: each takes the reserved pink hex facing their homeland (eastern gods with the eastern cities, African gods to the south, the Norse and Baltic ones to the north), re-shuffling when the centre moves but never giving up their slots
- **Smooth zoom that can never lose the map**: zooming out stops exactly at the full-city view, with the rim touching the screen edges
- Save to browser storage, JSON export/import, add rings beyond circle 8

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
