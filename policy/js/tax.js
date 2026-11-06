import { get, getWithOverride } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox } from './ui.js';

// ---- One shared base -----------------------------------------------
// alminnelig inntekt minus the interest deduction, keeping financial fees,
// small-scale business expenses, BSU and IPS. Implemented once; every
// variant is a toggle over this base.
export function baseIncome(input) {
  const { gross = 0, financialFees = 0, businessExpenses = 0, bsu = 0, ips = 0, interestPaid = 0 } = input;
  return gross + financialFees - businessExpenses - bsu - ips - interestPaid;
}

// ---- Variant A: "trappen" ------------------------------------------
// marginal 0/10/20/30/40/50 % per 1 G bracket
export function taxA(base, G) {
  const step = 1; // brackets are 1 G wide
  const rates = [0, 0.10, 0.20, 0.30, 0.40, 0.50];
  let tax = 0;
  let remaining = Math.max(0, base);
  let k = 0;
  while (remaining > 0) {
    const rate = rates[Math.min(k, rates.length - 1)];
    const width = Math.min(remaining, step * G);
    tax += rate * width;
    remaining -= width;
    k++;
  }
  return tax;
}
export function marginalA(base, G) {
  const k = Math.max(0, Math.floor(base / G));
  const rates = [0, 0.10, 0.20, 0.30, 0.40, 0.50];
  return rates[Math.min(k, rates.length - 1)];
}

// ---- Variant B: "sjablongen" ---------------------------------------
// tax = 0.5 × max(0, I − 3 G); welfare benefits (food card, barnetrygd
// 1 G/child, student stipend) add to the base. A 3 G pension hits the
// threshold exactly — zero tax, the demographic protection.
export function taxB(base, G, benefits = 0) {
  const threshold = get('tax.variantB.thresholdG') * G;
  return get('tax.variantB.rate') * Math.max(0, base + benefits - threshold);
}

// ---- Variant C: "desil-ankret" -------------------------------------
// flat X % above the Y-th percentile — one anchor number (median wage,
// SSB 11418) plus one rate. No distribution machinery.
export function taxC(base, anchor, ratePct) {
  return (ratePct / 100) * Math.max(0, base - anchor);
}

// ---- Today's system (comparison only) ------------------------------
export function taxToday(gross) {
  const trygdeavgift = 0.077 * Math.max(0, gross);
  const alminnelig = Math.max(0, gross - 0.46 * 136549); // minstefradrag + personfradrag, illustrative
  const brackets = [[0, 0.1934], [0.1934, 0.2678], [0.2678, 0.3667], [0.3667, 0.7529], [0.7529, 1.0], [1.0, 1.6], [1.6, Infinity]];
  const trinn = [[0.017, 0.0198], [0.04, 0.0445], [0.1328, 0.1353], [0.1724, 0.1762], [0.1745, 0.1762], [0.1762, 0.1762]];
  let trinnskatt = 0;
  for (let i = 0; i < trinn.length; i++) {
    const lo = brackets[i][0] * 136549, hi = brackets[i][1] * 136549;
    const w = Math.min(Math.max(0, gross - lo), hi - lo);
    trinnskatt += w * trinn[i][1];
  }
  return trygdeavgift + 0.22 * alminnelig + trinnskatt;
}

// Aggregate revenue per decile from SSB income distribution data (V1: decile means).
export function revenueByDecile(variant) {
  const G = get('G');
  const means = get('income.decileMeans.means');
  const persons = get('income.decileMeans.personsPerDecile');
  const anchor = getWithOverride('income.medianWageYear');
  return means.map((m, i) => {
    const base = baseIncome({ gross: m });
    let t = 0;
    if (variant === 'A') t = taxA(base, G);
    if (variant === 'B') t = taxB(base, G, 0);
    if (variant === 'C') t = taxC(base, anchor, 50);
    return { decile: 'D' + (i + 1), mean: m, tax: t, revenue: t * persons };
  });
}

const state = {
  variant: 'A', gross: 700000, interestPaid: 80000, financialFees: 0,
  businessExpenses: 0, bsu: 0, ips: 20000, children: 2, rateC: 50, percentileC: 50
};

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Skatt — én base, tre varianter' }),
    el('p', { class: 'desc', text: 'Én felles skattebase: alminnelig inntekt minus rentefradraget, med finansielle gebyrer, småskalafordringer, BSU og IPS beholdt. Trygdeavgift, trinnskatt og formuesskatt er fjernet; arbeidsgiveravgift og 22 % selskapsskatt består. Variantene er brytere over den samme basen.' }),
    formulaBox('base = brutto + fin.gebyrer − småskala − BSU − IPS − rentefradrag'));
  const bar = card();
  const variantSel = el('select', { onchange: e => { state.variant = e.target.value; draw(); } },
    ...['A', 'B', 'C'].map(v => el('option', { value: v, text: 'Variant ' + v, selected: state.variant === v ? '' : null })));
  variantSel.value = state.variant;
  bar.append(el('label', { text: 'Variant' }), variantSel,
    el('label', { text: 'Brutto inntekt (kr)' }), numInput('gross'),
    el('label', { text: 'Renteutgifter (fradragspost, kr)' }), numInput('interestPaid'),
    el('label', { text: 'IPS-innskudd (kr)' }), numInput('ips'),
    el('label', { text: 'Barn (barnetrygd til B-basen)' }), numInput('children', 0, 10));
  main.append(bar);
  const out = card();
  main.append(out);
  const chartGrid = el('div', { class: 'grid' });
  const cumCard = card(el('h3', { text: 'Kumulativ skatt etter inntekt (G-multipler)' }), el('div', { class: 'chartbox', id: 'cum-chart' }));
  const todayCard = card(el('h3', { text: 'Sammenlignet med dagens system' }), el('div', { class: 'chartbox', id: 'today-chart' }));
  const decileCard = card(el('h3', { text: 'Skatteinntekt per desil (SSB-desilgjennomsnitt, V1)' }), el('div', { class: 'chartbox', id: 'decile-chart' }));
  chartGrid.append(cumCard, todayCard, decileCard);
  main.append(chartGrid);
  const checkCard = card(el('h3', { text: 'Kontroltabell — variant A kumulativ skatt (spesifikasjon)' }));
  main.append(checkCard);
  let cumChart, todayChart, decileChart;

  function numInput(key, min = 0, max = 10000000) {
    const i = el('input', { type: 'number', value: String(state[key]), min: String(min), max: String(max) });
    i.addEventListener('input', () => { state[key] = Number(i.value) || 0; draw(); });
    return i;
  }

  function draw() {
    const G = get('G');
    const base = baseIncome(state);
    const benefits = benefitsFor(state);
    let tax = 0, formula = '';
    if (state.variant === 'A') { tax = taxA(base, G); formula = 'trappen: marginal 0/10/20/30/40/50 % per 1 G bracket'; }
    if (state.variant === 'B') { tax = taxB(base, G, benefits); formula = `sjablong: 0.5 × max(0, I − ${get('tax.variantB.thresholdG')} G) der I = base + ytelser`; }
    if (state.variant === 'C') { tax = taxC(base, getWithOverride('income.medianWageYear'), state.rateC); formula = `desil-ankret: ${state.rateC} % av base over ankeret (${fmt(getWithOverride('income.medianWageYear'))} kr, medianlønn SSB 11418)`; }
    clear(out);
    out.append(
      el('p', null, formulaBox(formula)),
      table(['Størrelse', 'Verdi'], [
        ['Skattebase', fmtNOK(base)],
        ['Ytelser lagt til basen (B)', fmtNOK(benefits)],
        ['Skatt', fmtNOK(tax)],
        ['Gjennomsnittssats', fmt(base > 0 ? 100 * tax / base : 0, 1) + ' %'],
        ['Grunnbeløpet G', fmt(G) + ' kr']
      ], [1]),
      state.variant === 'B'
        ? el('p', { class: 'desc', text: 'Illustrasjon (aldri formelen): «kort-sporingsteorien» — hver borgers betalinger og ytelser føres på et kort, og netto bidrag vises på slutten. Sjablongen over er det som er implementert.' })
        : null);

    // cumulative chart
    const xs = [];
    for (let g = 0; g <= 10.01; g += 0.25) xs.push(g);
    const series = xs.map(g => {
      const b = g * G;
      if (state.variant === 'A') return taxA(b, G) / G;
      if (state.variant === 'B') return taxB(b, G, 0) / G;
      return taxC(b, getWithOverride('income.medianWageYear'), state.rateC) / G;
    });
    cumChart?.destroy();
    cumChart = new Chart(document.getElementById('cum-chart'), {
      type: 'line',
      data: { labels: xs.map(x => fmt(x, 2)), datasets: [{ label: 'Kumulativ skatt (i G)', data: series, borderColor: '#e8b04b', tension: .2, pointRadius: 0 }] },
      options: { responsive: true, scales: { x: { title: { display: true, text: 'Inntekt (G)' } }, y: { title: { display: true, text: 'Skatt (G)' } } } }
    });

    // comparison vs today
    const incomes = [200000, 400000, 600000, 800000, 1000000, 1500000, 2000000];
    const model = incomes.map(i => {
      const b = baseIncome({ gross: i });
      if (state.variant === 'A') return taxA(b, G);
      if (state.variant === 'B') return taxB(b, G, benefitsFor({ gross: i }));
      return taxC(b, getWithOverride('income.medianWageYear'), state.rateC);
    });
    const today = incomes.map(i => taxToday(i));
    todayChart?.destroy();
    todayChart = new Chart(document.getElementById('today-chart'), {
      type: 'bar',
      data: { labels: incomes.map(fmtNOK), datasets: [
        { label: 'Modell ' + state.variant, data: model, backgroundColor: '#e8b04b' },
        { label: 'Dagens system (estimat)', data: today, backgroundColor: '#7d8b9d' }] },
      options: { responsive: true, scales: { y: { title: { display: true, text: 'Skatt (kr)' } } } }
    });

    // decile revenue
    const rev = revenueByDecile(state.variant);
    decileChart?.destroy();
    decileChart = new Chart(document.getElementById('decile-chart'), {
      type: 'bar',
      data: { labels: rev.map(r => r.decile), datasets: [
        { label: 'Skatt per person (kr)', data: rev.map(r => r.tax), backgroundColor: '#3fb950' },
        { label: 'Snittinntekt (kr)', data: rev.map(r => r.mean), backgroundColor: '#2b3244' }] },
      options: { responsive: true }
    });

    // spec check table for variant A
    clear(checkCard);
    checkCard.append(el('h3', { text: 'Kontroltabell — variant A kumulativ skatt (spesifikasjon)' }),
      table(['Inntekt', 'Skatt (G)', 'Sjekk'],
        [1, 2, 3, 4, 5, 6, 10].map(g => {
          const t = taxA(g * G, G) / G;
          const spec = { 1: 0, 2: 0.10, 3: 0.30, 4: 0.60, 5: 1.00, 6: 1.50, 10: 3.50 }[g];
          const ok = Math.abs(t - spec) < 1e-9;
          return [g + ' G', fmt(t, 2), ok ? el('span', { class: 'ok', text: '✓ ' + fmt(spec, 2) + ' G' }) : el('span', { class: 'bad', text: '✗ forventet ' + fmt(spec, 2) + ' G' })];
        }), [1]));
  }
  draw();
}

function benefitsFor(s) {
  const G = get('G');
  const barnetrygd = get('welfare.barnetrygdPerChildG') * G * (s.children || 0);
  const foodCard = get('sifo.grocerySingleAdultMonthly') * 12; // universal
  return barnetrygd + foodCard;
}
