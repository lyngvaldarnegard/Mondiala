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
  }
  draw();
}
