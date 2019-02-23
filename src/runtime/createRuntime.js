import { reconcileArrays, normalizeIncomingArray } from './reconcileArrays';
import Attributes from '../Attributes'

function clearAll(parent, current, marker, startNode) {
  if (!marker) return parent.textContent = '';
  if (Array.isArray(current)) {
    for (let i = 0; i < current.length; i++) {
      parent.removeChild(current[i]);
    }
  } else if (current != null && current != '') {
    if (startNode !== undefined) {
      let node = marker.previousSibling, tmp;
      while(node !== startNode) {
        tmp = node.previousSibling;
        parent.removeChild(node);
        node = tmp;
      }
    }
    else parent.removeChild(marker.previousSibling);
  }
  return '';
}

const eventRegistry = new Set();
function lookup(el, name) {
  let h = el[name], m = el.model, r, p;
  if ((h === undefined || (h.length > 1 && m === undefined))
    && (p = el.host || el.parentNode)) r = lookup(p, name);
  return [h !== undefined ? h : r && r[0], m || r && r[1]];
}

function eventHandler(e) {
  const node = (e.composedPath && e.composedPath()[0]) || e.target;
  const [handler, model] = lookup(node, `__${e.type}`);

  // reverse Shadow DOM retargetting
  if (e.target !== node) {
    Object.defineProperty(e, 'target', {
      configurable: true,
      value: node
    })
  }
  return handler && handler(e, model);
}

export function createRuntime(options) {
  const { wrap, cleanup, root } = options;

  function insertExpression(parent, value, current, marker) {
    if (value === current) return current;
    parent = (marker && marker.parentNode) || parent;
    const t = typeof value;
    if (t === 'string' || t === 'number') {
      if (t === 'number') value = value.toString();
      if (marker) {
        if (value === '') clearAll(parent, current, marker)
        else if (current !== '' && typeof current === 'string') {
          marker.previousSibling.data = value;
        } else {
          const node = document.createTextNode(value);
          if (current !== '' && current != null) {
            parent.replaceChild(node, marker.previousSibling);
          } else parent.insertBefore(node, marker);
        }
        current = value;
      } else {
        if (current !== '' && typeof current === 'string') {
          current = parent.firstChild.data = value;
        } else current = parent.textContent = value;
      }
    } else if (value == null || t === 'boolean') {
      current = clearAll(parent, current, marker);
    } else if (t === 'function') {
      wrap(function() { current = insertExpression(parent, value(), current, marker); });
    } else if (value instanceof Node) {
      if (Array.isArray(current)) {
        if (current.length === 0) {
          parent.insertBefore(value, marker);
        } else if (current.length === 1) {
          parent.replaceChild(value, current[0]);
        } else {
          clearAll(parent, current, marker);
          parent.appendChild(value);
        }
      } else if (current == null || current === '') {
        parent.insertBefore(value, marker);
      } else {
        parent.replaceChild(value, (marker && marker.previousSibling) || parent.firstChild);
      }
      current = value;
    } else if (Array.isArray(value)) {
      let array = normalizeIncomingArray([], value);
      clearAll(parent, current, marker);
      if (array.length !== 0) {
        for (let i = 0, len = array.length; i < len; i++) {
          parent.insertBefore(array[i], marker);
        }
      }
      current = array;
    } else {
      throw new Error("content must be Node, stringable, or array of same");
    }

    return current;
  }

  return Object.assign({
    insert(parent, accessor, init, marker) {
      if (typeof accessor !== 'function') return insertExpression(parent, accessor, init, marker);
      wrap((current = init) => insertExpression(parent, accessor(), current, marker));
    },
    delegateEvents(eventNames) {
      for (let i = 0, l = eventNames.length; i < l; i++) {
        const name = eventNames[i];
        if (!eventRegistry.has(name)) {
          eventRegistry.add(name);
          document.addEventListener(name, eventHandler);
        }
      }
    },
    clearDelegatedEvents() {
      for (let name of eventRegistry.keys()) document.removeEventListener(name, eventHandler);
      eventRegistry.clear();
    },
    spread(node, accessor) {
      wrap(function() {
        const props = accessor();
        let info;
        for (const prop in props) {
          const value = props[prop];
          if (prop === 'style') {
            Object.assign(node.style, value);
          } else if (prop === 'classList') {
            for (const className in value) node.classList.toggle(className, value[className]);
          } else if (info = Attributes[prop]) {
            if (info.type === 'attribute') {
              node.setAttribute(prop, value)
            } else node[info.alias] = value;
          } else node[prop] = value;
        }
      });
    },
    flow(parent, type, accessor, expr, afterRender, marker) {
      let startNode;
      if (marker) startNode = marker.previousSibling;
      if (type === 'each') {
        reconcileArrays(parent, accessor, expr, afterRender, options, startNode, marker);
      } else if (type === 'when') {
        let current, disposable;
        cleanup(function dispose() { disposable && disposable(); });
        wrap(cached => {
          const value = accessor();
          if (value === cached) return cached;
          disposable && disposable();
          parent = (marker && marker.parentNode) || parent;
          if (value == null || value === false) {
            clearAll(parent, current, marker, startNode);
            current = null;
            return value;
          }
          root(disposer => {
            disposable = disposer;
            current = insertExpression(parent, expr(value), current, marker)
            afterRender && afterRender(current, marker);
          });
          return value;
        })
      }
    }
  }, options);
}