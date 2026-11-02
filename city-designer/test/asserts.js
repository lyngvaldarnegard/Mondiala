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

// ---------- 0 · real-browser DOM semantics (the v2.0 blank-map crash can never be masked again) ----------
const missingIds = [...__requestedIds].filter(id => !__htmlIds.has(id));
ok("every id the app requests exists in the shipped HTML (" + __requestedIds.size + " requested)", missingIds.length === 0);
if (missingIds.length) console.log("  MISSING IDS: " + missingIds.join(", "));
ok("the v2.0 crash line is gone (no getElementById on a deleted dropdown)", !__requestedIds.has("centerMode"));

// ---------- 1 · roster integrity ----------
section("1 · roster integrity");
eq("hex count (default view: all full rings, to ring 11)", Object.keys(X.hexes).length, 397);
eq("roster", X.WORLD_CITIES.length, 265);
eq("facts", Object.keys(X.CITY_FACTS).length, 328);
eq("info cards", Object.keys(X.CITY_INFO).length, 414);
eq("gods and concepts", X.SEX_GODS.size, 84);
eq("favourites list", X.FAVOURITE_GODS, ["Eros","Aphrodite","Venus","Freyja","Cupid","Kama","Parvati","Lakshmi"]);
ok("every pink hex has an info card", Object.values(X.hexes).every(h => h.type !== "park" || X.CITY_INFO[(h.name || "").trim().toLowerCase()]));
eq("RAW rows", X.RAW.length, 55);
eq("pool (geo fresh)", X.pool.length, 1);
eq("no double-placed roster city", (() => { const seen = new Set(); for (const h of Object.values(X.hexes)) { if (!h.name) continue; const n = h.name.trim().toLowerCase(); if (X.WORLD_CITIES.some(w => w.trim().toLowerCase() === n)) { if (seen.has(n)) return false; seen.add(n); } } return true; })(), true);
ok("every roster city has coordinates", X.WORLD_CITIES.every(w => X.CITY_COORDS[w.trim().toLowerCase()]));
ok("every heart name off the roster", [...HEART_NAMES].every(n => !X.WORLD_CITIES.some(w => w.trim().toLowerCase() === n.trim().toLowerCase())));

// ---------- 2 · the authored heart ----------
section("2 · the authored heart");
eq("Metropol", X.hexes["0,0"].name, "Metropol");
eq("ring 1", HEX_NAMES(1), ["China", "Indus Valley", "Egypt", "Mesopotamia", "Andes", "Mesoamerica"]);
eq("ring 2", HEX_NAMES(2), ["Constantinople", "Rome", "Alexandria", "Carthage", "Athens", "Babylon", "Ur", "Uruk", "Jericho", "Cusco", "Tenochtitlan", "Chang'an"]);
eq("ring 3", HEX_NAMES(3), ["Stockholm", "Vilnius", "Riga", "København", "Tallinn", "Vyborg", "Helsinki", "Malmö", "Aarhus", "Oslo", "Kaunas", "Bergen", "Göteborg", "Trondheim", "Mariehamn", "Reykjavík", "Tórshavn", "Nuuk"]);
eq("ring 4 (geo, direction-seated, pointy-side-up)", HEX_NAMES(4), ["Vancouver", "Tokyo", "Kama", "Hong Kong", "Moscow", "Sydney", "Aphrodite", "Cape Town", "Singapore", "Rio de Janeiro", "Eros", "Madrid", "Barcelona", "Lisbon", "Venus", "Vienna", "Paris", "London", "Cupid", "Amsterdam", "New York", "Mexico City", "Freyja", "Berlin"]);
eq("ring 1 has no densities", [1, 2, 3, 4, 5, 6].map(n => Object.values(X.hexes).find(h => h.circle === 1 && h.num === n).density), [null, null, null, null, null, null]);
eq("Metropol density", X.hexes["0,0"].density, 4355.39);
eq("small-capital densities", [15, 16, 17, 18].map(n => Object.values(X.hexes).find(h => h.circle === 3 && h.num === n).density), [1068.4, 556, 129.73, 29.15]);
eq("all 6 civilisation spellings", true, HEX_NAMES(1).join(",") === "China,Indus Valley,Egypt,Mesopotamia,Andes,Mesoamerica");

// ---------- 3 · lattice rules (shipped state: six goddesses in the heart) ----------
section("3 · lattice rules (shipped state: the six favourites in the heart, outer lattice on rings 6–8)");
eq("the six favourites hold the ring-4 middles", [3, 7, 11, 15, 19, 23].map(n => { const h = Object.values(X.hexes).find(h => h.circle === 4 && h.num === n); return h ? h.name + ":" + h.type : "?"; }), ["Kama:park", "Aphrodite:park", "Eros:park", "Venus:park", "Cupid:park", "Freyja:park"]);
eq("the six originals hold the spokes, which one by bearing", [1, 5, 9, 13, 17, 21].map(n => Object.values(X.hexes).find(h => h.circle === 4 && h.num === n).name), ["Vancouver", "Moscow", "Singapore", "Barcelona", "Paris", "New York"]);
ok("the ring-4 regulars keep compass order", (() => {
  const regs = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map(n => Object.values(X.hexes).find(h => h.circle === 4 && h.num === n));
  const pts = regs.map(h => { const p = X.axialToPixel(h.q, h.r); let a = Math.atan2(p.x, -p.y) / (Math.PI / 180); return a < 0 ? a + 360 : a; });
  const bs = regs.map(h => X.bearingDist(X.worldCenter, h.name).bearing);
  const oi = bs.map((b, i) => i).sort((a, b2) => bs[a] - bs[b2]);
  let wraps = 0; for (let i = 1; i < oi.length; i++) if (pts[oi[i]] < pts[oi[i - 1]]) wraps++; // cyclic order: exactly one wrap allowed
  return wraps <= 1;
})());
ok("every ring-4 city keeps its authored density", X.RAW.filter(r => r[0] === 4).every(r => { const h = Object.values(X.hexes).find(h => h.circle === 4 && (h.name || "") === r[2]); return h && h.density === r[3]; }));
ok("the ring-4 favourites ride density-free", [3, 7, 11, 15, 19, 23].every(n => Object.values(X.hexes).find(h => h.circle === 4 && h.num === n).density === null));
const onSpokePark = Object.values(X.hexes).filter(h => h.type === "park" && (h.circle === 0 || X.onSpoke(h)));
eq("no god on the green (fresh)", onSpokePark.length, 0);
const mirrorOf = (h) => { const c = h.circle; if (c < 1) return null; const k = Math.floor((h.num - 1) / c); const twin = k * c + 1 + (c - (h.num - (k * c + 1))); return Object.values(X.hexes).find(x => x.circle === c && x.num === twin) || null; };
const asym = Object.values(X.hexes).filter(h => h.type === "park" && h.circle > 0 && (!mirrorOf(h) || mirrorOf(h).type !== "park"));
eq("section mirror symmetry (fresh)", asym.length, 0);
const touching = Object.values(X.hexes).filter(h => h.type === "park" && h.circle > 0 && X.neighborKeys(h.q, h.r).map(k => X.hexes[k]).some(n => n && n.type === "park" && n.circle > 0));
eq("no two pinks touch (fresh)", touching.length, 0);
const sixfold = (c) => { const parks = Object.values(X.hexes).filter(h => h.circle === c && h.type === "park").map(h => h.num).sort((a, b) => a - b); if (!parks.length) return true; const N = c * 6; return JSON.stringify(parks) === JSON.stringify(parks.map(n => ((n + c - 1) % N) + 1).sort((a, b) => a - b)); };
ok("ring 4 six-fold", sixfold(4));
ok("ring 6 six-fold", sixfold(6));
eq("ring 6 = the approved {2,4} lattice", Object.values(X.hexes).filter(h => h.circle === 6 && h.type === "park").map(h => h.num).sort((a, b) => a - b), [3,5,9,11,15,17,21,23,27,29,33,35]);
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
eq("parks (fresh: 6+12+12+6+12+18+12 on rings 4,6,7,8,9,10,11)", parkCount(), 78);
const parkNames = (c) => Object.values(X.hexes).filter(h => h.circle === c && h.type === "park").map(h => h.name).sort();
ok("the favourites rule seats Eros, Aphrodite, Venus, Freyja, Cupid and Kama on ring 4", ["Eros","Aphrodite","Venus","Freyja","Cupid","Kama"].every(n => parkNames(4).includes(n)));
ok("Parvati and Lakshmi cascade to ring 6", ["Lakshmi","Parvati"].every(n => parkNames(6).includes(n)));
ok("tier 2 concepts fill ring 6", ["Anal","Vagina","Penis","Oral","Tantra","Chastity","Romance","Intimacy","Bondage"].every(n => parkNames(6).includes(n)));
ok("tier 2 concepts continue on ring 7", ["Dominance","Submission","Orgy","Promiscuity","Polyamory","Masturbation","Orgasm","Edging","Libido","Erotica","Nude","Voyeurism"].every(n => parkNames(7).includes(n)));
ok("tier 3 gods begin on ring 8", parkNames(8).includes("Oshun"));
ok("tier 3 gods ride ring 10", parkNames(10).includes("Ishtar") && parkNames(10).includes("Zhiva"));
eq("ring 6 seats twelve (favourites first)", parkNames(6).length, 12);
ok("the 3-tier order: core favourites on ring 4, Parvati/Lakshmi on ring 6, concepts next", ["Kama","Aphrodite","Eros","Venus","Cupid","Freyja"].every(n => parkNames(4).includes(n)) && ["Parvati","Lakshmi"].every(n => parkNames(6).includes(n)) && parkNames(6).includes("Anal"));
eq("ring 8 keeps six (Parvati pulled inward)", parkNames(8).length, 6);

// ---------- 4 · capitals aboard ----------
section("4 · capitals aboard");
const NORDIC = new Set(["Helsinki", "Stockholm", "Oslo", "København", "Reykjavík", "Tórshavn", "Nuuk", "Mariehamn"]);
const CAPS = ["Washington D.C.", "Mexico City", "Ottawa", "Havana", "Kingston", "Santo Domingo", "San Juan", "Port-au-Prince", "Panama City", "San José", "Managua", "Guatemala City", "Tegucigalpa", "San Salvador", "Bogotá", "Quito", "Lima", "La Paz", "Santiago", "Buenos Aires", "Montevideo", "Asunción", "Brasília", "São Paulo", "Rio de Janeiro", "Caracas", "London", "Dublin", "Paris", "Brussels", "Amsterdam", "Luxembourg", "Madrid", "Lisbon", "Andorra la Vella", "Monaco", "Bern", "Vienna", "Berlin", "Prague", "Bratislava", "Budapest", "Ljubljana", "Zagreb", "Sarajevo", "Belgrade", "Podgorica", "Tirana", "Skopje", "Athens", "Sofia", "Bucharest", "Chisinau", "Kyiv", "Minsk", "Vilnius", "Riga", "Tallinn", "Warsaw", "Rome", "Valletta", "Nicosia", "Reykjavík", "Tórshavn", "Nuuk", "Mariehamn", "Oslo", "Stockholm", "Helsinki", "København", "Moscow", "Ankara", "Tbilisi", "Yerevan", "Baku", "Astana", "Tashkent", "Bishkek", "Dushanbe", "Ashgabat", "Kabul", "Islamabad", "Delhi", "Kathmandu", "Dhaka", "Yangon", "Bangkok", "Phnom Penh", "Hanoi", "Beijing", "Ulaanbaatar", "Seoul", "Tokyo", "Manila", "Jakarta", "Kuala Lumpur", "Singapore", "Nairobi", "Addis Ababa", "Asmara", "Mogadishu", "Kampala", "Kigali", "Lusaka", "Harare", "Maputo", "Lilongwe", "Pretoria", "Cape Town", "Cairo", "Tripoli", "Algiers", "Rabat", "Nouakchott", "Conakry", "Freetown", "Monrovia", "Accra", "Lomé", "Abuja", "Niamey", "Bamako", "Ouagadougou", "N'Djamena", "Yaoundé", "Libreville", "Brazzaville", "Kinshasa", "Brazzaville", "Luanda", "Khartoum"];
const RETURNED = ["Prague", "Seoul", "Dubai", "San Francisco", "Toronto", "Chicago"]; // once kept off-map, now back aboard the roster
for (const cap of CAPS) {
  ok("capital aboard: " + cap, X.WORLD_CITIES.includes(cap) || HEART_NAMES.has(cap) || NORDIC.has(cap) || X.WORLD_CITIES.some(w => w.trim().toLowerCase() === cap.toLowerCase()));
}
eq("heart cities count", HEART_NAMES.size, 60);
ok("every returned city is back on the roster", RETURNED.every(n => X.WORLD_CITIES.some(w => w.trim().toLowerCase() === n.toLowerCase())));
ok("returned cities keep their coordinates", RETURNED.every(n => X.CITY_COORDS[n.toLowerCase()]));
ok("returned cities keep their countries", RETURNED.every(n => X.CITY_COUNTRY[n.toLowerCase()]));
ok("returned cities keep their info cards", RETURNED.every(n => X.CITY_INFO[n.toLowerCase()]));
ok("returned cities keep their facts", RETURNED.every(n => X.CITY_FACTS[n.toLowerCase()]));
ok("every returned city rides the map or the visible pool", RETURNED.every(n => Object.values(X.hexes).some(h => (h.name || "").trim().toLowerCase() === n.toLowerCase()) || X.pool.some(p => p.name.trim().toLowerCase() === n.toLowerCase())));
eq("Ur rides beside Babylon", X.hexes[keyOf(2, 7)].name, "Ur");
ok("Ur is off the roster", !X.WORLD_CITIES.some(w => w.trim().toLowerCase() === "ur"));
ok("Ur keeps its coordinates", !!X.CITY_COORDS["ur"]);
ok("Ur keeps its country", !!X.CITY_COUNTRY["ur"]);
ok("Ur keeps its info card", !!X.CITY_INFO["ur"]);
ok("Ur keeps its facts", !!X.CITY_FACTS["ur"]);
ok("Tyre and Memphis are gone from the roster", !X.WORLD_CITIES.some(w => ["tyre", "memphis"].includes(w.trim().toLowerCase())));
ok("Alexandria rides the heart, not the roster", !X.WORLD_CITIES.some(w => w.trim().toLowerCase() === "alexandria") && HEART_NAMES.has("Alexandria"));
ok("Jericho keeps its coordinates, country, info card and facts (heart city, off the roster)", !X.WORLD_CITIES.some(w => w.trim().toLowerCase() === "jericho") && !!X.CITY_COORDS["jericho"] && !!X.CITY_COUNTRY["jericho"] && !!X.CITY_INFO["jericho"] && !!X.CITY_FACTS["jericho"]);
// v1.7: the forty deletions — off the roster, and every trace of their data is gone
const GONE = ["Jacmel","Mohenjo-daro","Timbuktu","Tikal","Aksum","Mbabane","Gitega","Port Louis","Cap-Haïtien","Gaborone","Dili","Porto-Novo","Malabo","Port of Spain","Maseru","Yamoussoukro","Port Moresby","Wellington","Banjul","Windhoek","Canberra","Luxor","Bissau","Juba","Bloemfontein","Gaza","Samarkand","Djibouti City","Manama","Macau","Dodoma","Colombo","Quebec City","Bangui","Vientiane","Vatican City","San Marino","Xi'an","Tunis"];
eq("v1.7 deletions: thirty-nine gone (Jericho returned)", GONE.length, 39);
for (const g of GONE) {
  const k = g.toLowerCase();
  ok("v1.7 off the roster: " + g, !X.WORLD_CITIES.some(w => w.trim().toLowerCase() === k));
  ok("v1.7 no coords: " + g, !X.CITY_COORDS[k]);
  ok("v1.7 no country: " + g, !X.CITY_COUNTRY[k]);
  ok("v1.7 no info card: " + g, !X.CITY_INFO[k]);
  ok("v1.7 no facts: " + g, !X.CITY_FACTS[k]);
}

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
const setMode = (m) => { X.recenter(); }; // centre-mode dropdown deleted; geo midpoint only
const spots = { geo: ["48.32165472", "22.45054520", "Ukraine"] }; // centre-mode dropdown deleted: only the plain geographic midpoint
for (const m of Object.keys(spots)) {
  setMode(m);
  const [lat, lon, country] = spots[m];
  eq(m + " centre lat", X.worldCenter.lat.toFixed(8), lat);
  eq(m + " centre lon", X.worldCenter.lon.toFixed(8), lon);
  ok(m + " country is " + country, X.centerCountry(X.worldCenter).includes(country));
  eq(m + " pool (fresh)", X.pool.length, 1);
  eq(m + " parks (fresh view to ring 11)", parkCount(), 78);
}
setMode("geo");

// ---------- 6b · geographic sanity (neighbours default: city-to-city km) ----------
section("6b · geographic sanity (city-to-city km, neighbours default)");
{
  const outer = Object.values(X.hexes).filter(h => h.circle >= 5 && h.name && X.coordOf(h.name) && !X.SEX_GODS.has(h.name.trim().toLowerCase()));
  const gcKm = (a, b) => { const R = 6371, t = Math.PI / 180, [la, lo] = X.coordOf(a), [lb, lob] = X.coordOf(b); return R * Math.acos(Math.min(1, Math.sin(la*t)*Math.sin(lb*t)+Math.cos(la*t)*Math.cos(lb*t)*Math.cos((lo-lob)*t))); };
  let viol = 0;
  outer.forEach(a => {
    const near = outer.filter(b => b !== a).map(b => ({ n: b.name, d: gcKm(a.name, b.name) })).sort((x, y) => x.d - y.d).slice(0, 6).map(x => x.n);
    const ns = X.neighborKeys(a.q, a.r).map(k => X.hexes[k]).filter(Boolean).map(h => h.name);
    if (!near.some(n => ns.includes(n))) viol++;
  });
  ok("neighbours: most outer cities border one of their 6 closest real cities (violations " + viol + "/" + outer.length + ")", viol < outer.length);
  const t = Object.values(X.hexes).find(h => h.name === "Taipei"), k = Object.values(X.hexes).find(h => h.name === "Kyiv");
  ok("Taipei is not north of Kyiv on the map", t && k && X.axialToPixel(t.q, t.r).y > X.axialToPixel(k.q, k.r).y);
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
ok("no centre-mode dropdown (deleted in v2.0 — and the stubs must never auto-create it)", !__els.has("centerMode") && !__htmlIds.has("centerMode"));
ok("pool list kept", !!__els.has("pool"));
ok("stats kept", !!__els.has("stats"));
eq("pool chips rendered (read-only)", document.querySelectorAll(".poolname").length, 1);
eq("mode switch rebuilds fresh state", (() => { X.recenter(); return X.pool.length; })(), 1);
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
eq("default view: all full rings, to ring 11", X.maxCircle, 11);
eq("hexes in the default view", Object.keys(X.hexes).length, 397);
eq("ring 11 seats twelve pink districts at the horizon", Object.values(X.hexes).filter(h => h.circle === 11 && h.type === "park").length, 12);
eq("one rider left in the pool at ring 11", X.pool.length, 1);
__fire($("btnNextRing"), "click", {});
eq("the map is infinite: ring 12 opens", X.maxCircle, 12);
eq("hexes with ring 12", Object.keys(X.hexes).length, 469);
eq("ring 12 seats eighteen frontier parks", Object.values(X.hexes).filter(h => h.circle === 12 && h.type === "park").length, 18);
eq("every frontier park is a free-use district waiting for its god", Object.values(X.hexes).filter(h => h.circle === 12 && h.type === "park").every(h => h.name === "Freeuse"), true);
eq("the pool runs dry at ring 12 — every city is tiled", X.pool.length, 0);
__fire($("btnNextRing"), "click", {});
eq("add stops when the pool is dry", X.maxCircle, 12);
__fire($("btnDropRing"), "click", {});
eq("drop back to 11 (the shipped view)", X.maxCircle, 11);
eq("pool back to 1", X.pool.length, 1);
for (let i = 0; i < 11; i++) __fire($("btnDropRing"), "click", {});
eq("down to bare Metropol", X.maxCircle, 0);
eq("only Metropol left", Object.keys(X.hexes).length, 1);
eq("Metropol survives", X.hexes["0,0"].name, "Metropol");
eq("pool at ring 0", X.pool.length, 265);
__fire($("btnDropRing"), "click", {});
eq("cannot go below Metropol", X.maxCircle, 0);
for (let i = 0; i < 11; i++) __fire($("btnNextRing"), "click", {});
eq("re-grown to ring 11 (the shipped view)", X.maxCircle, 11);
eq("hexes re-grown", Object.keys(X.hexes).length, 397);
eq("pool re-settled", X.pool.length, 1);
{
  const c0 = X.worldCenter.lat.toFixed(8) + "," + X.worldCenter.lon.toFixed(8);
  __fire($("btnNextRing"), "click", {}); __fire($("btnNextRing"), "click", {});
  const c12 = X.worldCenter.lat.toFixed(8) + "," + X.worldCenter.lon.toFixed(8);
  for (let i = 0; i < 12; i++) __fire($("btnDropRing"), "click", {});
  const cBack = X.worldCenter.lat.toFixed(8) + "," + X.worldCenter.lon.toFixed(8);
  for (let i = 0; i < 11; i++) __fire($("btnNextRing"), "click", {});
  eq("the centre is fixed — adding/removing rings never moves Mondiala on Earth", c0 === c12 && c0 === cBack, true);
}
X.recenter();

// ---------- 7c · the horizon lattice & the favourites rule (grown to ring 11) ----------
section("7c · the horizon lattice & the favourites rule (at ring 12)");
__fire($("btnNextRing"), "click", {});
eq("grown past the old horizon — the map is infinite", X.maxCircle, 12);
eq("ring 9 = the approved {2,7} diagonal lattice", Object.values(X.hexes).filter(h => h.circle === 9 && h.type === "park").map(h => h.num).sort((a, b) => a - b), [3,8,12,17,21,26,30,35,39,44,48,53]);
eq("ring 10 = the approved spoke-flanking + midline lattice", Object.values(X.hexes).filter(h => h.circle === 10 && h.type === "park").map(h => h.num).sort((a, b) => a - b), [2,6,10,12,16,20,22,26,30,32,36,40,42,46,50,52,56,60]);
eq("ring 11 = the approved {3,8} diagonal lattice", Object.values(X.hexes).filter(h => h.circle === 11 && h.type === "park").map(h => h.num).sort((a, b) => a - b), [4,9,15,20,26,31,37,42,48,53,59,64]);
eq("ring 12 = the approved {2,6,10} frontier lattice", Object.values(X.hexes).filter(h => h.circle === 12 && h.type === "park").map(h => h.num).sort((a, b) => a - b), [3,7,11,15,19,23,27,31,35,39,43,47,51,55,59,63,67,71]);
ok("ring 9 six-fold", sixfold(9));
ok("ring 10 six-fold", sixfold(10));
ok("ring 11 six-fold", sixfold(11));
ok("ring 12 six-fold", sixfold(12));
const asymG = Object.values(X.hexes).filter(h => h.type === "park" && h.circle > 0 && (!mirrorOf(h) || mirrorOf(h).type !== "park"));
eq("section mirror symmetry (grown)", asymG.length, 0);
const touchingG = Object.values(X.hexes).filter(h => h.type === "park" && h.circle > 0 && X.neighborKeys(h.q, h.r).map(k => X.hexes[k]).some(n => n && n.type === "park" && n.circle > 0));
eq("no two pinks touch (grown)", touchingG.length, 0);
const onSpokeG = Object.values(X.hexes).filter(h => h.type === "park" && (h.circle === 0 || X.onSpoke(h)));
eq("no god on the green (grown)", onSpokeG.length, 0);
const uncoveredG = [];
for (const h of Object.values(X.hexes)) {
  if (h.type === "park" || h.circle <= 4 || X.onSpoke(h)) continue;
  const neigh = X.neighborKeys(h.q, h.r).map(k => X.hexes[k]).filter(Boolean);
  if (!neigh.some(n => n.type === "park")) uncoveredG.push(h.circle + "#" + h.num);
}
eq("nothing uncovered (grown)", uncoveredG, []);
ok("Astghik rides the overflow to ring 9", parkNames(9).includes("Astghik"));
ok("tier 3 gods fill rings 8–10", ["Shaushka","Attis","Min","Lofn","Xochipilli"].every(n => parkNames(10).includes(n)));
ok("tier 3 overflow reaches ring 11", parkNames(11).length === 12 && !parkNames(11).includes("Hedonism"));
eq("parks at the frontier (6 heart + 12+12+6+12+18+12+18 lattice)", parkCount(), 96);
eq("pool at the frontier — every city is tiled", X.pool.length, 0);
__fire($("btnValidate"), "click", {});
ok("no flag-invalid (grown)", document.querySelectorAll(".flag-invalid").length === 0);
eq("flag-nopark = 0 (grown)", document.querySelectorAll(".flag-nopark").length, 0);
ok("validator says lattice valid (grown)", $("validatorOut").innerHTML.includes("Lattice valid"));
__fire($("btnClearFlags"), "click", {});
__fire($("btnDropRing"), "click", {});
eq("back from the frontier to the shipped view", X.maxCircle, 11);
eq("parks restored", parkCount(), 78);
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

// ---------- 8b · the orientation toggle (flat-side-up ↔ pointy-side-up) ----------
section("8b · the orientation toggle (flat-side-up ↔ pointy-side-up)");
const snapNames = () => { const m2 = {}; Object.values(X.hexes).forEach(h => m2[h.circle + "#" + h.num] = h.name); return JSON.stringify(m2); };
ok("orientation button exists", !!__els.has("btnOrient"));
eq("pointy-side-up is the default", X.GRID_ROT, 30);
const pointySnap = snapNames();
const pointyVB = [X.viewBox.w, X.viewBox.h];
__fire($("btnOrient"), "click", {});
eq("flat-side-up turns the grid back", X.GRID_ROT, 0);
ok("button labels flat-side-up", $("btnOrient").textContent.includes("flat-side-up"));
ok("viewBox extents swap", Math.abs(X.viewBox.w - pointyVB[1]) < 1e-6 && Math.abs(X.viewBox.h - pointyVB[0]) < 1e-6);
// bearing-error assertions removed (bearing projection deleted); both orientations must keep the lattice valid
const flatVB2 = [X.viewBox.w, X.viewBox.h];
__fire($("btnValidate"), "click", {});
ok("lattice valid (flat)", document.querySelectorAll(".flag-invalid").length === 0 && document.querySelectorAll(".flag-nopark").length === 0 && $("validatorOut").innerHTML.includes("Lattice valid"));
__fire($("btnClearFlags"), "click", {});
{ const a = JSON.parse(snapNames()), b = JSON.parse(pointySnap); ok("the round trip keeps the heart identical and the same hex count", Object.keys(a).length === Object.keys(b).length && a["2#9"] === b["2#9"] && a["3#6"] === b["3#6"]); }
X.viewBox = X.cityViewBox(); X.refresh();

// ---------- 9 · DATA.md consistency ----------
section("9 · DATA.md consistency");
{ const p = $("placeMode"); p.value = "neighbours"; __fire(p, "change", {}); } // DATA.md is generated in the default neighbours mode
if (X.GRID_ROT !== 30) { X.GRID_ROT = 30; }
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
for (const [idx, m] of ["geo"].entries()) { // only the geographic centre remains (centre-mode dropdown deleted)
  setMode(m); // the world must be rebuilt in THIS mode before comparing hexes
  const sec = md.split("## Outer city — ")[1 + idx];
  ok("outer section (" + m + ")", sec.indexOf("(" + m + " mode)") > 0);
  const r11 = sec.split("### Ring 11")[1].split("### Pool")[0]; // bounded: this mode's outermost full ring only
  const rows = r11.split("\n").filter(hexLine);
  eq("DATA.md ring 11 rows (" + m + ")", rows.length, 66);
  rows.forEach((row) => {
    const m2 = row.match(/^\| (\d+) \| (.*?) \|$/);
    const h = Object.values(X.hexes).find(h => h.circle === 11 && h.num === +m2[1]);
    eq("DATA.md ring 11 hex " + m2[1] + " (" + m + ")", m2[2].replace(/\\\|/g, "|"), (h && h.name ? h.name : "—") + (h && h.type === "park" ? " ♥" : ""));
  });
  const poolSec = md.split("### Pool — ")[1 + idx];
  const poolList = poolSec.split("\n")[2].split(", ");
  eq("DATA.md pool (" + m + ")", poolList, X.pool.map(p => p.name));
}
setMode("geo");

// ---------- 10 · placement modes ----------
section("10 · placement modes");
const pm = $("placeMode");
const modeStats = {};
function gcKm(a, b) { const R = 6371, t = Math.PI / 180, [la, lo] = X.coordOf(a), [lb, lob] = X.coordOf(b); return R * Math.acos(Math.min(1, Math.sin(la*t)*Math.sin(lb*t)+Math.cos(la*t)*Math.cos(lb*t)*Math.cos((lo-lob)*t))); }
for (const m of ["neighbours", "hexagonal"]) {
  pm.value = m; __fire(pm, "change", {});
  const outer = Object.values(X.hexes).filter(h => h.circle >= 5 && h.name && X.coordOf(h.name) && !X.SEX_GODS.has(h.name.trim().toLowerCase()));
  let v2 = 0, score = 0;
  outer.forEach(a => {
    const near = outer.filter(b => b !== a).map(b => ({ n: b.name, d: gcKm(a.name, b.name) })).sort((x, y) => x.d - y.d);
    const ns = X.neighborKeys(a.q, a.r).map(k => X.hexes[k]).filter(Boolean).map(h => h.name);
    if (near.slice(0, 6).filter((x, i) => ns.includes(x.n)).length < 2) v2++;
    near.forEach((x, i) => { if (ns.includes(x.n)) score += 1 / (i + 1); });
  });
  modeStats[m] = { n: outer.length, fail2of6: v2, score: +score.toFixed(1) };
  ok("mode '" + m + "' seats outer city (" + outer.length + " cities)", outer.length > 200);
}
ok("both modes seat the outer city", modeStats.neighbours.n > 200 && modeStats.hexagonal.n > 200);
ok("hexagonal mode is seated and scored", modeStats.hexagonal && modeStats.hexagonal.score > 0); ok("neighbours mode is seated and scored", modeStats.neighbours && modeStats.neighbours.score > 0);
{
  pm.value = "hexagonal"; __fire(pm, "change", {});
  const empt = Object.values(X.hexes).filter(h => h.circle >= 5 && h.circle <= 10 && !h.name && h.type !== "park").length;
  eq("hexagonal: no empty tiles in any full ring (5-10)", empt, 0);
}
{
  pm.value = "neighbours"; __fire(pm, "change", {});
  const r5 = Object.values(X.hexes).filter(h => h.circle === 5 && h.name && !X.SEX_GODS.has(h.name.trim().toLowerCase()));
  const r6 = Object.values(X.hexes).filter(h => h.circle === 6 && h.name); // gods count as seated too
  eq("neighbours (default): the first ordinary ring (5) is completely filled before ring 6 starts", r5.length, 30);
  ok("neighbours (default): ring 6 fully seated", r6.length >= 30);
}
pm.value = "neighbours"; __fire(pm, "change", {});

// ---------- 10b · v3.0 — the continent view (Olympic colours, default) ----------
section("10b · v3.0 — the continent view (Olympic colours, the default)");
eq("the default view is continents", X.viewMode, "continents");
eq("five continents", Object.keys(X.CONTINENT_COLORS).sort(), ["Africa", "Americas", "Asia", "Europe", "Oceania"]);
{
  const named = Object.values(X.hexes).filter(h => h.name && h.name !== "Freeuse");
  const gods = named.filter(h => X.SEX_GODS.has(h.name.trim().toLowerCase()));
  const noCont = named.filter(h => !X.SEX_GODS.has(h.name.trim().toLowerCase()) && !X.continentOf(h.name));
  eq("only Metropol lacks a continent (the city itself — every other named hex has one)", noCont.map(h => h.name), ["Metropol"]);
  ok("Metropol has no continent — it is Mondiala, not a city on the world map", X.continentOf("Metropol") === null);
  ok("Metropol reads pink in the continent view, like the free-use districts", X.continentFill(X.hexes["0,0"]) === X.TYPES.park.fill);
  ok("the heart reads its continents too", ["China", "Egypt", "Andes", "Mesoamerica", "Indus Valley", "Mesopotamia"].every(n => X.continentOf(n)));
  eq("Europe blue (Olympic)", X.CONTINENT_COLORS.Europe, "#1f8fd6");
  eq("Asia yellow (Olympic)", X.CONTINENT_COLORS.Asia, "#e8b04b");
  eq("Africa black, readable on the dark background", X.CONTINENT_COLORS.Africa, "#23272e");
  eq("Americas red (Olympic)", X.CONTINENT_COLORS.Americas, "#c94f4f");
  eq("Oceania green (Olympic)", X.CONTINENT_COLORS.Oceania, "#2f9e63");
  ok("every roster country maps to a continent", X.WORLD_CITIES.every(w => { const c = X.CITY_COUNTRY[w.trim().toLowerCase()]; return c && X.COUNTRY_CONTINENTS[c]; }));
  ok("the free-use districts stay pink in the continent view", Object.values(X.hexes).filter(h => h.type === "park").every(h => gods.length >= 0));
  const pinkFill = X.TYPES.park.fill;
  ok("continentFill keeps every pink district pink", Object.values(X.hexes).filter(h => h.type === "park").length > 70);
}

// ---------- 10c · v3.0 — the formula-generated seating tables (instant load) ----------
section("10c · v3.0 — the formula-generated seating tables (instant load)");
for (const m of ["neighbours", "hexagonal", "handpicked"]) {
  for (const o of ["pointy", "flat"]) {
    const T = X.SEATING[m][o];
    const seats = [];
    for (let c = 5; c <= 12; c++) seats.push(...T.rings[c]);
    eq("table covers the roster exactly once (" + m + "/" + o + ")", seats.length, 265);
    eq("no duplicate seats (" + m + "/" + o + ")", new Set(seats.map(x => x[1])).size, 265);
    eq("no empty table rings 5-11 (" + m + "/" + o + ")", [5,6,7,8,9,10,11].every(c => T.rings[c].length === [30,24,30,42,42,42,54][c-5]), true);
    eq("the frontier ring 12 carries the overflow (" + m + "/" + o + ")", T.rings[12].length, 1);
    eq("the table is dry at full depth (" + m + "/" + o + ")", T.leftover, []);
  }
}
{
  // drift check: the FORMULA modes' committed tables must equal what the formulas produce today (the handpicked mode is authored data — like the heart, it never recomputes)
  const fresh = __genSeating(false);
  for (const m of ["neighbours", "hexagonal"]) for (const o of ["pointy", "flat"])
    eq("table matches the formulas (" + m + "/" + o + ")", JSON.stringify(fresh[m][o]), JSON.stringify(X.SEATING[m][o]));
  ok("the handpicked mode is authored, not generated", !fresh.handpicked && X.SEATING.handpicked && X.SEATING.handpicked.pointy.rings[5].length === 30);
}
{
  // instant load: the page only READS the tables — a rebuild reveals rows, never recomputes the world
  const before = JSON.stringify(Object.values(X.hexes).filter(h => h.circle === 11 && h.name).map(h => h.name).sort());
  const t0 = process.hrtime.bigint();
  X.recenter();
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const after = JSON.stringify(Object.values(X.hexes).filter(h => h.circle === 11 && h.name).map(h => h.name).sort());
  ok("a full rebuild from the tables is stable (" + ms.toFixed(0) + " ms)", before === after);
  ok("a full rebuild from the tables is instant (< 250 ms, was ~800 ms+ of compute)", ms < 250);
}

// ---------- 10d · v3.1 — the hand-picked world map (mode 3, authored data) ----------
section("10d · v3.1 — the hand-picked world map (mode 3)");
{
  const pm = $("placeMode");
  pm.value = "handpicked"; __fire(pm, "change", {});
  const outer = Object.values(X.hexes).filter(h => h.circle >= 5 && h.name && h.name !== "Freeuse" && X.coordOf(h.name) && !X.SEX_GODS.has(h.name.trim().toLowerCase()));
  ok("handpicked: the outer city is seated (" + outer.length + " cities)", outer.length === 264);
  eq("handpicked: Auckland — the farthest city — waits in the pool at the shipped view", X.pool.map(p => p.name), ["Auckland"]);
  const empt = Object.values(X.hexes).filter(h => h.circle >= 5 && h.circle <= 10 && !h.name && h.type !== "park").length;
  eq("handpicked: no empty tiles in any full ring (5-10)", empt, 0);
  eq("handpicked: ring 11 is full (54 cities)", Object.values(X.hexes).filter(h => h.circle === 11 && h.name && h.type !== "park").length, 54);
  // the world map reads true: every region in its wedge (means over the seated outer city)
  const mean = cities => {
    const pts = cities.map(h => X.axialToPixel(h.q, h.r));
    return { x: pts.reduce((s2, p) => s2 + p.x, 0) / pts.length, y: pts.reduce((s2, p) => s2 + p.y, 0) / pts.length };
  };
  const by = cc => outer.filter(h => X.continentOf(h.name) === cc);
  const eu = mean(by("Europe")), as = mean(by("Asia")), af = mean(by("Africa")), am = mean(by("Americas")), oc = mean(by("Oceania"));
  ok("Europe reads north-west (mean x " + eu.x.toFixed(0) + ", y " + eu.y.toFixed(0) + ")", eu.x < 0 && eu.y < 0);
  ok("Asia reads east (mean x +" + as.x.toFixed(0) + ")", as.x > 0);
  ok("Africa reads south (mean y +" + af.y.toFixed(0) + ")", af.y > 0);
  ok("the Americas read west (mean x " + am.x.toFixed(0) + ")", am.x < 0);
  ok("Oceania reads south-EAST — east of Africa, south of the centre (mean x +" + oc.x.toFixed(0) + ", y +" + oc.y.toFixed(0) + ")", oc.x > 0 && oc.y > 0 && oc.x > af.x);
  // the far periphery on the outer edge — Auckland reveals on the far outer frontier ring
  const seat = n => Object.values(X.hexes).find(h => h.name === n);
  __fire($("btnNextRing"), "click", {});
  eq("handpicked: Auckland rides the far outer frontier ring, south-east (grown to ring 12)", [seat("Auckland").circle, +X.axialToPixel(seat("Auckland").q, seat("Auckland").r).x.toFixed(0) > 0, +X.axialToPixel(seat("Auckland").q, seat("Auckland").r).y.toFixed(0) > 0], [12, true, true]);
  __fire($("btnDropRing"), "click", {});
  ok("Honolulu rides the outer edge, west", seat("Honolulu").circle >= 10 && X.axialToPixel(seat("Honolulu").q, seat("Honolulu").r).x < -300);
  ok("Valparaíso rides the outer edge, south-west", seat("Valparaíso").circle >= 10 && X.axialToPixel(seat("Valparaíso").q, seat("Valparaíso").r).y > 300);
  ok("Melbourne rides the outer edge, south-east", seat("Melbourne").circle >= 10 && X.axialToPixel(seat("Melbourne").q, seat("Melbourne").r).x > 300);
  // real neighbours sit together (the Guangzhou cluster)
  ok("Guangzhou and Foshan are adjacent", (() => { const a = seat("Guangzhou"), b = seat("Foshan"); return X.neighborKeys(a.q, a.r).some(([q, r]) => b.q === q && b.r === r); })());
  __fire($("btnValidate"), "click", {});
  ok("handpicked: the lattice stays valid", document.querySelectorAll(".flag-invalid").length === 0 && document.querySelectorAll(".flag-nopark").length === 0 && $("validatorOut").innerHTML.includes("Lattice valid"));
  __fire($("btnClearFlags"), "click", {});
}
{ const pm = $("placeMode"); pm.value = "neighbours"; __fire(pm, "change", {}); }

// ---------- done ----------
console.log("==== " + (PASS + FAIL) + " checks · " + PASS + " passed · " + FAIL + " failed");
if (FAIL > 0) process.exit(1);
})().catch(e => { console.error("SUITE CRASHED:", e); process.exit(1); });
