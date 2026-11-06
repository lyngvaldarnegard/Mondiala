// Shared data layer: every module reads curated values and live SSB data
// through this module. No module keeps its own copies of constants.

let DATA = null;
let REGISTER = null;
const live = { ok: [], failed: [] };

async function loadJSON(relPath) {
  const url = new URL(relPath, import.meta.url);
  if (typeof process !== 'undefined' && process.versions?.node) {
    const { readFile } = await import('node:fs/promises');
    return JSON.parse(await readFile(url, 'utf8'));
  }
  return fetch(url.href).then(x => x.json());
}

export async function initData() {
  const [d, r] = await Promise.all([
    loadJSON('../data/data.json'),
    loadJSON('../data/update-register.json')
  ]);
  DATA = d;
  REGISTER = r;
}

export function getData() {
  return DATA;
}
export function getRegister() {
  return REGISTER;
}
export function getLiveStatus() {
  return live;
}

// path like "sifo.grocerySingleAdultMonthly" or "welfare.barnetrygdPerChildG"
export function get(path) {
  if (!DATA) throw new Error('data layer not initialised');
  let node = DATA;
  for (const key of path.split('.')) {
    if (node == null || !(key in node)) throw new Error('unknown data field: ' + path);
    node = node[key];
  }
  return node;
}

// Resolve a value that may be overridden by a live SSB fetch result.
const overrides = new Map();
export function setOverride(path, value) {
  overrides.set(path, value);
}
export function getWithOverride(path) {
  return overrides.has(path) ? overrides.get(path) : get(path);
}

export function isDraft(path) {
  const entry = REGISTER.find(e => e.field === path || path.startsWith(e.field));
  return !!(entry && entry.draft);
}

export function registerEntry(path) {
  return REGISTER.find(e => e.field === path || path.startsWith(e.field)) || null;
}

// Sanity check per the update register: value must lie within [min, max].
export function sanityCheck(path, value) {
  const e = registerEntry(path);
  if (!e || !e.sanity) return null;
  const [lo, hi] = e.sanity;
  if (value < lo || value > hi) return { ok: false, range: [lo, hi] };
  return { ok: true, range: [lo, hi] };
}

const SSB_BASE = 'https://data.ssb.no/api/v0/no/table/';

// POST a json-stat query to data.ssb.no for the given table id.
// On any failure (offline, CORS, error) the caller's fallback (curated
// value from data.json) is returned unchanged.
export async function ssbQuery(tableId, query, fallbackValue, overridePath) {
  try {
    const res = await fetch(SSB_BASE + tableId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    const value = jsonStatValue(json);
    if (overridePath) setOverride(overridePath, value);
    live.ok.push(tableId);
    return value;
  } catch (err) {
    if (tableId && !live.failed.includes(tableId)) live.failed.push(tableId);
    return fallbackValue;
  }
}

function jsonStatValue(json) {
  const ds = json.dataset || json;
  const v = ds.value;
  if (!v || !v.length) throw new Error('empty dataset');
  return v[v.length - 1];
}

// Standard query builders for the tables the spec lists.
export const SsbTables = {
  publicFinances: '10487',
  incomeDistribution09935: '09935',
  incomeDistribution05854: '05854',
  wages11418: '11418',
  wages11419: '11419',
  population: '07459',
  projections: '12553',
  kostra: '10002'
};

export async function refreshLiveData() {
  const G = get('G');
  // Median wage anchor (variant C). Query: wages 11418, all occupations/yearly wage.
  await ssbQuery(SsbTables.wages11418, {
    query: [
      { code: 'Yrke', selection: { filter: 'item', values: ['0'] } },
      { code: 'ContentsCode', selection: { filter: 'item', values: ['ArbLonnPAAr'] } },
      { code: 'Tid', selection: { filter: 'top', values: ['1'] } }
    ],
    response: { format: 'json-stat' }
  }, get('income.medianWageYear'), 'income.medianWageYear');
  // Population total.
  await ssbQuery(SsbTables.population, {
    query: [
      { code: 'Region', selection: { filter: 'item', values: ['0'] } },
      { code: 'Kjonn', selection: { filter: 'item', values: ['1', '2'] } },
      { code: 'Alder', selection: { filter: 'item', values: ['999'] } },
      { code: 'Tid', selection: { filter: 'top', values: ['1'] } }
    ],
    response: { format: 'json-stat' }
  }, get('population.total'), 'population.total');
  return live;
}
