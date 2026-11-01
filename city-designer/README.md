# Mondiala — City Designer

Interactive hex-grid map of **Mondiala**, the new world capital — a read-only
viewer over the data files; the city itself is authored in the data.
Built from the "Hexagons of Mondiala" worldbuilding database (Notion).

## Features

- Hexagonal ring grid following the `L(n) = n × 6` circle system, with **Metropol** at the centre (1 km hex sides, 100 m boulevards)
- **Two orientations, one grid**: flat-side-up by default (the green radial spoke runs straight north–south through Metropol) — the **Orientation** button turns the whole grid 30° to pointy-side-up, the compass re-flows live
- **Orientation numbers**: hexagon 1 is the topmost hex of every ring; numbers run clockwise, so the numbers help you read the compass
- Rings 0–8: 217 hexagons, every one named — the heart's ring 4 carries the six favourite gods of love on its middles (v1.8); the six cradle goddesses wait unplaced, to be seated by editing the data

## The authored heart (rings 0–3) and the direction-seated ring 4

Rings 0–3 are fixed by hand in every centre mode; ring 4 (v1.8) seats by direction from the active centre:

- **Metropol** — the capital hexagon at the centre (density 4355.39 people/km²)
- **Ring 1 — the cradle civilisations**: the six places where the city itself was invented, one on every spoke, in founding order — **China, the Indus Valley, Mesopotamia, Egypt, the Andes and Mesoamerica**
- **Ring 2 — the ancient cities**: each civilisation's first great city on the spoke behind it — **Chang'an** (China), **Uruk** (Mesopotamia), **Memphis** (Egypt), **Cusco** (the Andes) and **Tenochtitlan** (Mesoamerica) — the freed Indus spoke seat carrying **Athens**, and the mids grouped by culture: **Constantinople** and **Athens** the Greek pair sheltering **Tyre**, which faces its Mesopotamian neighbours across Uruk; **Ur** at Uruk's side and **Babylon** bridging to Egypt; **Rome** and **Carthage**, Phoenicia's legacy living on
- **Ring 3 — Norden**: the Nordic world, 18 hexes with every Nordic country and autonomous land represented — the five capitals plus Göteborg on the green spokes (**Stockholm, København, Helsinki, Oslo, Göteborg**), and between them the Nordic cities by size: **Vilnius, Riga, Tallinn, Tampere | Tammerfors, Malmö, Aarhus, Kaunas, Bergen, Trondheim**, the small capitals of the North Atlantic **Mariehamn, Reykjavík, Tórshavn, Nuuk** — the Faroe Islands, Greenland and Åland all aboard, with Göteborg and Kaunas keeping their priority seats
- **Ring 4 — the inspiration cities, seated by direction (v1.8)**: the six cities Mondiala learns from hold the green spokes — *which* spoke decided by each one's true bearing from Mondiala's centre (in geo mode: **Vancouver** north, **Moscow** east-north-east, **Singapore** south-east, **Barcelona** south, **Paris** west-south-west, **New York** west-north-west) — the six favourite gods of love take the middles of the six triads, each facing her homeland by the compass rule, and the twelve other inspiration cities keep their ring-4 seats, exact hex by bearing: **London, Madrid; Berlin, Vienna; Tokyo, Hong Kong; Cape Town, Sydney; Amsterdam, Mexico City; Rio de Janeiro, Lisbon** — Prague, Seoul, Dubai, San Francisco, Toronto and Chicago stepped off the heart but stayed aboard the roster: Prague rides the map again at ring 6, the far five ride the visible pool (ring-4 densities are the density campaign's core figures — the city centre plus its immediate surroundings; sources logged in the campaign log)

### The favourites of the heart — six seated by rule, six waiting

All the pink tiles are equal (v1.8): one allocation list, the favourites at the top. The six favourites (**Eros, Aphrodite, Venus, Freyja, Cupid, Kama**) claim the ring-4 middles, each seated facing her homeland by the compass rule; **Milda** — not a favourite — rejoins the god flow and rides the lattice again from ring 7 (Ishtar keeps her seat). The six cradle goddesses (**Zhinü, Rati, Inanna, Hathor, Cavillaca, Xochiquetzal**) are deliberately **not placed yet**. The browser map is read-only — to seat a god, name their hexagon in the data (`mondiala-gods.js`):

- Put a god's name on a hexagon in the data — the hexagon turns pink on the spot, because the name *is* the type (the city it carried is kept in the data for later)
- Gods in the data survive **everything**: centre-mode switches, roster changes, ring additions — there is no reset to fear
- **Check lattice** guides you: orange hexagons are ordinary hexes that don't touch a god yet; red dashed ones break symmetry or sit on a green spoke. Fill the heart symmetrically and the checker reads zero on every count
- One symmetric home for the cradle six: the ring-2 mid pairs 2/12, 4/10 and 6/8 — three mirrored pairs, six seats (the ring-4 middles are taken by the favourites)

## The coordinate-driven world (rings 5–8)

Outside the authored heart, the city is **placed by real geography** instead of by hand:

- One roster of **270 great cities** — the big ones, the livable ones, the walkable ones, the ancient ones and simply famous ones — each carrying its real latitude and longitude. The ancient and holy cities that once sat in the hand-made heart (**Aleppo, Diyarbakır, Jerusalem, Babylon, Mecca**) are back on the roster and flow onto the outer rings by the same compass rule, settling near their kin
- **The capital audit**: every European capital but his two v1.7 exceptions (Vatican City and San Marino stepped off) and every capital of a country with more than a million people (from Washington D.C. and Mexico City to Nouakchott and Libreville) is on the map — plus the classic non-capitals: Salzburg, Basel, Lausanne, Lucerne, Lyon, Marseille, Naples, Turin, Bologna, Genoa, Palermo, Verona, Rotterdam, The Hague, Antwerp, Ghent, Bruges, Cambridge, Oxford, Dublin, Cork, Birmingham, Leeds, Manchester, Edinburgh, Aberdeen, Glasgow, Lviv, Odesa, Thessaloniki…
- **Mondiala sits at the centre of that roster**: wherever the roster's centre falls on Earth, that is where Mondiala "is", and the rings read like a compass around it. The compass decides (v1.8): a city's true bearing picks its angle — green spokes included, they seat cities like any tile — its real distance orders its direction's chain (near = inner), population breaks ties, and crowded directions flow continuously into the neighbouring free tiles — so only the outmost ring ever holds empty city hexes, and whole continents ride one band (Africa sits south and west, never on the far side of its bearing)
- **Three switchable centre modes** (the panel shows the coordinates *and the country, with its flag*, wherever Mondiala ends up):
  - **Geographic** — the plain midpoint of every tiled city, heart included: ≈ 47.21°N 17.24°E, in the **Kemenesalja foothills near Celldömölk, western Hungary** (🇭🇺)
  - **Population-weighted** — weighted by urban-area population (ancient cities at their ancient peaks): ≈ 50.29°N 25.57°E, in the **Volhynian uplands near Mizoch, north-western Ukraine** (🇺🇦)
  - **Greatness-weighted** — size + livability + walkability: ≈ 47.04°N 18.50°E, in the **Sárvíz valley south of Székesfehérvár, Hungary** (🇭🇺)
- The three default spots were reverse-checked against real maps. If you add a city and move the centre off them, the panel honestly falls back to the country of the nearest roster city (e.g. "🇺🇿 Uzbekistan (nearest: Tashkent, 96 km)")
- **Add a city and the map re-flows**: add a name, coordinates and population to the roster data, and Mondiala's centre moves — every ring re-settles around the new middle. Since v1.7 the centre iterates over the seated set, so removing a city re-flows the map — the old exact-restore law is retired
- **The pool = cities beyond the rim**: the 144 cities too far from the centre to fit before ring 8 ends — in geographic mode the megacities of the far side (Jakarta, Delhi, Shanghai, Guangzhou, Mumbai, São Paulo) plus the world's younger capitals (Pyongyang, Ottawa, Brasília, Nairobi, Kigali, Nouakchott, Libreville), Japan's Kyoto and Hiroshima and the Pacific and Gulf cities (Auckland, Brisbane, Honolulu, New Orleans). Press **+ Next ring** and the city grows ring by ring: ring 9 takes 42 pool cities and 12 pink districts (pool 144 → 102), ring 10 takes 42 more with 18 pink (→ 60), ring 11 takes 54 more with 12 pink (→ 6) — and then the map is infinite: ring 12 opens, seats the last six and the pool runs dry, every city tiled; **− Remove ring** takes it back, nothing is saved

## The pink free-use districts

- **36 pink free-use districts ship in the fresh city** — the six favourites on ring 4's middles and 30 in the outer lattice: 12 in ring 6, 12 in ring 7, 6 in ring 8 — and the growth rings bring 60 more: 12 on ring 9, 18 on ring 10, 12 on ring 11, 18 on ring 12 (96 at the frontier) — the god-named ones after gods of love and sexuality, with concepts of eros riding the mixed rings alongside them, and the frontier's pink districts waiting as free-use parks, their gods not yet arrived; the six cradle goddesses still wait unplaced
- **Four lattice rules**, enforced by the checker:
  1. **No god on the green** — the pink districts are never allowed on Metropol or the green spokes, which carry the metro main lines
  2. **Symmetry** — the pink set is six-fold symmetric around the green spokes (the pattern repeats around every spoke) and mirror-symmetric inside each of the six sections between them
  3. **Every ordinary hexagon of the outer city touches a god** — any hex of rings 5 and beyond that is not green borders at least one pink free-use district; the authored heart stands on its own
  4. **No two pinks ever touch** — a pink district never borders another; the ring-6 twelve sit at each section's 3rd and 5th hex, the ring-9 twelve at the 3rd and 8th, the ring-10 eighteen at the 2nd, 6th and 10th, and the ring-11 twelve at the 4th and 9th, and the ring-12 eighteen at the 2nd, 6th and 10th, so the lattice steps out and the pink tiles never meet
- The cradle goddesses wait unplaced; the heart's goddess star ships with the checker reading zero on every count — seating the cradle six is up to you
- No god is hand-seated any more: **all the pink tiles are equal — one allocation list, the favourites at the top** — the six favourites (Eros, Aphrodite, Venus, Freyja, Cupid, Kama) claim the ring-4 middles, Parvati and Lakshmi cascade to ring 6, Pothos fills the seat Cupid left, Milda rides the lattice again from ring 7, and Aizen-Myōō slides to ring 8; the rest sit **by compass**: each takes the reserved pink hex that faces their homeland, by bearing from Mondiala's centre — the same rule as the cities. Eastern gods (Nanaya, Anahita, Ishtar, Parvati, Yue Lao, Astghik, Aizen-Myōō) sit with the eastern cities; African gods (Oshun, Bastet, Bes, Mami Wata, Erzulie Freda) to the south; the Norse and Baltic ones (Sjöfn, Freyr, Zhiva) to the north — Milda rides the ring-7 lattice again; the Mediterranean love gods (Cupid, Adonis, Astarte, Qetesh, Turan, Prende, Lada, Cybele, Dionysus, Himeros, Peitho, Anteros, Pothos) with the classical world; and Áine and Tlazolteotl to the west. Each god's homeland coordinates are part of the data
- **The gods re-shuffle with the centre**: switch centre mode, add a city, or flip the orientation, and the gods re-settle onto the same reserved lattice to face their homelands from the new spot — and the ring-4 favourites move with the compass, not with the centre
- The five deities that waited dormant since the early rings (**Shaushka, Attis, Min, Lofn, Xochipilli**) woke with v1.6 and ride ring 9, the innermost horizon ring

## The tools

- **Ring view**: alternating red and blue rings, with Metropol and the six radial spoke hexes green — toggle with "View"
- **Type view**: see hexes as District, Free-use district, Water, Plaza, Civic, Industrial (free-use hexes are pink, Kondomeriet-style)
- **Click any hexagon** for an info card: the real-world city it copies, its flag, architectural style — plus the real city's population, livability score and (where published) Walk Score
- Every hexagon shows its flag and name on the map; tooltips show the data too
- Postal-code labels in the `Circle · Name · Hexagon number` system
- **Read-only in the browser** — every hex shows exactly what the data says; naming a hex for a god of love in the data makes it pink automatically
- **World placement panel**: switch centre mode, see where Mondiala sits (coordinates, country and flag)
- **Orientation toggle**: flat-side-up ↔ pointy-side-up — the grid turns 30° rigidly and re-seats by the new compass; the round trip is identity
- **Lattice checker** enforcing the four lattice rules — green spokes stay sacred, symmetry stays whole, no ordinary hex gets left without a god, no two pinks ever touch
- **Headless test suite**: 737 checks verify the roster's integrity, the authored heart and the direction-seated ring 4, the four lattice rules (in both orientations), the read-only map, the ring viewer, the direction-first seating bounds (bearing-error averages under 50° in every centre mode, no African city in the eastern sector, no mid-map empty tiles), pools and centres of all three centre modes, the capital audit, zoom and pan behaviour, the orientation toggle round trip, and that `DATA.md` matches the live city — see [`test/`](test/)

## Usage

Open `mondiala.html` in any browser — no build step, no dependencies. The map reads
its world data from the five `mondiala-*.js` files in the same folder, so keep the whole
`city-designer` folder together (downloading the folder gets you everything).
Or just use the hosted copy: **<https://lyngvaldarnegard.github.io/Mondiala/>**.

- Drag to pan, scroll to zoom — the zoom steps are smooth and follow the wheel; a hard flick still moves only one gentle step. Dragging and zooming never highlight the page text; only the controls stay selectable
- **Zooming out can never lose the map**: it stops exactly at the full-city view, with the city's edges touching the screen — the default view. Panning away and zooming out brings you right back to it
- **+ Next ring / − Remove ring** are view-only: grow the city ring by ring — the map is infinite, so the rings keep opening until the pool runs dry (ring 12 in the shipped data), or unwind it all the way down to bare Metropol and grow it back — the view re-fits so the new rim's edges touch the screen; nothing is saved, a reload resets to the shipped city
- Click a hexagon to inspect it
- The **Orientation** button flips the grid between flat-side-up and pointy-side-up — everything re-seats by the new compass, nothing is saved
- "Check lattice" flags violations of the four lattice rules on the map

## Tests — `test/`

The headless suite that keeps every claim in this README honest lives in
**[`test/`](test/)** and is part of the repository — so it survives everything and anyone
can re-run it. It loads the *shipped* files (`mondiala.html` + its five themed data
files) the same way a browser would, rebuilds the city, and runs **737 checks**: roster integrity, the authored heart and the direction-seated ring 4, the lattice rules and validator (both orientations), the read-only map, the ring viewer, the direction-first bounds, all three centre modes' placements, pools and centres, the capital audit, pan/zoom, the orientation toggle, and a full `DATA.md` consistency pass.

Run it from the `city-designer` folder with `sh test/run.sh` — needs Node ≥ 18 and nothing
else. `test/split_push.py` rebuilds `mondiala.html` and the five `mondiala-*.js` data
files from the source canvas; `test/gen_data_md.js` regenerates `DATA.md` from the live city.

## Data

The worldbuilding data lives in **five themed files**, so a change means editing one
small file instead of a monolith:

- **[`mondiala-heart.js`](mondiala-heart.js)** — the authored heart, rings 0–4: Metropol, the cradle
  civilisations, the ancient cities, Norden and the inspiration cities
- **[`mondiala-cities.js`](mondiala-cities.js)** — the 270-city world roster with real
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
  to that index and marked "≈".
- **Walk Score** — published Walk Score city rankings, shown where available (mostly US cities).
- **Coordinates** — city-centre latitude/longitude in decimal degrees.
- **Countries** — the roster carries each city's country; the world-placement panel uses it to name the country at Mondiala's coordinates, and the three default centre spots are stored with their verified countries (Hungary, Ukraine, Hungary).
- **God homelands** — each love god's origin coordinates decide which reserved pink hex they face; the gods re-settle by compass whenever Mondiala's centre moves or the grid turns, and the cradle goddesses wait to be seated in the data.
