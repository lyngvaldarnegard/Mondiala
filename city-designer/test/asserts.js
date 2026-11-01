// asserts.js — the full regression suite over the live app. Runs after loader.js + gen_data_md.js.
// The whole file is wrapped in an IIFE so its helpers don't collide with the
// consts from gen_data_md.js (this file is concatenated into the same scope).
(async () => {
"use strict";
const X = globalThis.__X;
const $ = id => document.getElementById(id);
const keyOf = (c, n) => { const h = Object.values(X.hexes).find(h => h.circle === c && h.num === n); return h ? h.q + "," + h.r : null; };
const HEX_NAMES = (c) => { const out = []; for (let n = 1; n <= c * 6; n++) { const h = Object.values(X.hexes).find(h => h.circle === c && h.num === n); out.push(h && h.name ? h.name : "—"); } return out; };
const HEART_NAMES = new Set([].concat(...[1, 2, 3, 4].map(c => HEX_NAMES(c))).filter(n => n !== "—"));
let PASS = 0, FAIL = 0, SECTION = "";
const ok = (label, cond) => { if (cond) PASS++; else { FAIL++; console.log("  FAIL: " + label); } };
const eq = (label, got, want) => { if (JSON.stringify(got) === JSON.stringify(want)) PASS++; else { FAIL++; console.log("  FAIL: " + label + " " + JSON.stringify(got) + " === " + JSON.stringify(want)); } };
const section = (s) => { SECTION = s; console.log("── " + s); };
const parkCount = () => Object.values(X.hexes).filter(h => h.type === "park").length;

// ---------- 1 · roster integrity ----------
section("1 · roster integrity");
eq("hex count", Object.keys(X.hexes).length, 217);
eq("roster", X.WORLD_CITIES.length, 305);
eq("facts", Object.keys(X.CITY_FACTS).length, 373);
eq("info cards", Object.keys(X.CITY_INFO).length, 419);
eq("gods", X.SEX_GODS.size, 42);
eq("RAW rows", X.RAW.length, 61);
eq("pool (geo fresh)", X.pool.length, 179);
eq("no double-placed roster city", (() => { const seen = new Set(); for (const h of Object.values(X.hexes)) { if (!h.name) continue; const n = h.name.trim().toLowerCase(); if (X.WORLD_CITIES.some(w => w.trim().toLowerCase() === n)) { if (seen.has(n)) return false; seen.add(n); } } return true; })(), true);
ok("every roster city has coordinates", X.WORLD_CITIES.every(w => X.CITY_COORDS[w.trim().toLowerCase()]));
ok("every heart name off the roster", [...HEART_NAMES].every(n => !X.WORLD_CITIES.some(w => w.trim().toLowerCase() === n.trim().toLowerCase())));

// ---------- 2 · the authored heart ----------
section("2 · the authored heart");
eq("Metropol", X.hexes["0,0"].name, "Metropol");
eq("ring 1", HEX_NAMES(1), ["China", "Indus Valley", "Mesopotamia", "Egypt", "Andes", "Mesoamerica"]);
eq("ring 2", HEX_NAMES(2), ["Chang'an", "Constantinople", "Mohenjo-daro", "Athens", "Uruk", "Babylon", "Memphis", "Rome", "Cusco", "Tyre", "Tenochtitlan", "Carthage"]);
eq("ring 3", HEX_NAMES(3), ["Stockholm", "Vilnius", "Riga", "København", "Tallinn", "Tampere | Tammerfors", "Helsinki", "Malmö", "Aarhus", "Oslo", "Kaunas", "Bergen", "Göteborg", "Trondheim", "Mariehamn", "Reykjavík", "Tórshavn", "Nuuk"]);
eq("ring 4", HEX_NAMES(4), ["Paris", "London", "Milda", "Madrid", "Barcelona", "Berlin", "Kama", "Vienna", "Moscow", "Tokyo", "Aphrodite", "Hong Kong", "Singapore", "Cape Town", "Eros", "Sydney", "Vancouver", "Amsterdam", "Venus", "Mexico City", "New York", "Rio de Janeiro", "Freyja", "Lisbon"]);
eq("ring 1 has no densities", [1, 2, 3, 4, 5, 6].map(n => Object.values(X.hexes).find(h => h.circle === 1 && h.num === n).density), [null, null, null, null, null, null]);
eq("Metropol density", X.hexes["0,0"].density, 4355.39);
eq("small-capital densities", [15, 16, 17, 18].map(n => Object.values(X.hexes).find(h => h.circle === 3 && h.num === n).density), [1068.4, 556, 129.73, 29.15]);
eq("all 6 civilisation spellings", true, HEX_NAMES(1).join(",") === "China,Indus Valley,Mesopotamia,Egypt,Andes,Mesoamerica");

// ---------- 3 · lattice rules (shipped state: six goddesses in the heart) ----------
section("3 · lattice rules (shipped state: six goddesses in the heart)");
eq("heart goddesses by compass", [3, 7, 11, 15, 19, 23].map(n => { const h = Object.values(X.hexes).find(h => h.circle === 4 && h.num === n); return h ? h.name + ":" + h.type : "?"; }), ["Milda:park", "Kama:park", "Aphrodite:park", "Eros:park", "Venus:park", "Freyja:park"]);
const onSpokePark = Object.values(X.hexes).filter(h => h.type === "park" && (h.circle === 0 || X.onSpoke(h)));
eq("no god on the green (fresh)", onSpokePark.length, 0);
const mirror = (h) => X.hexes[(-h.q) + "," + (h.q + h.r)];
const asym = Object.values(X.hexes).filter(h => h.type === "park" && (!mirror(h) || mirror(h).type !== "park"));
eq("mirror symmetry (fresh)", asym.length, 0);
const sixfold = (c) => { const parks = Object.values(X.hexes).filter(h => h.circle === c && h.type === "park").map(h => h.num).sort((a, b) => a - b); if (!parks.length) return true; const N = c * 6; return JSON.stringify(parks) === JSON.stringify(parks.map(n => ((n + c - 1) % N) + 1).sort((a, b) => a - b)); };
ok("ring 4 six-fold", sixfold(4));
ok("ring 5 six-fold", sixfold(5));
ok("ring 7 six-fold", sixfold(7));
ok("ring 8 six-fold", sixfold(8));
const uncovered = [];
for (const h of Object.values(X.hexes)) {
  if (h.type === "park" || h.circle <= 4 || X.onSpoke(h)) continue;
  const neigh = X.neighborKeys(h.q, h.r).map(k => X.hexes[k]).filter(Boolean);
  if (!neigh.some(n => n.type === "park")) uncovered.push(h.circle + "#" + h.num);
}
uncovered.sort((a, b) => { const [c1, n1] = a.split("#"), [c2, n2] = b.split("#"); return (+c1 - +c2) || (+n1 - +n2); });
eq("whole heart exempt, nothing uncovered (fresh)", uncovered, []);
eq("parks (fresh: 30 outer + 6 heart goddesses)", parkCount(), 36);

// ---------- 4 · capitals aboard ----------
section("4 · capitals aboard");
const NORDIC = new Set(["Helsinki", "Stockholm", "Oslo", "København", "Reykjavík", "Tórshavn", "Nuuk", "Mariehamn"]);
const CAPS = ["Washington D.C.", "Mexico City", "Ottawa", "Havana", "Kingston", "Santo Domingo", "San Juan", "Port-au-Prince", "Panama City", "San José", "Managua", "Guatemala City", "Tegucigalpa", "San Salvador", "Bogotá", "Quito", "Lima", "La Paz", "Santiago", "Buenos Aires", "Montevideo", "Asunción", "Brasília", "São Paulo", "Rio de Janeiro", "Caracas", "London", "Dublin", "Paris", "Brussels", "Amsterdam", "Luxembourg", "Madrid", "Lisbon", "Andorra la Vella", "Monaco", "Bern", "Vienna", "Berlin", "Prague", "Bratislava", "Budapest", "Ljubljana", "Zagreb", "Sarajevo", "Belgrade", "Podgorica", "Tirana", "Skopje", "Athens", "Sofia", "Bucharest", "Chisinau", "Kyiv", "Minsk", "Vilnius", "Riga", "Tallinn", "Warsaw", "Vatican City", "San Marino", "Rome", "Valletta", "Nicosia", "Reykjavík", "Tórshavn", "Nuuk", "Mariehamn", "Oslo", "Stockholm", "Helsinki", "København", "Moscow", "Ankara", "Tbilisi", "Yerevan", "Baku", "Astana", "Tashkent", "Bishkek", "Dushanbe", "Ashgabat", "Kabul", "Islamabad", "Delhi", "Kathmandu", "Dhaka", "Colombo", "Yangon", "Bangkok", "Vientiane", "Phnom Penh", "Hanoi", "Beijing", "Ulaanbaatar", "Seoul", "Tokyo", "Manila", "Jakarta", "Kuala Lumpur", "Singapore", "Nairobi", "Addis Ababa", "Asmara", "Mogadishu", "Kampala", "Kigali", "Dodoma", "Lusaka", "Harare", "Maputo", "Lilongwe", "Maseru", "Gaborone", "Windhoek", "Pretoria", "Cape Town", "Bloemfontein", "Cairo", "Tripoli", "Tunis", "Algiers", "Rabat", "Nouakchott", "Banjul", "Bissau", "Conakry", "Freetown", "Monrovia", "Yamoussoukro", "Accra", "Lomé", "Porto-Novo", "Abuja", "Niamey", "Bamako", "Ouagadougou", "N'Djamena", "Yaoundé", "Libreville", "Brazzaville", "Bangui", "Kinshasa", "Brazzaville", "Luanda", "Windhoek", "Juba", "Khartoum", "Port Moresby", "Wellington", "Canberra"];
const KEPT = ["Prague", "Seoul", "Dubai", "San Francisco", "Toronto", "Chicago"]; // stepped off the heart, kept in the data for later
for (const cap of CAPS) {
  ok("capital aboard: " + cap, X.WORLD_CITIES.includes(cap) || HEART_NAMES.has(cap) || NORDIC.has(cap) || KEPT.includes(cap) || X.WORLD_CITIES.some(w => w.trim().toLowerCase() === cap.toLowerCase()));
}
eq("heart cities count", HEART_NAMES.size, 60);
ok("every kept city keeps its coordinates", KEPT.every(n => X.CITY_COORDS[n.toLowerCase()]));
ok("every kept city keeps its country", KEPT.every(n => X.CITY_COUNTRY[n.toLowerCase()]));
ok("every kept city keeps its info card", KEPT.every(n => X.CITY_INFO[n.toLowerCase()]));
ok("every kept city keeps its facts", KEPT.every(n => X.CITY_FACTS[n.toLowerCase()]));
ok("no kept city is on the map or the roster", KEPT.every(n => !HEART_NAMES.has(n) && !X.WORLD_CITIES.some(w => w.trim().toLowerCase() === n.toLowerCase())));

// ---------- 5 · validator (fresh state → the three rules) ----------
section("5 · validator (fresh state → the three rules)");
__fire($("btnValidate"), "click", {});
ok("no flag-invalid (fresh)", document.querySelectorAll(".flag-invalid").length === 0);
eq("flag-nopark = 0 (fresh)", document.querySelectorAll(".flag-nopark").length, 0);
ok("validator says lattice valid (fresh)", $("validatorOut").innerHTML.includes("Lattice valid"));
__fire($("btnClearFlags"), "click", {});
ok("clear flags works", document.querySelectorAll(".flag-nopark").length === 0);

// ---------- 6 · centres ----------
section("6 · centres");
const setMode = (m) => { $("centerMode").value = m; __fire($("centerMode"), "change", {}); };
const spots = { geo: ["42.14872240", "24.79302491", "Bulgaria"], pop: ["36.93213238", "67.00017894", "Tajikistan"], great: ["44.48894929", "28.97183031", "Romania"] };
for (const m of Object.keys(spots)) {
  setMode(m);
  const [lat, lon, country] = spots[m];
  eq(m + " centre lat", X.worldCenter.lat.toFixed(8), lat);
  eq(m + " centre lon", X.worldCenter.lon.toFixed(8), lon);
  ok(m + " country is " + country, X.centerCountry(X.worldCenter).includes(country));
  eq(m + " pool (fresh)", X.pool.length, 179);
  eq(m + " parks (30 outer + 6 heart goddesses)", parkCount(), 36);
}
setMode("geo");

// ---------- 7 · the read-only map ----------
section("7 · the read-only map");
// the editing UI is gone: none of these ids are ever looked up by the app,
// so they never exist in the stub DOM (do not $() them — that would create them)
ok("no add-ring button", !__els.has("btnAddRing"));
ok("no paint mode", !__els.has("modePaint"));
ok("no save/load card", !__els.has("btnSaveLocal") && !__els.has("btnLoadLocal") && !__els.has("jsonio"));
ok("no export/import", !__els.has("btnExport") && !__els.has("btnImport"));
ok("no reset button", !__els.has("btnReset"));
ok("no add-city form", !__els.has("btnAddCity") && !__els.has("addName") && !__els.has("extraList"));
ok("no brush / type chips", !__els.has("types") && !__els.has("modeSelect"));
// the viewing controls stay
ok("view toggle kept", !!__els.has("btnView"));
ok("validator kept", !!__els.has("btnValidate") && !!__els.has("btnClearFlags"));
ok("centre-mode switch kept", !!__els.has("centerMode"));
ok("pool list kept", !!__els.has("pool"));
ok("stats kept", !!__els.has("stats"));
eq("pool chips rendered (read-only)", document.querySelectorAll(".poolname").length, 179);
eq("mode switch rebuilds fresh state", (() => { setMode("pop"); setMode("geo"); return X.pool.length; })(), 179);
// clicking a hex still shows its read-only card
X.selected = keyOf(1, 1);
X.showInspector();
ok("PCODE label", $("inspector").innerHTML.includes("1 China 1"));
ok("inspector shows the info card, not edit fields", !$("inspector").innerHTML.includes("iApply"));
ok("inspector has no Apply button", !__els.has("iApply"));
X.selected = null; X.showInspector();

// ---------- 7b · the ring viewer (view-only) ----------
section("7b · the ring viewer (view-only)");
ok("ring-viewer buttons wired", __els.has("btnNextRing") && __els.has("btnDropRing"));
__fire($("btnNextRing"), "click", {});
eq("ring 9 opens", X.maxCircle, 9);
eq("hexes with ring 9", Object.keys(X.hexes).length, 271);
eq("ring 9 carries plain cities only", Object.values(X.hexes).filter(h => h.circle === 9 && h.type === "park").length, 0);
eq("pool after ring 9", X.pool.length, 125);
eq("pool chips re-render", document.querySelectorAll(".poolname").length, 125);
__fire($("btnNextRing"), "click", {});
eq("ring 10 opens", X.maxCircle, 10);
eq("pool after ring 10", X.pool.length, 65);
__fire($("btnNextRing"), "click", {});
eq("ring 11 takes the last 65", X.pool.length, 0);
__fire($("btnNextRing"), "click", {});
eq("add stops when the pool runs dry", X.maxCircle, 11);
__fire($("btnDropRing"), "click", {});
eq("drop back to 10", X.maxCircle, 10);
eq("pool back to 65", X.pool.length, 65);
__fire($("btnDropRing"), "click", {});
eq("drop back to 9", X.maxCircle, 9);
eq("pool back to 125", X.pool.length, 125);
__fire($("btnDropRing"), "click", {});
eq("drop back to 8", X.maxCircle, 8);
eq("hexes restored", Object.keys(X.hexes).length, 217);
eq("pool restored", X.pool.length, 179);
for (let i = 0; i < 8; i++) __fire($("btnDropRing"), "click", {});
eq("down to bare Metropol", X.maxCircle, 0);
eq("only Metropol left", Object.keys(X.hexes).length, 1);
eq("Metropol survives", X.hexes["0,0"].name, "Metropol");
eq("pool at ring 0", X.pool.length, 305);
__fire($("btnDropRing"), "click", {});
eq("cannot go below Metropol", X.maxCircle, 0);
for (let i = 0; i < 8; i++) __fire($("btnNextRing"), "click", {});
eq("re-grown to ring 8", X.maxCircle, 8);
eq("hexes re-grown", Object.keys(X.hexes).length, 217);
eq("pool re-settled", X.pool.length, 179);
X.recenter();

// ---------- 8 · pan / zoom / click-guard ----------
section("8 · pan / zoom / click-guard");
const svg = $("map");
const fit = X.cityViewBox();
eq("fresh view is the full-city fit", [X.viewBox.x, X.viewBox.y, X.viewBox.w, X.viewBox.h].join(","), [fit.x, fit.y, fit.w, fit.h].join(","));
// a drag sets the moved guard, and clicks are suppressed while it is set
X.selected = null;
X.moved = false;
__fire(svg, "mousedown", { clientX: 500, clientY: 400 });
eq("mousedown starts still", X.moved, false);
__fire(svg, "mousemove", { clientX: 570, clientY: 430 }); // |70| + |30| = 100 > 2
ok("drag sets the moved guard", X.moved === true);
const hexEl = document.querySelector('[data-key="' + keyOf(1, 1) + '"]');
__fire($("map"), "click", { target: hexEl });
eq("click suppressed while moved", X.selected, null);
X.moved = false;
__fire($("map"), "click", { target: hexEl });
eq("click selects when still", X.selected, keyOf(1, 1));
// zoom in shrinks the view; zooming out can never shrink past the full-city view
X.moved = false;
__fire(svg, "wheel", { deltaY: -120 });
ok("zoom-in changes the view", X.viewBox.w < fit.w);
for (let i = 0; i < 40; i++) __fire(svg, "wheel", { deltaY: 300 }); // a hard flick still only gentle steps
ok("zoom-out floor is the city view", X.viewBox.w >= fit.w - 1e-6);
X.viewBox = X.cityViewBox();
X.refresh();

// ---------- 9 · DATA.md consistency ----------
section("9 · DATA.md consistency");
X.recenter(); // the data-driven rebuild IS the fresh state — there is nothing else to restore
const md = fs.readFileSync("../DATA.md", "utf8");
const lines = md.split("\n");
const hexLine = (l) => l.startsWith("| ") && l.indexOf("Hex") === -1 && l.indexOf("---") === -1;
for (const c of [0, 1, 2, 3, 4]) {
  const sec = md.split("### Ring " + c + " —")[1] || "";
  const end = (c < 4 ? sec.indexOf("### Ring " + (c + 1)) : sec.indexOf("## ")) > 0
    ? (c < 4 ? sec.indexOf("### Ring " + (c + 1)) : sec.indexOf("## "))
    : sec.length;
  const rows = sec.slice(0, end).split("\n").filter(hexLine);
  eq("DATA.md ring " + c + " rows", rows.length, c === 0 ? 1 : c * 6);
  rows.forEach((row, i) => {
    const m2 = row.match(/^\| (\d+) \| (.*?) \|/);
    const h = Object.values(X.hexes).find(h => h.circle === c && h.num === +m2[1]);
    eq("DATA.md ring " + c + " hex " + m2[1], m2[2].replace(/\\\|/g, "|").replace(" ♥", ""), h && h.name ? h.name : "—");
  });
}
for (const [idx, m] of ["geo", "pop", "great"].entries()) {
  setMode(m); // the world must be rebuilt in THIS mode before comparing hexes
  const sec = md.split("## Outer city — ")[1 + idx];
  ok("outer section (" + m + ")", sec.indexOf("(" + m + " mode)") > 0);
  const r8 = sec.split("### Ring 8")[1].split("### Pool")[0]; // bounded: this mode's ring 8 only
  const rows = r8.split("\n").filter(hexLine);
  eq("DATA.md ring 8 rows (" + m + ")", rows.length, 48);
  rows.forEach((row) => {
    const m2 = row.match(/^\| (\d+) \| (.*?) \|$/);
    const h = Object.values(X.hexes).find(h => h.circle === 8 && h.num === +m2[1]);
    eq("DATA.md ring 8 hex " + m2[1] + " (" + m + ")", m2[2].replace(/\\\|/g, "|"), (h && h.name ? h.name : "—") + (h && h.type === "park" ? " ♥" : ""));
  });
  const poolSec = md.split("### Pool — ")[1 + idx];
  const poolList = poolSec.split("\n")[2].split(", ");
  eq("DATA.md pool (" + m + ")", poolList, X.pool.map(p => p.name));
}
setMode("geo");

// ---------- done ----------
console.log("==== " + (PASS + FAIL) + " checks · " + PASS + " passed · " + FAIL + " failed");
if (FAIL > 0) process.exit(1);
})().catch(e => { console.error("SUITE CRASHED:", e); process.exit(1); });
