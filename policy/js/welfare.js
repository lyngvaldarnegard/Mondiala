import { get } from './data.js';
import { ageCounts } from './pension.js';

// Barnetrygd: 1 G per child (0–17), universal.
export function childCount(total = get('population.total')) {
  const counts = ageCounts(total);
  let n = 0;
  for (let a = 0; a <= 17; a++) n += counts[a];
  return n;
}

export function barnetrygdCost(total = get('population.total')) {
  return childCount(total) * get('welfare.barnetrygdPerChildG') * get('G');
}

// Student stipend: student FTE count × yearly stipend in G (both from the
// register; the FTE count is draft until the data pass). Measured in G, not
// NOK — every welfare level in the model is a multiple of G.
export function stipendCost() {
  return get('welfare.studentFteCount') * get('welfare.studentStipendYearG') * get('G');
}
export function stipendPerStudentNOK() {
  return get('welfare.studentStipendYearG') * get('G');
}

// Sin tax: set equal to the estimated social cost of alcohol and tobacco
// per year (draft register values until the data pass).
export function sinTaxCost() {
  return get('sinTax.alcoholSocialCostNOK') + get('sinTax.tobaccoSocialCostNOK');
}
