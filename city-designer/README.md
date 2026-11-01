# Mondiala — City Designer

Interactive hex-grid city designer for **Mondiala**, the new world capital.
Built from the "Hexagons of Mondiala" worldbuilding database (Notion).

## Features

- Hexagonal ring grid following the `L(n) = n × 6` circle system, with **Metropol** at the centre (1 km hex sides, 100 m boulevards)
- **Flat-top hexes**: the green radial spoke runs straight north–south through Metropol
- **Orientation numbers**: hexagon 1 is the topmost hex of every ring; numbers run clockwise, so the numbers help you read the compass
- Rings 0–8: 217 hexagons, every one named

## The fixed heart (rings 0–3)

- **Metropol** — the capital hexagon at the centre
- **Ring 1 — the cradle civilisations**: the six civilisations that invented the city — Ancient China, the Indus Valley, Mesopotamia, Ancient Egypt, the Ancient Andes and Mesoamerica — each settled on the spoke its homeland bears to from Mondiala
- **Ring 2 — the cradle heart**: the six green spokes carry each civilisation's first great city — Chang'an, Mohenjo-daro, Uruk, Memphis, Qosqo and Tenochtitlan — each directly outside its cradle hex; the six pink hexes between carry each civilisation's goddess of love — Zhinü (beside Ancient China), Rati (the Indus Valley), Inanna (Mesopotamia), Hathor (Ancient Egypt), Cavillaca (the Ancient Andes) and Xochiquetzal (Mesoamerica) — each adjacent to her own civilisation
- **Ring 3 (Norden)** — the Nordic world: two population tiers, the five Nordic capitals + Göteborg hold the green spokes, smaller cities sorted by population between them

## The coordinate-driven world (rings 4–8)

Outside the fixed heart, the city is **placed by real geography** instead of by hand:

- One roster of **206 great cities** — the big ones, the livable ones, the walkable ones, the ancient ones (the OG cities) and simply famous ones — each carrying its real latitude and longitude
- **Mondiala sits at the centre of that roster**: wherever the roster's centre falls on Earth, that is where Mondiala "is", and the rings read like a compass around it — a city's bearing from the centre picks its hexagon, its real distance picks its ring (near = inner), and population breaks ties
- **The classical and famous cities flow by compass onto the outer rings** — Rome, Athens, Alexandria, Jerusalem, Jericho, Constantinople, Carthage, Babylon, Ur and Tikal settle near the civilisations they grew from; the holy cities (Mecca, Medina, Gaza, Damascus) cluster together on their bearing; the Silk Road runs out through Isfahan and Samarkand; Kyoto and Hiroshima join the eastern rim alongside the modern giants
- **Three switchable centre modes** (the panel shows the coordinates *and the country, with its flag*, wherever Mondiala ends up):
  - **Geographic** — the plain midpoint of all 206 cities: ≈ 48.5°N 24.6°E, in the Carpathian highlands of Ukraine, above the Prut valley near Yaremche (🇺🇦)
  - **Population-weighted** — weighted by urban-area population (ancient cities at their ancient peaks): ≈ 45.1°N 65.9°E, in the Kyzylkum steppe of southern Kazakhstan, north of the Syr Darya (🇰🇿)
  - **Greatness-weighted** — size + livability + walkability: ≈ 50.8°N 27.6°E, in Volhynian Polissya, Ukraine's woodland country by Yemilchyne (🇺🇦)
- The three default spots were reverse-checked against real maps. If you add a city and move the centre off them, the panel honestly falls back to the country of the nearest roster city (e.g. "🇵🇱 Poland (nearest: Kraków, 359 km)")
- **Add a city and the map re-flows**: type a name, latitude, longitude and population, and Mondiala's centre moves — every ring re-settles around the new middle
- **The pool = cities beyond the horizon**: the 56 cities too far from the centre to fit before ring 8 ends (in geographic mode the far side of the world — Tokyo, Jakarta, Mexico City, São Paulo, Buenos Aires, Rio, the Andes cities, Australia, plus Auckland, Brisbane, New Orleans, Honolulu and ancient Tikal). Press **+ Add ring** and they settle onto the new rim by the same compass rule

## The pink free-use districts

- **36 pink free-use districts** in total — 6 in ring 2, 12 in ring 5, 12 in ring 7, 6 in ring 8 — all named after gods of love and sexuality and all kept off the green spokes, which are reserved for the metro main lines
- **The cradle six are authored**: Zhinü, Rati, Inanna, Hathor, Cavillaca and Xochiquetzal sit in ring 2, each beside her own civilisation — they never move
- The outer lattice is a **proven minimum**: with the six ring-2 hexes fixed, no arrangement covers every non-green hexagon with fewer districts
- **Mirror-symmetric about the north–south axis**: the left half of the city mirrors the right half
- **The lattice rule**: every hexagon that is not green borders at least one pink free-use district — the green hexes (Metropol and the six metro spokes) are the only exemption — and no two districts touch each other
- The district hexes are **reserved**: wherever the city flow settles, the gods keep the lattice — the slot lattice itself never moves
- **The outer gods (rings 5, 7, 8) sit by compass**: each god takes the reserved pink hex that faces their homeland, by bearing from Mondiala's centre — the same rule as the cities. Eastern gods (Nanaya, Anahita, Rati, Kama, Parvati, Yue Lao) sit with the eastern cities; African gods (Oshun, Bastet, Bes, Mami Wata) to the south; the Norse and Baltic ones (Sjöfn, Freyr, Freyja, Milda, Zhiva) to the north; the Mediterranean love gods (Venus, Aphrodite, Cupid, Adonis, Astarte, Qetesh, Turan, Prende, Lada, Cybele, Dionysus, Himeros, Peitho) with the classical world; and Áine, Tlazolteotl and Erzulie Freda to the west. Each god's homeland coordinates are part of the data
- **The gods re-shuffle with the centre**: switch centre mode or add a city, and the gods re-settle onto the same lattice to face their homelands from the new spot — they never give up their reserved slots, and the cradle six keep their authored hexes
- Eight deities (Shaushka, Attis, Pothos, Min, Lofn, Xochipilli, Eros, Ishtar) are dormant for now — Eros and Ishtar rest while their Roman and Sumerian selves (Cupid, Inanna) walk the city — their info cards remain, waiting for a future ring

## The tools

- **Ring view**: alternating red and blue rings, with Metropol and the six radial spoke hexes green — toggle with "View"
- **Type view**: paint hexes as District, Free-use district, Water, Plaza, Civic, Industrial (free-use hexes are pink, Kondomeriet-style)
- **Click any hexagon** for an info card: the real-world city it copies, its flag, architectural style — plus the real city's population, livability score and (where published) Walk Score
- Every hexagon shows its flag and name on the map; tooltips show the data too
- Postal-code labels in the `Circle · Name · Hexagon number` system
- Editable name, type, density, style and notes per hex — manual edits survive re-flows
- **World placement panel**: switch centre mode, see where Mondiala sits (coordinates, country and flag), add cities
- **Lattice checker** validating the free-use district lattice (no two districts touch; every non-green hexagon touches one)
- Save to browser storage, JSON export/import (carries the centre mode and your added cities), add rings beyond circle 8

## Usage

Open `mondiala.html` in any browser — no build step, no dependencies. The map reads
its world data from `mondiala-data.js` in the same folder, so keep the two files together
(downloading the whole `city-designer` folder gets you everything).

- Drag to pan, scroll to zoom — the zoom steps are smooth and follow the wheel; a hard flick still moves only one gentle step. Dragging and zooming never highlight the page text; only form fields and the JSON box stay selectable
- **Zooming out can never lose the map**: it stops exactly at the full-city view, with the city's edges touching the screen — the default view. Panning away and zooming out brings you right back to it
- Adding a ring (or resetting) re-fits the view the same way, so the new rim's edges touch the screen
- Click a hexagon to inspect and edit it
- Paint mode applies an armed type to every hex you click
- "Check lattice" flags violations of the free-use district lattice on the map

## Data

The worldbuilding data lives in its own file, **[`mondiala-data.js`](mondiala-data.js)**: the
fixed cradle heart (rings 0–3), the 206-city world roster with real coordinates, each city's
country, the info cards, the real-city facts, the reserved god lattice and each god's homeland
coordinates. Edit it directly on GitHub — the map reads it as-is, no regeneration needed.
**[`DATA.md`](DATA.md)** is a human-readable copy of the same data (tables you can copy
into Notion), generated from the `.js` file.

Hexagon data (names, circles, hexagon numbers, densities) is sourced from the
*Hexagons of Mondiala* database in Notion; the city roster extends the database
with the world's great cities, the classical ancient ones and the simply famous.

Real-city data in the info cards:

- **Population** — urban area (the physical settlement), not administrative city limits:
  Nordic cities from the national statistics agencies (Statistics Sweden *tätort* 2023,
  Statistics Denmark *byområde* 2026, SSB *tettsted* 2025, Statistics Finland urban areas 2024);
  megacities from Demographia World Urban Areas (2025); ancient cities at their ancient peaks
  (marked "≈ ancient peak"). Estimates are marked with "≈".
- **Livability** — EIU Global Liveability Index scale. Values tagged "EIU GLI 2026" are verified
  from the published 2026 ranking (Copenhagen 98.0, Vienna 97.1, Melbourne 97.0, Sydney 96.6,
  Osaka 96.0, Tokyo 95.7, Vancouver 95.8); everything else is an editorial estimate calibrated
  to that index and marked with "≈".
- **Walk Score** — published Walk Score city rankings, shown where available (mostly US cities).
- **Coordinates** — city-centre latitude/longitude in decimal degrees.
- **Countries** — the roster carries each city's country; the world-placement panel uses it to name the country at Mondiala's coordinates, and the three default centre spots are stored with their verified countries (Ukraine, Kazakhstan, Ukraine).
- **God homelands** — each love god's origin coordinates decide which reserved pink hex they face; the outer gods re-settle by compass whenever Mondiala's centre moves.
