# Mondiala — City Designer

Interactive hex-grid city designer for **Mondiala**, the new world capital.
Built from the "Hexagons of Mondiala" worldbuilding database (Notion).

## Features

- Hexagonal ring grid following the `L(n) = n × 6` circle system, with **Metropol** at the centre (1 km hex sides, 100 m boulevards)
- **Flat-top hexes**: the green radial spoke runs straight north–south through Metropol
- **Orientation numbers**: hexagon 1 is the topmost hex of every ring; numbers run clockwise, so the numbers help you read the compass
- Rings 0–8: 217 hexagons, 205 named — the eighteen empty heart hexes wait for the twelve gods of love, to be filled in by hand

## The authored heart (rings 0–4)

The heart is fixed by hand in every centre mode:

- **Metropol** — the capital hexagon at the centre (density 4355.39 people/km²)
- **Ring 1 — the inspiration cities**: the six cities Mondiala learns from — **Paris, Barcelona, Moscow, Singapore, Vancouver and New York** — each on the spoke its homeland bears to, carrying its real-world density (Paris 19 430, Barcelona 16 630, New York 11 313.8, Singapore 8 188.27, Vancouver 5 749.9, Moscow 5 080 people/km²)
- **Ring 2 — the cradle civilisations**: the civilisations that invented the city hold the green spokes — **China, the Indus Valley, Mesopotamia, Egypt, the Andes and Mesoamerica** — with **Greece** and **Phoenicia** joining them between. Hexes 2, 6, 8 and 12 stay open for now
- **Ring 3 — the cradle cities and the classics**: each civilisation's first great city on its spoke — **Chang'an** (China), **Mohenjo-daro** (Indus Valley), **Uruk** (Mesopotamia), **Memphis** (Egypt), **Cusco** (the Andes) and **Tenochtitlan** (Mesoamerica) — with the four classics between them: **Athens** (beside Greece), **Constantinople**, **Rome** and **Carthage**. Hexes 2, 3, 6, 9, 11, 14, 17 and 18 stay open for now
- **Ring 4 — Norden**: the Nordic world, 24 hexes with every Nordic country and autonomous land represented — the capitals plus Göteborg on the green spokes (**Stockholm, København, Helsinki, Oslo, Göteborg, Reykjavík**), and between them, sorted by population: **Vilnius, Riga, Tallinn, Tampere | Tammerfors, Malmö, Aarhus, Kaunas, Turku | Åbo, Bergen, Trondheim, Vyborg, Billund, Stavanger, Kristiansand, Narva**, and the small capitals of the North Atlantic: **Tórshavn, Nuuk, Mariehamn**

### The twelve gods of love — yours to place

The heart's twelve gods — the cradle goddesses (**Zhinü, Rati, Inanna, Hathor, Cavillaca, Xochiquetzal**) and the great six (**Aphrodite, Venus, Eros, Ishtar, Kama, Freyja**) — are deliberately **not placed yet**. The eighteen empty heart hexes wait for them, to be filled in by hand:

- Click an empty heart hexagon, type a god's name in the inspector, press **Apply** — the hexagon turns pink on the spot, because the name *is* the type
- Hand-placed gods survive **everything**: centre-mode switches, adding cities, adding rings, export/import, even a full reset
- **Check lattice** guides you: orange hexagons are ordinary hexes that don't touch a god yet; red dashed ones break symmetry or sit on a green spoke. Fill the heart symmetrically and the checker reads 0 / 0 / 0
- One symmetric solution the checker is happy with: the ring-2 seats 2, 6, 8, 12 and the ring-3 seats 2, 3, 6, 9, 11, 14, 17, 18 — mirrored pairs across the north–south axis, with Athens, Constantinople, Rome and Carthage each touching a god

## The coordinate-driven world (rings 5–8)

Outside the authored heart, the city is **placed by real geography** instead of by hand:

- One roster of **318 great cities** — the big ones, the livable ones, the walkable ones, the ancient ones and simply famous ones — each carrying its real latitude and longitude. The ancient and holy cities that once sat in the hand-made heart (**Aleppo, Diyarbakır, Jerusalem, Babylon, Mecca, Aksum**) are back on the roster and flow onto the outer rings by the same compass rule, settling near their kin
- **The capital audit**: every European capital (all 50, from Vatican City and San Marino to Moscow and Ankara) and every capital of a country with more than a million people (from Washington D.C. and Mexico City to Nouakchott, Libreville and Malabo) is on the map — plus the classic non-capitals: Salzburg, Basel, Lausanne, Lucerne, Lyon, Marseille, Naples, Turin, Bologna, Genoa, Palermo, Verona, Rotterdam, The Hague, Antwerp, Ghent, Bruges, Cambridge, Oxford, Dublin, Cork, Birmingham, Leeds, Manchester, Edinburgh, Aberdeen, Glasgow, Lviv, Odesa, Thessaloniki…
- **Mondiala sits at the centre of that roster**: wherever the roster's centre falls on Earth, that is where Mondiala "is", and the rings read like a compass around it — a city's bearing from the centre picks its hexagon, its real distance picks its ring (near = inner), and population breaks ties
- **Three switchable centre modes** (the panel shows the coordinates *and the country, with its flag*, wherever Mondiala ends up):
  - **Geographic** — the plain midpoint of all 318 cities: ≈ 42.63°N 24.42°E, in the upper Tundzha valley of **Bulgaria** — rose-valley meadows just north-east of Kalofer, under the central Stara Planina (🇧🇬)
  - **Population-weighted** — weighted by urban-area population (ancient cities at their ancient peaks): ≈ 41.92°N 68.21°E, in the **Turkistan steppe of Kazakhstan** — open grassland south-east of the Shardara reservoir, between the Syr Darya and the Kazakh–Uzbek borderlands (🇰🇿)
  - **Greatness-weighted** — size + livability + walkability: ≈ 45.72°N 28.22°E, in the **western Budjak of Moldova** — steppe and vineyards between the lower Prut and the Yalpuh lakes (🇲🇩)
- The three default spots were reverse-checked against real maps. If you add a city and move the centre off them, the panel honestly falls back to the country of the nearest roster city (e.g. "🇺🇿 Uzbekistan (nearest: Tashkent, 96 km)")
- **Add a city and the map re-flows**: type a name, latitude, longitude and population, and Mondiala's centre moves — every ring re-settles around the new middle. Removing an added city restores the exact previous map
- **The pool = cities beyond the horizon**: the 192 cities too far from the centre to fit before ring 8 ends — in geographic mode the megacities of the far side (Tokyo, Jakarta, Delhi, Shanghai, Mexico City, São Paulo) plus the world's younger capitals (Canberra, Wellington, Pyongyang, Ottawa, Brasília, Nairobi, Kigali, Nouakchott, Libreville, Malabo), Japan's Kyoto and Hiroshima, the Pacific and Gulf cities (Auckland, Brisbane, Honolulu, New Orleans, Quebec City) and ancient Tikal and Timbuktu. Press **+ Add ring** and 54 of them settle onto the new rim by the same compass rule

## The pink free-use districts

- **42 pink free-use districts** in total once the heart is filled — 12 in the heart (hand-placed, see above) and 30 in the outer lattice: 12 in ring 5, 12 in ring 7, 6 in ring 8 — all named after gods of love and sexuality
- **Three lattice rules**, enforced by the checker:
  1. **No god on the green** — the pink districts are never allowed on Metropol or the green spokes, which carry the metro main lines
  2. **Mirror symmetry** — the pink set mirrors across the north–south axis; the left half of the city matches the right
  3. **Every ordinary hexagon touches a god** — any hex that is not green (and not in the Nordic ring, which stands on its own) borders at least one pink free-use district
- Until the twelve heart gods are placed, exactly the eighteen empty heart hexes wait — the checker counts them for you
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
- **Headless test suite**: 203 checks verify the roster's integrity, the heart's authored contents, the three lattice rules, the hand-god fill-later flow (placement, auto-pinking, survival across switches, imports, resets, ring 9), the compass placements and pool of all three centre modes, the capital audit, add/remove and import/export round-trips, zoom and pan behaviour, and that `DATA.md` matches the live city

## Usage

Open `mondiala.html` in any browser — no build step, no dependencies. The map reads
its world data from `mondiala-data.js` in the same folder, so keep the two files together
(downloading the whole `city-designer` folder gets you everything).
Or just use the hosted copy: **<https://lyngvaldarnegard.github.io/Mondiala/>**.

- Drag to pan, scroll to zoom — the zoom steps are smooth and follow the wheel; a hard flick still moves only one gentle step. Dragging and zooming never highlight the page text; only form fields and the JSON box stay selectable
- **Zooming out can never lose the map**: it stops exactly at the full-city view, with the city's edges touching the screen — the default view. Panning away and zooming out brings you right back to it
- Adding a ring re-fits the view the same way, so the new rim's edges touch the screen
- Click a hexagon to inspect and edit it
- Paint mode applies an armed type to every hex you click
- "Check lattice" flags violations of the three lattice rules on the map — and counts the heart hexes still waiting for their gods

## Data

The worldbuilding data lives in its own file, **[`mondiala-data.js`](mondiala-data.js)**: the
authored heart (rings 0–4), the 318-city world roster with real coordinates, each city's
country, the info cards, the real-city facts, the reserved god lattice and each god's homeland
coordinates. Edit it directly on GitHub — the map reads it as-is, no regeneration needed.
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
- **Countries** — the roster carries each city's country; the world-placement panel uses it to name the country at Mondiala's coordinates, and the three default centre spots are stored with their verified countries (Bulgaria, Kazakhstan, Moldova).
- **God homelands** — each love god's origin coordinates decide which reserved pink hex they face; the outer gods re-settle by compass whenever Mondiala's centre moves, and the twelve heart gods wait for their hand-placed seats.
