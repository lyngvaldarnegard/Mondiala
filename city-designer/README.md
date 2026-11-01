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
- **Ring 1** — the six largest inspirations: Paris, Barcelona, Moscow, Singapore, Vancouver, New York
- **Ring 2 — the ancient inspirations**: the six green spokes carry the famous ancient cities — Rome, Athens, Constantinople, Mesopotamia (Babylon, Ur and Uruk combined), Jerusalem and Homoia (the proto-city, after Çatalhöyük in Anatolia); the six hexes between them are pink free-use districts named after gods of love and sexuality — Venus (beside Rome), Aphrodite (beside Athens), Eros, Ishtar (beside Mesopotamia), Kama and Freyja (the Norse one, fitting for the Nordic world capital)
- **Ring 3 (Norden)** — the Nordic world: two population tiers, the five Nordic capitals + Göteborg hold the green spokes, smaller cities sorted by population between them

## The coordinate-driven world (rings 4–8)

Outside the fixed heart, the city is **placed by real geography** instead of by hand:

- One roster of **161 great cities** — the big ones, the livable ones and the walkable ones — each carrying its real latitude and longitude
- **Mondiala sits at the centre of that roster**: wherever the roster's centre falls on Earth, that is where Mondiala "is", and the rings read like a compass around it — a city's bearing from the centre picks its hexagon, its real distance picks its ring (near = inner), and population breaks ties
- **Three switchable centre modes**:
  - **Geographic** — the plain midpoint of all 161 cities: ≈ 49.0°N 20.7°E, on the Poland–Slovakia border
  - **Population-weighted** — weighted by urban-area population: ≈ 42.4°N 71.8°E, in the Tian Shan mountains
  - **Greatness-weighted** — size + livability + walkability: ≈ 51.5°N 24.9°E, in the Ukrainian–Polish borderlands
- **Add a city and the map re-flows**: type a name, latitude, longitude and population, and Mondiala's centre moves — every ring re-settles around the new middle
- **The pool = cities beyond the horizon**: the 11 cities too far from the centre to fit before ring 8 ends (in geographic mode the Andes and Australia: Quito, La Paz, Cusco, Lima, Montevideo, Buenos Aires, Santiago, Valparaíso, Perth, Melbourne, Sydney). Press **+ Add ring** and they settle onto the new rim by the same compass rule

## The pink free-use districts

- **36 pink free-use districts** in total — 6 in ring 2, 12 in ring 5, 12 in ring 7, 6 in ring 8 — all named after gods of love and sexuality and all kept off the green spokes, which are reserved for the metro main lines
- The lattice is a **proven minimum**: with the six ring-2 hexes fixed, no arrangement covers every non-green hexagon with fewer districts
- **Mirror-symmetric about the north–south axis**: the left half of the city mirrors the right half
- **The lattice rule**: every hexagon that is not green borders at least one pink free-use district — the green hexes (Metropol and the six metro spokes) are the only exemption — and no two districts touch each other
- The district hexes are **reserved**: wherever the city flow settles, the gods keep their slots. Six deities (Shaushka, Attis, Pothos, Min, Lofn, Xochipilli) are dormant for now — their info cards remain, waiting for a future ring

## The tools

- **Ring view**: alternating red and blue rings, with Metropol and the six radial spoke hexes green — toggle with "View"
- **Type view**: paint hexes as District, Free-use district, Water, Plaza, Civic, Industrial (free-use hexes are pink, Kondomeriet-style)
- **Click any hexagon** for an info card: the real-world city it copies, its flag, architectural style — plus the real city's population, livability score and (where published) Walk Score
- Every hexagon shows its flag and name on the map; tooltips show the data too
- Postal-code labels in the `Circle · Name · Hexagon number` system
- Editable name, type, density, style and notes per hex — manual edits survive re-flows
- **World placement panel**: switch centre mode, see where Mondiala sits, add cities
- **Lattice checker** validating the free-use district lattice (no two districts touch; every non-green hexagon touches one)
- Save to browser storage, JSON export/import (carries the centre mode and your added cities), add rings beyond circle 8

## Usage

Open `mondiala-map.html` in any browser — no build step, no dependencies. The map reads
its world data from `mondiala-data.js` in the same folder, so keep the two files together
(downloading the whole `city-designer` folder gets you everything).

- Drag to pan, scroll to zoom — the zoom steps are smooth and follow the wheel; a hard flick still moves only one gentle step
- **Zooming out can never lose the map**: it stops exactly at the full-city view, with the city's edges touching the screen — the default view. Panning away and zooming out brings you right back to it
- Adding a ring (or resetting) re-fits the view the same way, so the new rim's edges touch the screen
- Click a hexagon to inspect and edit it
- Paint mode applies an armed type to every hex you click
- "Check lattice" flags violations of the free-use district lattice on the map

## Data

The worldbuilding data lives in its own file, **[`mondiala-data.js`](mondiala-data.js)**: the
fixed rings 0–3, the 161-city world roster with real coordinates, the info cards, the
real-city facts and the reserved god lattice. Edit it directly on GitHub — the map reads
it as-is, no regeneration needed. **[`DATA.md`](DATA.md)** is a human-readable copy of the
same data (tables you can copy into Notion), generated from the `.js` file.

Hexagon data (names, circles, hexagon numbers, densities) is sourced from the
*Hexagons of Mondiala* database in Notion; the city roster extends the database
with the world's great cities.

Real-city data in the info cards:

- **Population** — urban area (the physical settlement), not administrative city limits:
  Nordic cities from the national statistics agencies (Statistics Sweden *tätort* 2023,
  Statistics Denmark *byområde* 2026, SSB *tettsted* 2025, Statistics Finland urban areas 2024);
  megacities from Demographia World Urban Areas (2025). Estimates are marked with "≈".
- **Livability** — EIU Global Liveability Index scale. Values tagged "EIU GLI 2026" are verified
  from the published 2026 ranking (Copenhagen 98.0, Vienna 97.1, Melbourne 97.0, Sydney 96.6,
  Osaka 96.0, Tokyo 95.7, Vancouver 95.8); everything else is an editorial estimate calibrated
  to that index and marked with "≈".
- **Walk Score** — published Walk Score city rankings, shown where available (mostly US cities).
- **Coordinates** — city-centre latitude/longitude in decimal degrees.
