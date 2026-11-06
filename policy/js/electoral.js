import { get, getWithOverride } from './data.js';
import { el, clear, card, table, fmt, formulaBox, chartCanvas } from './ui.js';

// ---------------------------------------------------------------------------
// The electoral system page is an EXPLAINER: infographic cards that explain
// how the main electoral systems work, and then the Mondiala model step by
// step. The live allocation below is the illustration of the Mondiala model,
// not a calculator you are meant to operate.
// ---------------------------------------------------------------------------

// House size S = odd(∛population) — locked at exactly S.
export function houseSize(pop = getWithOverride('population.total')) {
  const n = Math.round(Math.cbrt(pop));
  return n % 2 === 0 ? n + 1 : n;
}

// Droop quota 1/(S+1) of the national vote is the structural threshold.
export function droopQuota(totalVotes, S) {
  return totalVotes / (S + 1);
}

// The Mondiala model: half the seats split equally across the counties
// (floor rounding); the remainder are national levelling seats, recreated
// via STV-style ranked choice. No explicit threshold, no overhang seats,
// house locked at S.
export function allocate(counties, parties, pop = getWithOverride('population.total')) {
  const S = houseSize(pop);
  const countyPool = Math.floor(S / 2);
  const nCounties = counties.length;
  const perCounty = Math.floor(countyPool / nCounties);
  const countySeats = counties.map(c => ({
    ...c,
    seats: perCounty,
    winner: [...parties].sort((a, b) => (c.votesByParty?.[c.name]?.[a.name] ?? a.votes * c.voters) - (c.votesByParty?.[c.name]?.[b.name] ?? b.votes * c.voters))[0]?.name
  }));
  let assigned = perCounty * nCounties;
  let levelling = S - assigned;
  const totalVotes = parties.reduce((s, p) => s + p.votes, 0);
  const quota = droopQuota(totalVotes, S);
  const stv = runSTV(parties.map(p => ({ ...p })), levelling, quota);
  return { S, countyPool, perCounty, levelling, countySeats, quota, stv };
}

function runSTV(candidates, seats, quota) {
  const elected = [];
  const log = [];
  const pool = candidates.map(c => ({ ...c }));
  const won = {};
  while (elected.length < seats && pool.length) {
    pool.sort((a, b) => b.votes - a.votes);
    const top = pool[0];
    if (quota > 0 && top.votes >= quota) {
      won[top.name] = (won[top.name] || 0) + 1;
      elected.push({ name: top.name, votes: quota });
      log.push(`${top.name} takes seat ${won[top.name]} with ≥ quota — surplus transferred`);
      top.votes -= quota;
      if (top.votes <= 0) pool.shift();
    } else {
      const lowest = pool[pool.length - 1];
      log.push(`${lowest.name} is eliminated (lowest, ${fmt(lowest.votes)}) — votes transferred`);
      pool.pop();
      const restTotal = pool.reduce((s, c) => s + c.votes, 0);
      for (const c of pool) c.votes += lowest.votes * (restTotal ? c.votes / restTotal : 1 / Math.max(1, pool.length));
    }
  }
  return { elected, log };
}

// --- Illustrative allocation under the different systems -----------------
// All examples use the register's example parties, so the numbers are live
// data, not invented.
function exampleVotes() {
  return get('electoral.parties').map(p => ({ ...p }));
}
function winnerTakesAll(parties, seats) {
  const sorted = [...parties].sort((a, b) => b.votes - a.votes);
  return parties.map(p => ({ name: p.name, seats: p === sorted[0] ? seats : 0 }));
}
function dHondt(parties, seats) {
  const out = parties.map(p => ({ name: p.name, seats: 0 }));
  for (let s = 0; s < seats; s++) {
    let best = null, bestQ = -1;
    for (const p of parties) {
      const q = p.votes / (out.find(o => o.name === p.name).seats + 1);
      if (q > bestQ) { bestQ = q; best = p.name; }
    }
    out.find(o => o.name === best).seats++;
  }
  return out;
}
function mondialaSeats(parties, counties, pop) {
  const r = allocate(counties, parties, pop);
  const totals = {};
  for (const c of r.countySeats) totals[c.winner] = (totals[c.winner] || 0) + c.seats;
  for (const e of r.stv.elected) totals[e.name] = (totals[e.name] || 0) + 1;
  return parties.map(p => ({ name: p.name, seats: totals[p.name] || 0 }));
}

const SYSTEMS = [
  {
    name: 'First past the post (FPTP)',
    how: 'The country is cut into districts. In each district the candidate with the most votes wins the seat — no majority needed, no second preferences.',
    where: 'United Kingdom, United States, Canada, India (lower house)',
    pros: ['One representative per district, easy to understand', 'Usually produces single-party governments'],
    cons: ['A party can win most seats with far from most votes', 'Votes for losing candidates elect nobody']
  },
  {
    name: 'Two-round (runoff)',
    how: 'As in FPTP, but if nobody passes a set share in round one, the top candidates go to a second round where the winner needs a majority.',
    where: 'France, Brazil (presidential), many mayoral systems',
    pros: ['The winner has broad support', 'Voters can reconsider between rounds'],
    cons: ['Two rounds are expensive and slow', 'Strategic voting in round one']
  },
  {
    name: 'Party-list proportional representation',
    how: 'Parties present lists. Seats are shared in proportion to votes using a divisor method such as D\u2019Hondt or Sainte-Laguë. A threshold often applies.',
    where: 'Norway (Stortinget — adjusted Sainte-Laguë, 4% threshold), Netherlands, Spain',
    pros: ['Seats closely follow votes', 'Small parties win representation'],
    cons: ['Thresholds can exclude millions of voters', 'Voters choose parties, not people']
  },
  {
    name: 'Single transferable vote (STV)',
    how: 'Multi-seat districts; voters rank candidates. Candidates passing the Droop quota 1/(S+1) are elected; surplus and eliminated votes transfer to the next preference.',
    where: 'Ireland, Malta, Australian Senate',
    pros: ['Voters pick people, not just parties', 'Nearly no wasted votes'],
    cons: ['Counting is complex', 'Requires ranked ballots']
  },
  {
    name: 'Mixed-member proportional (MMP)',
    how: 'Voters have two votes: one for a district winner (FPTP), one for a party list. List seats top up so the total stays proportional.',
    where: 'Germany, New Zealand',
    pros: ['Local representation plus proportionality', 'Familiar district vote'],
    cons: ['Overhang seats can distort the house', 'Two vote classes to explain']
  },
  {
    name: 'The Mondiala model',
    how: 'The house is locked at S = odd(∛population). No explicit threshold exists: the Droop quota 1/(S+1) of the national vote is the structural threshold. Half the seats are split equally across the counties (floor rounding); the rest are national levelling seats recreated via STV-style ranked choice. No overhang seats — the house is always exactly S.',
    where: 'The Mondiala programme\u2019s own system (this model)',
    pros: ['House size follows population by a fixed formula — no political haggling', 'Equal county weight + national proportional correction', 'The threshold is structural, never a political choice'],
    cons: ['Equal county seats slightly overweight small counties', 'Ranked-choice levelling is complex to count']
  }
];

export function render(main) {
  clear(main);
  const pop = getWithOverride('population.total');
  const counties = get('electoral.counties');
  const parties = exampleVotes();

  main.append(el('h2', { text: 'Electoral systems — an explainer' }),
    el('p', { class: 'desc', text: 'This page explains how the main electoral systems turn votes into seats, and then walks through the Mondiala model step by step. The numbers below all come live from the register\u2019s example parties and counties — they illustrate the systems, they are not a calculator to operate.' }));

  // 1. Infographic cards: one per system
  const systemsGrid = el('div', { class: 'grid' });
  for (const sys of SYSTEMS) {
    systemsGrid.append(card(
      el('h3', { text: sys.name }),
      el('p', { class: 'desc', text: sys.how }),
      el('p', { class: 'desc', text: 'Used in: ' + sys.where }),
      el('p', null, el('span', { class: 'ok', text: '+ ' + sys.pros.join(' · ') })),
      el('p', null, el('span', { class: 'bad', text: '− ' + sys.cons.join(' · ') }))));
  }
  main.append(card(el('h3', { text: 'How the main systems work' })), systemsGrid);

  // 2. Same votes, three systems — the illustrative comparison
  const S = houseSize(pop);
  const cmpCard = card(
    el('h3', { text: `Same votes, different systems — ${fmt(S)} seats` }),
    el('p', { class: 'desc', text: 'The register\u2019s example parties, given the same vote shares, produce very different houses. Winner-takes-all hands everything to the largest party; D\u2019Hondt proportional representation follows the votes; the Mondiala model combines equal county seats with a national STV levelling pool.' }),
    el('div', { class: 'chartbox', id: 'sys-chart' }));
  main.append(cmpCard);

  // 3. The Mondiala model, step by step
  const r = allocate(counties, parties, pop);
  const stepsCard = card(
    el('h3', { text: 'The Mondiala model, step by step' }),
    el('p', { class: 'desc', text: 'Step 1 — the house size is a formula, not a negotiation: ' }),
    formulaBox('S = odd(∛population) = ' + fmt(S)),
    el('p', { class: 'desc', text: `Step 2 — half the seats (${fmt(r.countyPool)}) are split equally across the ${counties.length} counties with floor rounding: ${fmt(r.perCounty)} seats per county. Every county counts equally, regardless of population.` }),
    el('p', { class: 'desc', text: `Step 3 — the remaining ${fmt(r.levelling)} seats are one national levelling pool, filled by STV-style ranked choice. The Droop quota 1/(S+1) = ${fmt(r.quota)} votes is the structural threshold — it emerges from the house size, it is never set politically.` }),
    el('p', { class: 'desc', text: 'Step 4 — no overhang seats, no exceptions: county seats + levelling seats always sum to exactly S.' }),
    table(['Quantity', 'Value'], [
      ['Population', fmt(pop)],
      ['S = odd(∛population)', fmt(r.S)],
      ['County pool (half, floor rounding)', fmt(r.countyPool) + ` = ${fmt(r.perCounty)} per county × ${counties.length} counties`],
      ['National levelling pool (STV)', fmt(r.levelling)],
      ['Droop quota (structural threshold)', fmt(r.quota) + ' votes = 1/(S+1) of all votes'],
      ['Total seats', fmt(r.countyPool - (r.countyPool - r.perCounty * counties.length) + r.levelling) + ` (locked at S = ${fmt(r.S)})`]
    ], [1]),
    el('h3', { text: 'County seats (equal split)' }),
    table(['County', 'Voters', 'Seats', 'Largest party'], r.countySeats.map(c => [c.name, fmt(c.voters), fmt(c.seats), c.winner])),
    el('h3', { text: 'The STV levelling round — election log' }),
    el('p', { class: 'desc', text: r.stv.log.join(' · ') || 'No levelling seats this time.' }));
  main.append(stepsCard);

  // comparison chart
  const wta = winnerTakesAll(parties, S);
  const dh = dHondt(parties, S);
  const mon = mondialaSeats(parties, counties, pop);
  new Chart(chartCanvas('sys-chart'), {
    type: 'bar',
    data: {
      labels: parties.map(p => p.name),
      datasets: [
        { label: 'Winner-takes-all (illustration)', data: wta.map(x => x.seats), backgroundColor: '#f85149' },
        { label: 'Party-list PR, D\u2019Hondt (illustration)', data: dh.map(x => x.seats), backgroundColor: '#7d8b9d' },
        { label: 'The Mondiala model (live)', data: mon.map(x => x.seats), backgroundColor: '#e8b04b' }
      ]
    },
    options: { responsive: true, scales: { y: { title: { display: true, text: 'Seats' } } } }
  });
}
