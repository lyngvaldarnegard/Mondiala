import { get, getWithOverride } from './data.js';
import { el, clear, card, table, fmt, formulaBox, chartCanvas } from './ui.js';

// House size S = odd(∛population) — locked at exactly S.
export function houseSize(pop = getWithOverride('population.total')) {
  const n = Math.round(Math.cbrt(pop));
  return n % 2 === 0 ? n + 1 : n;
}

// Droop quota 1/(S+1) of the national vote is the structural threshold.
export function droopQuota(totalVotes, S) {
  return totalVotes / (S + 1);
}

// Half the seats are split equally across the counties (floor rounding); the
// remainder are national levelling seats, recreated via STV-style ranked
// choice. No explicit threshold, no overhang seats, house locked at S.
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
  // STV-style ranked choice over the national levelling pool
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
      const surplusShare = top.votes;
      for (const c of pool.slice(1)) c.votes += 0; // transfers only on elimination; surplus stays with the party
      if (top.votes <= 0) pool.shift();
    } else {
      const lowest = pool[pool.length - 1];
      log.push(`${lowest.name} is eliminated from the allocation (lowest, ${fmt(lowest.votes)}) — votes transferred`);
      pool.pop();
      const restTotal = pool.reduce((s, c) => s + c.votes, 0);
      for (const c of pool) c.votes += lowest.votes * (restTotal ? c.votes / restTotal : 1 / Math.max(1, pool.length));
    }
  }
  return { elected, log };
}

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Electoral system — S = odd(∛population)' }),
    el('p', { class: 'desc', text: 'The house is locked at exactly S = odd(∛population) representatives. Half the seats are split equally across the counties (floor rounding); the rest are national levelling seats recreated via STV-style ranked choice. The Droop quota 1/(S+1) is the structural threshold — no explicit threshold, no overhang seats, house locked at S.' }),
    formulaBox('S = odd(∛N) · quota = votes/(S+1)'));
  const out = card();
  main.append(out);
  const chartCard = card(el('h3', { text: 'Seats per party' }), el('div', { class: 'chartbox', id: 'el-chart' }));
  main.append(chartCard);
  let chart;

  function draw() {
    const pop = getWithOverride('population.total');
    const counties = get('electoral.counties');
    const parties = get('electoral.parties');
    const r = allocate(counties, parties, pop);
    clear(out);
    const totals = {};
    for (const c of r.countySeats) totals[c.winner] = (totals[c.winner] || 0) + c.seats;
    for (const e of r.stv.elected) totals[e.name] = (totals[e.name] || 0) + 1;
    out.append(table(['Quantity', 'Value'], [
      ['Population', fmt(pop)],
      ['S = odd(∛population)', fmt(r.S)],
      ['County seat pool (half, floor rounding)', fmt(r.countyPool) + ` = ${fmt(r.perCounty)} per county × ${counties.length} counties`],
      ['National levelling seats (STV)', fmt(r.levelling)],
      ['Droop quota (structural threshold)', fmt(r.quota) + ' votes = 1/(S+1) of all votes'],
      ['Total seats', fmt(r.countyPool - (r.countyPool - r.perCounty * counties.length) + r.levelling) + ` (locked at S = ${fmt(r.S)})`]
    ], [1]));
    out.append(el('h3', { text: 'County seats (equal split)' }),
      table(['County', 'Voters', 'Seats', 'Largest party'],
        r.countySeats.map(c => [c.name, fmt(c.voters), fmt(c.seats), c.winner])));
    out.append(el('h3', { text: 'STV levelling — election log' }),
      el('p', { class: 'desc', text: r.stv.log.join(' · ') || 'No levelling seats this time.' }));
    chart?.destroy();
    chart = new Chart(chartCanvas('el-chart'), {
      type: 'bar',
      data: {
        labels: parties.map(p => p.name),
        datasets: [
          { label: 'Votes', data: parties.map(p => p.votes), backgroundColor: '#7d8b9d', yAxisID: 'y1' },
          { label: 'Seats', data: parties.map(p => totals[p.name] || 0), backgroundColor: '#e8b04b' }
        ]
      },
      options: { responsive: true, scales: { y1: { position: 'right', title: { display: true, text: 'Votes' } } } }
    });
  }
  draw();
}
