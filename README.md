# Mondiala

Worldbuilding project for **Mondiala**, the new world capital — centred on the interactive city map.

## The city map

The interactive hex-grid map lives in [`city-designer/`](city-designer/). Open
[`city-designer/mondiala.html`](city-designer/mondiala.html) in any browser —
no build step, no dependencies.

- **Rings 0–8: 217 named hexagons.** The fixed heart — Metropol, the six largest inspirations, the ancient inspirations + Venus, Aphrodite, Eros, Ishtar, Kama and Freyja, and the Nordic ring — is set forever
- **Rings 4–8 are placed by real geography**: Mondiala sits at the centre of the world's 161 great cities; a city's bearing from that centre picks its hexagon and its real distance picks its ring. Three switchable centre modes — geographic, population-weighted and greatness-weighted — and adding a city moves the centre and re-flows the whole map
- **36 pink free-use districts** in a proven-minimal, mirror-symmetric lattice named after gods of love and sexuality — every non-green hexagon touches one, no two touch each other, and the gods keep their hexes no matter how the city flow settles
- **Smooth zoom that can never lose the map**: zooming out stops exactly at the full-city view, with the rim touching the screen edges
- Save to browser storage, JSON export/import, add rings beyond circle 8

The worldbuilding data lives in its own file,
[`city-designer/mondiala-data.js`](city-designer/mondiala-data.js) — the roster, coordinates,
info cards, real-city facts and the god lattice. It can be edited directly on GitHub; the map
reads it as-is, nothing to regenerate. [`city-designer/DATA.md`](city-designer/DATA.md) is a
human-readable, copy-into-Notion-friendly copy of all of it.

Full documentation: [city-designer/README.md](city-designer/README.md)

## Data

Hexagon data (names, circles, hexagon numbers, densities) is sourced from the
*Hexagons of Mondiala* database in Notion; the city roster extends the database
with the world's great cities.
