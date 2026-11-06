import { get, getWithOverride } from './data.js';
import { el, clear, card, table, fmt, fmtNOK } from './ui.js';
import { baseIncome, taxA, taxB, taxC } from './tax.js';
import { cutoff, queueSize, occupationWeights, pensionCost, ageCounts, groups } from './pension.js';
import { foodCardCost } from './foodcard.js';
import { computeIncome, computeExpenditure, lvt } from './budget.js';
import { grantFor, mayorSalaryG, councilSize, nationalGrantTotal } from './municipal.js';
import { houseSize, droopQuota, allocate } from './electoral.js';

// Visible checks: every formula from the spec gets a row here. The same
// assertions run headless in test/formulas.mjs.
export function runChecks() {
  const G = get('G');
  const pop = getWithOverride('population.total');
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });

  // Variant A cumulative tax matches spec exactly
  const specA = { 1: 0, 2: 0.10, 3: 0.30, 4: 0.60, 5: 1.00, 6: 1.50, 10: 3.50 };
  for (const [g, want] of Object.entries(specA)) {
    const got = taxA(Number(g) * G, G) / G;
    add(`Variant A kumulativ skatt ved ${g} G = ${fmt(want, 2)} G`, Math.abs(got - want) < 1e-9, `fikk ${fmt(got, 2)} G`);
  }

  // Shared base: deductions subtract, additions add
  const b = baseIncome({ gross: 800000, financialFees: 1000, businessExpenses: 5000, bsu: 20000, ips: 15000, interestPaid: 80000 });
  add('Skattebase = brutto + gebyrer − småskala − BSU − IPS − rentefradrag', b === 800000 + 1000 - 5000 - 20000 - 15000 - 80000, `= ${fmt(b)} kr`);

  // Variant B: sjablong formula, 3 G pension hits the threshold exactly
  add('Variant B: 0.5 × max(0, 3 G − 3 G) = 0 (demografisk beskyttelse)', taxB(3 * G, G, 0) === 0, `= ${taxB(3 * G, G, 0)}`);
  add('Variant B: 0.5 × max(0, 6 G − 3 G) = 1.5 G', Math.abs(taxB(6 * G, G, 0) / G - 1.5) < 1e-9, `= ${fmt(taxB(6 * G, G, 0) / G, 2)} G`);
  add('Variant B: ytelser (matkort) legges til basen', taxB(3 * G, G, 10000) === 5000, `= ${fmt(taxB(3 * G, G, 10000))} kr`);

  // Variant C: one anchor + one rate
  const anchor = getWithOverride('income.medianWageYear');
  add('Variant C: 50 % av (anker + 100 000 − anker) = 50 000', taxC(anchor + 100000, anchor, 50) === 50000, `= ${fmt(taxC(anchor + 100000, anchor, 50))} kr`);
  add('Variant C: under ankeret = 0 skatt', taxC(anchor - 1, anchor, 50) === 0, `= ${fmt(taxC(anchor - 1, anchor, 50))} kr`);

  // Pension queue
  const counts = ageCounts();
  const g = groups(counts);
  const P = queueSize(counts.reduce((s, c) => s + c, 0), g.U, g.V);
  add('P = max(1 % × N, V/1.5 − U) er positiv', P > 0, `P = ${fmt(P)}`);
  const c0 = cutoff(false);
  add('Utgangsalderen finnes (virtuell)', c0.cutoff != null && c0.cutoff > 0, `${fmt(c0.cutoff, 1)} år`);
  add('Utgangsalderen finnes (faktisk)', c0.cutoffActual != null && c0.cutoffActual > 0, `${fmt(c0.cutoffActual, 1)} år`);
  const weights = occupationWeights();
  add('l_j′ = max(1, L_ref/L_j) kun oppover', weights.every(w => w.l >= 1), weights.map(w => fmt(w.l, 2)).join(', '));
  add('Pensjonskostnad = P × 3 G', Math.abs(pensionCost() - P * get('pensionLevelG') * G) < 1, fmtNOK(pensionCost()));

  // Food card
  add('Matkort = befolkning × sats × 12', foodCardCost() === pop * get('sifo.grocerySingleAdultMonthly') * 12, fmtNOK(foodCardCost()));

  // Budget always balances via the LVT valve
  const inc = computeIncome('A');
  const exp = computeExpenditure({ pensionOn: true, foodcardOn: true, municipalOn: true, on: {}, scale: {}, gdpShare: {}, gniShare: {}, cultureTarget: false });
  const incT = inc.reduce((s, i) => s + i.value, 0);
  const expT = exp.reduce((s, p) => s + p.value, 0);
  const v = lvt(expT, incT);
  add('Budsjettet balanserer via LVT-ventilen (invariant)', expT <= incT + v.amount + 1e-6, `utgifter ${fmtNOK(expT)}, inntekt + LVT ${fmtNOK(incT + v.amount)}`);
  add('LVT-satsen lukker gapet', v.rate >= 0 && (v.amount === 0 || Math.abs(v.amount - (expT - incT)) < 1), fmt(100 * v.rate, 2) + ' %');

  // Municipal formulas
  const comm = { residents: 1000, km2: 100, children: 200, pupils: 150, pensioners: 180 };
  add('Kommunetilskudd er G-per-enhet (behov, ikke skattefundament)', grantFor(comm) > 0, fmtNOK(grantFor(comm)));
  add('Ordførerlønn = G·(α + β·∛innb.)', Math.abs(mayorSalaryG(1000) * G - (get('municipal.mayorAlpha') + get('municipal.mayorBeta') * 10) * G) < 1e-6, fmtNOK(mayorSalaryG(1000) * G));
  const cs = councilSize(1000);
  add('Kommunestyre = odd(∛innb.)', cs % 2 === 1 && cs === 11, `∛1000 = 10 → ${cs}`);
  add('Nasjonalt tilskudd > 0', nationalGrantTotal() > 0, fmtNOK(nationalGrantTotal()));

  // Electoral
  const S = houseSize(pop);
  add('S = odd(∛befolkning)', S % 2 === 1 && S === 177, `S = ${S}`);
  const parties = get('electoral.parties');
  const totalVotes = parties.reduce((s, p) => s + p.votes, 0);
  add('Droop-kvote = stemmer/(S+1)', Math.abs(droopQuota(totalVotes, S) - totalVotes / (S + 1)) < 1e-6, fmt(droopQuota(totalVotes, S)));
  const r = allocate(get('electoral.counties'), parties, pop);
  const seatTotal = r.countySeats.reduce((s, c) => s + c.seats, 0) + r.stv.elected.length;
  add('Huset er låst på nøyaktig S', seatTotal === S, `${seatTotal} = S = ${S}`);

  return checks;
}

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Formelkontroller' }),
    el('p', { class: 'desc', text: 'Hver formel fra spesifikasjonen er festet her — kontrollene kjører live i UI-et, og de samme påstandene kjøres headless i test/formulas.mjs.' }));
  const checks = runChecks();
  const failed = checks.filter(c => !c.ok);
  main.append(card(
    el('h3', { text: failed.length ? el('span', { class: 'bad', text: `${failed.length} av ${checks.length} kontroller feiler` }) : el('span', { class: 'ok', text: `Alle ${checks.length} kontroller grønne ✓` }) }),
    table(['Kontroll', 'Resultat', 'Detalj'],
      checks.map(c => [c.name, c.ok ? el('span', { class: 'ok', text: '✓' }) : el('span', { class: 'bad', text: '✗' }), c.detail]))));
}
