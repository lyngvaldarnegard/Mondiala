// gen_data_md.js — regenerates ../DATA.md (the human-readable city tables) from the live app state
"use strict";
const fs = require("fs");
const X = globalThis.__X;
const $ = id => document.getElementById(id);
{ const p = $("placeMode"); p.value = "neighbours"; __fire(p, "change", {}); } // DATA.md documents the default (neighbours) layout
const escCell = s => String(s).replace(/\|/g, "\\|");
const SUB = { 0: "Metropol", 1: "the cradle civilisations", 2: "the ancient cities", 3: "the Nordics", 4: "the inspiration cities" };
const MODENAME = { geo: "geographic midpoint" };
function hexOf(c, n) { return Object.values(X.hexes).find(h => h.circle === c && h.num === n); }
function ringTable(c, withDensity) {
  const rows = [];
  for (let n = 1; n <= c * 6; n++) {
    const h = hexOf(c, n);
    const name = h && h.name ? h.name : "—";
    if (withDensity) rows.push("| " + n + " | " + escCell(name) + " | " + (h && h.density != null ? h.density : "—") + " |");
    else rows.push("| " + n + " | " + escCell(name + (h && h.type === "park" ? " ♥" : "")) + " |");
  }
  return rows.join("\n");
}
let out = [];
const hexes = Object.values(X.hexes);
const named = hexes.filter(h => h.name).length;
const parks = hexes.filter(h => h.type === "park").length;
out.push("# Mondiala — the city, hexagon by hexagon");
out.push("");
out.push("Mondiala in numbers: **" + hexes.length + " hexagons** across rings 0–" + X.maxCircle + " · **" + named + " named hexes** · **" + parks + " pink free-use districts** (v1.8: the six favourite gods of love hold the ring-4 middles — one allocation list, the favourites at the top; the cradle goddesses wait unplaced) · **" + X.WORLD_CITIES.length + " world cities** on the roster, **" + X.pool.length + "** of them waiting in the pool.");
out.push("");
out.push("The heart is authored by hand, every hexagon filled — ring 1 the six cradle civilisations (China, the Indus Valley, Mesopotamia, Egypt, the Andes, Mesoamerica), ring 2 the twelve ancient cities (hexes 1–9 sorted by apex — the time each city was greatest, newest first — and Cusco, Tenochtitlan, Chang'an pinned at 10–12), ring 3 the Nordics with every Nordic country represented, ring 4 the inspiration cities of the world — v1.8 the heart learns direction: the six originals hold the green spokes (which spoke by their true bearing), the six favourites hold the middles facing their homelands, and the twelve other inspiration cities keep their ring-4 seats by bearing; Milda rides the lattice again from ring 7; past ring 8 the pink lattice reaches the designed horizon — rings 9–11 seat the dormant five, fourteen new love-gods and the concepts of eros, deities by compass and concepts in authored order; the cradle goddesses stay unplaced. The map is read-only in the browser — every change happens in the data files.");
out.push("");
out.push("## The heart — rings 0–3 authored; ring 4 seats by direction from the active centre (shown here in geo mode)");
out.push("");
for (const c of [0, 1, 2, 3, 4]) {
  const dens = (c === 0 || c === 3 || c === 4);
  out.push("### Ring " + c + " — " + SUB[c]);
  out.push("");
  if (c === 0) { out.push("| Hex | Name | Density |"); out.push("|---|---|---|"); out.push("| 0 | " + escCell(hexOf(0, 0).name) + " | " + hexOf(0, 0).density + " |"); }
  else { out.push(dens ? "| Hex | Name | Density |" : "| Hex | Name |"); out.push(dens ? "|---|---|---|" : "|---|---|"); out.push(ringTable(c, dens)); }
  out.push("");
}
const base = { geo: {}, pop: {}, great: {} };
for (const m of ["geo"]) { // only the geographic centre remains
  X.recenter();
  base[m].pool = X.pool.map(p => p.name);
  out.push("## Outer city — " + MODENAME[m] + " (" + m + " mode)");
  out.push("");
  out.push("Mondiala sits at " + X.worldCenter.lat.toFixed(5) + "°, " + X.worldCenter.lon.toFixed(5) + "° — " + X.centerCountry(X.worldCenter) + ".");
  out.push("");
  for (let c = 5; c <= X.maxCircle; c++) {
    out.push("### Ring " + c);
    out.push("");
    out.push("| Hex | Name |");
    out.push("|---|---|");
    out.push(ringTable(c, false));
    out.push("");
  }
  out.push("### Pool — " + base[m].pool.length + " unplaced (" + m + " mode)");
  out.push("");
  out.push(base[m].pool.join(", "));
  out.push("");
}
X.recenter(); // centre dropdown deleted; geo midpoint only
fs.mkdirSync(require("path").dirname("../DATA.md"), { recursive: true });
fs.writeFileSync("../DATA.md", out.join("\n") + "\n", "utf8");
console.log("DATA.md written: " + (out.join("\n").length + 1) + " chars");
