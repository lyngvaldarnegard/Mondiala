import { get, getWithOverride } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox } from './ui.js';

// Single-year population counts, spread uniformly over the curated bins.
export function ageCounts(total = get('population.total')) {
  const bins = get('population.ageDistribution.bins');
  const counts = [];
  for (let a = 0; a <= 100; a++) counts[a] = 0;
  for (const b of bins) {
    const nYears = b.to - b.from + 1;
    const perYear = b.share * total / nYears;
    for (let a = b.from; a <= Math.min(b.to, 100); a++) counts[a] += perYear;
  }
  return counts;
}

export function groups(counts) {
  let U = 0, V = 0, E = 0; // children+young, workforce, elderly (67+)
  for (let a = 0; a < counts.length; a++) {
    if (a <= 24) U += counts[a];
    else if (a <= 66) V += counts[a];
    else E += counts[a];
  }
  return { U, V, E };
}

// P = max(1% × N, V/1.5 − U) — how many pensioners the economy carries.
export function queueSize(N, U, V) {
  return Math.max(0.01 * N, V / 1.5 - U);
}

// l_j' = max(1, L_ref / L_j), computed from register data at runtime — upward only.
export function occupationWeights() {
  const occ = get('occupationalLifeExpectancy.occupations');
  const Lref = get('occupationalLifeExpectancy.L_ref');
  return occ.map(o => ({ ...o, l: Math.max(1, Lref / o.L) }));
}

const WORK_START = 25;

// Virtual (adjusted) age: age + Σ(years in occupation × (l_j' − 1)).
// Career length assumed from WORK_START for the aggregate model; the
// individual calculator uses the user's own occupation-share table.
export function virtualAge(age, weights, careerYears) {
  let v = age;
  for (const w of weights) v += careerYears * w.share * (w.l - 1);
  return v;
}

// Build the population sorted by (adjusted) age, descending; the cutoff is
// the adjusted age of person nr. P.
export function cutoff(actualMode = false, counts = ageCounts()) {
  const N = counts.reduce((s, c) => s + c, 0);
  const { U, V } = groups(counts);
  const P = queueSize(N, U, V);
  const weights = occupationWeights();
  const persons = [];
  for (let a = 0; a < counts.length; a++) {
    if (actualMode) {
      persons.push({ age: a, vage: a, count: counts[a] });
    } else {
      // split each single-year cohort over occupations
      for (const w of weights) {
        const career = Math.max(0, a - WORK_START);
        persons.push({ age: a, vage: a + career * (w.l - 1), count: counts[a] * w.share });
      }
    }
  }
  persons.sort((p, q) => q.vage - p.vage);
  let acc = 0, cut = null;
  for (const p of persons) {
    acc += p.count;
    if (acc >= P) { cut = p.vage; break; }
  }
  let accA = 0, cutActual = null;
  const byAge = persons.slice().sort((p, q) => q.age - p.age);
  for (const p of byAge) {
    accA += p.count;
    if (accA >= P) { cutActual = p.age; break; }
  }
  return { N, U, V, P, cutoff: cut, cutoffActual: cutActual };
}

export function pensionCost() {
  const G = get('G');
  const level = getWithOverride('pensionLevelG');
  const c = cutoff();
  return c.P * level * G;
}

const state = { actualMode: false, calcAge: 62, shares: null };

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Pensjon — en kø, ikke en fast alder' }),
    el('p', { class: 'desc', text: 'P = max(1 % × N, V/1.5 − U) bestemmer hvor mange pensjonister økonomien bærer: U = barn + unge (0–24), V = arbeidsstyrken (25–66). Utgangsalderen er den justerte (virtuelle) alderen til person nr. P i en befolkning sortert synkende. Virtuell alder = alder + Σ(år i yrke × (l_j′ − 1)), der l_j′ = max(1, L_ref/L_j) — kun oppover, harde yrker tjener køpoeng raskere, trygge teller nøyaktig 1.0. Pensjonsnivå: 3 G/år.' }),
    formulaBox('P = max(1 % × N, V/1.5 − U)'));
  const bar = card(
    el('label', { text: 'Visning' }),
    (() => {
      const s = el('select', { onchange: e => { state.actualMode = e.target.value === 'actual'; draw(); } },
        el('option', { value: 'virtual', text: 'Virtuell alder (justert)' }),
        el('option', { value: 'actual', text: 'Faktisk alder' }));
      s.value = state.actualMode ? 'actual' : 'virtual';
      return s;
    })());
  main.append(bar);
  const outCard = card();
  const chartCard = card(el('h3', { text: 'Aldersfordeling med utgangslinje' }), el('div', { class: 'chartbox', id: 'age-chart' }));
  const socCard = card(el('h3', { text: 'Samfunnsmodell over SSB-historikk + projeksjoner' }), el('div', { class: 'chartbox', id: 'soc-chart' }));
  const calcCard = card(el('h3', { text: 'Individuell kalkulator' }));
  const wCard = card(el('h3', { text: 'Yrkesvekter l_j′ = max(1, L_ref/L_j) — regnet i appen fra registerdata' }));
  main.append(outCard, chartCard, socCard, calcCard, wCard);
  let ageChart, socChart;

  function draw() {
    const G = get('G');
    const counts = ageCounts();
    const c = cutoff(state.actualMode, counts);
    const { E } = groups(counts);
    clear(outCard);
    outCard.append(table(['Størrelse', 'Verdi'], [
      ['Befolkning N', fmt(c.N)],
      ['Barn + unge U (0–24)', fmt(c.U)],
      ['Arbeidsstyrke V (25–66)', fmt(c.V)],
      ['Kø P = max(1 % × N, V/1.5 − U)', fmt(c.P)],
      ['Nåværende pensjonister (67+)', fmt(E) + (c.P > E ? ' — køen er lengre' : '')],
      ['Utgangsalder (' + (state.actualMode ? 'faktisk' : 'virtuell') + ')', fmt(c.cutoff, 1) + ' år'],
      ['Utgangsalder (faktisk, til sammenligning)', fmt(c.cutoffActual, 1) + ' år'],
      ['Pensjonskostnad (3 G/år)', fmtNOK(pensionCost())]
    ], [1]));

    ageChart?.destroy();
    const labels = counts.map((_, a) => a);
    // In virtual mode the distribution is re-bucketed over virtual ages —
    // the toggle visibly shifts the chart.
    let data;
    if (state.actualMode) {
      data = counts.slice();
    } else {
      const weights = occupationWeights();
      data = new Array(counts.length).fill(0);
      for (let a = 0; a < counts.length; a++) {
        const career = Math.max(0, a - WORK_START);
        for (const w of weights) {
          const v = Math.min(counts.length - 1, Math.floor(a + career * (w.l - 1)));
          data[v] += counts[a] * w.share;
        }
      }
    }
    const cutValue = state.actualMode ? c.cutoffActual : c.cutoff;
    const cutoffLine = {
      id: 'cutoffLine',
      afterDatasetsDraw(chart) {
        const x = chart.scales.x.getPixelForValue(Math.round(cutValue));
        const { top, bottom } = chart.chartArea;
        const ctx = chart.ctx;
        ctx.save();
        ctx.strokeStyle = '#e8b04b';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#e8b04b';
        ctx.fillText(`utgang ${fmt(cutValue, 1)} år`, x + 6, top + 12);
        ctx.restore();
      }
    };
    ageChart = new Chart(document.getElementById('age-chart'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: state.actualMode ? 'Personer per faktisk alder' : 'Personer per virtuell alder',
          data,
          backgroundColor: '#3fb950'
        }]
      },
      plugins: [cutoffLine],
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: 'Personer' } },
          x: { title: { display: true, text: state.actualMode ? 'Faktisk alder' : 'Virtuell alder (kohort-yrkesblanding)' } }
        },
        plugins: {
          annotationLike: false,
          tooltip: { callbacks: {} },
          legend: { display: false },
          title: {
            display: true,
            text: `Utgangslinje: person nr. ${fmt(c.P)} — ${state.actualMode ? 'faktisk' : 'virtuell'} alder ${fmt(state.actualMode ? c.cutoffActual : c.cutoff, 1)} år`
          }
        }
      }
    });

    // society model over history + projections
    const hist = get('population.history');
    const proj = get('population.projections');
    const years = [...hist.years, ...proj.years.filter(y => y > hist.years[hist.years.length - 1])];
    const totals = [...hist.totals, ...proj.totals.slice(hist.totals.length)];
    const rows = years.map((y, i) => {
      const cnt = ageCounts(totals[i]);
      const g = groups(cnt);
      const P = queueSize(totals[i], g.U, g.V);
      const cc = cutoff(false, cnt);
      return { year: y, total: totals[i], P, cutoff: cc.cutoff };
    });
    socChart?.destroy();
    socChart = new Chart(document.getElementById('soc-chart'), {
      type: 'line',
      data: {
        labels: rows.map(r => r.year),
        datasets: [
          { label: 'Kø P (antall pensjonister)', data: rows.map(r => r.P), borderColor: '#e8b04b', yAxisID: 'y' },
          { label: 'Virtuell utgangsalder', data: rows.map(r => r.cutoff), borderColor: '#3fb950', yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { position: 'left', title: { display: true, text: 'P' } },
          y1: { position: 'right', title: { display: true, text: 'Alder' } }
        }
      }
    });

    // individual calculator with editable occupation-share table
    const weights = occupationWeights();
    if (!state.shares) state.shares = Object.fromEntries(weights.map(w => [w.name, w.share]));
    clear(calcCard);
    calcCard.append(el('h3', { text: 'Individuell kalkulator' }),
      el('label', { text: 'Din alder' }),
      (() => {
        const i = el('input', { type: 'number', min: '16', max: '100', value: String(state.calcAge) });
        i.addEventListener('input', () => { state.calcAge = Number(i.value) || 0; drawCalc(); });
        return i;
      })(),
      el('p', { class: 'desc', text: 'Rediger yrkesandelene (må summere seg til 1) — antagelsestabellen er din; vektene kommer fra registeret.' }),
      el('div', { id: 'calc-out' }));
    const shareTable = table(['Yrke', 'Andel', 'l_j′'], weights.map(w => {
      const inp = el('input', { type: 'number', step: '0.01', min: '0', max: '1', value: String(state.shares[w.name]) });
      inp.addEventListener('input', () => { state.shares[w.name] = Number(inp.value) || 0; drawCalc(); });
      return [w.name, inp, fmt(w.l, 3)];
    }));
    calcCard.append(shareTable);
    function drawCalc() {
      const career = Math.max(0, state.calcAge - WORK_START);
      let vage = state.calcAge;
      for (const w of weights) vage += career * (state.shares[w.name] || 0) * (w.l - 1);
      const cc = cutoff(false);
      const out = document.getElementById('calc-out');
      out.replaceChildren(table(
        ['Din faktiske alder', 'Din virtuelle alder', 'Utgangsalder (virtuell)', 'Posisjon'],
        [[fmt(state.calcAge) + ' år', fmt(vage, 1) + ' år', fmt(cc.cutoff, 1) + ' år',
          vage >= cc.cutoff ? el('span', { class: 'ok', text: 'over utgangslinjen — pensjonert' }) : el('span', { class: 'bad', text: 'under utgangslinjen — i køen' })]]));
    }
    drawCalc();

    // weights table
    clear(wCard);
    wCard.append(el('h3', { text: 'Yrkesvekter l_j′ = max(1, L_ref/L_j) — regnet i appen fra registerdata' }),
      table(['Yrke', 'L_j (register)', 'l_j′', 'Køpoeng per yrkesår'],
        weights.map(w => [w.name, fmt(w.L, 1) + ' år', fmt(w.l, 3), fmt(w.l - 1, 3)]), [1, 2, 3]));
  }
  draw();
}
