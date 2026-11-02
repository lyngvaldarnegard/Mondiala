// loader.js — reads the SHIPPED app (../mondiala.html + the five data files it
// references), evals it in this scope (with the stubs above) in browser script
// order, exposes __X. Run from this test directory (run.sh does that): the app
// files sit one level up.
"use strict";
const __fs = require("fs");
const __html = __fs.readFileSync("../mondiala.html", "utf8");
const __scripts = [];
{
  const re = /<script(?:\s+src="([^"]*)")?>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(__html))) __scripts.push({ src: m[1] || null, body: m[2] });
}
// expected structure: [app head (inline), the five themed data files + the generated seating table (src tags, empty), app tail (inline)]
const __DATA_FILES = ["mondiala-heart.js", "mondiala-cities.js", "mondiala-info.js", "mondiala-facts.js", "mondiala-gods.js", "mondiala-seating.js", "mondiala-handpicked.js"];
if (__scripts.length !== 2 + __DATA_FILES.length) throw new Error("mondiala.html: expected " + (2 + __DATA_FILES.length) + " script tags, found " + __scripts.length);
__stubSetHtmlIds([...__html.matchAll(/\bid="([^"]*)"/g)].map(m => m[1])); // real-browser semantics: only ids present in the shipped HTML exist
const __srcs = __scripts.slice(1, -1).map(s => s.src);
if (JSON.stringify(__srcs) !== JSON.stringify(__DATA_FILES)) throw new Error("mondiala.html: unexpected data files " + JSON.stringify(__srcs));
if (__scripts.slice(1, -1).some(s => s.body.trim())) throw new Error("mondiala.html: data script tags must be empty (src only)");
let __src = __scripts[0].body;
for (const s of __scripts.slice(1, -1)) __src += "\n" + __fs.readFileSync("../" + s.src, "utf8");
__src += "\n" + __scripts[__scripts.length - 1].body;
const __export = `
;globalThis.__X = {
  RAW, WORLD_CITIES, CITY_COORDS, CITY_COUNTRY, COUNTRY_CONTINENTS, CITY_INFO, CITY_FACTS, SEX_GODS, PINK_GODS, PINK_SLOTS, GOD_ORIGINS, FAVOURITE_GODS, CENTER_SPOTS, TYPES, SEATING,
  DIRS, SIZE, HEX_AREA,
  get hexes() { return hexes; }, get pool() { return pool; },
  get maxCircle() { return maxCircle; }, set maxCircle(v) { maxCircle = v; },
  get GRID_ROT() { return GRID_ROT; }, set GRID_ROT(v) { GRID_ROT = v; },
  get placeMode() { return placeMode; }, set placeMode(v) { placeMode = v; },
  get COMPASS_KM() { return COMPASS_KM; }, set COMPASS_KM(v) { COMPASS_KM = v; },
  get viewMode() { return viewMode; },
  continentOf, continentFill, CONTINENT_COLORS, eyeTrueDir, readSeating, hungarianMax, heartRingSeats,
  compassSeat, fillWorldPlan, RING4_ORIGINALS,
  get centerMode() { return centerMode; }, set centerMode(v) { centerMode = v; },
  get selected() { return selected; }, set selected(v) { selected = v; },
  get viewBox() { return viewBox; }, set viewBox(v) { viewBox = v; },
  get worldCenter() { return worldCenter; }, get extraCities() { return extraCities; },
  get viewMode() { return viewMode; },
  get moved() { return moved; }, set moved(v) { moved = v; },
  get gHexes() { return gHexes; },
  buildCity, computeWorldPlan, computeCenter, bearingDist, greatCircleKm, coordOf, factPop, factLiv, factWalk, factsFor, factPopPos, geoWeight,
  centerCountry, pinkPlan, pinkRingGods, worldSlots, neighborKeys, onSpoke, ringPositions, axialToPixel, cityViewBox,
  recenter, refresh, renderPool, renderStats, renderCenterOut, showInspector,
  fmtPop, fmtLatLon
};
`;
eval(__src + "\n" + __export);
