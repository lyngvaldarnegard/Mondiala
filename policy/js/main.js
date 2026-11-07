import { initData, refreshLiveData, getLiveStatus, getRegister, getData } from './data.js';
import { el, clear, card, table } from './ui.js';
import * as manifesto from './manifesto.js';
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
  { id: 'manifesto', name: 'Manifesto', mod: manifesto },
  { id: 'register', name: 'Data register', mod: null },
  { id: 'tax', name: 'Tax workbench', mod: tax },
  { id: 'pension', name: 'Pension', mod: pension },
  { id: 'foodcard', name: 'Food card', mod: foodcard },
  { id: 'budget', name: 'National budget', mod: budget },
  { id: 'municipal', name: 'Municipal finance', mod: municipal },
  { id: 'electoral', name: 'Electoral system', mod: electoral },
  { id: 'constitution', name: 'Constitution', mod: constitution },
  { id: 'mondiala', name: 'Mondiala', mod: mondiala },
  { id: 'checks', name: 'Formula checks', mod: checks }
];

const main = document.getElementById('main');
const nav = document.getElementById('nav');

function renderRegister() {
  clear(main);
  const reg = getRegister();
  main.append(
    el('h2', { text: 'Data register' }),
    el('p', { class: 'desc', text: 'Every concrete number lives here — data.json and the update register. No module keeps its own constants. Fields marked "draft" are replaced at the data pass with no code change.' }),
    card(el('h3', { text: 'Register' }),
      table(
        ['Field', 'Value', 'Source', 'Cadence', 'Sanity range', 'Status'],
        reg.map(e => [
          e.field,
          e.value === 'draft' || typeof e.value !== 'number' ? 'draft' : el('span', { text: String(e.value) }),
          e.source, e.cadence,
          e.sanity ? `${e.sanity[0]} – ${e.sanity[1]}` : '—',
          e.draft ? el('span', { class: 'pill', text: 'draft — replaced at the data pass' }) : el('span', { class: 'ok', text: 'curated' })
        ])
      )),
    card(el('h3', { text: 'SSB PxWeb' }),
      el('p', { class: 'desc', text: 'The client POSTs json-stat queries to data.ssb.no/api/v0/no/table/{id} (10487, 09935/05854, 11418/11419, population, KOSTRA). On any failure everything falls back to the curated values — the app works offline.' }),
      el('p', { id: 'live-status' }))
  );
  const st = getLiveStatus();
  document.getElementById('live-status').textContent =
    st.ok.length ? `Live from SSB: tables ${st.ok.join(', ')} were read.` :
    (st.failed.length ? `SSB unavailable (tables ${st.failed.join(', ')}) — using curated values.` : 'Checking SSB …');
}

function route() {
  const id = (location.hash || '#manifesto').slice(1);
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
