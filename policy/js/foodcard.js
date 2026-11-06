import { get, getWithOverride } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox } from './ui.js';

// Universal, flat SIFO single-adult grocery rate for every resident.
// cost = population × rate × 12. Taxable in variant B, tax-free in A.
export function foodCardCost(population = getWithOverride('population.total')) {
  return population * get('sifo.grocerySingleAdultMonthly') * 12;
}

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'The food card — universal and flat' }),
    el('p', { class: 'desc', text: 'Every resident receives the SIFO single-adult grocery rate every month. No means testing, no rate difference. The cost is population × rate × 12. Taxable in variant B (added to the base), tax-free in variant A.' }),
    formulaBox('cost = population × SIFO rate × 12'));
  const out = card();
  main.append(out);
  const chartCard = card(el('h3', { text: 'Cost over population history and projection' }), el('div', { class: 'chartbox', id: 'fc-chart' }));
  main.append(chartCard);
  let chart;

  function draw() {
    const pop = getWithOverride('population.total');
    const rate = get('sifo.grocerySingleAdultMonthly');
    const cost = foodCardCost();
    clear(out);
    out.append(table(['Quantity', 'Value'], [
      ['Population', fmt(pop)],
      ['SIFO rate (single adult, per month)', fmt(rate) + ' NOK'],
      ['Annual cost', fmtNOK(cost)],
      ['Per person per year', fmt(rate * 12) + ' NOK'],
      ['Treatment in the tax system', 'A: tax-free · B: taxable (added to the base)']
    ], [1]));

    const hist = get('population.history');
    const proj = get('population.projections');
    const years = [...hist.years, ...proj.years.filter(y => y > hist.years[hist.years.length - 1])];
    const totals = [...hist.totals, ...proj.totals.slice(hist.totals.length)];
    chart?.destroy();
    chart = new Chart(document.getElementById('fc-chart'), {
      type: 'line',
      data: {
        labels: years,
        datasets: [{ label: 'Food card cost per year', data: totals.map(foodCardCost), borderColor: '#3fb950', fill: true, backgroundColor: 'rgba(63,185,80,.15)' }]
      },
      options: { responsive: true, scales: { y: { title: { display: true, text: 'NOK per year' } } } }
    });
  }
  draw();
}
