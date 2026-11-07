import { get } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox, chartCanvas } from './ui.js';
import { ageCounts, groups } from './pension.js';

// ---- The satsmodell (item 6) ---------------------------------------
// T_k = G · (a·I_k + b·A_k + c·B_k + d·E_barn + e·E_ung + f·E_vgs
//            + g·S_k + h·P_k + i·W_k)
// G is the grant rate unit; the coefficients a–i are POLITICAL PARAMETERS
// (not data), rendered as user-editable number fields. The STANDARD RATES are
// calculated from public data (KOSTRA / SSB service and cost statistics) at
// the data pass and drop into the register as the defaults; until then the
// coefficients stay neutral at 1 (equal weighting) — nothing is invented.
// Variable definitions (Notion, "Public transfers to the municipal sector"):
//   I_k    residents
//   A_k    km²
//   B_k    children in kindergarten age (1–5)
//   E_barn primary school pupils (6–12)
//   E_ung  lower secondary pupils (13–15)
//   E_vgs  upper secondary pupils (16–18)
//   S_k    students
//   P_k    pensioners
//   W_k    persons in the workforce
const state = { coefs: null, kostra: true, directEntry: null };

export function coefficients() {
  if (!state.coefs) state.coefs = { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 };
  return state.coefs;
}

// National unit counts from the register's age distribution; students are
// the draft register FTE count, area the curated national area.
export function nationalUnits() {
  const counts = ageCounts();
  const N = counts.reduce((s, c) => s + c, 0);
  const { V, E } = groups(counts);
  const sum = (lo, hi) => counts.slice(lo, hi + 1).reduce((s, c) => s + c, 0);
  return {
    I: N,
    A: get('municipal.nationalAreaKm2'),
    B: sum(1, 5),
    E_barn: sum(6, 12),
    E_ung: sum(13, 15),
    E_vgs: sum(16, 18),
    S: get('welfare.studentFteCount'),
    P: E,
    W: V
  };
}

export function satsmodell(units, c = coefficients()) {
  const G = get('G');
  return G * (c.a * units.I + c.b * units.A + c.c * units.B + c.d * units.E_barn +
    c.e * units.E_ung + c.f * units.E_vgs + c.g * units.S + c.h * units.P + c.i * units.W);
}

// National total: the satsmodell over the national unit counts.
export function nationalGrantTotal() {
  return satsmodell(nationalUnits());
}

// Per-commune units: a proportional assumption — the commune carries the
// national per-resident share of each demographic unit (computed in-app from
// the register, never a local tax base). Area is the commune's own km².
export function communeUnits(c) {
  const n = nationalUnits();
  const f = c.residents / n.I;
  return {
    I: c.residents,
    A: c.km2,
    B: f * n.B,
    E_barn: f * n.E_barn,
    E_ung: f * n.E_ung,
    E_vgs: f * n.E_vgs,
    S: f * n.S,
    P: f * n.P,
    W: f * n.W
  };
}

export function grantFor(c, coefs = coefficients()) {
  return satsmodell(communeUnits(c), coefs);
}

// Mayor salary: G·(α + β·∛pop); council size: odd(∛pop).
export function mayorSalaryG(pop, m = get('municipal')) {
  return m.mayorAlpha + m.mayorBeta * Math.cbrt(pop);
}
export function councilSize(pop) {
  const n = Math.round(Math.cbrt(pop));
  return n % 2 === 0 ? n + 1 : n;
}

const COEF_LABELS = [
  ['a', 'residents (I_k)'],
  ['b', 'km² (A_k)'],
  ['c', 'kindergarten-age children (B_k)'],
  ['d', 'primary school pupils (E_barn)'],
  ['e', 'lower secondary pupils (E_ung)'],
  ['f', 'upper secondary pupils (E_vgs)'],
  ['g', 'students (S_k)'],
  ['h', 'pensioners (P_k)'],
  ['i', 'workforce (W_k)']
];

// Unit key per coefficient, in the same order as COEF_LABELS.
const COEF_UNITS = ['I', 'A', 'B', 'E_barn', 'E_ung', 'E_vgs', 'S', 'P', 'W'];

// Decomposition of one commune's grant: what each unit type (residents, km²,
// each demographic group) contributes, at the current coefficients.
export function grantBreakdown(c, coefs = coefficients()) {
  const G = get('G');
  const u = communeUnits(c);
  const rows = COEF_LABELS.map(([k, label], idx) => {
    const key = COEF_UNITS[idx];
    const units = u[key];
    const rate = coefs[k] * G;
    return { coef: k, label, units, rate, amount: rate * units };
  });
  const total = rows.reduce((s, r) => s + r.amount, 0);
  for (const r of rows) r.share = total > 0 ? r.amount / total : 0;
  return { rows, total };
}

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Municipal finance — needs-based grants (the satsmodell)' }),
    el('p', { class: 'desc', text: 'The grants follow the satsmodell: T_k = G · (a·I_k + b·A_k + c·B_k + d·E_barn + e·E_ung + f·E_vgs + g·S_k + h·P_k + i·W_k), where G is the grant rate unit and a–i are POLITICAL PARAMETERS (not data) — user-editable fields. The standard rates are calculated from public data (KOSTRA / SSB service and cost statistics) at the data pass and load in as the defaults; until then the coefficients are neutral at 1 (equal weighting). The grants are never a function of the local tax base. Norm-cost anchor: the most expensive communes covering half the population. A local land value tax (LVT) remains alongside the national grants. Ordering formulas: mayor salary G·(α + β·∛residents), council size odd(∛residents).' }),
    formulaBox('T_k = G · (a·I_k + b·A_k + c·B_k + d·E_barn + e·E_ung + f·E_vgs + g·S_k + h·P_k + i·W_k)'));
  const bar = card(
    el('label', { text: 'Per-person view (default; uncheck for totals)' }),
    (() => {
      const c = el('input', { type: 'checkbox' });
      c.checked = state.kostra;
      c.addEventListener('change', () => { state.kostra = c.checked; draw(); });
      return c;
    })(),
    el('label', { text: 'Direct entry' }),
    (() => {
      const c = el('input', { type: 'checkbox' });
      c.addEventListener('change', () => {
        state.directEntry = c.checked ? { name: 'Own commune', residents: 5000, km2: 300 } : null;
        draw();
      });
      return c;
    })());
  main.append(bar);
  const coefCard = card(el('h3', { text: 'Political parameters a–i (not data) — no official rates exist' }));
  main.append(coefCard);
  const out = card();
  main.append(out);
  const breakdownCard = card(el('h3', { text: 'Where the grant comes from — per unit' }));
  main.append(breakdownCard);
  const chartCard = card(el('h3', { text: 'Grants per commune' }), el('div', { class: 'chartbox', id: 'mun-chart' }));
  main.append(chartCard);
  let chart;

  function draw() {
    const c = coefficients();
    clear(coefCard);
    coefCard.append(el('h3', { text: 'Political parameters a–i (not data) — no official rates exist' }),
      table(['Coefficient', 'Unit', 'Value (political parameter)'],
        COEF_LABELS.map(([k, label]) => {
          const i = el('input', { type: 'number', step: '0.1', min: '0', value: String(c[k]) });
          i.addEventListener('input', () => { c[k] = Number(i.value) || 0; draw(); });
          return ['a–i: ' + k, label, i];
        })));

    const communes = state.directEntry ? [state.directEntry] : get('municipal.exampleCommunes');
    const rows = communes.map(cm => ({
      ...cm,
      grant: grantFor(cm),
      mayor: mayorSalaryG(cm.residents) * get('G'),
      council: councilSize(cm.residents)
    }));
    clear(out);
    out.append(table(
      ['Commune', 'Residents', 'km²', 'Grant', 'Grant per resident', 'Mayor salary', 'Council'],
      rows.map(r => [r.name, fmt(r.residents), fmt(r.km2), fmtNOK(r.grant), fmtNOK(r.grant / r.residents), fmtNOK(r.mayor), fmt(r.council)]),
      [1, 2, 3, 4, 5, 6]));
    out.append(el('p', { class: 'desc', text: `Norm-cost anchor: ${get('municipal.normCostAnchor')}. National total grant (the satsmodell over national unit counts): ${fmtNOK(nationalGrantTotal())}.` }));

    // Per-unit decomposition for one commune: how much each km² and each
    // member of each demographic group brings in, at the current coefficients.
    clear(breakdownCard);
    const sel = el('select');
    for (const cm of communes) sel.append(el('option', { value: cm.name, text: cm.name }));
    if (state.selectedCommune && communes.some(cm => cm.name === state.selectedCommune)) sel.value = state.selectedCommune;
    sel.addEventListener('change', () => { state.selectedCommune = sel.value; draw(); return; });
    const cm = communes.find(x => x.name === sel.value) || communes[0];
    const bd = grantBreakdown(cm, c);
    breakdownCard.append(
      el('h3', { text: 'Where the grant comes from — per unit' }),
      el('p', { class: 'desc', text: `${cm.name}: every unit earns its coefficient × G. Demographic units are the commune's proportional share of the national counts; residents and km² are the commune's own. Drag the coefficients a–i above and watch each line move.` }),
      el('label', { text: 'Commune' }), sel,
      table(
        ['Unit', 'Units in the commune', 'Rate per unit (coefficient × G)', 'Grant component', 'Share of the grant'],
        bd.rows.map(r => [
          `${r.label} — coefficient ${r.coef}`,
          fmt(r.units, r.units < 100 ? 1 : 0),
          fmtNOK(r.rate),
          fmtNOK(r.amount),
          fmt(100 * r.share, 1) + ' %']),
        [1, 2, 3, 4]),
      el('p', { class: 'desc', text: `Sum of the components: ${fmtNOK(bd.total)} — the same number as the grant column in the table above. Per square kilometre: ${fmtNOK(bd.rows[1].rate)}; per resident: ${fmtNOK(bd.rows[0].rate)}; per pensioner: ${fmtNOK(bd.rows[7].rate)} — all at the current coefficients.` }));

    chart?.destroy();
    chart = new Chart(chartCanvas('mun-chart'), {
      type: 'bar',
      data: {
        labels: rows.map(r => r.name),
        datasets: state.kostra
          ? [{ label: 'Grant per resident (NOK) — support per person', data: rows.map(r => r.grant / r.residents), backgroundColor: '#e8b04b' }]
          : [{ label: 'Grant (NOK, total)', data: rows.map(r => r.grant), backgroundColor: '#3fb950' }]
      },
      options: { responsive: true }
    });
  }
  draw();
}
