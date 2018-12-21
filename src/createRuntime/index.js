import reconcileArrays from './reconcileArrays';
import Attributes from '../Attributes'

function normalizeIncomingArray(normalized, array) {
  for (var i = 0, len = array.length; i < len; i++) {
    var item = array[i];
    if (item instanceof Node) {
        normalized.push(item);
    } else if (item == null || item === true || item === false) { // matches null, undefined, true or false
        // skip
    } else if (Array.isArray(item)) {
        normalizeIncomingArray(normalized, item);
    } else if (typeof item === 'string') {
        normalized.push(item);
    } else {
        normalized.push(item.toString());
    }
  }
  return normalized;
}

function appendNodes(parent, array, marker) {
  for (let i = 0, len = array.length; i < len; i++) {
    let node = array[i];
    if (!(node instanceof Node))
      node = array[i] = document.createTextNode(node);
    parent.insertBefore(node, marker);
  }
}

function clearAll(parent, current, marker) {
  if (!marker) return parent.textContent = '';
  if (Array.isArray(current)) {
    for (let i = 0; i < current.length; i++) {
      parent.removeChild(current[i]);
    }
  } else if (current != null && current != '') parent.removeChild(marker.previousSibling);
  return '';
}

function model(el) {
  let m = el.model, a = el.action, r;
  if (!m && el.parentNode) r = model(el.parentNode);
  return [m || r && r[0], a || r && r[1]];
}

export function createRuntime(options) {
  const { wrap } = options;

  function insertExpression(parent, value, current, marker) {
    if (value === current) return current;
    parent = (marker && marker.parentNode) || parent;
    const t = typeof value;
    if (t === 'string' || t === 'number') {
      if (t === 'number') value = value.toString();
      if (marker) {
        if (current !== '' && typeof current === 'string') {
          current = marker.previousSibling.data = value;
        } else {
          const node = document.createTextNode(value);
          if (current !== '' && current != null) {
            parent.replaceChild(node, marker.previousSibling);
          } else parent.insertBefore(node, marker);
        }
      } else {
        if (current !== '' && typeof current === 'string') {
          current = parent.firstChild.data = value;
        } else current = parent.textContent = value;
      }
    } else if (value == null || value === '' || t === 'boolean') {
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
      if (array.length === 0) {
        clearAll(parent, current, marker);
      } else {
        if (Array.isArray(current)) {
          if (current.length === 0) {
            appendNodes(parent, array, marker);
          } else {
            reconcileArrays(parent, current, array, !!marker);
          }
        } else if (current == null || current === '') {
          appendNodes(parent, array, marker);
        } else {
          reconcileArrays(parent, [(marker && marker.previousSibling) || parent.firstChild], array, !!marker);
        }
      }
      current = array;
    } else {
      throw new Error("content must be Node, stringable, or array of same");
    }

    return current;
  }

  return Object.assign({
    insert(parent, accessor, init) {
      if (typeof accessor !== 'function') return insertExpression(parent, accessor, init);
      wrap((current = init) => insertExpression(parent, accessor(), current));
    },
    insertM(parent, accessor, init, marker) {
      if (typeof accessor !== 'function') return insertExpression(parent, accessor, init, marker);
      wrap((current = init) => insertExpression(parent, accessor(), current, marker));
    },
    addEventListener(node, eventName, handler) {
      node.addEventListener(eventName, e => {
        if (handler.length < 2) return handler(e);
        const a = model(e.target);
        handler(e, a[0], a[1]);
      });
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
    }
  }, options);
}
