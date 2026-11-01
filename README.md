# Mondiala

Worldbuilding project for **Mondiala**, the new world capital — centred on the interactive city map.

**Try it live: <https://lyngvaldarnegard.github.io/Mondiala/>** — served by GitHub Pages, updated with every push to `main`.

## The city map

The interactive hex-grid map lives in [`city-designer/`](city-designer/). Open
[`city-designer/mondiala.html`](city-designer/mondiala.html) in any browser —
no build step, no dependencies.

- **Rings 0–8: 217 hexagons.** The authored heart — Metropol, the six inspiration cities (Paris, Barcelona, Moscow, Singapore, Vancouver, New York), the six cradle civilisations each with her goddess of love beside her (Ancient China–Zhinü, the Indus Valley–Rati, Mesopotamia–Inanna, Ancient Egypt–Hathor, the Ancient Andes–Cavillaca, Mesoamerica–Xochiquetzal), the ancient cities of ring 3 (Diyarbakır, Aleppo, Athens, Jerusalem, Babylon, Carthago, Rome, Aksum, Byzantium, Mecca, Tenochtitlan) with the great love gods Freyja, Aphrodite, Ishtar, Venus, Eros and Kama on their spokes, and the Nordic ring — is set forever
- **Rings 5–8 are placed by real geography**: Mondiala sits at the centre of the world's 314 great cities — modern, classical and simply famous, including the twelve newest megacities (Jinan, Dalian, Qingdao, Belo Horizonte, Harbin, Pune, Surabaya, Surat, Shenyang, Chongqing, Foshan, Dongguan). The roster is capital-complete: all 50 European capitals (Vatican City and San Marino included) and every capital of a country with more than a million people, plus the great non-capitals — Salzburg, Basel, Lausanne, Lyon, Marseille, Naples, Turin, Rotterdam, The Hague, Antwerp, Ghent, Bruges, Cambridge, Oxford, Dublin, Cork, Birmingham, Leeds, Manchester, Edinburgh, Glasgow, Lviv, Odesa, Thessaloniki. A city's bearing from that centre picks its hexagon and its real distance picks its ring. Three switchable centre modes — geographic (the western Stara Planina, the Balkan ridge above the Iskar Gorge in Bulgaria), population-weighted (Kazakhstan's Shardara steppe, between the Karatau mountains and the Syr Darya reservoir) and greatness-weighted (the Tigheci hills of southern Moldova) — and adding a city moves the centre and re-flows the whole map
- **42 pink free-use districts** in a proven-minimal, mirror-symmetric lattice named after gods of love and sexuality — every non-green hexagon touches one and no two touch each other. Twelve are authored in the heart (the cradle goddesses in ring 2, the great six on ring 3's spokes); the outer thirty sit **by compass**: each takes the reserved pink hex facing their homeland (eastern gods with the eastern cities, African gods to the south, the Norse and Baltic ones to the north), re-shuffling when the centre moves but never giving up their slots
- **Smooth zoom that can never lose the map**: zooming out stops exactly at the full-city view, with the rim touching the screen edges
- Save to browser storage, JSON export/import, add rings beyond circle 8 — and a headless test suite of 2 481 checks keeps it all honest

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
