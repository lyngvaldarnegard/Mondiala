// asserts.js — the full regression suite over the live app. Runs after loader.js + gen_data_md.js.
// The whole file is wrapped in an IIFE so its helpers don't collide with the
// consts from gen_data_md.js (this file is concatenated into the same scope).
(async () => {
"use strict";
const X = globalThis.__X;
const baselineExport = X.exportJSON(); // the pristine fresh build — later sections mutate state, this restores it
const $ = id => document.getElementById(id);
const keyOf = (c, n) => { const h = Object.values(X.hexes).find(h => h.circle === c && h.num === n); return h ? h.q + "," + h.r : null; };
const namesOf = (c) => { const out = []; for (let n = 1; n <= c * 6; n++) { const h = Object.values(X.hexes).find(h => h.circle === c && h.num === n); out.push(h && h.name ? h.name : "—"); } return out; };
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
eq("ring 4", HEX_NAMES(4), ["Paris", "London", "Amsterdam", "Madrid", "Barcelona", "Berlin", "Vienna", "Prague", "Moscow", "Seoul", "Tokyo", "Hong Kong", "Singapore", "Dubai", "Sydney", "San Francisco", "Vancouver", "Toronto", "Chicago", "Mexico City", "New York", "Rio de Janeiro", "Cape Town", "Lisbon"]);
eq("ring 1 has no densities", [1, 2, 3, 4, 5, 6].map(n => Object.values(X.hexes).find(h => h.circle === 1 && h.num === n).density), [null, null, null, null, null, null]);
eq("Metropol density", X.hexes["0,0"].density, 4355.39);
eq("small-capital densities", [15, 16, 17, 18].map(n => Object.values(X.hexes).find(h => h.circle === 3 && h.num === n).density), [1068.4, 556, 129.73, 29.15]);
eq("all 6 civilisation spellings", true, HEX_NAMES(1).join(",") === "China,Indus Valley,Mesopotamia,Egypt,Andes,Mesoamerica");

// ---------- 3 · lattice rules (shipped state: empty heart) ----------
section("3 · lattice rules (shipped state: no gods in the heart)");
const onSpokePark = Object.values(X.hexes).filter(h => h.type === "park" && (h.circle === 0 || X.onSpoke(h)));
eq("no god on the green (fresh)", onSpokePark.length, 0);
const mirror = (h) => X.hexes[(-h.q) + "," + (h.q + h.r)];
const asym = Object.values(X.hexes).filter(h => h.type === "park" && (!mirror(h) || mirror(h).type !== "park"));
eq("mirror symmetry (fresh)", asym.length, 0);
const uncovered = [];
for (const h of Object.values(X.hexes)) {
  if (h.type === "park" || h.circle <= 4 || X.onSpoke(h)) continue;
  const neigh = X.neighborKeys(h.q, h.r).map(k => X.hexes[k]).filter(Boolean);
  if (!neigh.some(n => n.type === "park")) uncovered.push(h.circle + "#" + h.num);
}
uncovered.sort((a, b) => { const [c1, n1] = a.split("#"), [c2, n2] = b.split("#"); return (+c1 - +c2) || (+n1 - +n2); });
eq("whole heart exempt, nothing uncovered (fresh)", uncovered, []);
eq("outer parks (fresh)", parkCount(), 30);

// ---------- 4 · capitals aboard ----------
section("4 · capitals aboard");
const NORDIC = new Set(["Helsinki", "Stockholm", "Oslo", "København", "Reykjavík", "Tórshavn", "Nuuk", "Mariehamn"]);
const CAPS = ["Washington D.C.", "Mexico City", "Ottawa", "Havana", "Kingston", "Santo Domingo", "San Juan", "Port-au-Prince", "Panama City", "San José", "Managua", "Guatemala City", "Tegucigalpa", "San Salvador", "Bogotá", "Quito", "Lima", "La Paz", "Santiago", "Buenos Aires", "Montevideo", "Asunción", "Brasília", "São Paulo", "Rio de Janeiro", "Caracas", "London", "Dublin", "Paris", "Brussels", "Amsterdam", "Luxembourg", "Madrid", "Lisbon", "Andorra la Vella", "Monaco", "Bern", "Vienna", "Berlin", "Prague", "Bratislava", "Budapest", "Ljubljana", "Zagreb", "Sarajevo", "Belgrade", "Podgorica", "Tirana", "Skopje", "Athens", "Sofia", "Bucharest", "Chisinau", "Kyiv", "Minsk", "Vilnius", "Riga", "Tallinn", "Warsaw", "Vatican City", "San Marino", "Rome", "Valletta", "Nicosia", "Reykjavík", "Tórshavn", "Nuuk", "Mariehamn", "Oslo", "Stockholm", "Helsinki", "København", "Moscow", "Ankara", "Tbilisi", "Yerevan", "Baku", "Astana", "Tashkent", "Bishkek", "Dushanbe", "Ashgabat", "Kabul", "Islamabad", "Delhi", "Kathmandu", "Dhaka", "Colombo", "Yangon", "Bangkok", "Vientiane", "Phnom Penh", "Hanoi", "Beijing", "Ulaanbaatar", "Seoul", "Tokyo", "Manila", "Jakarta", "Kuala Lumpur", "Singapore", "Nairobi", "Addis Ababa", "Asmara", "Mogadishu", "Kampala", "Kigali", "Dodoma", "Lusaka", "Harare", "Maputo", "Lilongwe", "Maseru", "Gaborone", "Windhoek", "Pretoria", "Cape Town", "Bloemfontein", "Cairo", "Tripoli", "Tunis", "Algiers", "Rabat", "Nouakchott", "Banjul", "Bissau", "Conakry", "Freetown", "Monrovia", "Yamoussoukro", "Accra", "Lomé", "Porto-Novo", "Abuja", "Niamey", "Bamako", "Ouagadougou", "N'Djamena", "Yaoundé", "Libreville", "Brazzaville", "Bangui", "Kinshasa", "Brazzaville", "Luanda", "Windhoek", "Juba", "Khartoum", "Port Moresby", "Wellington", "Canberra"];
for (const cap of CAPS) {
  ok("capital aboard: " + cap, X.WORLD_CITIES.includes(cap) || HEART_NAMES.has(cap) || NORDIC.has(cap) || X.WORLD_CITIES.some(w => w.trim().toLowerCase() === cap.toLowerCase()));
}
eq("heart cities count", HEART_NAMES.size, 60);

// ---------- 5 · validator (fresh state → the three rules) ----------
section("5 · validator (fresh state → the three rules)");
__fire($("btnValidate"), "click", {});
ok("no flag-invalid (fresh)", document.querySelectorAll(".flag-invalid").length === 0);
eq("flag-nopark = 0 (fresh)", document.querySelectorAll(".flag-nopark").length, 0);
ok("validator says lattice valid (fresh)", $("validatorOut").innerHTML.includes("Lattice valid"));
__fire($("btnClearFlags"), "click", {});
ok("clear flags works", document.querySelectorAll(".flag-nopark").length === 0);

// ---------- 6 · hand-placing the twelve heart gods (the fill-later flow) ----------
section("6 · hand-placing the twelve heart gods (the fill-later flow)");
// a verified symmetric fill — the gods are named onto ordinary heart hexes (over the cities;
// btnReset below restores the shipped heart): ring 2 mids pair (2,12)(4,10)(6,8), ring 4 mids pair (2,24)(3,23)(6,20)
const GODS = [["Zhinü", 2, 2], ["Xochiquetzal", 2, 12], ["Aphrodite", 2, 4], ["Ishtar", 2, 10],
             ["Inanna", 2, 6], ["Hathor", 2, 8],
             ["Venus", 4, 2], ["Freyja", 4, 24], ["Kama", 4, 3], ["Eros", 4, 23],
             ["Rati", 4, 6], ["Cavillaca", 4, 20]];
for (const [g, c, n] of GODS) {
  X.selected = keyOf(c, n);
  X.showInspector();
  $("iName").value = g;
  $("iType").value = "district";
  __fire($("iApply"), "click", {});
}
eq("all twelve placed", GODS.every(([g, c, n]) => { const h = Object.values(X.hexes).find(h => h.circle === c && h.num === n); return h.name === g && h.type === "park"; }), true);
eq("parks now 42", parkCount(), 42);
__fire($("btnValidate"), "click", {});
eq("valid 0/0/0 after fill", [document.querySelectorAll(".flag-invalid").length, document.querySelectorAll(".flag-nopark").length].join("/"), "0/0");
// survives a mode switch (which re-flows the computed placement)
const setMode = (m) => { $("centerMode").value = m; __fire($("centerMode"), "change", {}); };
setMode("great");
ok("gods survive mode switch", GODS.every(([g, c, n]) => { const h = Object.values(X.hexes).find(h => h.circle === c && h.num === n); return h.name === g; }));
setMode("geo");
// survives export → import
const filledExport = X.exportJSON();
X.importJSON(filledExport);
ok("gods survive export→import", GODS.every(([g, c, n]) => { const h = Object.values(X.hexes).find(h => h.circle === c && h.num === n); return h.name === g && h.type === "park"; }));
// survives add-ring (ring 9) and reset back
__fire($("btnAddRing"), "click", {});
ok("gods survive add-ring", GODS.every(([g, c, n]) => { const h = Object.values(X.hexes).find(h => h.circle === c && h.num === n); return h.name === g; }));
eq("ring 9 exists", Object.values(X.hexes).some(h => h.circle === 9), true);
__fire($("btnReset"), "click", {});
eq("reset back to 217", Object.keys(X.hexes).length, 217);
ok("gods survive reset", GODS.every(([g, c, n]) => { const h = Object.values(X.hexes).find(h => h.circle === c && h.num === n); return h.name === g; }));
// removing a god breaks symmetry (Eros at 4#23 loses his mirror Kama at 4#3)…
X.selected = keyOf(4, 23);
X.showInspector();
__fire($("iClearName"), "click", {});
__fire($("btnValidate"), "click", {});
ok("removing Eros breaks symmetry (Kama unmirrored)", document.querySelectorAll(".flag-invalid").length >= 1);
// …and restoring him heals it
X.selected = keyOf(4, 23);
X.showInspector();
$("iName").value = "Eros";
$("iType").value = "district";
__fire($("iApply"), "click", {});
__fire($("btnValidate"), "click", {});
eq("restored: valid again", [document.querySelectorAll(".flag-invalid").length, document.querySelectorAll(".flag-nopark").length].join("/"), "0/0");
// a god on a green spoke is flagged (rule 1) — then undone
X.selected = keyOf(5, 1);
X.showInspector();
$("iName").value = "Prende";
$("iType").value = "district";
__fire($("iApply"), "click", {});
__fire($("btnValidate"), "click", {});
ok("god on spoke flagged", document.querySelectorAll(".flag-invalid").length >= 1);
X.hexes[keyOf(5, 1)].name = "";
X.hexes[keyOf(5, 1)].type = "district";
X.refresh();
__fire($("btnValidate"), "click", {});
eq("clean again", [document.querySelectorAll(".flag-invalid").length, document.querySelectorAll(".flag-nopark").length].join("/"), "0/0");

// ---------- 7 · centres ----------
section("7 · centres");
const spots = { geo: ["42.14872240", "24.79302491", "Bulgaria"], pop: ["36.93213238", "67.00017894", "Tajikistan"], great: ["44.48894929", "28.97183031", "Romania"] };
for (const m of Object.keys(spots)) {
  setMode(m);
  const [lat, lon, country] = spots[m];
  eq(m + " centre lat", X.worldCenter.lat.toFixed(8), lat);
  eq(m + " centre lon", X.worldCenter.lon.toFixed(8), lon);
  ok(m + " country is " + country, X.centerCountry(X.worldCenter).includes(country));
  eq(m + " pool (gods displaced 12 heart cities back)", X.pool.length, 191);
  eq(m + " parks (gods placed)", parkCount(), 42);
}
setMode("geo");

// ---------- 8 · save / load / export / import / add-remove city ----------
section("8 · save / load / export / import / add-remove city");
X.importJSON(baselineExport);
const baseExport = baselineExport;
eq("import baseline: identical export", X.exportJSON(), baseExport);
$("jsonio").value = baseExport;
__fire($("btnImport"), "click", {});
eq("textarea import round-trip", X.exportJSON(), baseExport);
$("addName").value = "Anchorage"; $("addLat").value = "61.218"; $("addLon").value = "-149.903"; $("addPop").value = "291247";
__fire($("btnAddCity"), "click", {});
ok("Anchorage added", X.extraCities.length === 1 && (Object.values(X.hexes).some(h => h.name === "Anchorage") || X.pool.some(p => p.name === "Anchorage")));
ok("centre moved (weighted)", Math.abs(X.worldCenter.lat - 42.14872240) > 0.00001);
const anchChip = [...document.querySelectorAll(".poolname")].find(el => (el.textContent || "").includes("Anchorage") && el.textContent.includes("remove"));
ok("Anchorage listed for removal", !!anchChip);
__fire(anchChip, "click", {}); // remove it
eq("removal restores the exact map", X.exportJSON(), baseExport);
__fire($("btnSaveLocal"), "click", {});
eq("saved to storage", localStorage.getItem("mondiala-city"), baseExport);
X.importJSON(filledExport); // dirty the state…
__fire($("btnLoadLocal"), "click", {});
eq("load from browser restores baseline", X.exportJSON(), baseExport);

// ---------- 9 · pool, paint, inspector ----------
section("9 · pool, paint, inspector");
X.importJSON(baselineExport); // clean slate for this section
eq("pool chips rendered", document.querySelectorAll(".poolname").length, 179);
const tokyoEl = [...document.querySelectorAll(".poolname")].find(el => el.textContent === "Jakarta");
ok("Jakarta in the pool", !!tokyoEl);
__fire(tokyoEl, "click", {}); // arm
eq("Jakarta armed", X.armedPoolName, "Jakarta");
const spoke6 = keyOf(6, 3); // spoke hexes accept armed placement — there is no spoke guard on placing
__fire($("map"), "click", { target: document.querySelector('[data-key="' + spoke6 + '"]') });
eq("Jakarta placed on 6#3", X.hexes[spoke6].name, "Jakarta");
eq("Jakarta left the pool", X.pool.some(p => p.name === "Jakarta"), false);
eq("unarmed after placing", X.armedPoolName, null);
X.selected = spoke6;
X.showInspector();
$("iStyle").value = "Test style";
$("iNotes").value = "Test note";
__fire($("iApply"), "click", {});
ok("inspector edits stick", X.hexes[spoke6].style === "Test style" && X.hexes[spoke6].notes === "Test note");
__fire($("modePaint"), "click", {});
eq("paint mode on", X.paintMode, true);
const plazaChip = [...document.querySelectorAll(".typechip")].find(el => (el.innerHTML || "").toLowerCase().includes("plaza"));
ok("plaza chip exists", !!plazaChip);
__fire(plazaChip, "click", {}); // arm the brush
const mid5 = keyOf(5, 2);
__fire($("map"), "click", { target: document.querySelector('[data-key="' + mid5 + '"]') });
eq("paint plaza", X.hexes[mid5].type, "plaza");
__fire($("modeSelect"), "click", {});
eq("select mode back", X.paintMode, false);
X.selected = keyOf(1, 1);
X.showInspector();
ok("PCODE label", $("inspector").innerHTML.includes("1 China 1"));

// ---------- 10 · pan / zoom / click-guard ----------
section("10 · pan / zoom / click-guard");
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
const parisEl = document.querySelector('[data-key="' + keyOf(1, 1) + '"]');
__fire($("map"), "click", { target: parisEl });
eq("click suppressed while moved", X.selected, null);
X.moved = false;
__fire($("map"), "click", { target: parisEl });
eq("click selects when still", X.selected, keyOf(1, 1));
// zoom in shrinks the view; zooming out can never shrink past the full-city view
X.moved = false;
__fire(svg, "wheel", { deltaY: -120 });
ok("zoom-in changes the view", X.viewBox.w < fit.w);
for (let i = 0; i < 40; i++) __fire(svg, "wheel", { deltaY: 300 }); // a hard flick still only gentle steps
ok("zoom-out floor is the city view", X.viewBox.w >= fit.w - 1e-6);
X.viewBox = X.cityViewBox();
X.refresh();

// ---------- 11 · DATA.md consistency ----------
section("11 · DATA.md consistency");
X.importJSON(baselineExport);
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
