const GROUPING = '__rGroup',
  KEY = '__rid',
  FORWARD = 'nextSibling',
  BACKWARD = 'previousSibling';
let groupCounter = 0;

function addNode(node, parent, afterNode) {
  if (Array.isArray(node)) {
    if (!node.length) return;
    let mark = node[0]
    mark[KEY] = groupCounter;
    if (node.length !== 1) {
      mark[GROUPING] = groupCounter;
      node[node.length - 1][GROUPING] = groupCounter;
      node[node.length - 1][KEY] = groupCounter;
    }
    for (let i = 0; i < node.length; i++)
      afterNode ? parent.insertBefore(node[i], afterNode) : parent.appendChild(node[i]);
    return mark;
  }
  let mark;
  if (node.nodeType === 11) {
    node.__mounted = { parent, marker: afterNode };
    mark = node.firstChild;
    if (mark) {
      mark[KEY] = groupCounter;
      if (mark !== node.lastChild) {
        mark[GROUPING] = groupCounter;
        node.lastChild[GROUPING] = groupCounter;
        node.lastChild[KEY] = groupCounter;
      }
    }
  } else node[KEY] = groupCounter;

  afterNode ? parent.insertBefore(node, afterNode) : parent.appendChild(node);
  return mark || node;
}

function step(node, direction) {
  const key = node[GROUPING];
  node = node[direction];
  if (key) {
    while(node && node[GROUPING] !== key) node = node[direction];
    node = node[direction];
  }
  return node;
}

function removeNodes(parent, node, end) {
  let tmp;
  while(node !== end) {
    tmp = node.nextSibling;
    parent.removeChild(node);
    node = tmp;
  }
}

function insertNodes(parent, node, end, target) {
  let tmp;
  while (node !== end) {
    tmp = node.nextSibling;
    parent.insertBefore(node, target);
    node = tmp;
  }
}

function cleanNode(disposables, node) {
  const key = node[KEY];
  disposables.get(key)();
  disposables.delete(key);
}

// This is almost straightforward implementation of reconcillation algorithm
// based on ivi documentation:
// https://github.com/localvoid/ivi/blob/2c81ead934b9128e092cc2a5ef2d3cabc73cb5dd/packages/ivi/src/vdom/implementation.ts#L1366
// With some fast paths from Surplus implementation:
// https://github.com/adamhaile/surplus/blob/master/src/runtime/content.ts#L86
// And working with data directly from Stage0:
// https://github.com/Freak613/stage0/blob/master/reconcile.js
// This implementation is tailored for fine grained change detection and adds suupport for fragments
export default function reconcile(parent, accessor, mapFn, afterRenderFn, options, beforeNode, afterNode) {
  const { wrap, cleanup, root, sample } = options;
  let disposables = new Map();

  function createFn(item, i, afterNode) {
    return root(disposer => {
      disposables.set(++groupCounter, disposer)
      return addNode(mapFn(item, i), parent, afterNode);
    });
  }

  function afterRender() {
    afterRenderFn && afterRenderFn(
      beforeNode ? beforeNode.nextSibling : parent.firstChild, afterNode
    );
  }

  cleanup(function dispose() {
    for (let i of disposables.keys()) disposables.get(i)();
    disposables.clear();
  });
  wrap((renderedValues = []) => {
    const data = accessor();
    return sample(() => {
      parent = (afterNode && afterNode.parentNode) || parent;
      const length = data.length;

      // Fast path for clear
      if (length === 0) {
        if (beforeNode !== undefined || afterNode !== undefined) {
          let node = beforeNode != undefined ? beforeNode.nextSibling : parent.firstChild;
          removeNodes(parent, node, afterNode === undefined ? null : afterNode);
        } else parent.textContent = "";

        for (let i of disposables.keys()) disposables.get(i)();
        disposables.clear();
        afterRender();
        return [];
      }

      // Fast path for create
      if (renderedValues.length === 0) {
        let nextData = new Array(length);
        for (let i = 0; i < length; i++) createFn(nextData[i] = data[i], i, afterNode);
        afterRender();
        return nextData;
      }

      let prevStart = 0,
        newStart = 0,
        loop = true,
        prevEnd = renderedValues.length-1, newEnd = length-1,
        a, b,
        prevStartNode = beforeNode ? beforeNode.nextSibling : parent.firstChild,
        newStartNode = prevStartNode,
        prevEndNode = afterNode ? afterNode.previousSibling : parent.lastChild,
        newAfterNode = afterNode;

      fixes: while(loop) {
        loop = false;
        let _node;

        // Skip prefix
        a = renderedValues[prevStart], b = data[newStart];
        while(a === b) {
          prevStart++;
          newStart++;
          newStartNode = prevStartNode = step(prevStartNode, FORWARD);
          if (prevEnd < prevStart || newEnd < newStart) break fixes;
          a = renderedValues[prevStart];
          b = data[newStart];
        }

        // Skip suffix
        a = renderedValues[prevEnd], b = data[newEnd];
        while(a === b) {
          prevEnd--;
          newEnd--;
          newAfterNode = prevEndNode;
          prevEndNode = step(prevEndNode, BACKWARD);
          if (prevEnd < prevStart || newEnd < newStart) break fixes;
          a = renderedValues[prevEnd];
          b = data[newEnd];
        }

        // Fast path to swap backward
        a = renderedValues[prevEnd], b = data[newStart];
        while(a === b) {
          loop = true;
          _node = step(prevEndNode, BACKWARD);
          let mark = _node.nextSibling;
          if (newStartNode !== mark) {
            insertNodes(parent, mark, prevEndNode.nextSibling, newStartNode)
            prevEndNode = _node;
          }
          newStart++;
          prevEnd--;
          if (prevEnd < prevStart || newEnd < newStart) break fixes;
          a = renderedValues[prevEnd];
          b = data[newStart];
        }

        // Fast path to swap forward
        a = renderedValues[prevStart], b = data[newEnd];
        while(a === b) {
          loop = true;
          _node = step(prevStartNode, FORWARD);
          if (prevStartNode !== newAfterNode) {
            let mark = _node.previousSibling;
            insertNodes(parent, prevStartNode, _node, newAfterNode);
            newAfterNode = mark;
            prevStartNode = _node;
          }
          prevStart++;
          newEnd--;
          if (prevEnd < prevStart || newEnd < newStart) break fixes;
          a = renderedValues[prevStart];
          b = data[newEnd];
        }
      }

      // Fast path for shrink
      if (newEnd < newStart) {
        if (prevStart <= prevEnd) {
          let next, key, node;
          while(prevStart <= prevEnd) {
            // manually step to keep refs
            node = prevEndNode;
            if (key = node[GROUPING]) {
              node = node.previousSibling;
              while(node && node[GROUPING] !== key) node = node.previousSibling;
            }
            next = node.previousSibling;
            removeNodes(parent, node, prevEndNode.nextSibling);
            cleanNode(disposables, prevEndNode);
            prevEndNode = next;
            prevEnd--;
          }
        }
        afterRender();
        return data.slice(0);
      }

      // Fast path for add
      if (prevEnd < prevStart) {
        if (newStart <= newEnd) {
          while(newStart <= newEnd) {
            createFn(data[newStart], newStart, newAfterNode);
            newStart++;
          }
        }
        afterRender();
        return data.slice(0);
      }

      // Positions for reusing nodes from current DOM state
      const P = new Array(newEnd + 1 - newStart);
      for(let i = newStart; i <= newEnd; i++) P[i] = -1;

      // Index to resolve position from current to new
      const I = new Map();
      for(let i = newStart; i <= newEnd; i++) I.set(data[i], i);

      let reusingNodes = 0, toRemove = [];
      for(let i = prevStart; i <= prevEnd; i++) {
        if (I.has(renderedValues[i])) {
          P[I.get(renderedValues[i])] = i;
          reusingNodes++;
        } else {
          toRemove.push(i);
        }
      }

      // Fast path for full replace
      if (reusingNodes === 0) {
        const doRemove = prevStartNode !== parent.firstChild || prevEndNode !== parent.lastChild;
        let node = prevStartNode, mark;
        newAfterNode = prevEndNode.nextSibling;
        while(node !== newAfterNode) {
          mark = step(node, FORWARD);
          cleanNode(disposables, node);
          doRemove && removeNodes(parent, node, mark);
          node = mark;
          prevStart++;
        }
        !doRemove && (parent.textContent = "");

        for(let i = newStart; i <= newEnd; i++) createFn(data[i], i, newAfterNode);
        afterRender();
        return data.slice(0);
      }

      // What else?
      const longestSeq = longestPositiveIncreasingSubsequence(P, newStart),
        nodes = [];
      let tmpC = prevStartNode, lisIdx = longestSeq.length - 1, tmpD;

      // Collect nodes to work with them
      for(let i = prevStart; i <= prevEnd; i++) {
        nodes[i] = tmpC;
        tmpC = step(tmpC, FORWARD);
      }

      for(let i = 0; i < toRemove.length; i++) {
        let index = toRemove[i],
          node = nodes[index];
        removeNodes(parent, node, step(node, FORWARD));
        cleanNode(disposables, node);
      }

      for(let i = newEnd; i >= newStart; i--) {
        if(longestSeq[lisIdx] === i) {
          newAfterNode = nodes[P[longestSeq[lisIdx]]];
          lisIdx--;
        } else {
          if (P[i] === -1) {
            tmpD = createFn(data[i], i, newAfterNode);
          } else {
            tmpD = nodes[P[i]];
            insertNodes(parent, tmpD, step(tmpD, FORWARD), newAfterNode);
          }
          newAfterNode = tmpD;
        }
      }

      afterRender();
      return data.slice(0);
    });
  });
}

// Picked from
// https://github.com/adamhaile/surplus/blob/master/src/runtime/content.ts#L368

// return an array of the indices of ns that comprise the longest increasing subsequence within ns
function longestPositiveIncreasingSubsequence(ns, newStart) {
  var seq = [],
    is  = [],
    l   = -1,
    pre = new Array(ns.length);

  for (var i = newStart, len = ns.length; i < len; i++) {
    var n = ns[i];
    if (n < 0) continue;
    var j = findGreatestIndexLEQ(seq, n);
    if (j !== -1) pre[i] = is[j];
    if (j === l) {
      l++;
      seq[l] = n;
      is[l]  = i;
    } else if (n < seq[j + 1]) {
      seq[j + 1] = n;
      is[j + 1] = i;
    }
  }

  for (i = is[l]; l >= 0; i = pre[i], l--) {
    seq[l] = i;
  }

  return seq;
}

function findGreatestIndexLEQ(seq, n) {
  // invariant: lo is guaranteed to be index of a value <= n, hi to be >
  // therefore, they actually start out of range: (-1, last + 1)
  var lo = -1,
    hi = seq.length;

  // fast path for simple increasing sequences
  if (hi > 0 && seq[hi - 1] <= n) return hi - 1;

  while (hi - lo > 1) {
    var mid = Math.floor((lo + hi) / 2);
    if (seq[mid] > n) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  return lo;
}