import { get } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox } from './ui.js';
import { ageCounts, groups } from './pension.js';

// Needs-based grants in G per unit — never a function of the local tax base.
export function grantFor(c, rates = get('municipal.grantsPerUnitG')) {
  const G = get('G');
  return G * (rates.perResident * c.residents +
    rates.perKm2 * c.km2 +
    rates.perChild * c.children +
    rates.perPupil * c.pupils +
    rates.perPensioner * c.pensioners);
}

// National total: the same per-unit rates over national unit counts.
export function nationalGrantTotal() {
  const counts = ageCounts();
  const { U, E } = groups(counts);
  const children = counts.slice(0, 18).reduce((s, c) => s + c, 0);
  const pupils = counts.slice(6, 19).reduce((s, c) => s + c, 0);
  return grantFor({ residents: counts.reduce((s, c) => s + c, 0), km2: 385207, children, pupils, pensioners: E });
}

// Mayor salary: G·(α + β·∛pop); council size: odd(∛pop).
export function mayorSalaryG(pop, m = get('municipal')) {
  return m.mayorAlpha + m.mayorBeta * Math.cbrt(pop);
}
export function councilSize(pop) {
  const n = Math.round(Math.cbrt(pop));
  return n % 2 === 0 ? n + 1 : n;
}

const state = { kostra: true, directEntry: null };

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Kommuneøkonomi — behovsstyrte tilskudd' }),
    el('p', { class: 'desc', text: 'Tilskuddene er G per enhet (innbyggere, km², barn, elever, pensjonister) — aldri avhengige av lokalt skattefundament. Normkost-anker: de dyreste kommunene som dekker halve befolkningen. Lokal eiendomsskatt på grunnverdi (LVT) består ved sida av de nasjonale tilskuddene. Ordningsformler: ordførerlønn G·(α + β·∛innbyggere), kommunestyre odd(∛innbyggere).' }),
    formulaBox('tilskudd = G × (0.35·innbyggere + 0.002·km² + 0.9·barn + 1.1·elever + 0.7·pensjonister)'));
  const bar = card(
    el('label', { text: 'KOSTRA-visning' }),
    (() => {
      const c = el('input', { type: 'checkbox' });
      c.checked = state.kostra;
      c.addEventListener('change', () => { state.kostra = c.checked; draw(); });
      return c;
    })(),
    el('label', { text: 'Direkteinntasting' }),
    (() => {
      const c = el('input', { type: 'checkbox' });
      c.addEventListener('change', () => {
        state.directEntry = c.checked ? { name: 'Egen kommune', residents: 5000, km2: 300, children: 1000, pupils: 700, pensioners: 900 } : null;
        draw();
      });
      return c;
    })());
  main.append(bar);
  const out = card();
  main.append(out);
  const chartCard = card(el('h3', { text: 'Tilskudd per kommune' }), el('div', { class: 'chartbox', id: 'mun-chart' }));
  main.append(chartCard);
  let chart;

  function draw() {
    const communes = state.directEntry ? [state.directEntry] : get('municipal.exampleCommunes');
    const rows = communes.map(c => ({
      ...c,
      grant: grantFor(c),
      mayor: mayorSalaryG(c.residents) * get('G'),
      council: councilSize(c.residents)
    }));
    clear(out);
    out.append(table(
      ['Kommune', 'Innb.', 'km²', 'Barn', 'Elever', 'Pens.', 'Tilskudd', 'Ordførerlønn', 'Styre'],
      rows.map(r => [r.name, fmt(r.residents), fmt(r.km2), fmt(r.children), fmt(r.pupils), fmt(r.pensioners), fmtNOK(r.grant), fmtNOK(r.mayor), fmt(r.council)]),
      [1, 2, 3, 4, 5, 6, 7, 8]));
    out.append(el('p', { class: 'desc', text: `Normkost-anker: ${get('municipal.normCostAnchor')}. Nasjonalt totaltilskudd (samme satser over landsenheter): ${fmtNOK(nationalGrantTotal())}.` }));

    chart?.destroy();
    chart = new Chart(document.getElementById('mun-chart'), {
      type: 'bar',
      data: {
        labels: rows.map(r => r.name),
        datasets: state.kostra
          ? [{ label: 'Tilskudd (kr)', data: rows.map(r => r.grant), backgroundColor: '#3fb950' }]
          : [{ label: 'Tilskudd per innbygger (kr)', data: rows.map(r => r.grant / r.residents), backgroundColor: '#e8b04b' }]
      },
      options: { responsive: true }
    });
  }
  draw();
}
