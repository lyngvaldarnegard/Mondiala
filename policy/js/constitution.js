import { get } from './data.js';
import { el, clear, card, table, fmt, formulaBox } from './ui.js';

const state = { preset: 'Norge', rules: null };

export function currentRules() {
  return state.rules || get('constitution.presets')[state.preset];
}

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Grunnlovsbygger' }),
    el('p', { class: 'desc', text: 'Presets Norge / Mondiala / Italia. Fiskalreglene er koblet til budsjett-presetsene: Mondialas 3 %-underskuddstak med gjenvalgsforbud, 60 % gjeldstak, og gulv for utdanning og helse. Budsjettet balanserer alltid gjennom LVT-ventilen — taket er derfor strukturelt oppfylt.' }));
  const bar = card(
    el('label', { text: 'Preset' }),
    (() => {
      const s = el('select', { onchange: e => { state.preset = e.target.value; state.rules = null; draw(); } },
        ...Object.keys(get('constitution.presets')).map(k => el('option', { value: k, text: k })));
      s.value = state.preset;
      return s;
    })());
  main.append(bar);
  const out = card();
  main.append(out);

  function draw() {
    const presets = get('constitution.presets');
    const rules = currentRules();
    const fields = [
      ['deficitCap', 'Underskuddstak (andel av BNP)', 'number', 0, 1, 0.005, v => v == null ? '—' : fmt(100 * v, 1) + ' %'],
      ['debtCap', 'Gjeldstak (andel av BNP)', 'number', 0, 2, 0.05, v => v == null ? '—' : fmt(100 * v, 0) + ' %'],
      ['educationFloor', 'Utdanningsgulv (andel av BNP)', 'number', 0, 1, 0.005, v => v == null ? '—' : fmt(100 * v, 1) + ' %'],
      ['healthFloor', 'Helsegulv (andel av BNP)', 'number', 0, 1, 0.005, v => v == null ? '—' : fmt(100 * v, 1) + ' %'],
      ['reelectionBan', 'Gjenvalgsforbud ved brutt tak', 'checkbox', null, null, null, v => v ? 'ja' : 'nei']
    ];
    clear(out);
    out.append(el('h3', { text: 'Fiskalregler — ' + state.preset }),
      table(['Artikkel', 'Verdi'], fields.map(([key, label, type, min, max, step, show]) => {
        let input;
        if (type === 'checkbox') {
          input = el('input', { type: 'checkbox' });
          input.checked = !!rules[key];
          input.addEventListener('change', () => { mutate(key, input.checked); });
        } else {
          input = el('input', { type: 'number', min: String(min), max: String(max), step: String(step), value: String(rules[key] ?? 0) });
          input.addEventListener('input', () => { mutate(key, Number(input.value)); });
        }
        return [label, input, show(currentRules()[key])];
      }), [1, 2]));
    function mutate(key, value) {
      if (!state.rules) state.rules = { ...presets[state.preset] };
      state.rules[key] = value;
      redraw();
    }
    function redraw() {
      const r = currentRules();
      out.querySelectorAll('tr').forEach((tr, i) => {
        const show = fields[i][6];
        tr.children[2].textContent = show(r[fields[i][0]]);
      });
    }
    out.append(el('p', { class: 'desc', text: 'Kobling til budsjettet: preset «Mondiala» i statsbudsjett-modulen setter utdannings- og helsegulvene som utgifts­andeler og viser at 3 %-taket og 60 %-gjeldstaket er strukturelt oppfylt — LVT-ventilen lukker ethvert gap før underskudd oppstår.' }));
  }
  draw();
}
