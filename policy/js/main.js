import { initData, refreshLiveData, getLiveStatus, getRegister, getData } from './data.js';
import { el, clear, card, table } from './ui.js';
import * as tax from './tax.js';
import * as pension from './pension.js';
import * as foodcard from './foodcard.js';
import * as budget from './budget.js';
import * as municipal from './municipal.js';
import * as electoral from './electoral.js';
import * as constitution from './constitution.js';
import * as mondiala from './mondiala.js';
import * as checks from './checks.js';

const pages = [
  { id: 'register', name: 'Dataregister', mod: null },
  { id: 'tax', name: 'Skatt', mod: tax },
  { id: 'pension', name: 'Pensjon', mod: pension },
  { id: 'foodcard', name: 'Matkort', mod: foodcard },
  { id: 'budget', name: 'Statsbudsjett', mod: budget },
  { id: 'municipal', name: 'Kommuneøkonomi', mod: municipal },
  { id: 'electoral', name: 'Valgsystem', mod: electoral },
  { id: 'constitution', name: 'Grunnlov', mod: constitution },
  { id: 'mondiala', name: 'Mondiala', mod: mondiala },
  { id: 'checks', name: 'Formelkontroller', mod: checks }
];

const main = document.getElementById('main');
const nav = document.getElementById('nav');

function renderRegister() {
  clear(main);
  const reg = getRegister();
  main.append(
    el('h2', { text: 'Dataregister' }),
    el('p', { class: 'desc', text: 'Alt som er et konkret tall bor her — data.json og oppdateringsregisteret. Ingen modul holder egne konstanter. Felter markert «draft» byttes ut i datapasset uten kodeendring.' }),
    card(el('h3', { text: 'Register' }),
      table(
        ['Felt', 'Verdi', 'Kilde', 'Kadens', 'Sanitetsområde', 'Status'],
        reg.map(e => [
          e.field,
          e.value === 'draft' || typeof e.value !== 'number' ? 'draft' : el('span', { text: String(e.value) }),
          e.source, e.cadence,
          e.sanity ? `${e.sanity[0]} – ${e.sanity[1]}` : '—',
          e.draft ? el('span', { class: 'pill', text: 'draft — byttes i datapasset' }) : el('span', { class: 'ok', text: 'kuratert' })
        ])
      )),
    card(el('h3', { text: 'SSB PxWeb' }),
      el('p', { class: 'desc', text: 'Klienten poster json-stat-spørringer mot data.ssb.no/api/v0/no/table/{id} (10487, 09935/05854, 11418/11419, befolkning, KOSTRA). Ved feil faller alt tilbake til de kuraterte verdiene — appen fungerer offline.' }),
      el('p', { id: 'live-status' }))
  );
  const st = getLiveStatus();
  document.getElementById('live-status').textContent =
    st.ok.length ? `Live fra SSB: tabellene ${st.ok.join(', ')} ble lest.` :
    (st.failed.length ? `SSB ikke tilgjengelig (tabellene ${st.failed.join(', ')}) — bruker kuraterte verdier.` : 'Sjekker SSB …');
}

function route() {
  const id = (location.hash || '#register').slice(1);
  const page = pages.find(p => p.id === id) || pages[0];
  for (const a of nav.children) a.classList.toggle('active', a.dataset.id === page.id);
  clear(main);
  if (page.mod) page.mod.render(main);
  else renderRegister();
}

async function boot() {
  await initData();
  refreshLiveData().then(route);
  for (const p of pages) {
    nav.append(el('a', { href: '#' + p.id, 'data-id': p.id, text: p.name }));
  }
  window.addEventListener('hashchange', route);
  route();
}
boot();
