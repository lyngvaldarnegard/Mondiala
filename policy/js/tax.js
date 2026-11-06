import { get, getWithOverride } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox } from './ui.js';

// ---- One shared base -----------------------------------------------
// General capitalised income minus the interest deduction, keeping financial
// fees, small-scale business expenses, BSU and IPS. Implemented once; every
// variant is a toggle over this base. All amounts are money (read-only
// output); user inputs are multiples of G, the country preset unit.
export function baseIncome(input) {
  const { gross = 0, financialFees = 0, businessExpenses = 0, bsu = 0, ips = 0, interestPaid = 0 } = input;
  return gross + financialFees - businessExpenses - bsu - ips - interestPaid;
}

// ---- Variant A: "the staircase" ------------------------------------
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

// ---- Variant B: "the flat template" -------------------------------
// tax = 0.5 × max(0, I − 3 G); welfare benefits (food card, barnetrygd
// 1 G/child, student stipend) add to the base. A 3 G pension hits the
// threshold exactly — zero tax, the demographic protection.
export function taxB(base, G, benefits = 0) {
  const threshold = get('tax.variantB.thresholdG') * G;
  return get('tax.variantB.rate') * Math.max(0, base + benefits - threshold);
}

// ---- Variant C: "decile anchored" ----------------------------------
// flat X % above the Y-th percentile — one anchor number (median wage,
// SSB 11418) plus one rate. No distribution machinery.
export function taxC(base, anchor, ratePct) {
  return (ratePct / 100) * Math.max(0, base - anchor);
}

// ---- Today's system (comparison only) ------------------------------
export function taxToday(gross) {
  const G = get('G');
  const socialSecurity = 0.077 * Math.max(0, gross);
  const alminnelig = Math.max(0, gross - 0.46 * G); // minimum + personal deduction, illustrative
  const brackets = [[0, 0.1934], [0.1934, 0.2678], [0.2678, 0.3667], [0.3667, 0.7529], [0.7529, 1.0], [1.0, 1.6], [1.6, Infinity]];
  const steps = [[0.017, 0.0198], [0.04, 0.0445], [0.1328, 0.1353], [0.1724, 0.1762], [0.1745, 0.1762], [0.1762, 0.1762]];
  let bracketTax = 0;
  for (let i = 0; i < steps.length; i++) {
    const lo = brackets[i][0] * G, hi = brackets[i][1] * G;
    const w = Math.min(Math.max(0, gross - lo), hi - lo);
    bracketTax += w * steps[i][1];
  }
  return socialSecurity + 0.22 * alminnelig + bracketTax;
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

// Benefits added to the base in variant B: barnetrygd (1 G per child)
// plus the universal food card.
export function benefitsFor(s) {
  const G = get('G');
  const barnetrygd = get('welfare.barnetrygdPerChildG') * G * (s.children || 0);
  const foodCard = get('sifo.grocerySingleAdultMonthly') * 12; // universal
  return barnetrygd + foodCard;
}

const state = {
  variant: 'A',
  grossG: 5, interestG: 0.6, feesG: 0, businessG: 0, bsuG: 0, ipsG: 0.15,
  children: 2, rateC: 50
};

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Tax — one base, three variants' }),
    el('p', { class: 'desc', text: 'One shared tax base: general capitalised income minus the interest deduction, keeping financial fees, small-scale business expenses, BSU and IPS. Social security contributions, bracket tax and wealth tax are removed; the employer contribution and the 22% corporate tax with current special regimes stay. The variants are toggles over the same base. Inputs are multiples of G (the country preset basic amount) — every money amount below is computed read-only output.' }),
    formulaBox('base = gross + financial fees − small-scale − BSU − IPS − interest deduction'));
  const bar = card();
  const variantSel = el('select', { onchange: e => { state.variant = e.target.value; draw(); } },
    ...['A', 'B', 'C'].map(v => el('option', { value: v, text: 'Variant ' + v })));
  variantSel.value = state.variant;
  bar.append(el('label', { text: 'Variant' }), variantSel,
    el('label', { text: 'Gross income (in G)' }), gInput('grossG'),
    el('label', { text: 'Interest paid (deduction, in G)' }), gInput('interestG'),
    el('label', { text: 'IPS contribution (in G)' }), gInput('ipsG'),
    el('label', { text: 'Children (barnetrygd added to the B base)' }), numInput('children', 0, 10));
  main.append(bar);
  const out = card();
  main.append(out);
  const chartGrid = el('div', { class: 'grid' });
  const cumCard = card(el('h3', { text: 'Cumulative tax by income (G multiples)' }), el('div', { class: 'chartbox', id: 'cum-chart' }));
  const todayCard = card(el('h3', { text: 'Compared with today\u2019s system' }), el('div', { class: 'chartbox', id: 'today-chart' }));
  const decileCard = card(el('h3', { text: 'Tax revenue per decile (SSB decile means, V1)' }), el('div', { class: 'chartbox', id: 'decile-chart' }));
  chartGrid.append(cumCard, todayCard, decileCard);
  main.append(chartGrid);
  const checkCard = card(el('h3', { text: 'Check table — variant A cumulative tax (spec)' }));
  main.append(checkCard);
  let cumChart, todayChart, decileChart;

  function gInput(key, min = 0, max = 100, step = 0.1) {
    const i = el('input', { type: 'number', value: String(state[key]), min: String(min), max: String(max), step: String(step) });
    i.addEventListener('input', () => { state[key] = Number(i.value) || 0; draw(); });
    return i;
  }
  function numInput(key, min = 0, max = 10000000) {
    const i = el('input', { type: 'number', value: String(state[key]), min: String(min), max: String(max) });
    i.addEventListener('input', () => { state[key] = Number(i.value) || 0; draw(); });
    return i;
  }
  function moneyState() {
    const G = get('G');
    return {
      gross: state.grossG * G,
      financialFees: state.feesG * G,
      businessExpenses: state.businessG * G,
      bsu: state.bsuG * G,
      ips: state.ipsG * G,
      interestPaid: state.interestG * G,
      children: state.children
    };
  }

  function draw() {
    const G = get('G');
    const s = moneyState();
    const base = baseIncome(s);
    const benefits = benefitsFor(s);
    let tax = 0, formula = '';
    if (state.variant === 'A') { tax = taxA(base, G); formula = 'the staircase: marginal 0/10/20/30/40/50 % per 1 G bracket'; }
    if (state.variant === 'B') { tax = taxB(base, G, benefits); formula = `flat template: 0.5 × max(0, I − ${get('tax.variantB.thresholdG')} G) where I = base + benefits`; }
    if (state.variant === 'C') { tax = taxC(base, getWithOverride('income.medianWageYear'), state.rateC); formula = `decile anchored: ${state.rateC} % of base above the anchor (${fmt(getWithOverride('income.medianWageYear'))} NOK, median wage SSB 11418)`; }
    clear(out);
    out.append(
      el('p', null, formulaBox(formula)),
      table(['Quantity', 'Value'], [
        ['Gross income (read-only output)', fmtNOK(s.gross)],
        ['Tax base', fmtNOK(base)],
        ['Benefits added to the base (B)', fmtNOK(benefits)],
        ['Tax', fmtNOK(tax)],
        ['Average rate', fmt(base > 0 ? 100 * tax / base : 0, 1) + ' %'],
        ['The basic amount G (country preset)', fmt(G) + ' NOK']
      ], [1]),
      state.variant === 'B'
        ? el('p', { class: 'desc', text: 'Illustration only (never the formula): the "card-tracking theory" — every citizen\u2019s payments and benefits are booked on a card and the net contribution shown at the end. The flat template above is what is implemented.' })
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
      data: { labels: xs.map(x => fmt(x, 2)), datasets: [{ label: 'Cumulative tax (in G)', data: series, borderColor: '#e8b04b', tension: .2, pointRadius: 0 }] },
      options: { responsive: true, scales: { x: { title: { display: true, text: 'Income (G)' } }, y: { title: { display: true, text: 'Tax (G)' } } } }
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
        { label: 'Model ' + state.variant, data: model, backgroundColor: '#e8b04b' },
        { label: 'Today\u2019s system (estimate)', data: today, backgroundColor: '#7d8b9d' }] },
      options: { responsive: true, scales: { y: { title: { display: true, text: 'Tax (NOK)' } } } }
    });

    // decile revenue
    const rev = revenueByDecile(state.variant);
    decileChart?.destroy();
    decileChart = new Chart(document.getElementById('decile-chart'), {
      type: 'bar',
      data: { labels: rev.map(r => r.decile), datasets: [
        { label: 'Tax per person (NOK)', data: rev.map(r => r.tax), backgroundColor: '#3fb950' },
        { label: 'Mean income (NOK)', data: rev.map(r => r.mean), backgroundColor: '#2b3244' }] },
      options: { responsive: true }
    });

    // spec check table for variant A
    clear(checkCard);
    checkCard.append(el('h3', { text: 'Check table — variant A cumulative tax (spec)' }),
      table(['Income', 'Tax (G)', 'Check'],
        [1, 2, 3, 4, 5, 6, 10].map(g => {
          const t = taxA(g * G, G) / G;
          const spec = { 1: 0, 2: 0.10, 3: 0.30, 4: 0.60, 5: 1.00, 6: 1.50, 10: 3.50 }[g];
          const ok = Math.abs(t - spec) < 1e-9;
          return [g + ' G', fmt(t, 2), ok ? el('span', { class: 'ok', text: '\u2713 ' + fmt(spec, 2) + ' G' }) : el('span', { class: 'bad', text: '\u2717 expected ' + fmt(spec, 2) + ' G' })];
        }), [1]));
  }
  draw();
}
