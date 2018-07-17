import reconcileArrays from './reconcileArrays'
import Attributes from '../Attributes'

isNode = (el) -> el and el.nodeName and el.nodeType

normalizeIncomingArray = (normalized, array) ->
  i = 0
  len = array.length
  while i < len
    item = array[i]
    if item instanceof Node
      normalized.push item
    else if not item? or item is true or item is false
      # matches null, undefined, true or false
      # skip
    else if Array.isArray(item)
      normalizeIncomingArray(normalized, item)
    else if typeof item == 'string'
      normalized.push item
    else
      normalized.push item.toString()
    i++
  normalized

singleExpression = ->
  current = null
  (value, parent) ->
    return if value is current
    t = typeof value
    if t is 'string'
      return current = parent.firstChild.data = value if current
      current = parent.textContent = value
    else if 'number' is t or 'boolean' is t or value instanceof Date or value instanceof RegExp
      value = value.toString()
      return current = parent.firstChild.data = value if current
      current = parent.textContent = value
    else if not value? or t is 'boolean'
      current = parent.textContent = ''
    else if value instanceof Node
      if Array.isArray(current)
        if current.length is 0
          parent.appendChild(value)
        else if current.length is 1
          parent.replaceChild(value, current[0])
        else
          parent.textContent = ''
          parent.appendChild(value)
      else if current is '' or not current?
        parent.appendChild(value)
      else parent.replaceChild(value, parent.firstChild)
      current = value
    else if Array.isArray(value)
      array = normalizeIncomingArray([], value)
      if array.length is 0
        parent.textContent = ''
      else
        if Array.isArray(current)
          if current.length is 0
            parent.appendChild(child) for child in array
          else reconcileArrays(parent, current, array)
        else unless current
          parent.appendChild(child) for child in array
        else reconcileArrays(parent, [parent.firstChild], array)
      current = array
    else
      throw new Error("content must be Node, stringable, or array of same")

multipleExpressions = ->
  nodes = []
  (value, parent) ->
    marker = null
    t = typeof value
    parent = nodes[0]?.parentNode or parent
    if t is 'string' or 'number' is t or 'boolean' is t or value instanceof Date or value instanceof RegExp
      if nodes[0]?.nodeType is 3
        nodes[0].data = value.toString()
        marker = nodes[0]
      else
        value = document.createTextNode(value.toString())
        if nodes[0]
          parent.replaceChild(value, nodes[0])
        else parent.appendChild(value)
        nodes[0] = marker = value
    else if value instanceof Node
      if nodes[0]
        if nodes[0] isnt value
          parent.replaceChild(value, nodes[0])
      else parent.appendChild(value)
      nodes[0] = marker = value
    else if Array.isArray(value)
      array = normalizeIncomingArray([], value)
      if array.length
        unless nodes.length
          for child, i in array
            parent.appendChild(child)
            nodes[i] = child
          marker = nodes[i - 1]
        else
          reconcileArrays(parent, nodes, array, true)
          nodes = array
          marker = nodes[nodes.length - 1]

    # handle nulls
    unless marker?
      if nodes[0] is parent.firstChild and nodes.length > 1 and nodes[nodes.length - 1] is parent.lastChild
        parent.textContent = '';
        value = document.createTextNode('');
        parent.appendChild(value)
        marker = nodes[0] = value
      else if nodes[0]?.nodeType is 3
        nodes[0].data = '';
        marker = nodes[0]
      else
        value = document.createTextNode('')
        if nodes[0]
          parent.replaceChild(value, nodes[0])
        else parent.appendChild(value)
        marker = nodes[0] = value

    # trim extras
    while marker isnt (node = nodes[nodes.length - 1])
      parent.removeChild(node)
      nodes.length = nodes.length - 1
    return

DelegateMap = {}
eventHandler = (el, key, fn) -> (e) ->
  node = e.target
  node = node.parentNode while node and node isnt el and !(found = node[key])?
  return unless found?
  fn(found, e)
  return

applySpread = (props, node) ->
  for prop, value of props
    if prop is 'style'
      node.style[k] = value[k] for k of value
      continue
    if prop is 'classList'
      node.classList.toggle(className, prop[className]) for className of value
      continue
    if info = Attributes[prop]
      if info.type is 'attribute'
        node.setAttribute(prop, value)
        continue
      else prop = info.alias
    node[prop] = value
  return

export createRuntime = ({ wrapExpr, disposer }) ->
  disposer or= (->)
  return runtime = {
    assign: (a) ->
      for i in [1...arguments.length] by 1
        b = arguments[i]
        a[k] = b[k] for k of b
      return a

    insert: (parent, accessor) ->
      if typeof accessor is 'function'
        return wrapExpr(accessor, parent, false, singleExpression())
      singleExpression()(accessor, parent)

    insertM: (parent, accessor) ->
      if typeof accessor is 'function'
        return wrapExpr(accessor, parent, false, multipleExpressions())
      multipleExpressions()(accessor, parent)

    wrap: (elem, accessor, fn) ->
      wrapExpr accessor, elem, true, fn

    spread: (elem, accessor) ->
      wrapExpr ->
        props = accessor()
        v for k, v of props
        return props
      , elem, true, applySpread

    addEventListener: (node, eventName, fn) ->
      node.addEventListener(eventName, fn)

    addEventDelegate: (el, parentEl, eventName, key, id, fn) ->
      el[key] = id
      return if parentEl[key]
      parentEl[key] = true
      parentEl.addEventListener(eventName, eventHandler(parentEl, key, fn), true);

    delegateBinding: (k, signal, update) ->
      DelegateMap[k] = delegate = {head: undefined, tail: undefined}
      wrapExpr signal, delegate, true, (_, delegate) ->
        node = delegate.head
        while node
          update(node.value(), node.elem)
          node = node.next
        return
      disposer(() -> delete DelegateMap[k]; return)
      return

    addBindingDelegate: (key, elem, value) ->
      delegate = DelegateMap[key]
      unless delegate.tail
        delegate.tail = delegate.head = node = {value, elem}
      else
        delegate.tail = delegate.tail.next = node = {value, elem, prev: delegate.tail}
      disposer(() ->
        if node.prev
          node.prev.next = node.next
        else delegate.head = node.next
        if node.next
          node.next.prev = node.prev
        else delegate.tail = node.prev
        return
      )
  }