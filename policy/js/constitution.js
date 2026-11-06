import { get } from './data.js';
import { el, clear, card, table, fmt, formulaBox } from './ui.js';

const state = { preset: 'Norway', rules: null };

export function currentRules() {
  return state.rules || get('constitution.presets')[state.preset];
}

export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Constitution builder' }),
    el('p', { class: 'desc', text: 'Presets Norway / Mondiala / Italy. The fiscal rules link to the budget presets: Mondiala’s 3% deficit cap with a re-election ban, the 60% debt cap, and floors for education and health. The budget always balances through the LVT valve — the cap is therefore structurally satisfied.' }));
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
      ['deficitCap', 'Deficit cap (share of GDP)', 'number', 0, 1, 0.005, v => v == null ? '—' : fmt(100 * v, 1) + ' %'],
      ['debtCap', 'Debt cap (share of GDP)', 'number', 0, 2, 0.05, v => v == null ? '—' : fmt(100 * v, 0) + ' %'],
      ['educationFloor', 'Education floor (share of GDP)', 'number', 0, 1, 0.005, v => v == null ? '—' : fmt(100 * v, 1) + ' %'],
      ['healthFloor', 'Health floor (share of GDP)', 'number', 0, 1, 0.005, v => v == null ? '—' : fmt(100 * v, 1) + ' %'],
      ['reelectionBan', 'Re-election ban on a broken cap', 'checkbox', null, null, null, v => v ? 'yes' : 'no']
    ];
    clear(out);
    out.append(el('h3', { text: 'Fiscal rules — ' + state.preset }),
      table(['Article', 'Value'], fields.map(([key, label, type, min, max, step, show]) => {
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
    out.append(el('p', { class: 'desc', text: 'Link to the budget: the Mondiala preset in the national budget module sets the education and health floors as expenditure shares and shows the 3% cap and 60% debt cap are structurally satisfied — the LVT valve closes any gap before a deficit arises.' }));
  }
  draw();
}
