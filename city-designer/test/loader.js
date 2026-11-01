// loader.js — reads the SHIPPED app (../mondiala.html + ../mondiala-data.js),
// evals it in this scope (with the stubs above) in browser script order, exposes __X.
// Run from this test directory (run.sh does that): the app files sit one level up.
"use strict";
const __fs = require("fs");
function __read(p) { return __fs.readFileSync(p, "utf8"); }
const __html = __read("../mondiala.html");
const __data = __read("../mondiala-data.js");
const __scripts = [];
{
  const re = /<script(?:\s+src="([^"]*)")?>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(__html))) __scripts.push({ src: m[1] || null, body: m[2] });
}
// expected structure: [app head (inline), mondiala-data.js (src tag), app tail (inline)]
if (__scripts.length !== 3) throw new Error("mondiala.html: expected 3 script tags, found " + __scripts.length);
if (__scripts[1].src !== "mondiala-data.js" || __scripts[1].body.trim()) throw new Error("mondiala.html: expected an empty <script src=\"mondiala-data.js\"> in the middle");
const __parts = { src: __scripts[0].body + "\n" + __data + "\n" + __scripts[2].body };
const __export = `
;globalThis.__X = {
  RAW, WORLD_CITIES, CITY_COORDS, CITY_COUNTRY, CITY_INFO, CITY_FACTS, SEX_GODS, PINK_GODS, PINK_SLOTS, GOD_ORIGINS, CENTER_SPOTS, TYPES,
  DIRS, SIZE, HEX_AREA,
  get hexes() { return hexes; }, get pool() { return pool; },
  get maxCircle() { return maxCircle; }, set maxCircle(v) { maxCircle = v; },
  get centerMode() { return centerMode; }, set centerMode(v) { centerMode = v; },
  get selected() { return selected; }, set selected(v) { selected = v; },
  get viewBox() { return viewBox; }, set viewBox(v) { viewBox = v; },
  get worldCenter() { return worldCenter; }, get extraCities() { return extraCities; },
  get paintMode() { return paintMode; }, get armedType() { return armedType; }, get armedPoolName() { return armedPoolName; },
  get viewMode() { return viewMode; },
  get moved() { return moved; }, set moved(v) { moved = v; },
  get gHexes() { return gHexes; },
  buildCity, computeWorldPlan, computeCenter, bearingDist, greatCircleKm, coordOf, factPop, factLiv, factWalk, factsFor, factPopPos, geoWeight,
  centerCountry, pinkPlan, worldSlots, neighborKeys, onSpoke, ringPositions, axialToPixel, cityViewBox,
  exportJSON, importJSON, recenter, refresh, renderPool, renderTypes, renderStats, renderCenterOut, renderExtraList, showInspector, setPaint, snapshotEdits,
  fmtPop, fmtLatLon
};
`;
eval(__parts.src + "\n" + __export);
