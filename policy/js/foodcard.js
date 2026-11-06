import { get, getWithOverride } from './data.js';
import { el, clear, card, table, fmt, fmtNOK, formulaBox } from './ui.js';

// Universal, flat SIFO single-adult grocery rate for every resident.
// cost = population × rate × 12. Taxable in variant B, tax-free in A.
export function foodCardCost(population = getWithOverride('population.total')) {
  return population * get('sifo.grocerySingleAdultMonthly') * 12;
}

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Matkortet — universelt og flatt' }),
    el('p', { class: 'desc', text: 'Hver bosatt får SIFOs matrate for enkeltvoksen hver måned. Ingen behovsprøving, ingen satsforskjell. Kostnaden er befolkning × sats × 12. Skattepliktig i variant B (legges til basen), skattefri i variant A.' }),
    formulaBox('kostnad = befolkning × SIFO-sats × 12'));
  const out = card();
  main.append(out);
  const chartCard = card(el('h3', { text: 'Kostnad over befolkningshistorikk og -projeksjon' }), el('div', { class: 'chartbox', id: 'fc-chart' }));
  main.append(chartCard);
  let chart;

  function draw() {
    const pop = getWithOverride('population.total');
    const rate = get('sifo.grocerySingleAdultMonthly');
    const cost = foodCardCost();
    clear(out);
    out.append(table(['Størrelse', 'Verdi'], [
      ['Befolkning', fmt(pop)],
      ['SIFO-sats (enkeltvoksen, per mnd)', fmt(rate) + ' kr'],
      ['Årskostnad', fmtNOK(cost)],
      ['Per person per år', fmt(rate * 12) + ' kr'],
      ['Behandling i skattesystemet', 'A: skattefri · B: skattepliktig (legges til basen)']
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
        datasets: [{ label: 'Matkortkostnad per år', data: totals.map(foodCardCost), borderColor: '#3fb950', fill: true, backgroundColor: 'rgba(63,185,80,.15)' }]
      },
      options: { responsive: true, scales: { y: { title: { display: true, text: 'kr per år' } } } }
    });
  }
  draw();
}
