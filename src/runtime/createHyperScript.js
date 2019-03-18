import NonComposedEvents from '../NonComposedEvents';

const FLOW_METHODS = ['each', 'when', 'suspend', 'portal'];

// Inspired by https://github.com/hyperhype/hyperscript
export function createHyperScript(r, {delegateEvents = true} = {}) {
  const bindings = {};
  function h() {
    let args = [].slice.call(arguments), e = null, delegatedEvents = new Set();
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
        let multi = false;
        for (let i = 0; i < l.length; i++) {
          if(typeof l[i] === 'function') {
            multi = true;
            break;
          }
        }
        if (multi) {
          for (let i = 0; i < l.length; i++) {
            const item = l[i];
            const n = e.appendChild(document.createTextNode(''));
            if (item.flow) item(e, n);
            else r.insert(e, item, undefined, n);
          }
        } else r.insert(e, l);
      } else if(l instanceof Node) e.appendChild(l);
      else if ('object' === type) {
        for (const k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              const lc = k.toLowerCase();
              if (delegateEvents && lc !== k && !NonComposedEvents.has(lc.slice(2))) {
                const name = lc.slice(2);
                delegatedEvents.add(name);
                e[`__${name}`] = l[k];
              } else e[lc] = l[k];
            } else if (k === 'ref') {
              l[k](e);
            } else if (k[0] === '$') {
              bindings[k.slice(1)](e, l[k]);
            } else (function(k, l) { r.wrap(() => parseKeyValue(k, l[k]())); })(k, l);
          } else parseKeyValue(k, l[k]);
        }
      } else if ('function' === typeof l) {
        if (l.flow) l(e);
        else r.insert(e, l);
      }
    }
    while(args.length) item(args.shift());
    r.delegateEvents(Array.from(delegatedEvents));
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
      } else if(k === 'events') {
        for (const c in v) e.addEventListener(c, v[c]);
      } else if(k === 'attrs') {
        for (const a in v) e.setAttribute(a, v[a]);
      } else e[k] = v;
    }
  }

  h.registerBinding = (key, fn) => { bindings[key] = fn; }

  FLOW_METHODS.forEach(key =>
    h[key] = (a, t, o = {}) => {
      const m = (e, n) => r.flow(e, key, a, t, o, n);
      m.flow = true;
      return m;
    }
  );

  return h;
}