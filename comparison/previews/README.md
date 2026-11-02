# Rule-tuning previews — neighbours & hexagonal

Sigurd's eye picks. Nothing here ships until he rules. All panels: the shipped view (rings 0–11), pointy-side-up, continent colours, the pink free-use districts pink.

**Median** = median real great-circle km between cities on adjacent hexes (lower = real neighbours sit together). **corr(lat, y)** = north reads up. **corr(lon, x)** = east reads right.

| Preview | Compass weight | Median km | corr(lat, y) | corr(lon, x) |
|---|---|---|---|---|
| [N0](N0.svg) | OFF — pure city-to-city | 1,217 | +0.43 | +0.61 |
| [N800](N800.svg) | 800 — faint | 1,485 | +0.25 | +0.50 |
| [N1500 — current](N1500.svg) | 1500 — shipped | 1,330 | +0.54 | +0.53 |
| [N3000](N3000.svg) | 3000 — strong pull | 1,187 | +0.42 | +0.52 |
| [H1500 — current](H1500.svg) | 1500 — shipped | 1,409 | +0.30 | +0.72 |

Notes:

- The compass weight is the main neighbours knob: how hard a city is pulled toward the hex that matches its real-world direction from Mondiala. OFF = the original v2.0 city-to-city folding; higher = hemispheres dominate.
- Hexagonal's seating is two-stage (km-plausible pool of 8 first, the compass decides within it), so its compass weight is already fixed by design — its knob would be the pool size (8 → 6 or 12), a small code change if he wants that preview.
- Other knobs available on request: candidate pool size (6 → 12), ring-5 seeding (heart-anchored vs compass-pure), hard rule on/off.
