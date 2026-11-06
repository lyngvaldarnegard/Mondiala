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
    { id: 'oil', name: 'Oljefondet (3 %-regelen)', value: d.oilFundWithdrawalNOK },
    { id: 'wage', name: 'Arbeidsgiveravgift', value: d.employerAvgiftNOK },
    { id: 'corp', name: 'Selskapsskatt 22 %', value: d.corporateTaxNOK },
    { id: 'inctax', name: 'Inntektsskatt (variant ' + variant + ')', value: decileRevenue }
  ];
}

export function computeExpenditure(settings) {
  const posts = get('budget.expenditure.posts');
  const gdp = get('budget.gdpNOK');
  const gni = get('budget.gniNOK');
  return posts.map(p => {
    if (p.computed === 'pension') return { ...p, value: settings.pensionOn ? pensionCost() : 0 };
    if (p.computed === 'foodcard') return { ...p, value: settings.foodcardOn ? foodCardCost() : 0 };
    if (p.computed === 'municipal') return { ...p, value: settings.municipalOn ? nationalGrantTotal() : 0 };
    let v = p.valueNOK * (settings.scale[p.id] ?? 1);
    if (p.gdpShare) v = Math.max(p.gdpShare[0], Math.min(p.gdpShare[1], settings.gdpShare[p.id] ?? p.default)) * gdp;
    if (p.gniShare) v = Math.max(p.gniShare[0], Math.min(p.gniShare[1], settings.gniShare[p.id] ?? p.default)) * gni;
    if (p.targetShare) v = settings.cultureTarget ? p.targetShare * gdp : v * (settings.scale[p.id] ?? 1);
    return { ...p, value: v };
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
  scale: {},
  gdpShare: {},
  gniShare: {},
  cultureTarget: false,
  pensionOn: true, foodcardOn: true, municipalOn: true,
  preset: null
};

const presets = {
  cheapest: { name: 'Billigste vedtatte bunt', gdp: { health: 0.04, education: 0.04, defence: 0.02, research: 0 }, gni: { aid: 0.007 }, scale: { transport: .8, admin: .8, culture: 0, interest: 1 } },
  priciest: { name: 'Dyreste vedtatte bunt', gdp: { health: 0.08, education: 0.08, defence: 0.05, research: 1.4 }, gni: { aid: 0.01 }, scale: { transport: 1.3, admin: 1.2, culture: 1.5, interest: 1 } },
  mondiala: { name: 'Mondialas grunnlov (gulv og lok)', gdp: { health: 0.07, education: 0.06, defence: 0.02, research: 1 }, gni: { aid: 0.007 }, scale: { transport: 1, admin: 1, culture: 1, interest: 1 } }
};

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Statsbudsjettet — Sankey med LVT-ventilen' }),
    el('p', { class: 'desc', text: 'Inntektssiden er låst og regelstyrt: oljefondet etter 3 %-regelen, arbeidsgiveravgift, 22 % selskapsskatt og inntektsskatten fra valgt variant. Utgiftspostene er redigerbare med statusflagg (grunnlov / lovvedtatt / løfte) og landepresets. Eiendomsskatten på grunnverdi (LVT) er balanseventilen: satten er det som lukker gapet — budsjettet balanserer alltid, som strukturell invariant, aldri en UI-tilstand.' }),
    formulaBox('LVT-sats = (utgifter − øvrig inntekt) / grunnverdi­base'));
  const bar = card(
    el('label', { text: 'Skattevariant' }),
    (() => {
      const s = el('select', { onchange: e => { state.variant = e.target.value; draw(); } },
        ...['A', 'B', 'C'].map(v => el('option', { value: v, text: 'Variant ' + v })));
      s.value = state.variant;
      return s;
    })(),
    el('label', { text: 'Pensjonsnivå (G/år)' }),
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
  const postsCard = card(el('h3', { text: 'Utgiftsposter' }));
  main.append(postsCard);
  const sankeyCard = card(el('h3', { text: 'Sankey — inntekt til utgift, LVT-ventilen lukker' }), el('div', { id: 'sankey' }));
  main.append(sankeyCard);
  const balCard = card();
  main.append(balCard);
  const tsCard = card(el('h3', { text: 'Tidsserie — SSB-historikk og modellprojeksjon (befolkningsdrevet)' }), el('div', { class: 'chartbox', id: 'ts-chart' }));
  main.append(tsCard);
  let tsChart, sankeySvg;

  function applyPreset(key) {
    state.preset = key || null;
    if (!key) { draw(); return; }
    const p = presets[key];
    Object.assign(state.gdpShare, p.gdp);
    Object.assign(state.gniShare, p.gni);
    Object.assign(state.scale, p.scale);
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
    postsCard.append(el('h3', { text: 'Utgiftsposter' }),
      table(['Post', 'Flagg', 'Verdi', 'Skru av/på', 'Justering'],
        posts.map(p => {
          const cb = el('input', { type: 'checkbox' });
          cb.checked = state.on[p.id] !== false;
          cb.addEventListener('change', () => { state.on[p.id] = cb.checked; draw(); });
          let adj = '—';
          if (p.gdpShare) {
            const r = el('input', { type: 'range', min: String(p.gdpShare[0]), max: String(p.gdpShare[1]), step: '0.001', value: String(state.gdpShare[p.id] ?? p.default) });
            r.addEventListener('input', () => { state.gdpShare[p.id] = Number(r.value); draw(); });
            adj = r;
          } else if (p.gniShare) {
            const r = el('input', { type: 'range', min: String(p.gniShare[0]), max: String(p.gniShare[1]), step: '0.001', value: String(state.gniShare[p.id] ?? p.default) });
            r.addEventListener('input', () => { state.gniShare[p.id] = Number(r.value); draw(); });
            adj = r;
          } else if (!p.computed) {
            const r = el('input', { type: 'range', min: '0', max: '2', step: '0.05', value: String(state.scale[p.id] ?? 1) });
            r.addEventListener('input', () => { state.scale[p.id] = Number(r.value); draw(); });
            adj = r;
          }
          return [p.name, flagPill(p.flag), fmtNOK(p.value), cb, adj];
        })));

    // balance card
    clear(balCard);
    balCard.append(el('h3', { text: 'Balanse' }),
      table(['Størrelse', 'Verdi'], [
        ['Inntekt (låst, regelstyrt)', fmtNOK(incomeTotal)],
        ['Utgifter', fmtNOK(expTotal)],
        ['LVT-ventil (beløp)', fmtNOK(valve.amount)],
        ['Implisitt LVT-sats', fmt(100 * valve.rate, 2) + ' % av grunnverdi­basen'],
        ['Overføring til oljefondet', valve.surplus > 0 ? fmtNOK(valve.surplus) : '—'],
        ['Budsjettbalanse', expTotal === incomeTotal + valve.amount ? el('span', { class: 'ok', text: '✓ balanserer alltid (invariant)' }) : el('span', { class: 'bad', text: 'brukket' })],
        ['Mondialas 3 %-underskuddstak', expTotal <= incomeTotal + valve.amount ? el('span', { class: 'ok', text: '✓ 0 % underskudd — taket holder strukturelt' }) : '—']
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
    for (const i of income) { node(i.name); links.push({ source: node(i.name), target: node('Utgifter'), value: i.value }); }
    if (valve.amount > 0) { node('LVT — balanseventil (' + fmt(100 * valve.rate, 2) + ' %)'); links.push({ source: node('LVT — balanseventil (' + fmt(100 * valve.rate, 2) + ' %)'), target: node('Utgifter'), value: valve.amount }); }
    if (valve.surplus > 0) { node('Oljefondet — innskudd'); links.push({ source: node('Utgifter'), target: node('Oljefondet — innskudd'), value: valve.surplus }); }
    for (const p of posts) { node(p.name); links.push({ source: node('Utgifter'), target: node(p.name), value: p.value }); }
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
          { label: 'Utgifter (befolkningsdrevet modell)', data: totals.map(t => expTotal * t / basePop), borderColor: '#f85149' },
          { label: 'Låst inntekt (modell)', data: totals.map(t => incomeTotal * t / basePop), borderColor: '#3fb950' },
          { label: 'LVT-ventil', data: totals.map(t => Math.max(0, (expTotal - incomeTotal)) * t / basePop), borderColor: '#e8b04b' }
        ]
      },
      options: { responsive: true, scales: { y: { title: { display: true, text: 'kr' } } } }
    });
  }
  function flagPill(flag) {
    const t = { constitutional: 'grunnlov', legislated: 'lovvedtatt', pledge: 'løfte' }[flag] || flag;
    return el('span', { class: 'pill', text: t });
  }
  draw();
}
