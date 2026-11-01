// stubs.js — headless DOM for testing the Mondiala app outside a browser
"use strict";
const __els = new Map();   // id -> element
const __all = new Set();  // every live element

class __ClassList {
  constructor() { this._s = new Set(); }
  add(...cs) { cs.forEach(c => c && this._s.add(c)); }
  remove(...cs) { cs.forEach(c => this._s.delete(c)); }
  contains(c) { return this._s.has(c); }
  toggle(c, on) { if (on === undefined) on = !this._s.has(c); if (on) this._s.add(c); else this._s.delete(c); return on; }
}

function makeEl(tag, ns) {
  const el = {
    tagName: String(tag).toUpperCase(),
    namespaceURI: ns || null,
    children: [], parentNode: null,
    attributes: {}, dataset: {}, style: {},
    _listeners: {},
    clientWidth: 1000, clientHeight: 800,
    textContent: "", value: "",
    id: undefined,
  };
  el.classList = new __ClassList();
  Object.defineProperty(el, "className", {
    get() { return [...el.classList._s].join(" "); },
    set(v) { el.classList._s = new Set(String(v).split(/\s+/).filter(Boolean)); },
  });
  el.setAttribute = (n, v) => {
    el.attributes[n] = String(v);
    if (n === "class") el.classList._s = new Set(String(v).split(/\s+/).filter(Boolean));
    if (n.slice(0, 5) === "data-") el.dataset[n.slice(5)] = String(v);
  };
  el.getAttribute = (n) => (n in el.attributes ? el.attributes[n] : null);
  el.appendChild = (c) => { c.parentNode = el; el.children.push(c); __register(c); return c; };
  el.removeChild = (c) => { const i = el.children.indexOf(c); if (i >= 0) { el.children.splice(i, 1); c.parentNode = null; __unregister(c); } };
  el.addEventListener = (t, f) => { (el._listeners[t] = el._listeners[t] || []).push(f); };
  el.removeEventListener = (t, f) => { const a = el._listeners[t]; if (a) { const i = a.indexOf(f); if (i >= 0) a.splice(i, 1); } };
  el.closest = (sel) => {
    if (sel && sel[0] === ".") { let n = el; while (n) { if (n.classList && n.classList.contains(sel.slice(1))) return n; n = n.parentNode; } }
    if (sel && sel[0] === "#") { let n = el; while (n) { if (n.id === sel.slice(1)) return n; n = n.parentNode; } }
    return null;
  };
  el.click = () => {};
  el.getBoundingClientRect = () => ({ left: 0, top: 0, right: 1000, bottom: 800, width: 1000, height: 800 });
  let _innerHTML = "";
  Object.defineProperty(el, "innerHTML", {
    get() { return _innerHTML; },
    set(html) {
      _innerHTML = String(html);
      el.children.slice().forEach(c => __unregister(c));
      el.children.length = 0;
      __parseInto(_innerHTML, el);
    },
  });
  __all.add(el);
  return el;
}

function __register(el) {
  if (el.id) __els.set(el.id, el);
}
function __unregister(el) {
  __all.delete(el);
  if (el.id && __els.get(el.id) === el) __els.delete(el.id);
  el.children.slice().forEach(__unregister);
}
function __unescape(s) { return String(s).replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"); }
function __parseInto(html, parent) {
  const re = /<([a-zA-Z][a-zA-Z0-9-]*)((?:\s[^<>]*?)?)>/g;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[2] || "";
    const el = makeEl(m[1]);
    const idm = attrs.match(/\bid="([^"]*)"/);
    if (idm) el.id = idm[1];
    const clsm = attrs.match(/\bclass="([^"]*)"/);
    if (clsm) el.className = __unescape(clsm[1]);
    const valm = attrs.match(/\bvalue="([^"]*)"/);
    if (valm) el.value = __unescape(valm[1]);
    if (el.tagName === "SELECT") { // pick the selected option's value, else the first
      const rest = html.slice(re.lastIndex);
      const end = rest.indexOf("</select>");
      const seg = end === -1 ? rest : rest.slice(0, end);
      const optRe = /<option\b([^>]*)>/g; let om, first = null, sel = null;
      while ((om = optRe.exec(seg))) {
        const ov = (om[1].match(/value="([^"]*)"/) || [])[1];
        if (first === null) first = ov === undefined ? "" : ov;
        if (om[1].indexOf("selected") !== -1) sel = ov === undefined ? "" : ov;
      }
      el.value = sel !== null ? sel : (first !== null ? first : "");
    }
    parent.appendChild(el); // registers id into __els
  }
}

const document = {
  _listeners: {},
  children: [],
  parentNode: null,
  body: makeEl("body"),
  createElement: (t) => makeEl(t),
  createElementNS: (ns, t) => makeEl(t, ns),
  getElementById: (id) => {
    let el = __els.get(id);
    if (!el) { el = makeEl("div"); el.id = id; __els.set(id, el); }
    return el;
  },
  addEventListener: (t, f) => { (document._listeners[t] = document._listeners[t] || []).push(f); },
  querySelector: (sel) => __qsa(sel)[0] || null,
  querySelectorAll: (sel) => __qsa(sel),
};
document.body.parentNode = document;

function __qsa(sel) {
  const out = [];
  for (const el of __all) {
    if (sel[0] === "." && el.classList && el.classList.contains(sel.slice(1))) out.push(el);
    else if (sel[0] === "[") {
      const m = sel.match(/^\[data-key="(.*)"\]$/);
      if (m && el.dataset && el.dataset.key === m[1]) out.push(el);
    }
  }
  return out;
}

const window = { addEventListener() {}, removeEventListener() {}, innerWidth: 1000, innerHeight: 800 };
const localStorage = {
  _d: {},
  getItem(k) { return k in this._d ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};

function __fire(el, type, ev) {
  const e = Object.assign({ target: el, currentTarget: el, preventDefault() {}, stopPropagation() {}, clientX: 0, clientY: 0, deltaY: 0, deltaMode: 0 }, ev || {});
  (el._listeners[type] || []).slice().forEach(f => f(e));
}
