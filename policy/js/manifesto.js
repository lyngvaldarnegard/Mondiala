import { get } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox, chartCanvas } from './ui.js';
import { baseIncome, taxA, marginalA, taxB, benefitsFor, taxToday, taxTodayBreakdown } from './tax.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs = {}, ...children) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, v);
  for (const c of children) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}
function svgText(x, y, text, attrs = {}) { return svg('text', { x, y, fill: '#7d8b9d', 'font-size': 11, ...attrs }, text); }

const prose = (t) => el('p', { class: 'desc', text: t });
const lead = (t) => el('p', { style: 'max-width:760px;color:#dce3ec;font-size:15px;line-height:1.65;margin-bottom:14px;', text: t });
const sectionTitle = (kicker, title) => el('div', null,
  el('div', { style: 'font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#e8b04b;margin-bottom:2px;', text: kicker }),
  el('h2', { text: title }));

const state = {
  mazeG: 4.5,
  stairG: 4.5,
  flatG: 5,
  children: 2
};

export function render(main) {
  clear(main);
  main.append(hero(), theMaze(), oneBase(), planA(), planB(), fiveLives(), whatStays(), explore());
}

// ---------------------------------------------------------------- hero
function hero() {
  return card(el('div', null,
    sectionTitle('A personal manifesto', 'A country that runs itself'),
    lead('This page is my attempt to explain an idea I can\u2019t stop thinking about: a welfare state that runs on rules, not on yearly political fighting. Not a smaller state and not a bigger one \u2014 a state where the formulas are decided once, in the open, and then they just run. Like autopilot.'),
    lead('The concrete case is Norway, because that\u2019s the country I know and its numbers are public. But the idea is general, and at the bottom of the page there is a sandbox where you can break it.'),
    prose('Everything here is interactive and every number comes from a visible data layer \u2014 the basic amount G, the SIFO food budget, SSB income statistics \u2014 so you can check me as you read. Start with the problem.')));
}

// ---------------------------------------------------------- the maze
function theMaze() {
  const c = card(sectionTitle('The problem', 'Today\u2019s tax code is a maze with three locks'),
    lead('If you earn a salary in Norway today, three different taxes grab at it before you see the money: trygdeavgift (7.7% from the first krone), alminnelig inntekt (22% after a deduction) and trinnskatt (five invisible brackets that stack on top). Add formuesskatt on what you own, subtract whatever deductions you qualify for \u2014 and the result is a system almost nobody can compute for themselves.'),
    prose('That opacity is a political problem, not just an inconvenience. When nobody can compute their own tax, the annual budget negotiation becomes a fog of accusations, and the system survives on vibes. My answer is not to patch the maze but to leave it: one tax base you can explain on an envelope, and rates you can hold in your head.'),
    el('div', { class: 'chartbox', id: 'maze-box', style: 'margin-top:10px;' }));
  drawMaze();
  return c;
}

function drawMaze() {
  const box = document.getElementById('maze-box');
  if (!box) return;
  clear(box);
  const G = get('G');
  const gross = state.mazeG * G;
  const d = taxTodayBreakdown(gross);
  const W = 620, H = 150, x0 = 40, barW = 520, y0 = 40, barH = 54;
  const parts = [
    { label: 'Trygdeavgift 7.7%', v: d.socialSecurity, color: '#f85149' },
    { label: '22 % alminnelig inntekt', v: d.incomeTax, color: '#e8b04b' },
    { label: 'Trinnskatt (5 brackets)', v: d.bracketTax, color: '#a371f0' },
    { label: 'You keep', v: Math.max(0, gross - d.total), color: '#3fb950' }
  ];
  const sum = parts.reduce((s, p) => s + p.v, 0) || 1;
  let x = x0;
  const s = svg('svg', { viewBox: `0 0 ${W} ${H}`, style: 'width:100%;max-width:620px;' });
  for (const p of parts) {
    const w = barW * p.v / sum;
    s.append(svg('rect', { x, y: y0, width: Math.max(0, w - 1), height: barH, fill: p.color, rx: 3 }));
    if (w > 46) s.append(svgText(x + w / 2, y0 + barH / 2 + 4, fmt(p.v / 1000) + 'k', { fill: '#0d1117', 'text-anchor': 'middle', 'font-size': 12 }));
    x += w;
  }
  s.append(svgText(x0, 24, `Where a salary of ${fmtNOK(gross)} goes today (estimate)`));
  box.append(s);
  const legend = el('div', { style: 'display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:10px;font-size:12px;color:#7d8b9d;' });
  for (const p of parts) {
    legend.append(el('span', { style: 'display:inline-flex;align-items:center;gap:6px;' },
      (() => { const d = document.createElement('span'); d.style.cssText = 'width:10px;height:10px;border-radius:2px;background:' + p.color + ';display:inline-block;'; return d; })(),
      p.label));
  }
  box.append(legend);
  const slider = el('input', { type: 'range', min: '0', max: '10', step: '0.1', value: String(state.mazeG), style: 'width:100%;margin-top:8px;' });
  slider.addEventListener('input', () => { state.mazeG = Number(slider.value); drawMaze(); });
  box.append(el('label', { text: `Salary: ${fmt(gross)} NOK (${fmt(state.mazeG, 1)} G) \u2014 drag me` }), slider);
}

// ---------------------------------------------------------- one base
function oneBase() {
  return card(sectionTitle('The foundation', 'One base, written on an envelope'),
    lead('Both of my tax plans share the same starting point, because the base is where the maze really lives. The base is general capitalised income \u2014 your salary, and your capital income \u2014 minus the interest you paid on your debts, and still allowing the deductions that protect ordinary saving and small business: financial fees, small-scale business expenses, BSU and IPS.'),
    formulaBox('base = gross income + financial fees \u2212 small-scale expenses \u2212 BSU \u2212 IPS \u2212 interest paid'),
    prose('What disappears entirely: trygdeavgift, trinnskatt and formuesskatt. What stays untouched: arbeidsgiveravgift (the employer contribution) and the 22% corporate tax with its current special regimes \u2014 those raise money where the money is made, and this manifesto is about your tax return, not the company accounts.'),
    prose('On top of this one base I have two plans. They are different temperaments, not rivals: Plan A keeps the progressive instinct but makes it visible; Plan B is the radical one \u2014 one line of arithmetic for the whole country.'));
}

// ---------------------------------------------------------- plan A
function planA() {
  const c = card(sectionTitle('Plan A', 'The staircase \u2014 progressivity you can see'),
    lead('Plan A keeps the idea that higher incomes should pay a higher share, but makes it physical: a staircase where each step of 1 G (the basic amount) is taxed at one visible rate \u2014 0, 10, 20, 30, 40, then 50% on everything above 6 G. No hidden brackets: if you know your income in G, you can compute your tax by counting steps on your fingers.'),
    formulaBox('Plan A: marginal 0 / 10 / 20 / 30 / 40 / 50 % per 1 G bracket'),
    el('div', { class: 'chartbox', id: 'stair-box', style: 'margin:14px 0;' }),
    prose('The first 1 G is completely free \u2014 that is the floor nobody taxes under. Then each additional G costs 10 percentage points more of itself, stopping at half. The curve below is the whole plan: notice it is one smooth staircase, no cliffs, nothing to game.'),
    el('div', { class: 'chartbox', id: 'stair-chart' }),
    el('h3', { text: 'The staircase in numbers' }),
    prose('The whole plan summed up \u2014 cumulative tax at round incomes. This is the spec the formula implements; the checks page asserts it after every change.'),
    el('div', { id: 'stair-check' }));
  drawStair();
  return c;
}

function drawStair() {
  const G = get('G');
  const box = document.getElementById('stair-box');
  if (box) {
    clear(box);
    const W = 640, H = 250, x0 = 46, y0 = 210, px = 52, py = 40;
    const xG = (g) => x0 + g * px;
    const yT = (t) => y0 - t * py;
    const s = svg('svg', { viewBox: `0 0 ${W} ${H}`, style: 'width:100%;max-width:640px;' });
    const rates = [0, 0.10, 0.20, 0.30, 0.40, 0.50];
    const colors = ['#2b3244', '#3d5a80', '#3f7fb9', '#4aa3a0', '#5dbd6f', '#e8b04b'];
    let cum = 0;
    for (let k = 0; k < 6; k++) {
      const x = xG(k), w = px;
      s.append(svg('rect', { x, y: yT(cum), width: w, height: y0 - yT(cum), fill: colors[k], stroke: '#0d1117' }));
      const next = cum + rates[k];
      s.append(svgText(x + w / 2, yT(cum) - 6, (rates[k] * 100) + '%', { 'text-anchor': 'middle', fill: '#dce3ec', 'font-size': 12 }));
      cum = next;
    }
    s.append(svg('line', { x1: xG(6), y1: yT(1.5), x2: xG(9.2), y2: yT(1.5 + 0.5 * 3.2), stroke: '#e8b04b', 'stroke-width': 3 }));
    for (let g = 0; g <= 9; g++) s.append(svgText(xG(g), y0 + 16, g === 0 ? '0' : g + 'G', { 'text-anchor': 'middle' }));
    for (let t = 0; t <= 4; t++) s.append(svgText(x0 - 8, yT(t) + 4, t + 'G', { 'text-anchor': 'end' }));
    s.append(svgText(x0, 18, 'Cumulative tax (in G) \u2014 each step is 1 G wide and taxed at its label'));
    const g = state.stairG;
    const tax = taxA(g * G, G) / G;
    s.append(svg('line', { x1: xG(Math.min(g, 9.2)), y1: y0, x2: xG(Math.min(g, 9.2)), y2: yT(tax), stroke: '#f85149', 'stroke-dasharray': '4 3' }));
    s.append(svg('circle', { cx: xG(Math.min(g, 9.2)), cy: yT(tax), r: 5, fill: '#f85149' }));
    box.append(s);
    const slider = el('input', { type: 'range', min: '0', max: '10', step: '0.1', value: String(g), style: 'width:100%;margin-top:8px;' });
    slider.addEventListener('input', () => { state.stairG = Number(slider.value); drawStair(); });
    box.append(
      el('p', null, el('strong', { text: `Income ${fmt(g * G)} NOK (${fmt(g, 1)} G) \u2192 tax ${fmtNOK(tax * G)} \u00b7 average ${fmt(g > 0 ? 100 * tax / g : 0, 1)}% \u00b7 next krone: ${fmt(marginalA(g * G, G) * 100)}%` })),
      el('label', { text: 'Drag to climb the staircase' }), slider);
  }
  const chartBox = document.getElementById('stair-chart');
  if (chartBox && typeof Chart !== 'undefined') {
    const xs = [];
    for (let g = 0; g <= 10.001; g += 0.2) xs.push(g);
    const a = xs.map(g => taxA(g * G, G) / G);
    const b = xs.map(g => taxB(g * G, G, 0) / G);
    const today = xs.map(g => g > 0 ? taxToday(g * G) / G : 0);
    stairChart?.destroy();
    stairChart = new Chart(chartCanvas('stair-chart'), {
      type: 'line',
      data: { labels: xs.map(x => fmt(x, 1)), datasets: [
        { label: 'Plan A (staircase)', data: a, borderColor: '#e8b04b', pointRadius: 0, tension: .05 },
        { label: 'Plan B (flat template)', data: b, borderColor: '#3fb950', pointRadius: 0, tension: .05 },
        { label: 'Today (estimate)', data: today, borderColor: '#7d8b9d', pointRadius: 0, tension: .2 }] },
      options: { responsive: true, scales: { x: { title: { display: true, text: 'Income (G)' }, ticks: { maxTicksLimit: 11 } }, y: { title: { display: true, text: 'Tax (G)' } } } }
    });
  }
  const checkBox = document.getElementById('stair-check');
  if (checkBox) {
    clear(checkBox);
    const spec = { 1: 0, 2: 0.10, 3: 0.30, 4: 0.60, 5: 1.00, 6: 1.50, 10: 3.50 };
    checkBox.append(table(['Income', 'Tax (G)', 'Average rate'],
      Object.entries(spec).map(([g, t]) => [
        g + ' G (' + fmtNOK(g * G) + ')',
        fmt(t, 2) + ' G',
        fmt(100 * t / g, 1) + ' %'])));
  }
}
let stairChart;

// ---------------------------------------------------------- plan B
function planB() {
  const c = card(sectionTitle('Plan B', 'The flat template \u2014 one line of arithmetic'),
    lead('Plan B is the radical one, and my favourite. Delete every bracket. The tax is one sentence: half of everything above 3 G. The first 3 G of income \u2014 about ' + fmtNOK(3 * get('G')) + ' today \u2014 is yours, untouched, whoever you are.'),
    formulaBox('Plan B: tax = 0.5 \u00d7 max(0, income \u2212 3 G)'),
    el('div', { class: 'chartbox', id: 'flat-box', style: 'margin:14px 0;' }),
    lead('Why 3 G, exactly? Because that is the pension. A pensioner on the model\u2019s standard 3 G pension hits the threshold exactly and pays zero \u2014 the whole welfare floor sits under the tax line. That one coincidence replaces a whole book of exceptions: no pensioner discount, no student discount, nothing to apply for.'),
    prose('And the benefits you receive \u2014 the universal food card, barnetrygd (1 G per child) \u2014 are simply added to your income before the sentence is applied. One arithmetic line, no exceptions, and still nobody at the bottom pays.'),
    el('div', { class: 'chartbox', id: 'flat-note' }));
  drawFlat();
  return c;
}

function drawFlat() {
  const G = get('G');
  const box = document.getElementById('flat-box');
  if (!box) return;
  clear(box);
  const W = 640, H = 130, x0 = 46, barW = 520, y0 = 34, barH = 46;
  const xG = (g) => x0 + g / 10 * barW;
  const s = svg('svg', { viewBox: `0 0 ${W} ${H}`, style: 'width:100%;max-width:640px;' });
  s.append(svg('rect', { x: xG(0), y: y0, width: xG(3) - xG(0) - 2, height: barH, fill: '#3fb950', rx: 3 }));
  s.append(svgText((xG(0) + xG(3)) / 2, y0 + barH / 2 + 4, 'the first 3 G \u2014 untouched', { 'text-anchor': 'middle', fill: '#0d1117', 'font-size': 12 }));
  s.append(svg('rect', { x: xG(3), y: y0, width: xG(10) - xG(3) - 1, height: barH / 2 - 1, fill: '#e8b04b', rx: 3 }));
  s.append(svg('rect', { x: xG(3), y: y0 + barH / 2, width: xG(10) - xG(3) - 1, height: barH / 2, fill: '#2b3244', rx: 3 }));
  s.append(svgText(xG(3) + 8, y0 + barH / 2 - 4, 'above 3 G: half to the state (gold), half to you', { fill: '#dce3ec', 'font-size': 12 }));
  for (let g = 0; g <= 10; g += 1) s.append(svgText(xG(g), y0 + barH + 16, g === 0 ? '0' : g + 'G', { 'text-anchor': 'middle' }));
  const g = state.flatG;
  s.append(svg('line', { x1: xG(g), y1: y0 - 8, x2: xG(g), y2: y0 + barH + 4, stroke: '#f85149', 'stroke-width': 2 }));
  box.append(s);
  const benefits = benefitsFor({ children: state.children });
  const tax = taxB(g * G, G, benefits);
  const slider = el('input', { type: 'range', min: '0', max: '10', step: '0.1', value: String(g), style: 'width:100%;margin-top:8px;' });
  slider.addEventListener('input', () => { state.flatG = Number(slider.value); drawFlat(); });
  const kids = el('input', { type: 'number', min: '0', max: '10', step: '1', value: String(state.children) });
  kids.addEventListener('input', () => { state.children = Number(kids.value) || 0; drawFlat(); });
  box.append(
    el('p', null, el('strong', { text: `Income ${fmt(g * G)} NOK (${fmt(g, 1)} G) + benefits ${fmtNOK(benefits)} \u2192 tax ${fmtNOK(tax)} \u00b7 average ${fmt(g > 0 ? 100 * tax / (g * G) : 0, 1)}%` })),
    el('label', { text: 'Income (drag)' }), slider,
    el('label', { text: 'Children (barnetrygd 1 G each, added to the base)' }), kids);
}

// ---------------------------------------------------------- five lives
function fiveLives() {
  const c = card(sectionTitle('The same rule, five lives', 'A student, a nurse, an engineer, a pensioner, a CEO'),
    lead('The honest test of a tax plan is not a graph \u2014 it is whether you can tell your friend what happens to people you both know. Here are five lives, computed live from the same formulas as everything else (today\u2019s column is an estimate of the current system).'),
    el('div', { id: 'lives-table' }),
    el('div', { class: 'chartbox', id: 'lives-chart' }),
    prose('Read the pensioner\u2019s row twice: under Plan B they pay exactly zero, not because of a special rule but because the welfare floor and the tax threshold are the same number \u2014 that is the design, not a coincidence patched in afterwards.'),
    prose('And the student: with the food card and the stipend added to the base, the sentence still gives them zero. The floor does the work the deductions do today.'));
  drawLives();
  return c;
}

function drawLives() {
  const G = get('G');
  const stipend = get('welfare.studentStipendYear');
  const personas = [
    { name: 'Student on stipend', gross: stipend, children: 0, note: 'stipend + food card' },
    { name: 'Nurse', gross: 620000, children: 1, note: 'median-ish wage' },
    { name: 'Engineer', gross: 850000, children: 2, note: 'above median' },
    { name: 'Pensioner (3 G)', gross: 3 * G, children: 0, note: 'the model\u2019s standard pension' },
    { name: 'Executive', gross: 1800000, children: 2, note: 'top decile' }
  ];
  const rows = personas.map(p => {
    const base = baseIncome({ gross: p.gross });
    const benefits = benefitsFor({ children: p.children });
    const a = taxA(base, G);
    const b = taxB(base, G, benefits);
    const today = taxToday(p.gross);
    return { ...p, base, benefits, a, b, today, keepB: p.gross + benefits - b };
  });
  const t = document.getElementById('lives-table');
  if (t) {
    clear(t);
    t.append(table(
      ['Life', 'Income', 'Today (est.)', 'Plan A', 'Plan B', 'B: what you keep incl. benefits'],
      rows.map(r => [
        r.name + el('div', { class: 'pill', style: 'display:inline-block;margin-top:2px;', text: r.note }),
        fmtNOK(r.gross),
        fmtNOK(r.today),
        fmtNOK(r.a),
        fmtNOK(r.b),
        fmtNOK(r.keepB)]),
      [1, 2, 3, 4, 5]));
  }
  const chartBox = document.getElementById('lives-chart');
  if (chartBox && typeof Chart !== 'undefined') {
    livesChart?.destroy();
    livesChart = new Chart(chartCanvas('lives-chart'), {
      type: 'bar',
      data: { labels: rows.map(r => r.name), datasets: [
        { label: 'Today (est.)', data: rows.map(r => r.today), backgroundColor: '#7d8b9d' },
        { label: 'Plan A', data: rows.map(r => r.a), backgroundColor: '#e8b04b' },
        { label: 'Plan B', data: rows.map(r => r.b), backgroundColor: '#3fb950' }] },
      options: { responsive: true, scales: { y: { title: { display: true, text: 'Tax (NOK)' } } } }
    });
  }
}
let livesChart;

// ---------------------------------------------------------- what stays
function whatStays() {
  return card(sectionTitle('Beyond the tax return', 'Where the money goes \u2014 and what makes it balance'),
    lead('A tax plan is only half a state. The other half: every resident gets a universal food card at the flat SIFO single-adult grocery rate (' + fmtNOK(get('sifo.grocerySingleAdultMonthly')) + '/month, taxable in Plan B, free in Plan A). The pension is a queue, not a fixed age \u2014 how many pensioners the economy carries is decided by a formula over the population, with hard occupations earning queue credit faster. Municipal grants are per person, per km\u00b2, per pupil \u2014 never dependent on the local tax base.'),
    prose('And the budget always balances, by construction: spending is whatever the rules say, and a land value tax is the valve \u2014 its rate is simply whatever closes the gap. You can watch the flows on the budget page\u2019s Sankey diagram, and toggling the pension level or the food card visibly moves the implicit LVT rate.'),
    prose('None of these numbers are hardcoded here: they live in a data register with sources and sanity ranges, refreshed from SSB where an API exists \u2014 which is the whole point. Rules in the open, data in the open, and the state runs itself.'));
}

// ---------------------------------------------------------- explore
function explore() {
  const link = (href, text) => el('a', { href, style: 'color:#e8b04b;text-decoration:none;font-size:14px;display:block;padding:4px 0;', text });
  return card(sectionTitle('Keep going', 'The workbench, the models, and the sandbox'),
    prose('This page is the argument. The rest of the site is the machinery \u2014 every module reads the same data layer, and the formula checks page asserts the specs after every change:'),
    el('div', null,
      link('#tax', 'Tax workbench \u2014 the full calculator: deductions, variant C, decile revenue'),
      link('#pension', 'The pension queue \u2014 age-distribution chart with the cutoff line'),
      link('#foodcard', 'The food card \u2014 cost, universality, SIFO anchor'),
      link('#budget', 'The national budget \u2014 the Sankey that always balances'),
      link('#municipal', 'Municipal finance \u2014 needs-based grants, not tax-base grants'),
      link('#electoral', 'The electoral system \u2014 seats by cube root, levelling by ranked choice'),
      link('#constitution', 'The constitution builder \u2014 Norway, Mondiala, Italy as presets'),
      link('#checks', 'Formula checks \u2014 the specs, asserted live'),
      link('#register', 'The data register \u2014 every number and its source'),
      el('a', { href: '../simulator/', style: 'color:#e8b04b;text-decoration:none;font-size:14px;display:block;padding:4px 0;', text: 'The society simulator \u2014 build the economy from blobs and watch the rules play out \u2192' })));
}
