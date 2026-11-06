import { get, getWithOverride } from './data.js';
import { el, clear, card, table, fmt, formulaBox } from './ui.js';

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
      log.push(`${top.name} tar mandat ${won[top.name]} med ≥ kvote — overflødig overført`);
      top.votes -= quota;
      const surplusShare = top.votes;
      for (const c of pool.slice(1)) c.votes += 0; // transfers only on elimination; surplus stays with the party
      if (top.votes <= 0) pool.shift();
    } else {
      const lowest = pool[pool.length - 1];
      log.push(`${lowest.name} ryker ut av tildelingen (lavest, ${fmt(lowest.votes)}) — stemmene overført`);
      pool.pop();
      const restTotal = pool.reduce((s, c) => s + c.votes, 0);
      for (const c of pool) c.votes += lowest.votes * (restTotal ? c.votes / restTotal : 1 / Math.max(1, pool.length));
    }
  }
  return { elected, log };
}

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Valgsystem — S = odd(∛befolkning)' }),
    el('p', { class: 'desc', text: 'Stortinget låses på nøyaktig S = odd(∛befolkning) representanter. Halvparten av mandatene fordeles likt over fylkene (gulvrunding); resten er nasjonale utjevningsmandater som gjenopprettes via STV-aktig rangert valg. Droop-kvoten 1/(S+1) er den strukturelle sperren — ingen eksplisitt sperre, ingen overhengsmandater, huset låst på S.' }),
    formulaBox('S = odd(∛N) · kvote = stemmer/(S+1)'));
  const out = card();
  main.append(out);
  const chartCard = card(el('h3', { text: 'Mandater per parti' }), el('div', { class: 'chartbox', id: 'el-chart' }));
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
    out.append(table(['Størrelse', 'Verdi'], [
      ['Befolkning', fmt(pop)],
      ['S = odd(∛befolkning)', fmt(r.S)],
      ['Fylkesmandatpool (halvparten, gulvrunding)', fmt(r.countyPool) + ` = ${fmt(r.perCounty)} per fylke × ${counties.length} fylker`],
      ['Nasjonale utjevningsmandater (STV)', fmt(r.levelling)],
      ['Droop-kvote (strukturell terskel)', fmt(r.quota) + ' stemmer = 1/(S+1) av alle stemmer'],
      ['Sum mandater', fmt(r.countyPool - (r.countyPool - r.perCounty * counties.length) + r.levelling) + ` (låst på S = ${fmt(r.S)})`]
    ], [1]));
    out.append(el('h3', { text: 'Fylkesmandater (lik fordeling)' }),
      table(['Fylke', 'Velgere', 'Mandater', 'Største parti'],
        r.countySeats.map(c => [c.name, fmt(c.voters), fmt(c.seats), c.winner])));
    out.append(el('h3', { text: 'STV-utjevning — valglogg' }),
      el('p', { class: 'desc', text: r.stv.log.join(' · ') || 'Ingen utjevningsmandater denne gangen.' }));
    chart?.destroy();
    chart = new Chart(document.getElementById('el-chart'), {
      type: 'bar',
      data: {
        labels: parties.map(p => p.name),
        datasets: [
          { label: 'Stemmer', data: parties.map(p => p.votes), backgroundColor: '#7d8b9d', yAxisID: 'y1' },
          { label: 'Mandater', data: parties.map(p => totals[p.name] || 0), backgroundColor: '#e8b04b' }
        ]
      },
      options: { responsive: true, scales: { y1: { position: 'right', title: { display: true, text: 'Stemmer' } } } }
    });
  }
  draw();
}
