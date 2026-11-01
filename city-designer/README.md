# Mondiala — City Designer

Interactive hex-grid city designer for **Mondiala**, the new world capital.
Built from the "Hexagons of Mondiala" worldbuilding database (Notion).

## Features

- Hexagonal ring grid following the `L(n) = n × 6` circle system, with **Metropol** at the centre (1 km hex sides, 100 m boulevards)
- **Flat-top hexes**: the green radial spoke runs straight north–south through Metropol
- **Orientation numbers**: hexagon 1 is the topmost hex of every ring; numbers run clockwise, so the numbers help you read the compass
- Rings 0–6: 127 hexagons built from the Notion database, every one named
- **Ring 2 — the ancient inspirations**: the six green spokes carry the famous ancient cities — Rome, Athens, Constantinople, Mesopotamia (Babylon, Ur and Uruk combined), Jerusalem and Homoia (the proto-city, after Çatalhöyük in Anatolia); the six hexes between them are pink free-use districts named after gods of love and sexuality — Venus (beside Rome), Aphrodite (beside Athens), Eros, Ishtar (beside Mesopotamia), Kama and Freyja (the Norse one, fitting for the Nordic world capital)
- **18 pink free-use districts** in total (6 in ring 2, 12 in ring 5), all named after gods of love and sexuality and all kept off the green spokes, which are reserved for the metro main lines
- **Sorted rings**:
  - Ring 3 (Norden) — two population tiers: the five Nordic capitals + Göteborg hold the green spokes (Stockholm first, at the top), smaller cities sorted by population between them
  - Ring 4 — sorted by livability (EIU Global Liveability-style), the best city (Vienna) at the top of the ring
  - Ring 5 — the six most livable cities hold the green spokes (Osaka at the top); the next twelve sit between pink free-use buffers, so no city in ring 5 touches the green metro line; the twelve least livable moved to ring 6
  - Ring 6 — sorted by population, biggest city (Jakarta) at the top, now including the displaced ring-5 megacities (Delhi, Cairo, Beijing, Bangkok, Buenos Aires, Rio de Janeiro, Bogotá, Lima); the twenty smallest overflow cities sit in the unplaced-names pool
- **Ring view**: alternating red and blue rings, with Metropol and the six radial spoke hexes green — toggle with "View"
- **Type view**: paint hexes as District, Free-use district, Water, Plaza, Civic, Industrial (free-use hexes are pink, Kondomeriet-style)
- **Click any hexagon** for an info card: the real-world city it copies, its flag, architectural style — plus the real city's population, livability score and (where published) Walk Score
- Every hexagon shows its flag and name on the map; tooltips show the data too
- Postal-code labels in the `Circle · Name · Hexagon number` system
- Editable name, type, density, style and notes per hex
- **Lattice checker** validating the free-use district lattice (no two districts touch; every other interior hex touches one)
- Save to browser storage, JSON export/import, add rings beyond circle 6

## Usage

Open `index.html` in any browser — fully self-contained, no build step, no dependencies.

- Drag to pan, scroll to zoom
- Click a hexagon to inspect and edit it
- Paint mode applies an armed type to every hex you click
- "Check lattice" flags violations of the free-use district lattice on the map

## Data

Hexagon data (names, circles, hexagon numbers, densities) is sourced from the
*Hexagons of Mondiala* database in Notion.

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
