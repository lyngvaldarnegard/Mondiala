import { get, getWithOverride, setOverride } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox } from './ui.js';
import { revenueByDecile } from './tax.js';
import { pensionCost } from './pension.js';
import { foodCardCost } from './foodcard.js';
import { nationalGrantTotal } from './municipal.js';

// Locked rule-driven income, computed live from the modules.
export function computeIncome(variant = 'A') {
  const d = get('budget.income');
  const decileRevenue = revenueByDecile(variant).reduce((s, r) => s + r.revenue, 0);
  return [
    { id: 'oil', name: 'Oil fund (the 3% rule)', value: d.oilFundWithdrawalNOK },
    { id: 'wage', name: 'Employer contribution', value: d.employerAvgiftNOK },
    { id: 'corp', name: 'Corporate tax 22%', value: d.corporateTaxNOK },
    { id: 'inctax', name: 'Income tax (variant ' + variant + ')', value: decileRevenue }
  ];
}

// Expenditure: every post is set as a share of GDP or GNI (general inputs);
// money amounts are computed read-only output. The baseline share for a
// plain post is derived from the register baseline (valueNOK / GDP) — no
// invented numbers.
export function computeExpenditure(settings) {
  const posts = get('budget.expenditure.posts');
  const gdp = get('budget.gdpNOK');
  const gni = get('budget.gniNOK');
  return posts.map(p => {
    if (p.computed === 'pension') return { ...p, value: settings.pensionOn ? pensionCost() : 0 };
    if (p.computed === 'foodcard') return { ...p, value: settings.foodcardOn ? foodCardCost() : 0 };
    if (p.computed === 'municipal') return { ...p, value: settings.municipalOn ? nationalGrantTotal() : 0 };
    if (p.gdpShare) {
      const share = Math.max(p.gdpShare[0], Math.min(p.gdpShare[1], settings.gdpShare[p.id] ?? p.default));
      return { ...p, value: share * gdp, share };
    }
    if (p.gniShare) {
      const share = Math.max(p.gniShare[0], Math.min(p.gniShare[1], settings.gniShare[p.id] ?? p.default));
      return { ...p, value: share * gni, share };
    }
    if (p.targetShare) {
      const on = settings.cultureTarget;
      const share = on ? p.targetShare : (settings.gdpShare[p.id] ?? p.valueNOK / gdp);
      return { ...p, value: share * gdp, share };
    }
    const share = settings.gdpShare[p.id] ?? p.valueNOK / gdp;
    return { ...p, value: share * gdp, share };
  }).filter(p => settings.on[p.id] !== false);
}

// The LVT is the balance valve: its rate is whatever closes the gap.
// The budget always balances — a structural invariant, not a UI state.
export function lvt(expenditureNOK, incomeNOK) {
  const base = get('budget.income.lvtBaseNOK');
  const gap = expenditureNOK - incomeNOK;
  if (gap <= 0) return { rate: 0, amount: 0, surplus: -gap };
  return { rate: gap / base, amount: gap, surplus: 0 };
}

const state = {
  variant: 'A',
  on: {},
  gdpShare: {},
  gniShare: {},
  cultureTarget: false,
  pensionOn: true, foodcardOn: true, municipalOn: true,
  preset: null
};

const presets = {
  cheapest: { name: 'Cheapest enacted bundle', gdp: { health: 0.04, education: 0.04, defence: 0.02, research: 0 }, gni: { aid: 0.007 } },
  priciest: { name: 'Priciest enacted bundle', gdp: { health: 0.08, education: 0.08, defence: 0.05, research: 0.014 }, gni: { aid: 0.01 } },
  mondiala: { name: 'Mondiala\u2019s constitution (floors and caps)', gdp: { health: 0.07, education: 0.06, defence: 0.02 }, gni: { aid: 0.007 } }
};

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'The national budget — Sankey with the LVT valve' }),
    el('p', { class: 'desc', text: 'The income side is locked and rule-driven: the oil fund under the 3% rule, the employer contribution, the 22% corporate tax and the income tax of the chosen variant. Expenditure posts are editable as shares of GDP or GNI with status flags (constitutional / legislated / pledge) and country presets. The land value tax (LVT) is the balance valve: its rate is whatever closes the gap — the budget always balances, as a structural invariant, never a UI state. All money amounts are computed read-only output; the inputs are general (shares of GDP/GNI, multiples of G).' }),
    formulaBox('LVT rate = (expenditure − other income) / land value base'));
  const bar = card(
    el('label', { text: 'Tax variant' }),
    (() => {
      const s = el('select', { onchange: e => { state.variant = e.target.value; draw(); } },
        ...['A', 'B', 'C'].map(v => el('option', { value: v, text: 'Variant ' + v })));
      s.value = state.variant;
      return s;
    })(),
    el('label', { text: 'Pension level (G/year)' }),
    (() => {
      const i = el('input', { type: 'number', min: '1', max: '5', step: '0.5', value: String(getWithOverride('pensionLevelG')) });
      i.addEventListener('input', () => { setOverride('pensionLevelG', Number(i.value) || 3); draw(); });
      return i;
    })(),
    el('label', { text: 'Preset' }),
    (() => {
      const s = el('select', { onchange: e => { applyPreset(e.target.value); } },
        el('option', { value: '', text: '—' }),
        ...Object.entries(presets).map(([k, p]) => el('option', { value: k, text: p.name })));
      return s;
    })());
  main.append(bar);
  const postsCard = card(el('h3', { text: 'Expenditure posts' }));
  main.append(postsCard);
  const sankeyCard = card(el('h3', { text: 'Sankey — income to expenditure, the LVT valve closes' }), el('div', { id: 'sankey' }));
  main.append(sankeyCard);
  const balCard = card();
  main.append(balCard);
  const tsCard = card(el('h3', { text: 'Time series — SSB history and model projection (population-driven)' }), el('div', { class: 'chartbox', id: 'ts-chart' }));
  main.append(tsCard);
  let tsChart, sankeySvg;

  function applyPreset(key) {
    state.preset = key || null;
    if (!key) { draw(); return; }
    const p = presets[key];
    Object.assign(state.gdpShare, p.gdp);
    Object.assign(state.gniShare, p.gni);
    draw();
  }

  function draw() {
    const income = computeIncome(state.variant);
    const posts = computeExpenditure(state);
    const incomeTotal = income.reduce((s, i) => s + i.value, 0);
    const expTotal = posts.reduce((s, p) => s + p.value, 0);
    const valve = lvt(expTotal, incomeTotal);

    // expenditure toggles
    clear(postsCard);
    postsCard.append(el('h3', { text: 'Expenditure posts' }),
      table(['Post', 'Flag', 'Input (share)', 'Amount (read-only)', 'On/off'],
        posts.map(p => {
          const cb = el('input', { type: 'checkbox' });
          cb.checked = state.on[p.id] !== false;
          cb.addEventListener('change', () => { state.on[p.id] = cb.checked; draw(); });
          let adj;
          if (p.gdpShare) adj = pctInput('gdpShare', p, p.gdpShare, 'of GDP');
          else if (p.gniShare) adj = pctInput('gniShare', p, p.gniShare, 'of GNI');
          else if (p.targetShare) adj = pctInput('gdpShare', p, null, 'of GDP');
          else adj = pctInput('gdpShare', p, null, 'of GDP');
          return [p.name, flagPill(p.flag), adj, fmtNOK(p.value), cb];
        })));

    function pctInput(key, p, range, ofWhat) {
      const wrap = el('span');
      const gdp = get('budget.gdpNOK'), gni = get('budget.gniNOK');
      const cur = state[key][p.id] ?? (p.targetShare && key === 'gdpShare' && !state.cultureTarget ? p.valueNOK / gdp : (p.valueNOK / (ofWhat === 'of GNI' ? gni : gdp)));
      const i = el('input', { type: 'number', min: '0', max: range ? String(range[1] * 100) : '100', step: '0.1', value: String(100 * cur) });
      i.addEventListener('input', () => { state[key][p.id] = (Number(i.value) || 0) / 100; draw(); });
      wrap.append(i, ' % ' + ofWhat);
      return wrap;
    }

    // balance card
    clear(balCard);
    balCard.append(el('h3', { text: 'Balance' }),
      table(['Quantity', 'Value'], [
        ['Income (locked, rule-driven)', fmtNOK(incomeTotal)],
        ['Expenditure', fmtNOK(expTotal)],
        ['LVT valve (amount)', fmtNOK(valve.amount)],
        ['Implicit LVT rate', fmt(100 * valve.rate, 2) + ' % of the land value base'],
        ['Transfer to the oil fund', valve.surplus > 0 ? fmtNOK(valve.surplus) : '—'],
        ['Budget balance', expTotal === incomeTotal + valve.amount ? el('span', { class: 'ok', text: '\u2713 always balances (invariant)' }) : el('span', { class: 'bad', text: 'broken' })],
        ['Mondiala\u2019s 3% deficit cap', expTotal <= incomeTotal + valve.amount ? el('span', { class: 'ok', text: '\u2713 0% deficit — the cap holds structurally' }) : '—']
      ], [1]));

    // Sankey via d3-sankey
    const box = document.getElementById('sankey');
    box.replaceChildren();
    const w = Math.min(1100, box.clientWidth || 1100), h = 520;
    const nodes = [];
    const links = [];
    const nodeIndex = {};
    function node(name) {
      if (!(name in nodeIndex)) { nodeIndex[name] = nodes.length; nodes.push({ name }); }
      return nodeIndex[name];
    }
    for (const i of income) { node(i.name); links.push({ source: node(i.name), target: node('Expenditure'), value: i.value }); }
    if (valve.amount > 0) { node('LVT — balance valve (' + fmt(100 * valve.rate, 2) + ' %)'); links.push({ source: node('LVT — balance valve (' + fmt(100 * valve.rate, 2) + ' %)'), target: node('Expenditure'), value: valve.amount }); }
    if (valve.surplus > 0) { node('Oil fund — deposit'); links.push({ source: node('Expenditure'), target: node('Oil fund — deposit'), value: valve.surplus }); }
    for (const p of posts) { node(p.name); links.push({ source: node('Expenditure'), target: node(p.name), value: p.value }); }
    sankeySvg?.remove();
    sankeySvg = d3.select(box).append('svg').attr('width', w).attr('height', h);
    const sk = d3.sankey().nodeWidth(16).nodePadding(10).extent([[10, 10], [w - 10, h - 10]]);
    const graph = sk({ nodes: nodes.map(d => ({ ...d })), links: links.map(l => ({ ...l })) });
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    sankeySvg.append('g').selectAll('rect').data(graph.nodes).join('rect')
      .attr('x', d => d.x0).attr('y', d => d.y0).attr('height', d => d.y1 - d.y0).attr('width', d => d.x1 - d.x0)
      .attr('fill', d => color(d.name)).attr('stroke', '#0d1117').append('title').text(d => d.name);
    sankeySvg.append('g').selectAll('path').data(graph.links).join('path')
      .attr('d', d3.sankeyLinkHorizontal()).attr('stroke-width', d => Math.max(1, d.width))
      .attr('stroke', d => color(d.source.name)).attr('fill', 'none').attr('opacity', .35)
      .append('title').text(d => `${d.source.name} → ${d.target.name}: ${fmtNOK(d.value)}`);
    sankeySvg.append('g').selectAll('text').data(graph.nodes).join('text')
      .attr('x', d => d.x0 < w / 2 ? d.x1 + 5 : d.x0 - 5).attr('y', d => (d.y0 + d.y1) / 2).attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < w / 2 ? 'start' : 'end').attr('fill', '#dce3ec').attr('font-size', 11)
      .text(d => d.name);

    // time series: history + projection, expenditure scaled by population path
    const hist = get('population.history');
    const proj = get('population.projections');
    const years = [...hist.years, ...proj.years.filter(y => y > hist.years[hist.years.length - 1])];
    const totals = [...hist.totals, ...proj.totals.slice(hist.totals.length)];
    const basePop = totals[0];
    tsChart?.destroy();
    tsChart = new Chart(document.getElementById('ts-chart'), {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          { label: 'Expenditure (population-driven model)', data: totals.map(t => expTotal * t / basePop), borderColor: '#f85149' },
          { label: 'Locked income (model)', data: totals.map(t => incomeTotal * t / basePop), borderColor: '#3fb950' },
          { label: 'LVT valve', data: totals.map(t => Math.max(0, (expTotal - incomeTotal)) * t / basePop), borderColor: '#e8b04b' }
        ]
      },
      options: { responsive: true, scales: { y: { title: { display: true, text: 'NOK' } } } }
    });
  }
  function flagPill(flag) {
    const t = { constitutional: 'constitutional', legislated: 'legislated', pledge: 'pledge' }[flag] || flag;
    return el('span', { class: 'pill', text: t });
  }
  draw();
}
