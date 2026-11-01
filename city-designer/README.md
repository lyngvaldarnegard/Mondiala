# Mondiala — City Designer

Interactive hex-grid city designer for **Mondiala**, the new world capital.
Built from the "Hexagons of Mondiala" worldbuilding database (Notion).

## Features

- Hexagonal ring grid following the `L(n) = n × 6` circle system, with **Metropol** at the centre (1 km hex sides, 100 m boulevards)
- **Flat-top hexes**: the green radial spoke runs straight north–south through Metropol
- **Orientation numbers**: hexagon 1 is the topmost hex of every ring; numbers run clockwise, so the numbers help you read the compass
- Rings 0–8: 217 hexagons, every one named — the heart carries cities only; the twelve gods of love wait unplaced, to be hand-named onto any hexagon you like

## The authored heart (rings 0–4)

The heart is fixed by hand in every centre mode:

- **Metropol** — the capital hexagon at the centre (density 4355.39 people/km²)
- **Ring 1 — the cradle civilisations**: the six places where the city itself was invented, one on every spoke, in founding order — **China, the Indus Valley, Mesopotamia, Egypt, the Andes and Mesoamerica**
- **Ring 2 — the ancient cities**: each civilisation's first great city on the spoke behind it — **Chang'an** (China), **Mohenjo-daro** (Indus Valley), **Uruk** (Mesopotamia), **Memphis** (Egypt), **Cusco** (the Andes) and **Tenochtitlan** (Mesoamerica) — with six ancient classics between them: **Constantinople, Athens, Babylon, Rome, Tyre** (carrying Phoenicia's legacy) **and Carthage**
- **Ring 3 — Norden**: the Nordic world, 18 hexes with every Nordic country and autonomous land represented — the five capitals plus Göteborg on the green spokes (**Stockholm, København, Helsinki, Oslo, Göteborg**), and between them the Nordic cities by size: **Vilnius, Riga, Tallinn, Tampere | Tammerfors, Malmö, Aarhus, Kaunas, Bergen, Trondheim**, the small capitals of the North Atlantic **Mariehamn, Reykjavík, Tórshavn, Nuuk** — the Faroe Islands, Greenland and Åland all aboard, with Göteborg and Kaunas keeping their priority seats
- **Ring 4 — the inspiration cities**: the six cities Mondiala learns from, each on the spoke its homeland bears to, carrying its real-world density — **Paris** (19 430), **Barcelona** (16 630), **Moscow** (5 080), **Singapore** (8 188.27), **Vancouver** (5 749.9) and **New York** (11 313.8) — with a world tour of eighteen more between them, clockwise from Paris: **London, Amsterdam, Madrid; Berlin, Vienna, Prague; Seoul, Tokyo, Hong Kong; Dubai, Sydney, San Francisco; Toronto, Chicago, Mexico City; Rio de Janeiro, Cape Town, Lisbon** (densities are Demographia-style urban-area estimates)

### The twelve gods of love — yours to place

The heart's twelve gods — the cradle goddesses (**Zhinü, Rati, Inanna, Hathor, Cavillaca, Xochiquetzal**) and the great six (**Aphrodite, Venus, Eros, Ishtar, Kama, Freyja**) — are deliberately **not placed yet**. The heart ships with cities only — name any hexagon for a god and it becomes theirs:

- Click any hexagon, type a god's name in the inspector, press **Apply** — the hexagon turns pink on the spot, because the name *is* the type (the city it carried returns to the pool)
- Hand-placed gods survive **everything**: centre-mode switches, adding cities, adding rings, export/import, even a full reset
- **Check lattice** guides you: orange hexagons are ordinary hexes that don't touch a god yet; red dashed ones break symmetry or sit on a green spoke. Fill the heart symmetrically and the checker reads 0 / 0 / 0
- One symmetric solution the checker is happy with: the ring-2 mid pairs 2/12, 4/10 and 6/8, and the ring-4 mid pairs 2/24, 3/23 and 6/20 — mirrored pairs across the north–south axis

## The coordinate-driven world (rings 5–8)

Outside the authored heart, the city is **placed by real geography** instead of by hand:

- One roster of **305 great cities** — the big ones, the livable ones, the walkable ones, the ancient ones and simply famous ones — each carrying its real latitude and longitude. The ancient and holy cities that once sat in the hand-made heart (**Aleppo, Diyarbakır, Jerusalem, Babylon, Mecca, Aksum**) are back on the roster and flow onto the outer rings by the same compass rule, settling near their kin
- **The capital audit**: every European capital (all 50, from Vatican City and San Marino to Moscow and Ankara) and every capital of a country with more than a million people (from Washington D.C. and Mexico City to Nouakchott, Libreville and Malabo) is on the map — plus the classic non-capitals: Salzburg, Basel, Lausanne, Lucerne, Lyon, Marseille, Naples, Turin, Bologna, Genoa, Palermo, Verona, Rotterdam, The Hague, Antwerp, Ghent, Bruges, Cambridge, Oxford, Dublin, Cork, Birmingham, Leeds, Manchester, Edinburgh, Aberdeen, Glasgow, Lviv, Odesa, Thessaloniki…
- **Mondiala sits at the centre of that roster**: wherever the roster's centre falls on Earth, that is where Mondiala "is", and the rings read like a compass around it — a city's bearing from the centre picks its hexagon, its real distance picks its ring (near = inner), and population breaks ties
- **Three switchable centre modes** (the panel shows the coordinates *and the country, with its flag*, wherever Mondiala ends up):
  - **Geographic** — the plain midpoint of all 305 cities: ≈ 42.15°N 24.79°E, on the **Thracian plain at Plovdiv's eastern edge, Bulgaria** — the upper Maritsa valley under the Rhodope foothills, on the site of ancient Philipopolis (🇧🇬)
  - **Population-weighted** — weighted by urban-area population (ancient cities at their ancient peaks): ≈ 36.93°N 67.00°E, in the **Babatag range of Tajikistan** — arid border hills south of the Hisor valley, above the Amu Darya plain (🇹🇯)
  - **Greatness-weighted** — size + livability + walkability: ≈ 44.49°N 28.97°E, on the **Dobruja steppe of Romania** — the dry Casimcea plateau between the Danube and the Black Sea coast (🇷🇴)
- The three default spots were reverse-checked against real maps. If you add a city and move the centre off them, the panel honestly falls back to the country of the nearest roster city (e.g. "🇺🇿 Uzbekistan (nearest: Tashkent, 96 km)")
- **Add a city and the map re-flows**: type a name, latitude, longitude and population, and Mondiala's centre moves — every ring re-settles around the new middle. Removing an added city restores the exact previous map
- **The pool = cities beyond the horizon**: the 179 cities too far from the centre to fit before ring 8 ends — in geographic mode the megacities of the far side (Jakarta, Delhi, Shanghai, Guangzhou, Mumbai, São Paulo) plus the world's younger capitals (Canberra, Wellington, Pyongyang, Ottawa, Brasília, Nairobi, Kigali, Nouakchott, Libreville, Malabo), Japan's Kyoto and Hiroshima, the Pacific and Gulf cities (Auckland, Brisbane, Honolulu, New Orleans, Quebec City) and ancient Tikal and Timbuktu. Press **+ Add ring** and 54 of them settle onto the new rim by the same compass rule

## The pink free-use districts

- **42 pink free-use districts** in total once the heart is filled — 12 in the heart (hand-placed, see above) and 30 in the outer lattice: 12 in ring 5, 12 in ring 7, 6 in ring 8 — all named after gods of love and sexuality
- **Three lattice rules**, enforced by the checker:
  1. **No god on the green** — the pink districts are never allowed on Metropol or the green spokes, which carry the metro main lines
  2. **Mirror symmetry** — the pink set mirrors across the north–south axis; the left half of the city matches the right
  3. **Every ordinary hexagon of the outer city touches a god** — any hex of rings 5 and beyond that is not green borders at least one pink free-use district; the authored heart stands on its own
- The twelve heart gods wait unplaced — the heart ships 0 / 0 / 0 (no gods, no flags); placing them is up to you
- The outer gods sit **by compass**: each takes the reserved pink hex that faces their homeland, by bearing from Mondiala's centre — the same rule as the cities. Eastern gods (Nanaya, Anahita, Parvati, Yue Lao, Astghik, Aizen-Myōō) sit with the eastern cities; African gods (Oshun, Bastet, Bes, Mami Wata, Erzulie Freda) to the south; the Norse and Baltic ones (Sjöfn, Freyr, Milda, Zhiva) to the north; the Mediterranean love gods (Cupid, Adonis, Astarte, Qetesh, Turan, Prende, Lada, Cybele, Dionysus, Himeros, Peitho, Anteros, Pothos) with the classical world; and Áine and Tlazolteotl to the west. Each god's homeland coordinates are part of the data
- **The gods re-shuffle with the centre**: switch centre mode or add a city, and the outer gods re-settle onto the same reserved lattice to face their homelands from the new spot — and the hand-placed heart gods never move
- Five deities (Shaushka, Attis, Min, Lofn, Xochipilli) are dormant for now — their info cards remain, waiting for a future ring

## The tools

- **Ring view**: alternating red and blue rings, with Metropol and the six radial spoke hexes green — toggle with "View"
- **Type view**: paint hexes as District, Free-use district, Water, Plaza, Civic, Industrial (free-use hexes are pink, Kondomeriet-style)
- **Click any hexagon** for an info card: the real-world city it copies, its flag, architectural style — plus the real city's population, livability score and (where published) Walk Score
- Every hexagon shows its flag and name on the map; tooltips show the data too
- Postal-code labels in the `Circle · Name · Hexagon number` system
- Editable name, type, density, style and notes per hex — manual edits survive re-flows, and naming a hex for a god of love makes it pink automatically
- **World placement panel**: switch centre mode, see where Mondiala sits (coordinates, country and flag), add cities
- **Lattice checker** enforcing the three lattice rules — green spokes stay sacred, symmetry stays whole, no ordinary hex gets left without a god
- Save to browser storage, JSON export/import (carries the centre mode, your added cities and your hand-placed gods), add rings beyond circle 8
- **Headless test suite**: 453 checks verify the roster's integrity, the heart's authored contents, the three lattice rules, the hand-god placement flow (placement, auto-pinking, survival across switches, imports, resets, ring 9), the compass placements and pool of all three centre modes, the capital audit, add/remove and import/export round-trips, zoom and pan behaviour, and that `DATA.md` matches the live city — see [`test/`](test/)

## Usage

Open `mondiala.html` in any browser — no build step, no dependencies. The map reads
its world data from the five `mondiala-*.js` files in the same folder, so keep the whole
`city-designer` folder together (downloading the folder gets you everything).
Or just use the hosted copy: **<https://lyngvaldarnegard.github.io/Mondiala/>**.

- Drag to pan, scroll to zoom — the zoom steps are smooth and follow the wheel; a hard flick still moves only one gentle step. Dragging and zooming never highlight the page text; only form fields and the JSON box stay selectable
- **Zooming out can never lose the map**: it stops exactly at the full-city view, with the city's edges touching the screen — the default view. Panning away and zooming out brings you right back to it
- Adding a ring re-fits the view the same way, so the new rim's edges touch the screen
- Click a hexagon to inspect and edit it
- Paint mode applies an armed type to every hex you click
- "Check lattice" flags violations of the three lattice rules on the map

## Tests — `test/`

The headless suite that keeps every claim in this README honest lives in
**[`test/`](test/)** and is part of the repository — so it survives everything and anyone
can re-run it. It loads the *shipped* files (`mondiala.html` + its five themed data
files) the same way a browser would, rebuilds the city, and runs **453 checks**: roster integrity, the
authored heart, the lattice rules and validator, the hand-placement god flow, all three centre
modes' placements, pools and centres, the capital audit, save/load, pool arm-and-place,
paint, inspector, pan/zoom, and a full `DATA.md` consistency pass.

Run it from the `city-designer` folder with `sh test/run.sh` — needs Node ≥ 18 and nothing
else. `test/split_push.py` rebuilds `mondiala.html` and the five `mondiala-*.js` data
files from the source canvas; `test/gen_data_md.js` regenerates `DATA.md` from the live city.

## Data

The worldbuilding data lives in **five themed files**, so a change means editing one
small file instead of a monolith:

- **[`mondiala-heart.js`](mondiala-heart.js)** — the authored heart, rings 0–4: Metropol, the cradle
  civilisations, the ancient cities, Norden and the inspiration cities
- **[`mondiala-cities.js`](mondiala-cities.js)** — the 305-city world roster with real
  coordinates, each city's country, and the three verified centre spots
- **[`mondiala-info.js`](mondiala-info.js)** — the info cards: [flag, style description] for
  every hexagon's real-world model
- **[`mondiala-facts.js`](mondiala-facts.js)** — the real-city facts: population, livability
  and Walk Score per city
- **[`mondiala-gods.js`](mondiala-gods.js)** — the gods of love: the reserved pink slot
  lattice, the waiting gods per ring, each god's homeland coordinates and the full name set

Edit them directly on GitHub — the map reads them as-is, no regeneration needed.
**[`DATA.md`](DATA.md)** is a human-readable copy of the same data (tables you can copy
into Notion), generated from the live city.

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
- **Countries** — the roster carries each city's country; the world-placement panel uses it to name the country at Mondiala's coordinates, and the three default centre spots are stored with their verified countries (Bulgaria, Tajikistan, Romania).
- **God homelands** — each love god's origin coordinates decide which reserved pink hex they face; the outer gods re-settle by compass whenever Mondiala's centre moves, and the twelve heart gods wait for their hand-placed seats.
