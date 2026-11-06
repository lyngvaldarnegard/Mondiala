import { get } from './data.js';
import { el, clear, card, table, fmt } from './ui.js';

// Mondiala sandbox: the fictional world capital as a hex-map page, with the
// Mondiala constitution preset applied. The full interactive city map lives
// in the city-designer module of this repo.
export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Mondiala — the fictional capital' }),
    el('p', { class: 'desc', text: 'Mondiala is the sandbox: the world’s new capital with its own constitution — a 3% deficit cap with a re-election ban, a 60% debt cap, floors for education and health. The hex map below is a compact view; the full interactive city map lives in this repo’s city-designer.' }));
  const mapCard = card(el('h3', { text: 'Hex map — rings 0–3' }), el('div', { id: 'hexmap' }));
  main.append(mapCard);
  const c = get('constitution.presets').Mondiala;
  main.append(card(el('h3', { text: "Mondiala’s constitution (preset)" }),
    table(['Rule', 'Value'], [
      ['Deficit cap', fmt(100 * c.deficitCap, 1) + ' % of GDP'],
      ['Debt cap', fmt(100 * c.debtCap, 0) + ' % of GDP'],
      ['Education floor', fmt(100 * c.educationFloor, 1) + ' % of GDP'],
      ['Health floor', fmt(100 * c.healthFloor, 1) + ' % of GDP'],
      ['Re-election ban on a broken cap', c.reelectionBan ? 'yes' : 'no']
    ], [1])));
  main.append(card(el('h3', { text: 'Links' }),
    el('p', null, el('a', { href: '../city-designer/mondiala.html', text: 'Open the full interactive city map →' })),
    el('p', null, el('a', { href: '#budget', text: 'The Mondiala preset in the national budget →' }))));

  // Hex map: SVG elements must be created in the SVG namespace —
  // document.createElement cannot make them, so the map is drawn with
  // createElementNS. No flag property; rings 0–3 only.
  const box = document.getElementById('hexmap');
  const size = 26, w = 640, h = 420;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', String(w));
  svg.setAttribute('height', String(h));
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  const cx = w / 2, cy = h / 2;
  const hex = (x, y, r, i) => {
    const poly = document.createElementNS(NS, 'polygon');
    const pts = [];
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 180 * (60 * k - 30);
      pts.push(`${x + r * Math.cos(a)},${y + r * Math.sin(a)}`);
    }
    const col = i === 0 ? '#e8b04b' : (i <= 6 ? '#3fb950' : (i <= 18 ? '#4c8bf5' : '#7d8b9d'));
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('fill', col);
    poly.setAttribute('stroke', '#0d1117');
    poly.setAttribute('stroke-width', '1.5');
    poly.setAttribute('opacity', '0.9');
    return poly;
  };
  svg.append(hex(cx, cy, size, 0));
  let i = 1;
  for (let ring = 1; ring <= 3; ring++) {
    for (let k = 0; k < 6 * ring; k++) {
      const a = (Math.PI / 3) * (k / ring) - Math.PI / 6;
      const x = cx + size * 1.74 * ring * Math.cos(a + Math.PI / 6);
      const y = cy + size * 1.52 * ring * Math.sin(a + Math.PI / 6);
      svg.append(hex(x, y, size, i++));
    }
  }
  box.append(svg);
}
