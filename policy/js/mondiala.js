import { get } from './data.js';
import { el, clear, card, table, fmt } from './ui.js';

// Mondiala sandbox: the fictional world capital as a hex-map page, with the
// Mondiala constitution preset applied. The full interactive city map lives
// in the city-designer module of this repo.
export function render(main) {
  clear(main);
  main.append(el('h2', { text: 'Mondiala — den fiktive hovedstaden' }),
    el('p', { class: 'desc', text: 'Mondiala er sandkassen: verdens nye hovedstad med sin egen grunnlov — 3 % underskuddstak med gjenvalgsforbud, 60 % gjeldstak, gulv for utdanning og helse. Heks kartet under er en kompakt visning; det fullstendige interaktive bykartet bor i denne repoens city-designer.' }));
  const mapCard = card(el('h3', { text: 'Heks-kart — ring 0–3' }), el('div', { id: 'hexmap' }));
  main.append(mapCard);
  const c = get('constitution.presets').Mondiala;
  main.append(card(el('h3', { text: 'Mondialas grunnlov (preset)' }),
    table(['Regel', 'Verdi'], [
      ['Underskuddstak', fmt(100 * c.deficitCap, 1) + ' % av BNP'],
      ['Gjeldstak', fmt(100 * c.debtCap, 0) + ' % av BNP'],
      ['Utdanningsgulv', fmt(100 * c.educationFloor, 1) + ' % av BNP'],
      ['Helsegulv', fmt(100 * c.healthFloor, 1) + ' % av BNP'],
      ['Gjenvalgsforbud ved brutt tak', c.reelectionBan ? 'ja' : 'nei']
    ], [1])));
  main.append(card(el('h3', { text: 'Lenker' }),
    el('p', null, el('a', { href: '../city-designer/mondiala.html', text: 'Åpne det fullstendige interaktive bykartet →' })),
    el('p', null, el('a', { href: '#budget', text: 'Mondiala-presetten i statsbudsjettet →' }))));

  // hex map
  const box = document.getElementById('hexmap');
  const size = 26, w = 640, h = 420;
  const svg = el('svg', { width: String(w), height: String(h), viewBox: `0 0 ${w} ${h}` });
  const cx = w / 2, cy = h / 2;
  const hex = (x, y, r, i) => {
    const pts = [];
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 180 * (60 * k - 30);
      pts.push(`${x + r * Math.cos(a)},${y + r * Math.sin(a)}`);
    }
    const col = i === 0 ? '#e8b04b' : (i <= 6 ? '#3fb950' : (i <= 18 ? '#4c8bf5' : '#7d8b9d'));
    return el('polygon', { points: pts.join(' '), fill: col, stroke: '#0d1117', 'stroke-width': '1.5', opacity: '0.9' });
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
