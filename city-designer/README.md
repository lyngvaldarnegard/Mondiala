# Mondiala — City Designer

Interactive hex-grid city designer for **Mondiala**, the new world capital.
Built from the "Hexagons of Mondiala" worldbuilding database (Notion).

## Features

- Hexagonal ring grid following the `L(n) = n × 6` circle system, with **Metropol** at the centre (1 km hex sides, 100 m boulevards)
- **Flat-top hexes**: the green radial spoke runs straight north–south through Metropol
- **Orientation numbers**: hexagon 1 is the topmost hex of every ring; numbers run clockwise, so the numbers help you read the compass
- Rings 0–8: 217 hexagons, every one named
- **Ring 2 — the ancient inspirations**: the six green spokes carry the famous ancient cities — Rome, Athens, Constantinople, Mesopotamia (Babylon, Ur and Uruk combined), Jerusalem and Homoia (the proto-city, after Çatalhöyük in Anatolia); the six hexes between them are pink free-use districts named after gods of love and sexuality — Venus (beside Rome), Aphrodite (beside Athens), Eros, Ishtar (beside Mesopotamia), Kama and Freyja (the Norse one, fitting for the Nordic world capital)
- **42 pink free-use districts** in total (6 in ring 2, 12 in ring 5, 18 in ring 7, 6 in ring 8), all named after gods of love and sexuality and all kept off the green spokes, which are reserved for the metro main lines. New deities on the rim: Áine (Ireland), Parvati (India), Yue Lao (China), Mami Wata (West and Central Africa), Tlazolteotl (Mesoamerica) and Erzulie Freda (Vodou)
- **The lattice rule**: every hexagon that is not green borders at least one pink free-use district — the green hexes (Metropol and the six metro spokes) are the only exemption
- **The world map (rings 4–8)**: laid out like a map of Earth, with Metropol imagined in the Mediterranean — Europe in the north, Asia and Oceania in the east, Africa in the south, the Americas in the west. Every green spoke outside Norden carries a national capital or the country's largest city, plus the approved exceptions (Berlin, Hamburg, Munich and Frankfurt; Beijing, Shanghai, Hong Kong and Macau):
  - Ring 4 — the Grand Tour of iconic cities (London holds the top spoke; Ankara, Beijing, Cairo, Buenos Aires and Washington D.C. the others)
  - Ring 5 — the capitals ring, with pink free-use buffers flanking each spoke and holding each side's middle, so every ring-4 city touches a district (Berlin, Tehran, Shanghai, Lagos, São Paulo, Toronto hold the spokes)
  - Ring 6 — the dense world belt: 36 cities in one full circuit with no buffers (Hamburg, Riyadh, Hong Kong, Kinshasa, Lima and Mexico City on the spokes)
  - Ring 7 — the second capitals ring, with pink buffers flanking the spokes and anchoring the middle of each side (Frankfurt, Baghdad, Macau, Johannesburg, Bogotá and Havana hold the spokes)
  - Ring 8 — the outer world, completing every continent, with pink free-use districts anchoring the middle of each side so the rim's hexes touch a district too (Munich, Astana, Seoul, Nairobi, Santiago and Ottawa on the spokes)
  - Ring 3 (Norden) — unchanged: two population tiers, the five Nordic capitals + Göteborg hold the green spokes, smaller cities sorted by population between them
- **Ring view**: alternating red and blue rings, with Metropol and the six radial spoke hexes green — toggle with "View"
- **Type view**: paint hexes as District, Free-use district, Water, Plaza, Civic, Industrial (free-use hexes are pink, Kondomeriet-style)
- **Click any hexagon** for an info card: the real-world city it copies, its flag, architectural style — plus the real city's population, livability score and (where published) Walk Score
- Every hexagon shows its flag and name on the map; tooltips show the data too
- Postal-code labels in the `Circle · Name · Hexagon number` system
- Editable name, type, density, style and notes per hex
- **Lattice checker** validating the free-use district lattice (no two districts touch; every non-green hexagon touches one)
- Save to browser storage, JSON export/import, add rings beyond circle 8
- **Unplaced-names pool**: famous cities still waiting for a hexagon (Florence, Utrecht, Porto, Bristol, Houston, Portland, Xi'an, Suzhou, Nanjing, Tianjin, Bandung, plus Sarajevo, Kathmandu, Guangzhou, Pretoria, Manaus and Dallas, which yielded their rim hexes to the new pink districts) — click to arm, click a hex to place

## Usage

Open `index.html` in any browser — fully self-contained, no build step, no dependencies.

- Drag to pan, scroll to zoom
- Click a hexagon to inspect and edit it
- Paint mode applies an armed type to every hex you click
- "Check lattice" flags violations of the free-use district lattice on the map

## Data

Hexagon data (names, circles, hexagon numbers, densities) is sourced from the
*Hexagons of Mondiala* database in Notion; the world-map rings extend the
database with cities that make geographic sense.

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
