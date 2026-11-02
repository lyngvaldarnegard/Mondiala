# Mondiala — version history

Every push to git is a permanent snapshot: nothing is ever overwritten or lost, and any
version below can be browsed in full or restored. This file is the human-readable index of
the shipped states. [GitHub Releases](https://github.com/lyngvaldarnegard/Mondiala/releases)
are the named milestones on top (with notes and a downloadable zip of the whole state) —
the commits themselves are the real archive.

| Version | Commit | State |
|---|---|---|
| **v3.2 — the true two-rule engine, compass off** | `main` (this push) | bookmark branch `archive/v3.2-whole-ring-compass-off` |\n| **v3.1 — the hand-picked world map** | shipped | bookmark branch `archive/v3.1-the-handpicked-world-map` |
| **v3.0 — the map loads, instantly, in colour, from formula-generated tables** | superseded by v3.1 | bookmark branch `archive/v3.0-the-map-loads` |
| v2.0–v2.2 | `40e27de` → `8406a89` | the city-to-city rework, the lat/lon sort, the perf fix |
| **v1.8 — the heart learns direction** | superseded by v3.0 | current · direction-first seating, the favourites hold the ring-4 middles, the orientation toggle |
| **v1.7 — the city finds the centre** | `a69254cb` (+ the density campaign's B1 `7e04820`) | bookmark branch `archive/v1.7-the-city-finds-the-centre` |
| **v1.6 — the city reaches the horizon** | `8d26c34` | bookmark branch `archive/v1.6-the-city-reaches-the-horizon` |
| **v1.5 — the lattice steps out** | `e059141` | bookmark branch `archive/v1.5-the-lattice-steps-out` |
| **v1.4.1 — six-fold pink lattice** | `c70e1b9` | bookmark branch `archive/v1.4.1-six-fold-pink-lattice` |
| **v1.4 — the heart goddesses** | `2e878bf` | bookmark branch `archive/v1.4-the-heart-goddesses` |
| **v1.3.2 — down to bare Metropol** | `08d7440` | bookmark branch `archive/v1.3.2-down-to-bare-metropol` |
| **v1.3.1 — the ring viewer** | `f945990` | bookmark branch `archive/v1.3.1-ring-viewer` |
| **v1.3 — the map goes read-only** | `af81811` | bookmark branch `archive/v1.3-read-only-map` |
| **v1.2 — the civilisation heart** | `a42e888` | bookmark branch `archive/v1.2-the-civilisation-heart` |
| **v1.1.2 — the data splits into five themed files** | `0484b199` | bookmark branch `archive/v1.1.2-split-data` |
| **v1.1.1 — the test toolchain joins the repo** | `6650214` | bookmark branch `archive/v1.1.1-test-toolchain` |
| **v1.1 — the corrected heart** | `41645f0` | bookmark branch `archive/v1.1-the-corrected-heart` |
| **v1.0 — the ancient heart** | `d4c84c1` | superseded by v1.1 |

## v3.0 — the map loads, instantly, in colour, from formula-generated tables

The five mission items of the v3.0 print, shipped together:

- **The map loads.** Root cause of the permanent blank map (every real browser, desktop and phone, since v2.0): the Init block's first line `document.getElementById("centerMode").value = centerMode` referenced the centre-mode dropdown that v2.0 deleted — real browsers threw `TypeError: Cannot set properties of null` and the script died before `buildCity()` ever ran. The line is deleted. The headless stubs are hardened to real-browser semantics: `getElementById` returns `null` for any id absent from the shipped HTML (the old stubs auto-created it, which is how the suite stayed green for a whole major version while every real browser crashed), and the suite now asserts every id the app requests exists in the HTML. Verified: reintroducing the crash line now crashes the suite with the exact real-browser TypeError.
- **Instant load: formula-generated seating tables.** The placement formulas run once, offline, in the generator (`city-designer/test/gen_seating.js`, run via `sh city-designer/test/regen.sh`), and ship as `mondiala-seating.js` — one table per placement mode per orientation, generated to the full depth of the roster (ring 12, no dry frontier). The page only reads the tables: no expensive compute at load or at click, «+ Next ring» reveals precomputed rows and inner rings never re-flow. Roster edit = re-run the generator + commit the regenerated table. The suite drift-checks the committed table against the formulas every run, and asserts a full rebuild is instant (< 250 ms) and stable.
- **Continent view — the new default.** Every hexagon coloured by its city's continent in the Olympic ring colours: Europe blue, Asia yellow, Africa black (kept readable on the dark background; labels get halos), Americas red, Oceania green. Every named hex has a continent — the heart's civilisations included (China → Asia, Egypt → Africa, the Andes → the Americas), via the verified country→continent map (zero unmapped against the roster; heart civilisations fall back to the nearest roster city's continent). The pink free-use districts stay pink in every view; the ring view and the type view remain one click away.
- **Reverse fill — the third placement mode.** Sigurd's own design: the roster's farthest cities from Mondiala land on the far outer frontier ring (the one ring with empty tiles); the six directional extremes pin the outermost full ring's corners (Honolulu west, Melbourne south, Auckland's eastern extreme rides the frontier as the single farthest city) — corner assignment by eye-true direction from real lon/lat deltas, never great-circle bearing, which lies at extreme range (Honolulu reads due "north" from the centre); then the front fills ring by ring inward, greedily by real km, until it stops against the hand-authored heart. No re-sort — the inward chains are the point.
- **Variant A — the modes run themselves.** Both existing modes seat with a compass sense: a weak directional term (the city's eye-true direction vs the hex's on-screen direction, `COMPASS_KM = 1500` the tuning knob) rides along in the greedy score; the v2.1/v2.2 global lat/lon re-sort is deleted. Measured (shipped view, neighbours): median grid-neighbour distance **4,847 → 1,330 km** (v2.0 reference: 1,190) with corr(lat, y) −0.54 (v2.2: −0.83, v2.0: −0.08) — Europe at the top, Africa at the bottom, Asia east, the Americas west, and real neighbours sitting together again. Variant B (greedy + local-swap after-step) and the v2.2 baseline are rendered side by side in [`comparison/v3.0-engine-comparison.md`](comparison/v3.0-engine-comparison.md) for the eye to compare; the loser does not ship.
- Suite: **676 checks, all green** (new sections: real-browser DOM semantics, the continent view, the seating tables incl. drift check, the reverse fill)

## v2.2 — perf fix (2.7 s → 0.8 s load)

Neighbours candidate pool capped 12→6, incremental scoring, swap refinement sampled and bounded at 3 sweeps; the `cityN` swap bug fixed; lat/lon axes kept. Suite 618 green.

## v2.1 — global lat/lon sort pass in both placement modes

North up by construction (corr(lat, y) −0.58) + bounded local swap refinement — at the cost of grid-neighbour adjacency (median 1,202 → 4,925 km). Suite 618 green.

## v3.1 — the hand-picked world map (the third mode)

The third dropdown option is now **Hand-picked — the authored world map**, replacing the reverse fill (Sigurd's ruling: "you can ship it and replace it with the third mode in the toggle. I'll just make replacements afterwards"). Like the heart, it is authored data, not a formula: `mondiala-handpicked.js`, a hand-editable table (city → ring·hex, both orientations). Roster edits do not reflow it — a new city waits in the pool; Sigurd edits the file to make replacements.

- **How it was drafted:** from the equal-rank whole-ring engine output (median 1,168 km — the best adjacency of all engines tried), then hand-corrected per Sigurd's criteria: Melbourne moved to the outer south-east edge; Auckland — the roster's farthest city — to the free south-east seat of the far outer frontier ring 12 (she waits in the pool at the shipped view, revealing on «+ Next ring»); 26 bounded direction fixes so no city sits more than ~100° off its real bearing, every swap improving both cities.
- **The result (measured, shipped view):** Europe north-west, Asia east, Africa south, the Americas west, **Oceania south-east — east of Africa** (Sigurd's ruling: South Africa is west of Australia); median grid-neighbour 1,386 km; corr(lat, y) +0.49, corr(lon, x) +0.75; the Guangzhou cluster and The Hague–Rotterdam sit adjacent; Honolulu west, Valparaíso south-west on the outer edge.
- The suite asserts the wedges, the periphery, the full rings and the lattice on this mode every run (684 checks).
- The reverse-fill engine is deleted (in git history); the two formula modes are unchanged.

## v3.2 — the true two-rule whole-ring engine, compass OFF (the eye ruled: WR0)

The neighbours mode now runs Sigurd's actual design, restored: each ring is decided **all at once, not slot by slot** — two rules, exactly as he stated them: (1) HARD — every old-ring city must border at least one of its 6 closest of the cities remaining for the new ring; (2) SUM SCORE — the summed 1/rank over old-ring-to-new-ring adjacencies (rank = real-km rank among the remaining candidates) is maximized, every combination of the ring considered at once (exact Hungarian assignment, verified 300/300 against brute force; a minimal-damage repair pass enforces the hard rule where the optimum leaves it broken). **No compass term** — his eye compared the whole-ring renders and ruled compass-off the correct one (WR0: median 1,204 km, the world reads purely through city-to-city km; the co-equal-rank variant put Europe beneath Africa and was rejected). The engine runs only in the generator; the page still loads instantly from the tables.

- Measured (shipped view, neighbours): median grid-neighbour km 1,330 → **1,204**; the heart's own ring-4 cities now anchor the first ordinary ring directly (the gods never count — no real place on Earth).
- Suite: **686 checks green** (hard-rule sampled assertions, exactness spot-check, all prior guarantees).

## v2.0 — two placement modes, city-to-city real km, no hex coordinates

The outer city is placed purely by real great-circle km between cities — hexes have no coordinates, and the old bearing/radius projection is deleted entirely. The centre-mode dropdown is deleted; the plain geographic midpoint is the only centre (each mode may adjust its own).

- **Neighbours (default)**: greedy 1/rank closest-city scoring; hard rule — every city on the previous ring borders at least one of its six closest remaining candidates.
- **Hexagonal**: the centre is placed so each 60° sector holds enough cities to fill all its ring hexes (no empty tiles outside the frontier ring); each ring's sectors filled with the closest remaining cities to the previous ring in that sector; surplus spills to later rings.
- Deleted: latlon / direction / distance / hybrid modes, the centre-mode dropdown, the repair pass, and all temporary hex coordinates.
- Suite: **618 checks, all green**

## v1.16 — TRUE MAP: lat/lon grid is the default placement

The outer city is now laid out as a real world map: each free outer hex is assigned a (lon, lat) position spanning the roster's own extent (x = longitude, y = latitude, north up), and every city takes the free hex nearest its real coordinates — so neighbours on the map are neighbours on Earth, and "north of" is literally up (verified: Taipei sits below Kyiv; corr(latitude, screen-y) = -0.61; zero empty tiles in rings 5–10). Hexagonal, Neighbours, Direction, Distance and Hybrid remain as alternative placement modes in the dropdown.

- Suite: **791 checks, all green** (new assertions pin: no empty tiles in full rings, north-up orientation, Taipei-south-of-Kyiv)

## v1.15 — allocation modes renamed: Hexagonal (Plan B, default) & Neighbours (Plan A)

The placement dropdown now reads:

- **Hexagonal (Plan B, default)**: every ordinary ring is split into 6 equal 60° sections aligned to the hexagon's slot gaps; each section is filled with the closest remaining cities (km from Mondiala) whose bearing falls in it, nearest-angle assignment within the section. Rings fill completely innermost-first. The centre is **balanced** by local search so the 6 bearing sectors hold roughly equal city counts (both north-aligned and slot-aligned grids) — so no section ever runs dry. Only the outermost ring may stay partial.
- **Neighbours (Plan A)**: first ring seeded one city per sector; later rings filled greedily, each slot maximizing the summed 1/rank score (old-ring city's closeness to bordered new-ring cities) under the hard rule that every old-ring city borders ≥1 of its 6 closest remaining candidates (fallback: best score if unsatisfiable).
- Direction only / Distance only / Hybrid remain for comparison. Centre modes (geo/pop/great) unchanged; only Hexagonal re-balances the centre.
- Audit (shipped view): Hexagonal bearing-error avg 22° / adjacency gap avg 846 km; Neighbours avg 89° / 3522 km — Hexagonal is far more geographically coherent.
- Suite: **787 checks, all green**

## v1.14 — proximity score counts only old-ring ↔ new-ring edges

The greedy pick in proximity mode now scores exactly what you specified: for every city in the **old ring** (c−1), sum `1/rank` over the **new-ring** (c) cities bordering it; the candidate's own score and same-ring neighbors no longer count. Measured effect on the shipped view: proximity 2-of-6 failures 105 → 237 (the rule is now stricter about what "good" means), score metric 199.5 → 105.5 on the old definition.

- Suite: **785 checks, all green**

## v1.13 — proximity mode is the default, first ordinary ring fills completely

- **Proximity mode is now the shipped default** (dropdown + `placeMode` default): the first ordinary ring (found, not hardcoded) is seeded one city per 60° direction sector — closest to Mondiala in each — and then **filled completely** before any later ring starts; rings 6+ are filled greedily slot by slot, each pick maximizing the summed 1/rank closest-city score
- DATA.md and the bearing/sector assertions document the direction mode explicitly; the mode section pins ring 5 = 30 seated, ring 6 = 36
- Suite: **785 checks, all green**

## v1.12 — placement-mode picker + hard proximity rule

The panel's World placement card gains a **placement mode** dropdown with four styles to compare live:

- **Hybrid (default)** — the v1.8 compass band, then a repair pass enforcing the hard rule: every outer city borders **at least 2 of its 6 closest** outer cities (great-circle km, coordinates only)
- **Direction only** — the original v1.8 compass band, no repair (for comparison)
- **Distance only** — rings filled purely by km from Mondiala, then the same hard rule
- **Proximity** — ring 5 seeded by 6 direction sectors (closest city per sector), every later ring filled greedily slot by slot, each pick maximizing the summed 1/rank closest-city score (bordering your closest = 1 pt, 2nd closest = 1/2 pt, ...)

Measured on the shipped view (264 outer cities, fail = fewer than 2 of 6 closest bordered): direction 181 fail · hybrid 106 fail · distance 189 fail · proximity 105 fail. Hybrid scores highest on the 1/rank metric (220 vs 170 direction).

- Suite: **783 checks, all green** (new section 10 exercises all four modes and asserts hybrid beats direction on the hard rule)

## v1.11 — proximity repair + 3-tier pink allocation

- **Proximity repair (v1.10 follow-up)**: after the compass seating, a bounded greedy pass swaps outer-city names so each city borders one of its 6 geographically closest outer cities (great-circle km from coordinates only — no region labels). Violations dropped 90 → 53 of 264; avg ring-adjacency gap 3639 → 2917 km. The compass band remains the backbone; the repair only removes the worst near/far interleavings.
- **3-tier pink allocation**: the allocation list is now favourites first, then the concepts of eros (no homeland), then all other gods — rings fill innermost-first, tier by tier (ring 4 the six favourites, rings 6–7 the 23 concepts, rings 8+ the remaining gods, overflow to ring 11)
- Suite: **777 checks, all green**

## v1.10 — the centre is fixed on Earth

Mondiala's spot no longer drifts when rings are added or removed:

- **Fixed centre**: `computeWorldPlan()` now computes the centre once per mode from the heart's real cities plus the FULL roster — never from the tiled subset — so `maxCircle` only changes which cities are shown, never where Mondiala sits (verified: identical centre at ring 0, 11 and 12)
- **All 8 remaining heart names gained coordinates** (Metropol, the six ring-1 civilisations, Uruk, Chang'an; China pinned at Nanjing 32.06, 118.8) — they pull the centre but stay off the roster; null facts fall back to the default 500k pop / 70 livability / 50 walk weights, so pop and great modes are unaffected in kind
- **New centre spots**: geo 48.32165, 22.45055 (Ukraine) · pop 44.86027, 64.13385 (Uzbekistan) · great 49.75246, 25.72213 (Ukraine)
- Suite: **777 checks, all green**

## v1.9 — the ancient ring re-seated by apex

Ring 2 is re-seated and ring 1's Egypt and Mesopotamia swap places:

- **Ring 1 swap**: Egypt rides hex 3 and Mesopotamia hex 4 (was Mesopotamia 3, Egypt 4)
- **Ring 2 sorted by apex**: hexes 1–9 carry the ancient cities newest-apex-first — Constantinople, Rome, Alexandria, Carthage, Athens, Babylon, Ur, Uruk, Jericho — and hexes 10–12 stay pinned: Cusco, Tenochtitlan, Chang'an. Alexandria takes Memphis's seat (Memphis and Tyre leave the roster entirely); Jericho — the Natufian hunter-gatherer city, c. 9000 BC — fills Tyre's old seat at hex 9 and keeps its coordinates, country, facts and info card as a heart city off the roster
- **Knock-on**: the world roster drops to 266, the visible pool to 140, and the three centre spots re-settle with Jericho and Alexandria pulling the heart's centre (geo 46.63031, 18.40994 — Hungary; pop 49.55750, 28.64657 — Ukraine; great 46.71222, 19.54379 — Hungary)
- Suite: **735 checks, all green**

## v1.8 — the heart learns direction

The compass takes over the seating — direction decides where every city and god sits, the favourites claim the heart's pink seats by rule, and the grid learns to turn:

- **Direction-first seating (the compass decides)**: a city's true bearing picks its angle — green spokes included, they seat cities like any tile — and its real distance orders its direction's chain (near = inner). Crowded directions flow continuously into the neighbouring free tiles, so no ring but the outmost ever runs empty; only the frontier (ring 12, 48 empty city hexes) may. The whole compass stays one continuous band — Africa rides the south and west now, no city on the far side of its bearing
- **Ring 4 seats by direction**: the six originals (Paris, Barcelona, Moscow, Singapore, Vancouver, New York) hold the green spokes — *which* spoke decided by each one's true bearing (in geo mode: Vancouver north, Moscow east-north-east, Singapore south-east, Barcelona south, Paris west-south-west, New York west-north-west) — and the twelve other inspiration cities keep their ring-4 seats, exact hex by bearing
- **All pink tiles are equal — one allocation list, the favourites at the top**: the six favourites (Eros, Aphrodite, Venus, Freyja, Cupid, Kama) claim the ring-4 middles, each facing her homeland by compass. Milda — not a favourite — rejoins the god flow: she rides the lattice again from ring 7, Pothos fills Cupid's ring-6 seat, Aizen-Myōō slides to ring 8, and Astghik still rides the cascade out to ring 9
- **The orientation toggle**: **Orientation: flat-side-up ↔ pointy-side-up** — the whole grid turns 30° as one rigid body and the compass re-flows live, every hex re-seating by the new north; the round trip is identity, and all four lattice laws hold in both orientations
- The density campaign's B1 core figures for the eight big ring-4 cities (Paris, London, Madrid, Barcelona, Berlin, Vienna, Moscow, Tokyo) ride in the unnumbered heart rows
- Suite: **737 checks, all green** — direction-first bounds (bearing error averages under 50° in every centre mode, no African city in the eastern sector), ring-4 pins, favourites pins, the cascade pins, empty-tile law, toggle round-trip and both-orientation lattice law

## v1.7 — the city finds the centre

The centre is no longer the roster's alone — the city finds its own centre, the roster thins by his forty, and the designed horizon dissolves:

- **The heart pulls**: every city tiled on the map — the ancient heart and Norden included — pulls Mondiala's centre by its real-life location, and the seating iterates until the centre settles. Tenochtitlan and all of Norden got real coordinates for this. New fresh centres: geo the Kemenesalja foothills near Celldömölk, Hungary · pop the Volhynian uplands near Mizoch, Ukraine · great the Sárvíz valley south of Székesfehérvár, Hungary
- **Forty deletions**: the 36 non-European cities under a million (Jerusalem exempted, his call), plus Vatican City and San Marino (his call) and Xi'an and Tunis (no modern duplicates of heart Chang'an and Carthage) — roster 310 → 270, every trace of their data removed
- **The map is infinite**: the pool no longer stops at the designed horizon — ring 11 leaves six riders, ring 12 opens to seat them, and the frontier lattice (the {2,6,10} pattern, eighteen pink) holds all four laws; the frontier's parks wait as free-use districts, no god arrived yet. The pool runs dry: every city is tiled
- Growth re-flows the whole outer seating now — the grow-back-restores-exact-city law is retired by his choice
- Suite: **700 checks, all green** (the forty-deletion audit alone is 201 checks)

## v1.6 — the city reaches the horizon

The designed horizon fills in, and the seating of the gods becomes pure rule:

- **Rings 9–11 get their pink lattice**: twelve districts on ring 9 (each section's 3rd and 8th hex), eighteen on ring 10 (the 2nd, 6th and 10th), twelve on ring 11 (the 4th and 9th) — 78 parks at the horizon, up from 36
- **No god is hand-seated any more**: the favourites rule seats the favoured eight (Eros, Aphrodite, Venus, Freyja, Cupid, Kama, Parvati, Lakshmi) close to the centre — Cupid, Parvati and Lakshmi claim ring 6, and the cascade moves Pothos to ring 8 and Astghik to ring 9
- **The dormant five wake**: Shaushka, Attis, Min, Lofn and Xochipilli take ring 9 seats, joined by Tu'er Shen, Laka, Diyan Masalanta, Lel, Lelia, Volupia and Astghik
- **Fourteen new deities**, each with homeland coordinates: Tu'er Shen, Laka, Diyan Masalanta, Lel, Lelia, Volupia, Suadela, Hedylogos, Lempo, Aengus, Wadd, Hymenaios, Aphroditus, Dali
- **Twenty-two concepts of eros ride the horizon** (from the Hexagons of Mondiala database): Anal, Vagina, Penis, Oral, Tantra, Chastity, Romance, Intimacy, Bondage, Dominance, Submission, Orgy, Promiscuity, Polyamory, Masturbation, Orgasm, Edging, Libido, Erotica, Nude, Voyeurism, Hedonism — deities by compass, concepts in authored order
- **84 names in the full set**: six heart goddesses, 72 lattice seats and six waiting cradle goddesses
- Suite: **513 checks, all green**

## v1.5 — the lattice steps out

The outer pink lattice moves out one ring, the ancient heart regroups by culture, and the six cities kept off the map ride again:

- **The twelve outer pink slots move from ring 5 to ring 6** — seated at each section's 3rd and 5th hex, six-fold symmetric and mirror-symmetric inside each of the six sections, so no two pink districts ever touch
- **Ring 2 regroups by culture**: Ur rides at Uruk's side, Tyre sits flanked by the Greek pair and faces its Mesopotamian neighbours across Uruk, Athens holds the freed Indus spoke seat — Mohenjo-daro stepped off the heart and onto the roster (kept in the data, facts and all)
- **The six cities are back aboard**: Prague rides the map at ring 6, hex 7; Seoul, Dubai, San Francisco, Toronto and Chicago ride the visible pool, settling on rings 9–11 as the city grows — five stay beyond the designed horizon
- **New centres**: the 311-city roster moves Mondiala to the Central Balkan foothills above the Rositsa valley (geo, Bulgaria), the Fann mountains of the Zarafshan range (pop, Tajikistan) and the Budjak steppe near Cahul (great, Moldova)
- **The checker learns the fourth law**: no two pink districts may ever touch — alongside no god on the green, section-mirror symmetry and the six-fold repeat; **+ Next ring** now stops at ring 11, the designed horizon
- Suite: **484 checks, all green**

## v1.4.1 — six-fold pink lattice

The visible asymmetry, caught by his eye while the checker read zero: ring 5's twelve slots ran one rhythm around the east half of the ring (2nd and 4th hex of each spoke-to-spoke segment) and the flipped rhythm around the west half (1st and 3rd) — left-right mirror-symmetric, so the old check passed, but visibly lopsided: the north spoke flanked by no pink at all, the south spoke flanked by pink on both sides.

- **Ring 5's slots now sit in middle pairs at the diagonals** — 3, 4, 8, 9, 13, 14, 18, 19, 23, 24, 28, 29 — six-fold symmetric like ring 7 (spoke-flanking) and ring 8 (diagonals), echoing the ring-4 goddess star and ring-8's diagonal seats
- The twelve ring-5 gods re-shuffled onto the new slots by compass automatically; the spoke-flanking alternative was tested and rejected — it would have left six ring-6 hexes uncovered
- **New suite checks**: every ring's pink set must be invariant under a 60° rotation — the check that would have caught this
- Suite: **472 checks, all green**

## v1.4 — the heart goddesses

The heart gets its goddess star — six of love on the six ring-4 middles, each facing her homeland by the compass rule:

- **The middles of the six triads turn pink**: Milda north-east, Kama east, Aphrodite south-east, Eros south-west, Venus west, Freyja north-west — three exact mirror pairs, so the pink set stays symmetric and the checker reads 0 / 0 / 0
- **The pink tiles that had to move, moved**: Milda left the outer ring-7 lattice for the north-east middle, and Ishtar backfills her slot by her own compass (the cradle goddesses still wait unplaced)
- **No city deleted**: Vienna, Tokyo, Cape Town, Sydney and Amsterdam stay in the heart (hexes 8, 10, 14, 16, 18); Prague, Seoul, Dubai, San Francisco, Toronto and Chicago stepped off the heart and are kept in the data — coordinates, countries, info cards and facts all intact for later use
- **Centres unchanged**: the roster did not move, so Mondiala still sits on the Thracian plain (geo), the Babatag range (pop) and the Dobruja steppe (great)
- Suite: **468 checks, all green** (six new goddess, kept-city and pink-count checks)

## v1.3.2 — down to bare Metropol

The ring viewer gets its full range:

- **− Remove ring** unwinds ring by ring, all the way down to bare **Metropol** (ring 0, pool 305) — then **+ Next ring** grows the city back, hex for hex exact
- **+ Next ring** stops honestly when the pool runs dry (ring 11 in geographic mode: 65 cities on the last rim)
- Still pure view state — nothing is saved, a reload resets to the shipped city
- Suite: **462 checks, all green**

## v1.3.1 — the ring viewer

The add-ring control returns as what it always really was — a viewing feature (his call:
"this was not editing feature this was viewing feature"):

- **+ Next ring** — the pool settles onto ring 9 by the compass rule, right before your eyes
  (54 cities, pool 179 → 125, the view re-fitting so the new rim touches the screen)
- **− Remove ring** — takes the last extra ring away; ring 8 is the shipped city, so it
  can't go below that
- Pure view state — nothing is saved, a reload resets to the shipped city, the same
  non-persisting deal as the centre-mode switch
- Suite: **451 checks, all green** (14 new ring-viewer checks)

## v1.3 — the map goes read-only

The browser stops being an editor and becomes a pure viewer — it could never save
anything anyway, and every change already flowed through the data:

- **Removed**: the inspector's edit fields, brush/paint mode and the type chips,
  pool click-to-place, the add-city form, the add-ring button, and the whole
  save/load/export/import/reset card
- **Kept**: pan and zoom, the three centre modes, click-for-card inspection,
  the stats, the read-only pool list, the lattice checker and the view toggle
- `mondiala.html` shrank from 50 KB to 36 KB — pure app, no editing machinery
- The suite was reshaped with it: **437 checks, all green** — the editing-flow
  sections replaced by a read-only-map section (viewing controls present,
  editing UI gone)

## v1.2 — the civilisation heart

The heart rebuilt to the new design — every hexagon named, no gods shipping inside it:

- **Ring 1 — the six cradle civilisations** on the spokes, in founding order: China, the
  Indus Valley, Mesopotamia, Egypt, the Andes, Mesoamerica. Greece and Phoenicia step
  down to the info cards
- **Ring 2 — the twelve ancient cities**: each cradle's first great city behind its
  civilisation (Chang'an, Mohenjo-daro, Uruk, Memphis, Cusco, Tenochtitlan) with
  Constantinople, Athens, Babylon, Rome, Tyre and Carthage between them. Babylon moves
  into the heart off the roster; Tyre joins the data
- **Ring 3 — Norden, 18 hexes**, every Nordic country and autonomous land represented
  (Tórshavn, Nuuk, Mariehamn aboard; Göteborg and Kaunas keeping their priority seats) —
  Stavanger, Turku, Kristiansand, Narva, Vyborg and Billund step off the heart and onto
  the roster
- **Ring 4 — the inspiration cities, 24 hexes**: the six originals on the spokes
  (Paris, Barcelona, Moscow, Singapore, Vancouver, New York) with a world tour of
  eighteen between them: London, Amsterdam, Madrid, Berlin, Vienna, Prague, Seoul,
  Tokyo, Hong Kong, Dubai, Sydney, San Francisco, Toronto, Chicago, Mexico City,
  Rio de Janeiro, Cape Town, Lisbon
- **No gods in the heart** — the twelve gods of love stay unplaced, to be hand-named
  onto any hexagon; naming a hex for a god turns it pink, and the city it carried
  returns to the pool
- **Lattice rule 3 re-scoped**: every ordinary hexagon *of the outer city* (rings 5+)
  touches a pink district — the authored heart stands on its own, so the fresh build
  reads 0 / 0 / 0
- **New centres**: the Thracian plain at Plovdiv's eastern edge, Bulgaria (geo) · the
  Babatag range, Tajikistan (pop) · the Dobruja steppe, Romania (great)
- Roster 305, pool 179, facts 373, info cards 419 — and the 453-check suite updated to
  match, all green

## v1.1.2 — the data splits into five themed files

No app changes — the city, its data and its 453 green checks are exactly as v1.1.1 left
them. What changed is the shape of the data: the single `mondiala-data.js` monolith (with
the info cards and facts baked into the HTML itself) is now **five small themed files**,
each editable on its own:

- `mondiala-heart.js` — the authored rings 0–4
- `mondiala-cities.js` — the 318-city roster, coordinates, countries, centre spots
- `mondiala-info.js` — the 418 info cards
- `mondiala-facts.js` — the 372 real-city fact entries
- `mondiala-gods.js` — the pink slot lattice, the waiting gods, the homelands, the name set

`mondiala.html` shrank from 122 KB to 50 KB — it now carries only the app, and the old
`mondiala-data.js` is deleted. Change a city? Edit `mondiala-cities.js`. Change a goddess?
Only `mondiala-gods.js` moves.

## v1.1.1 — the test toolchain joins the repo

No app changes — the city is exactly as v1.1 shipped it. What's new is where the tests live:

- The headless test suite now lives in the repository itself, under **`city-designer/test/`**:
  the DOM stubs, the loader (which loads the *shipped* `mondiala.html` + `mondiala-data.js`
  the way a browser would), the `DATA.md` generator, the 453 assertions, `run.sh` and the
  canvas splitter. Rebuilt from scratch and expanded — every outer ring of all three centre
  modes is now checked cell by cell against `DATA.md`, not just the heart
- **453 checks, all green**: roster integrity, the authored heart (rings 0–4, hex by hex),
  the three lattice rules and the validator, the fill-later god flow (hand-placing all
  twelve gods, auto-pinking, survival across mode switches, imports, resets and ring 9),
  the three centres at 0.000 km, pools, the capital audit, save/load, arm-and-place, paint,
  inspector, pan/zoom and the full `DATA.md` consistency pass
- Run it with `sh city-designer/test/run.sh` (Node ≥ 18, no dependencies)

## v1.1 — the corrected heart (`41645f0`)

The heart rebuilt to the corrected design:

- **Ring 2 — the eight cradle civilisations**, no "Ancient" prefixes: China, the Indus Valley,
  Mesopotamia, Egypt, the Andes, Mesoamerica on the spokes, Greece and Phoenicia between
- **Ring 3 — the cradle cities and the classics**: Chang'an, Mohenjo-daro, Uruk, Memphis,
  Cusco, Tenochtitlan on the spokes; Athens, Constantinople, Rome, Carthage between
- **Ring 4 — Norden, all 24 hexes**: every Nordic country and autonomous land represented,
  with Stavanger, Kristiansand, Narva, Tórshavn, Nuuk and Mariehamn
- **The twelve heart gods deliberately unplaced** — the empty heart hexes wait to be filled
  in by hand; typing a god's name turns the hex pink, and hand-placed gods survive every
  re-flow, mode switch, import and reset
- **The three lattice rules**, enforced by the checker: no god on the green metro spokes;
  the pink set mirror-symmetric about the north–south axis; every ordinary hexagon outside
  Norden touching a god. (The old invented "no two parks adjacent" rule is retired.)
- **The ancient kin return to the roster** (318 cities — Aleppo, Diyarbakır, Jerusalem,
  Babylon, Mecca, Aksum flow onto the outer rings by compass; Cusco and Constantinople live
  in the heart instead of the roster)
- **New centres**: the upper Tundzha valley by Kalofer, Bulgaria (geo) · the Turkistan steppe
  south-east of the Shardara reservoir, Kazakhstan (pop) · the western Budjak, Moldova (great)
- Headless test suite: 203 checks green (at the time; expanded to 453 in v1.1.1)

Browse this version: <https://github.com/lyngvaldarnegard/Mondiala/tree/41645f0cc6def91f6dbcb23bb795576c46d1dc50>

## v1.0 — the ancient heart (`d4c84c1`)

The first authored heart, kept here for reference:

- Civilisations with "Ancient" prefixes (Ancient China, Ancient Egypt, the Ancient Andes)
- The cradle goddesses **Zhinü, Rati, Inanna, Hathor, Cavillaca, Xochiquetzal** placed in
  ring 2's mids; the six great love gods **Freyja, Aphrodite, Ishtar, Venus, Eros, Kama**
  on ring 3's spokes
- Ålesund in the Nordic ring; Cusco and Constantinople on the roster rather than in the heart
- The old invented lattice rule ("no two parks adjacent"), since retired
- Capital-complete roster with the twelve newest megacities added

Browse this version: <https://github.com/lyngvaldarnegard/Mondiala/tree/d4c84c141c9c21f5cdc7aa47f2657f6253cc5671>

## Earlier milestones

Before the heart was authored, the map grew ring by ring:

- `e8391dd` — the map gets hosted: root landing page for GitHub Pages, live links in the READMEs
- `ced807a` — capital-complete roster: every European capital and every >1M-country capital
- `f072cef` — the roster grows to 214, centre re-lands on the Low Tatras / Kyzylkum / Volhynia

## How to go back

- **Browse**: use the links above — GitHub shows the whole repository exactly as it was at
  that commit, file by file.
- **Restore**: say the word and any version's files can be brought back as a new commit —
  restoring an old version never destroys the newer ones; history only grows.
- **Mark a Release** (recommended for milestones): *Releases → Draft a new release →
  Choose a tag* (e.g. `v1.1`) → *Target: the commit listed above* → paste that version's
  notes from this file → *Publish release*. The release page then offers the entire state
  as a downloadable zip — handy as a stable link even before Pages is switched on.

## Going forward

Each shipped redesign gets an entry in this file and an `archive/vX.Y-name` bookmark branch,
created **before** the next change lands, so every state stays one click away.
