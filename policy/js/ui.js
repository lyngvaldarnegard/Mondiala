export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function fmt(n, digits = 0) {
  return Number(n).toLocaleString('nb-NO', { maximumFractionDigits: digits });
}

export function fmtNOK(n) {
  const abs = Math.abs(n);
  if (abs >= 1e12) return fmt(n / 1e12, 1) + ' bill. kr';
  if (abs >= 1e9) return fmt(n / 1e9, 1) + ' mrd kr';
  if (abs >= 1e6) return fmt(n / 1e6, 1) + ' mill. kr';
  return fmt(n) + ' kr';
}

export function card(...children) {
  return el('div', { class: 'card' }, ...children);
}

export function table(headers, rows, numCols = []) {
  const thead = el('thead', null, el('tr', null,
    ...headers.map((h, i) => el('th', { class: numCols.includes(i) ? 'num' : '', text: h }))));
  const tbody = el('tbody');
  for (const r of rows) {
    tbody.append(el('tr', null, ...r.map((c, i) => {
      const td = el('td', { class: numCols.includes(i) ? 'num' : '' });
      if (c && c.nodeType) td.append(c); else td.textContent = c;
      return td;
    })));
  }
  return el('table', null, thead, tbody);
}

export function formulaBox(text) {
  return el('div', { class: 'formula', text });
}

// Chart.js default dark styling
if (typeof window !== 'undefined' && window.Chart) {
  window.Chart.defaults.color = '#7d8b9d';
  window.Chart.defaults.borderColor = '#2b3244';
  window.Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
}
