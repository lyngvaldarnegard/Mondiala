// Route smoke test: renders every page with a minimal DOM stub and stubbed
// Chart.js/d3, catching runtime errors. Run: node policy/test/smoke.mjs
import { initData } from '../js/data.js';

function makeEl(tag = 'div') {
  const el = {
    nodeType: 1, tagName: tag, children: [], _text: '', style: {}, dataset: {},
    className: '', value: '', checked: false, clientWidth: 800, chartArea: { top: 0, bottom: 100 },
    scales: { x: { getPixelForValue: () => 0 } },
    appendChild(c) { this.children.push(c); return c; },
    append(...cs) { for (const c of cs) this.children.push(c); },
    removeChild(c) { this.children = this.children.filter(x => x !== c); },
    replaceChildren(...cs) { this.children = [...cs]; },
    get firstChild() { return this.children[0] || null; },
    addEventListener() {}, removeEventListener() {},
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k]; },
    querySelectorAll() { return []; }, querySelector() { return makeEl('div'); },
    classList: { toggle() {}, add() {}, remove() {} },
    ctx: null
  };
  Object.defineProperty(el, 'textContent', { get() { return this._text; }, set(v) { this._text = String(v); this.children = []; } });
  return el;
}

const registry = {};
global.document = {
  createElement: makeEl,
  createElementNS: (ns, tag) => makeEl(tag),
  createTextNode: t => ({ nodeType: 3, textContent: t }),
  getElementById: id => registry[id] || (registry[id] = makeEl('div')),
  querySelectorAll: () => []
};
global.window = { addEventListener() {}, Chart: undefined };
global.location = { hash: '' };
global.Chart = class Chart { constructor() {} destroy() {} };
const chain = () => new Proxy(function () {}, {
  get: (t, k) => {
    if (k === 'text' || k === 'attr' || k === 'data' || k === 'join' || k === 'append' || k === 'remove') return chain();
    return chain();
  },
  apply: () => chain()
});
global.d3 = Object.assign(() => chain(), {
  select: () => chain(),
  sankey: () => Object.assign((g) => ({ nodes: g.nodes.map((n, i) => ({ ...n, x0: i, x1: i + 1, y0: i, y1: i + 1 })), links: g.links.map(l => ({ ...l, width: 1, y1: 0 })) }), { nodeWidth: () => chain(), nodePadding: () => chain(), extent: () => chain() }),
  sankeyLinkHorizontal: () => () => '',
  scaleOrdinal: () => () => '#000',
  schemeTableau10: []
});

const routes = ['manifesto', 'tax', 'pension', 'foodcard', 'budget', 'municipal', 'electoral', 'constitution', 'mondiala', 'checks'];
const modules = {};
let failures = 0;
await initData();
for (const r of routes) {
  try {
    if (!modules[r]) modules[r] = await import(`../js/${r}.js`);
    const main = makeEl('main');
    modules[r].render(main);
    console.log(`  ✓ #/${r} rendered (${main.children.length} top-level nodes)`);
  } catch (e) {
    failures++;
    console.error(`  ✗ #/${r} failed: ${e.message}`);
    console.error(e.stack.split('\n').slice(0, 3).join('\n'));
  }
}
if (failures) process.exit(1);
console.log('\nAll routes render without errors.');
