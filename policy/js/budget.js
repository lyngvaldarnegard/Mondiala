import { get, getWithOverride, setOverride } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox, chartCanvas } from './ui.js';
import { revenueByDecile } from './tax.js';
import { pensionCost } from './pension.js';
import { foodCardCost } from './foodcard.js';
import { nationalGrantTotal } from './municipal.js';
import { barnetrygdCost, stipendCost } from './welfare.js';

// Locked rule-driven income, computed live from the modules. Every income
// post is individually toggleable (item 8); the LVT valve is structural and
// always on — it is what closes the gap.
export function computeIncome(variant = 'A', settings = {}) {
  const d = get('budget.income');
  const decileRevenue = revenueByDecile(variant).reduce((s, r) => s + r.revenue, 0);
  return [
    { id: 'oil', name: 'Oil fund (the 3% rule)', value: d.oilFundWithdrawalNOK },
    { id: 'wage', name: 'Employer contribution', value: d.employerAvgiftNOK },
    { id: 'corp', name: 'Corporate tax 22%', value: d.corporateTaxNOK },
    { id: 'inctax', name: 'Income tax (variant ' + variant + ')', value: decileRevenue }
  ].filter(i => settings.incomeOn?.[i.id] !== false);
}

// Expenditure (items 5, 8, 9): every program proposal is a visible,
// individually toggleable post. Posts either offer named alternatives with
// status labels (country / constitutional / legislated / pledge) as shares of
// GDP or GNI, or a plain percentage-of-budget number field. All inputs are
// general (shares); money amounts are computed read-only output.
export function computeExpenditure(settings) {
  const posts = get('budget.expenditure.posts');
  const gdp = get('budget.gdpNOK');
  const gni = get('budget.gniNOK');
  const on = id => settings.on?.[id] !== false;
  const baselineTotal = posts.reduce((s, p) => s + (p.valueNOK || 0), 0);

  const fixed = [];
  const budgetPosts = [];
  for (const p of posts) {
    if (!on(p.id)) continue;
    if (p.computed === 'pension') { fixed.push({ ...p, value: pensionCost() }); continue; }
    if (p.computed === 'foodcard') { fixed.push({ ...p, value: foodCardCost() }); continue; }
    if (p.computed === 'municipal') { fixed.push({ ...p, value: nationalGrantTotal() }); continue; }
    if (p.computed === 'barnetrygd') { fixed.push({ ...p, value: barnetrygdCost() }); continue; }
    if (p.computed === 'stipend') { fixed.push({ ...p, value: stipendCost() }); continue; }
    if (p.mode === 'budget') { budgetPosts.push(p); continue; }
    const base = p.mode === 'gni' ? gni : gdp;
    const alt = p.alternatives[settings.choice?.[p.id] ?? 0];
    const share = settings.custom?.[p.id] ?? (alt.share ?? (p.valueNOK / base));
    fixed.push({ ...p, share, value: share * base });
  }
  // Percentage-of-budget posts: T = F / (1 − Σ s_i), so each post really is
  // its stated share of the total budget.
  const F = fixed.reduce((s, p) => s + p.value, 0);
  const S = budgetPosts.reduce((s, p) => s + (settings.budgetShare?.[p.id] ?? p.valueNOK / baselineTotal), 0);
  const T = S >= 0.999 ? F / 0.001 : F / (1 - S);
  const out = fixed.map(p => ({ ...p, budgetShare: p.value / (T || 1) }));
  for (const p of budgetPosts) {
    const s = settings.budgetShare?.[p.id] ?? p.valueNOK / baselineTotal;
    out.push({ ...p, share: s, value: s * T, budgetShare: s });
  }
  return out;
}

export function expenditureTotal(posts) {
  return posts.reduce((s, p) => s + p.value, 0);
}

// The LVT is the balance valve: its rate is whatever closes the gap.
// The budget always balances — a structural invariant, not a UI state.
// Two separately labeled numbers (item 11): (1) the valve rate = gap / land
// value base — never a share of budget or GDP; (2) the LVT's share of the
// total budget.
export function lvt(expenditureNOK, incomeNOK) {
  const base = get('budget.income.lvtBaseNOK');
  const gap = expenditureNOK - incomeNOK;
  if (gap <= 0) return { rate: 0, amount: 0, surplus: -gap, budgetShare: 0 };
  return { rate: gap / base, amount: gap, surplus: 0, budgetShare: expenditureNOK > 0 ? gap / expenditureNOK : 0 };
}

const state = {
  variant: 'A',
  on: {},
  incomeOn: {},
  choice: {},
  custom: {},
  budgetShare: {}
};

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'The national budget — Sankey with the LVT valve' }),
    el('p', { class: 'desc', text: 'The income side is rule-driven and every income post is toggleable; the expenditure side carries every proposal in the programme as a visible, individually toggleable post. Each post either offers named alternatives labeled by status (country / constitutional / legislated / pledge), or a plain percentage-of-budget field. All inputs are general — shares of GDP, GNI or the budget, or multiples of G; money amounts are computed read-only output. The land value tax (LVT) is the balance valve: its rate is whatever closes the gap, and the budget always balances as a structural invariant.' }),
    formulaBox('LVT valve rate = (expenditure − other income) / land value base'));
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
    })());
  main.append(bar);
  const incCard = card(el('h3', { text: 'Income posts (rule-driven, each toggleable)' }));
  main.append(incCard);
  const postsCard = card(el('h3', { text: 'Expenditure posts — share of budget first, money second' }));
  main.append(postsCard);
  const sankeyCard = card(el('h3', { text: 'Sankey — income to expenditure, the LVT valve closes' }), el('div', { id: 'sankey' }));
  main.append(sankeyCard);
  const balCard = card();
  main.append(balCard);
  const tsCard = card(el('h3', { text: 'Time series — SSB history and model projection (population-driven)' }), el('div', { class: 'chartbox', id: 'ts-chart' }));
  main.append(tsCard);
  let tsChart, sankeySvg;

  function draw() {
    const income = computeIncome(state.variant, state);
    const posts = computeExpenditure(state);
    const incomeTotal = income.reduce((s, i) => s + i.value, 0);
    const expTotal = expenditureTotal(posts);
    const valve = lvt(expTotal, incomeTotal);
    const gdp = get('budget.gdpNOK');
    const gni = get('budget.gniNOK');
    const totalBudget = expTotal;

    // income posts
    clear(incCard);
    incCard.append(el('h3', { text: 'Income posts (rule-driven, each toggleable)' }),
      table(['Post', 'Amount (read-only)', 'Share of budget', 'On/off'],
        computeIncome(state.variant, { incomeOn: {} }).map(i => {
          const cb = el('input', { type: 'checkbox' });
          cb.checked = state.incomeOn[i.id] !== false;
          cb.addEventListener('change', () => { state.incomeOn[i.id] = cb.checked; draw(); });
          return [i.name, fmtNOK(i.value), fmt(100 * i.value / (totalBudget || 1), 1) + ' %', cb];
        })));

    // expenditure posts
    clear(postsCard);
    postsCard.append(el('h3', { text: 'Expenditure posts — share of budget first, money second' }),
      table(['Post', 'Status', 'Input (general)', 'Share of budget', 'Amount (read-only)', 'On/off'],
        get('budget.expenditure.posts').map(p => {
          const row = posts.find(q => q.id === p.id);
          const cb = el('input', { type: 'checkbox' });
          cb.checked = state.on[p.id] !== false;
          cb.addEventListener('change', () => { state.on[p.id] = cb.checked; draw(); });
          let input;
          if (p.computed) {
            input = el('span', { class: 'desc', text: 'computed from the modules' });
          } else if (p.mode === 'budget') {
            const cur = state.budgetShare[p.id] ?? (p.valueNOK / get('budget.expenditure.posts').reduce((s, q) => s + (q.valueNOK || 0), 0));
            const i = el('input', { type: 'number', min: '0', max: '99', step: '0.1', value: String(100 * cur) });
            i.addEventListener('input', () => { state.budgetShare[p.id] = (Number(i.value) || 0) / 100; draw(); });
            input = el('span', null, i, ' % of budget');
          } else {
            const sel = el('select', { onchange: e => { state.choice[p.id] = Number(e.target.value); delete state.custom[p.id]; draw(); } },
              ...p.alternatives.map((a, k) => el('option', { value: String(k), text: a.name })));
            sel.value = String(state.choice[p.id] ?? 0);
            const ofWhat = p.mode === 'gni' ? 'GNI' : 'GDP';
            const cur = state.custom[p.id] ?? (p.alternatives[state.choice[p.id] ?? 0].share ?? p.valueNOK / (p.mode === 'gni' ? gni : gdp));
            const i = el('input', { type: 'number', min: '0', max: '100', step: '0.1', value: String(100 * cur) });
            i.addEventListener('input', () => { state.custom[p.id] = (Number(i.value) || 0) / 100; draw(); });
            input = el('span', null, sel, ' ', i, ' % of ' + ofWhat);
          }
          const status = p.computed ? flagPill(p.flag) : (p.alternatives ? flagPill(p.alternatives[state.choice[p.id] ?? 0].status) : flagPill(p.flag));
          const share = row ? fmt(100 * row.budgetShare, 1) + ' %' : '—';
          const amount = row ? fmtNOK(row.value) : '—';
          return [p.name, status, input, share, amount, cb];
        })));

    // balance card
    clear(balCard);
    balCard.append(el('h3', { text: 'Balance' }),
      table(['Quantity', 'Value'], [
        ['Income (rule-driven, toggled posts)', fmtNOK(incomeTotal)],
        ['Expenditure (toggled posts)', fmtNOK(expTotal)],
        ['Gap closed by the LVT valve (amount)', fmtNOK(valve.amount)],
        ['LVT valve rate = gap / land value base', fmt(100 * valve.rate, 2) + ' % of the land value base (not a share of budget or GDP)'],
        ['LVT share of the total budget', fmt(100 * valve.budgetShare, 1) + ' % of the total budget'],
        ['Transfer to the oil fund', valve.surplus > 0 ? fmtNOK(valve.surplus) : '—'],
        ['Budget balance', Math.abs(expTotal - incomeTotal - valve.amount) < 1e-6 ? el('span', { class: 'ok', text: '\u2713 always balances (invariant)' }) : el('span', { class: 'bad', text: 'broken' })],
        ['Mondiala\u2019s 3% deficit cap', expTotal <= incomeTotal + valve.amount ? el('span', { class: 'ok', text: '\u2713 0% deficit — the cap holds structurally' }) : '—']
      ], [1]));

    // Sankey via d3-sankey
    const box = document.getElementById('sankey');
    box.replaceChildren();
    const w = Math.min(1100, box.clientWidth || 1100), h = 560;
    const nodes = [];
    const links = [];
    const nodeIndex = {};
    function node(name) {
      if (!(name in nodeIndex)) { nodeIndex[name] = nodes.length; nodes.push({ name }); }
      return nodeIndex[name];
    }
    for (const i of income) { node(i.name); links.push({ source: node(i.name), target: node('Expenditure'), value: i.value }); }
    if (valve.amount > 0) {
      const name = 'LVT valve (' + fmt(100 * valve.rate, 2) + ' % of the land value base)';
      links.push({ source: node(name), target: node('Expenditure'), value: valve.amount });
    }
    if (valve.surplus > 0) { node('Oil fund — deposit'); links.push({ source: node('Expenditure'), target: node('Oil fund — deposit'), value: valve.surplus }); }
    for (const p of posts) {
      const name = p.name + ' (' + fmt(100 * p.budgetShare, 1) + ' %)';
      links.push({ source: node('Expenditure'), target: node(name), value: p.value });
    }
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
    tsChart = new Chart(chartCanvas('ts-chart'), {
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
    const t = { country: 'country', constitutional: 'constitutional', legislated: 'legislated', pledge: 'pledge' }[flag] || flag;
    return el('span', { class: 'pill', text: t });
  }
  draw();
}
