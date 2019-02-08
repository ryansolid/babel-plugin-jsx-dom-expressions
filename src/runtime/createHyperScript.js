// Inspired by https://github.com/hyperhype/hyperscript
export function createHyperScript(r) {
  const bindings = {};
  function h() {
    let args = [].slice.call(arguments), e = null;
    function item(l) {
      const type = typeof l;
      if(l == null) ;
      else if('string' === type) {
        if(!e) parseClass(l);
        else e.appendChild(document.createTextNode(l));
      }
      else if('number' === type
        || 'boolean' === type
        || l instanceof Date
        || l instanceof RegExp ) {
          e.appendChild(document.createTextNode(l.toString()));
      }
      else if (Array.isArray(l)) {
        // Support Fragments
        if (!e) e = document.createDocumentFragment();
        for (let i = 0; i < l.length; i++) {
          const item = l[i];
          if (item.flow) item(e);
          else r.insert(e, item);
        }
      } else if(l instanceof Node) e.appendChild(l);
      else if ('object' === type) {
        for (const k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              r.addEventListener(e, k.substring(2), l[k]);
            } else if (k === 'ref') {
              l[k](e);
            } else if (k[0] === '$') {
              bindings[k.substring(1)](e, l[k]);
            } else (function(k, l) { r.wrap(() => parseKeyValue(k, l[k]())); })(k, l);
          } else parseKeyValue(k, l[k]);
        }
      } else if ('function' === typeof l) {
        if (l.flow) l(e);
        else r.insert(e, l);
      }
    }
    while(args.length) item(args.shift());
    return e;

    function parseClass (string) {
      // Our minimal parser doesn’t understand escaping CSS special
      // characters like `#`. Don’t use them. More reading:
      // https://mathiasbynens.be/notes/css-escapes .

      const m = string.split(/([\.#]?[^\s#.]+)/);
      if(/^\.|#/.test(m[1]))
        e = document.createElement('div');
      for (let i = 0; i < m.length; i++) {
        const v = m[i],
          s = v.substring(1, v.length);
        if(!v) continue;
        if(!e) e = document.createElement(v);
        else if (v[0] === '.') e.classList.add(s);
        else if (v[0] === '#') e.setAttribute('id', s);
      }
    }
    function parseKeyValue(k, v) {
      if(k === 'style') {
        if('string' === typeof v) e.style.cssText = v;
        else{
          for (const s in v) e.style.setProperty(s, v[s]);
        }
      } else if(k === 'classList') {
        for (const c in v) e.classList.toggle(c, v[c]);
      } else if(k === 'attrs') {
        for (const a in v) e.setAttribute(a, v[a]);
      } else e[k] = v;
    }
  }

  h.registerBinding = (key, fn) => { bindings[key] = fn; }

  h.when = (a, t, c) => {
    const m = e => {
      const n = e.appendChild(document.createTextNode(''));
      r.flow(e, 'when', a, t, c, n);
    }
    m.flow = true;
    return m;
  }

  h.each = (a, t, c) => {
    const m = e => {
      const n = e.appendChild(document.createTextNode(''));
      r.flow(e, 'each', a, t, c, n)
    };
    m.flow = true;
    return m;
  }

  return h;
}