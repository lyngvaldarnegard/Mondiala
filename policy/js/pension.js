import { get, getWithOverride } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox, chartCanvas } from './ui.js';

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
  main.append(el('h2', { text: 'Pension — a queue, not a fixed age' }),
    el('p', { class: 'desc', text: 'P = max(1 % × N, V/1.5 − U) decides how many pensioners the economy carries: U = children + young (0–24), V = the workforce (25–66). The exit age is the adjusted (virtual) age of person no. P in a population sorted descending. Virtual age = age + Σ(years in occupation × (l_j′ − 1)), where l_j′ = max(1, L_ref/L_j) — upward only, hard occupations earn queue credit faster, safe ones count exactly 1.0. Pension level: 3 G/year.' }),
    formulaBox('P = max(1 % × N, V/1.5 − U)'));
  const bar = card(
    el('label', { text: 'View' }),
    (() => {
      const s = el('select', { onchange: e => { state.actualMode = e.target.value === 'actual'; draw(); } },
        el('option', { value: 'virtual', text: 'Virtual age (adjusted)' }),
        el('option', { value: 'actual', text: 'Actual age' }));
      s.value = state.actualMode ? 'actual' : 'virtual';
      return s;
    })());
  main.append(bar);
  const outCard = card();
  const chartCard = card(el('h3', { text: 'Age distribution with the exit line' }), el('div', { class: 'chartbox', id: 'age-chart' }));
  const socCard = card(el('h3', { text: 'Society model over SSB history + projections' }), el('div', { class: 'chartbox', id: 'soc-chart' }));
  const calcCard = card(el('h3', { text: 'Individual calculator' }));
  const wCard = card(el('h3', { text: 'Occupation weights l_j′ = max(1, L_ref/L_j) — computed in-app from register data' }));
  main.append(outCard, chartCard, socCard, calcCard, wCard);
  let ageChart, socChart;

  function draw() {
    const G = get('G');
    const counts = ageCounts();
    const c = cutoff(state.actualMode, counts);
    const { E } = groups(counts);
    clear(outCard);
    outCard.append(table(['Quantity', 'Value'], [
      ['Population N', fmt(c.N)],
      ['Children + young U (0–24)', fmt(c.U)],
      ['Workforce V (25–66)', fmt(c.V)],
      ['Queue P = max(1 % × N, V/1.5 − U)', fmt(c.P)],
      ['Current pensioners (67+)', fmt(E) + (c.P > E ? ' — the queue is longer' : '')],
      ['Exit age (' + (state.actualMode ? 'actual' : 'virtual') + ')', fmt(c.cutoff, 1) + ' years'],
      ['Exit age (actual, for comparison)', fmt(c.cutoffActual, 1) + ' years'],
      ['Pension cost (3 G/year)', fmtNOK(pensionCost())]
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
        ctx.fillText(`exit ${fmt(cutValue, 1)} years`, x + 6, top + 12);
        ctx.restore();
      }
    };
    ageChart = new Chart(chartCanvas('age-chart'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: state.actualMode ? 'People per actual age' : 'People per virtual age',
          data,
          backgroundColor: '#3fb950'
        }]
      },
      plugins: [cutoffLine],
      options: {
        responsive: true,
        scales: {
          y: { title: { display: true, text: 'People' } },
          x: { title: { display: true, text: state.actualMode ? 'Actual age' : 'Virtual age (cohort occupation mix)' } }
        },
        plugins: {
          annotationLike: false,
          tooltip: { callbacks: {} },
          legend: { display: false },
          title: {
            display: true,
            text: `Exit line: person no. ${fmt(c.P)} — ${state.actualMode ? 'actual' : 'virtual'} age ${fmt(state.actualMode ? c.cutoffActual : c.cutoff, 1)} years`
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
    socChart = new Chart(chartCanvas('soc-chart'), {
      type: 'line',
      data: {
        labels: rows.map(r => r.year),
        datasets: [
          { label: 'Queue P (number of pensioners)', data: rows.map(r => r.P), borderColor: '#e8b04b', yAxisID: 'y' },
          { label: 'Virtual exit age', data: rows.map(r => r.cutoff), borderColor: '#3fb950', yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { position: 'left', title: { display: true, text: 'P' } },
          y1: { position: 'right', title: { display: true, text: 'Age' } }
        }
      }
    });

    // individual calculator with editable occupation-share table
    const weights = occupationWeights();
    if (!state.shares) state.shares = Object.fromEntries(weights.map(w => [w.name, w.share]));
    clear(calcCard);
    calcCard.append(el('h3', { text: 'Individual calculator' }),
      el('label', { text: 'Your age' }),
      (() => {
        const i = el('input', { type: 'number', min: '16', max: '100', value: String(state.calcAge) });
        i.addEventListener('input', () => { state.calcAge = Number(i.value) || 0; drawCalc(); });
        return i;
      })(),
      el('p', { class: 'desc', text: 'Edit the occupation shares (must sum to 1) — the assumption table is yours; the weights come from the register.' }),
      el('div', { id: 'calc-out' }));
    const shareTable = table(['Occupation', 'Share', 'l_j′'], weights.map(w => {
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
        ['Your actual age', 'Your virtual age', 'Exit age (virtual)', 'Position'],
        [[fmt(state.calcAge) + ' years', fmt(vage, 1) + ' years', fmt(cc.cutoff, 1) + ' years',
          vage >= cc.cutoff ? el('span', { class: 'ok', text: 'above the exit line — retired' }) : el('span', { class: 'bad', text: 'below the exit line — in the queue' })]]));
    }
    drawCalc();

    // weights table
    clear(wCard);
    wCard.append(el('h3', { text: 'Occupation weights l_j′ = max(1, L_ref/L_j) — computed in-app from register data' }),
      table(['Occupation', 'L_j (register)', 'l_j′', 'Queue credit per occupation-year'],
        weights.map(w => [w.name, fmt(w.L, 1) + ' years', fmt(w.l, 3), fmt(w.l - 1, 3)]), [1, 2, 3]));
  }
  draw();
}
