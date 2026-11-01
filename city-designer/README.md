# Mondiala — City Designer

Interactive hex-grid city designer for **Mondiala**, the new world capital.
Built from the "Hexagons of Mondiala" worldbuilding database (Notion).

## Features

- Hexagonal ring grid following the `L(n) = n × 6` circle system, with **Metropol** at the centre (1 km hex sides, 100 m boulevards)
- **Flat-top hexes**: the green radial spoke runs straight north–south through Metropol
- **Orientation numbers**: hexagon 1 is the topmost hex of every ring; numbers run clockwise, so the numbers help you read the compass
- Rings 0–8: 217 hexagons, 210 named — ring 3's hexagon 18 and ring 4's six remaining hexes stay open for the future

## The authored heart (rings 0–4)

The heart is fixed by hand in every centre mode, exactly as designed in the Notion database:

- **Metropol** — the capital hexagon at the centre (density 4355.39 people/km²)
- **Ring 1 — the inspiration cities**: the six cities Mondiala learns from — **Paris, Barcelona, Moscow, Singapore, Vancouver and New York** — each on the spoke its homeland bears to, carrying its real-world density (Paris 19 430, Barcelona 16 630, New York 11 313.8, Singapore 8 188.27, Vancouver 5 749.9, Moscow 5 080 people/km²)
- **Ring 2 — the cradle civilisations**: the six civilisations that invented the city — Ancient China, the Indus Valley, Mesopotamia, Ancient Egypt, the Ancient Andes and Mesoamerica — hold the six green spokes, and between each pair sits a goddess of love from that cradle: **Zhinü, Rati, Inanna, Hathor, Cavillaca and Xochiquetzal**
- **Ring 3 — the ancient cities and the great love gods**: eleven of the world's oldest and holiest cities in authored order — **Diyarbakır, Aleppo, Athens, Jerusalem, Babylon, Carthago, Rome, Aksum, Byzantium, Mecca and Tenochtitlan** — while the six great gods of love hold the green spokes between them: **Freyja** at the north point, **Aphrodite** beside Athens, **Ishtar** beside Babylon, **Venus** beside Rome, **Eros** beside Byzantium and **Kama**. Hexagon 18 stays open, echoing the database's one empty hexagon
- **Ring 4 — Norden**: the Nordic world — 18 cities with the five Nordic capitals + Göteborg on the green spokes (Stockholm, København, Helsinki, Oslo, Göteborg, Reykjavík) and the smaller Nordic cities sorted by population between them (Vilnius, Riga, Tallinn, Tampere | Tammerfors, Malmö, Aarhus, Kaunas, Turku | Åbo, Bergen, Trondheim, Vyborg, Billund)

## The coordinate-driven world (rings 5–8)

Outside the authored heart, the city is **placed by real geography** instead of by hand:

- One roster of **314 great cities** — the big ones, the livable ones, the walkable ones, the ancient ones and simply famous ones — each carrying its real latitude and longitude, including the twelve newest megacities from the database: **Jinan, Dalian, Qingdao, Belo Horizonte, Harbin, Pune, Surabaya, Surat, Shenyang, Chongqing, Foshan and Dongguan**
- **The capital audit**: every European capital (all 50, from Vatican City and San Marino to Moscow and Ankara) and every capital of a country with more than a million people (from Washington D.C. and Mexico City to Nouakchott, Libreville and Malabo) is on the map — plus the classic non-capitals: Salzburg, Basel, Lausanne, Lucerne, Lyon, Marseille, Naples, Turin, Bologna, Genoa, Palermo, Verona, Rotterdam, The Hague, Antwerp, Ghent, Bruges, Cambridge, Oxford, Dublin, Cork, Birmingham, Leeds, Manchester, Edinburgh, Aberdeen, Glasgow, Lviv, Odesa, Thessaloniki…
- **Mondiala sits at the centre of that roster**: wherever the roster's centre falls on Earth, that is where Mondiala "is", and the rings read like a compass around it — a city's bearing from the centre picks its hexagon, its real distance picks its ring (near = inner), and population breaks ties
- The classical and famous cities flow by compass onto the outer rings — Alexandria, Jericho and Constantinople settle near the ancient world of the heart; the holy cities (Medina, Gaza, Damascus) cluster on their bearing; the Silk Road runs out through Isfahan and Samarkand; the small European capitals and the Swiss cantonal cities form their own rings; the modern giants fill the far rim
- **Three switchable centre modes** (the panel shows the coordinates *and the country, with its flag*, wherever Mondiala ends up):
  - **Geographic** — the plain midpoint of all 314 cities: ≈ 42.99°N 23.44°E, in the western Stara Planina of **Bulgaria** — the Balkan ridge above the Iskar Gorge, the pass road from Sofia to the Danube plain (🇧🇬)
  - **Population-weighted** — weighted by urban-area population (ancient cities at their ancient peaks): ≈ 42.12°N 67.73°E, in the **Shardara steppe of Kazakhstan** — between the Karatau mountains and the Syr Darya reservoir, Turkistan region (🇰🇿)
  - **Greatness-weighted** — size + livability + walkability: ≈ 46.11°N 27.46°E, in the **Tigheci hills of Moldova** — oak woodland and steppe between the Prut and the Ialpug, southern Moldova (🇲🇩)
- The three default spots were reverse-checked against real maps. If you add a city and move the centre off them, the panel honestly falls back to the country of the nearest roster city (e.g. "🇺🇿 Uzbekistan (nearest: Tashkent, 96 km)")
- **Add a city and the map re-flows**: type a name, latitude, longitude and population, and Mondiala's centre moves — every ring re-settles around the new middle. Removing an added city restores the exact previous map
- **The pool = cities beyond the horizon**: the 188 cities too far from the centre to fit before ring 8 ends — in geographic mode the megacities of the far side (Tokyo, Jakarta, Delhi, Shanghai, Mexico City, São Paulo) plus the world's younger capitals (Canberra, Wellington, Pyongyang, Ottawa, Brasília, Nairobi, Kigali, Nouakchott, Libreville, Malabo), Japan's Kyoto and Hiroshima, the Pacific and Gulf cities (Auckland, Brisbane, Honolulu, New Orleans, Quebec City) and ancient Tikal and Timbuktu. Press **+ Add ring** and 54 of them settle onto the new rim by the same compass rule

## The pink free-use districts

- **42 pink free-use districts** in total — 6 in ring 2, 6 in ring 3, 12 in ring 5, 12 in ring 7, 6 in ring 8 — all named after gods of love and sexuality and all kept off the green spokes, which are reserved for the metro main lines
- **The heart gods are authored**: the cradle six (Zhinü, Rati, Inanna, Hathor, Cavillaca, Xochiquetzal) sit in ring 2 beside their civilisations, and the great six (Freyja, Aphrodite, Ishtar, Venus, Eros, Kama) hold ring 3's spokes — they never move
- The outer lattice (rings 5, 7, 8) is a **proven minimum**: with the twelve heart hexes fixed, no arrangement covers every non-green hexagon with fewer districts
- **Mirror-symmetric about the north–south axis**: the left half of the city mirrors the right half
- **The lattice rule**: every hexagon that is not green borders at least one pink free-use district — the green hexes (Metropol and the six metro spokes) are the only exemption — and no two districts touch each other
- The district hexes are **reserved**: wherever the city flow settles, the gods keep the lattice — the slot lattice itself never moves
- **The outer gods sit by compass**: each god takes the reserved pink hex that faces their homeland, by bearing from Mondiala's centre — the same rule as the cities. Eastern gods (Nanaya, Anahita, Parvati, Yue Lao, Astghik, Aizen-Myōō) sit with the eastern cities; African gods (Oshun, Bastet, Bes, Mami Wata, Erzulie Freda) to the south; the Norse and Baltic ones (Sjöfn, Freyr, Milda, Zhiva) to the north; the Mediterranean love gods (Cupid, Adonis, Astarte, Qetesh, Turan, Prende, Lada, Cybele, Dionysus, Himeros, Peitho, Anteros, Pothos) with the classical world; and Áine and Tlazolteotl to the west. Each god's homeland coordinates are part of the data
- **The gods re-shuffle with the centre**: switch centre mode or add a city, and the gods re-settle onto the same lattice to face their homelands from the new spot — they never give up their reserved slots, and the heart twelve keep their authored hexes
- Five deities (Shaushka, Attis, Min, Lofn, Xochipilli) are dormant for now — their info cards remain, waiting for a future ring

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
- **Headless test suite**: 2 481 checks verify the heart's authored contents, the lattice rules, the compass placements and pool of all three centre modes, the capital audit, add/remove and import/export round-trips, zoom and pan behaviour, and that `DATA.md` matches the live city

## Usage

Open `mondiala.html` in any browser — no build step, no dependencies. The map reads
its world data from `mondiala-data.js` in the same folder, so keep the two files together
(downloading the whole `city-designer` folder gets you everything).
Or just use the hosted copy: **<https://lyngvaldarnegard.github.io/Mondiala/>** — kept up to date automatically.

- Drag to pan, scroll to zoom — the zoom steps are smooth and follow the wheel; a hard flick still moves only one gentle step. Dragging and zooming never highlight the page text; only form fields and the JSON box stay selectable
- **Zooming out can never lose the map**: it stops exactly at the full-city view, with the city's edges touching the screen — the default view. Panning away and zooming out brings you right back to it
- Adding a ring (or resetting) re-fits the view the same way, so the new rim's edges touch the screen
- Click a hexagon to inspect and edit it
- Paint mode applies an armed type to every hex you click
- "Check lattice" flags violations of the free-use district lattice on the map

## Data

The worldbuilding data lives in its own file, **[`mondiala-data.js`](mondiala-data.js)**: the
authored heart (rings 0–4), the 314-city world roster with real coordinates, each city's
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
- **Countries** — the roster carries each city's country; the world-placement panel uses it to name the country at Mondiala's coordinates, and the three default centre spots are stored with their verified countries (Bulgaria, Kazakhstan, Moldova).
- **God homelands** — each love god's origin coordinates decide which reserved pink hex they face; the outer gods re-settle by compass whenever Mondiala's centre moves.
