// gen_data_md.js — regenerates ../DATA.md (the human-readable city tables) from the live app state
"use strict";
const fs = require("fs");
const X = globalThis.__X;
const $ = id => document.getElementById(id);
const escCell = s => String(s).replace(/\|/g, "\\|");
const SUB = { 0: "Metropol", 1: "the inspiration cities", 2: "the cradle civilisations", 3: "the cradle cities and the classics", 4: "Norden" };
const MODENAME = { geo: "geographic midpoint", pop: "population-weighted", great: "greatness-weighted" };
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
out.push("Mondiala in numbers: **" + hexes.length + " hexagons** across rings 0–" + X.maxCircle + " · **" + named + " named hexes** · **" + parks + " pink free-use districts** (the twelve heart gods wait unplaced, to be filled in by hand) · **" + X.WORLD_CITIES.length + " world cities** on the roster, **" + X.pool.length + "** of them waiting in the pool.");
out.push("");
out.push("The heart is authored by hand — ring 1 the inspiration cities, ring 2 the cradle civilisations (China, the Indus Valley, Mesopotamia, Egypt, the Andes, Mesoamerica, Greece, Phoenicia), ring 3 each cradle's first city plus Athens, Constantinople, Rome and Carthage, ring 4 Norden with every Nordic country represented. The empty heart hexes — ring 2: 2, 6, 8, 12; ring 3: 2, 3, 6, 9, 11, 14, 17, 18 — wait for the twelve gods of love to be placed by hand.");
out.push("");
out.push("## The heart — rings 0–4 (authored; identical in every centre mode)");
out.push("");
for (const c of [0, 1, 2, 3, 4]) {
  const dens = (c === 1 || c === 0 || c === 4);
  out.push("### Ring " + c + " — " + SUB[c]);
  out.push("");
  if (c === 0) { out.push("| Hex | Name | Density |"); out.push("|---|---|---|"); out.push("| 0 | " + escCell(hexOf(0, 0).name) + " | " + hexOf(0, 0).density + " |"); }
  else { out.push(dens ? "| Hex | Name | Density |" : "| Hex | Name |"); out.push(dens ? "|---|---|---|" : "|---|---|"); out.push(ringTable(c, dens)); }
  out.push("");
}
const base = { geo: {}, pop: {}, great: {} };
for (const m of ["geo", "pop", "great"]) {
  $("centerMode").value = m;
  __fire($("centerMode"), "change", {});
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
$("centerMode").value = "geo";
__fire($("centerMode"), "change", {});
fs.mkdirSync(require("path").dirname("../DATA.md"), { recursive: true });
fs.writeFileSync("../DATA.md", out.join("\n") + "\n", "utf8");
console.log("DATA.md written: " + (out.join("\n").length + 1) + " chars");
