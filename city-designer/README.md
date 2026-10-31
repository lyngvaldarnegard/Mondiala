# Mondiala — City Designer

Interactive hex-grid city designer for **Mondiala**, the new world capital.
Built from the "Hexagons of Mondiala" worldbuilding database (Notion).

## Features

- Hexagonal ring grid following the `L(n) = n × 6` circle system, with **Metropol** at the centre (1 km hex sides, 100 m boulevards)
- Rings 0–6: 156 named hexagons from the Notion database, pre-placed with real names and densities
- **Ring view**: alternating red and blue rings, with Metropol and the six radial spoke hexes green — toggle with "View"
- **Type view**: paint hexes as District, Free-use park, Water, Plaza, Civic, Industrial (free-use hexes are pink, Kondomeriet-style)
- **Click any hexagon** for an info card: the real-world city it copies, its flag, architectural style, density and estimated population
- Every hexagon shows its flag and name on the map
- Postal-code labels in the `Circle · Name · Hexagon number` system
- Editable name, type, density, style and notes per hex
- **Lattice checker** validating the free-use park rule (each park surrounded by six non-park hexes; every non-park hex touches a park)
- Unplaced-names pool for cities awaiting a hexagon slot
- Save to browser storage, JSON export/import, add rings beyond circle 6

## Usage

Open `index.html` in any browser — fully self-contained, no build step, no dependencies.

- Drag to pan, scroll to zoom
- Click a hexagon to inspect and edit it
- Paint mode applies an armed type to every hex you click
- "Check lattice" flags violations of the free-use park lattice on the map

## Data

Hexagon data (names, circles, hexagon numbers, densities) is sourced from the
*Hexagons of Mondiala* database in Notion.
