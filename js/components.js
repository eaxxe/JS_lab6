export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'on') {
      Object.entries(attrs.on).forEach(([ev, fn]) => node.addEventListener(ev, fn));
    } else if (k === 'style') {
      Object.assign(node.style, attrs.style);
    } else if (k === 'cls') {
      node.className = attrs.cls;
    } else {
      node.setAttribute(k, attrs[k]);
    }
  }
  children.flat().forEach(c => {
    if (c == null) return;
    node.append(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

export function Button(text, opts = {}) {
  return el('button', { cls: `btn ${opts.cls || ''}`, on: opts.on || {} }, text);
}


export function Input(placeholder, opts = {}) {
  const i = el('input', { cls: opts.cls || 'input', placeholder });
  if (opts.on && opts.on.input) i.addEventListener('input', opts.on.input);
  if (opts.on && opts.on.change) i.addEventListener('change', opts.on.change);
  return i;
}

export function Card(content, cls = '') {
  return el('div', { cls: `card ${cls}` }, content);
}

export function List(items = []) {
  const wrap = el('div', { cls: 'list' });
  items.forEach(it => wrap.append(it));
  return wrap;
}