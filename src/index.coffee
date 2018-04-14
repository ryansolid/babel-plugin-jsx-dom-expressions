export default (babel) ->
  { types: t } = babel

  document = t.identifier("document");
  createElement = t.identifier("createElement");
  createElementNS = t.identifier("createElementNS");
  createTextNode = t.identifier("createTextNode");
  appendChild = t.identifier("appendChild");
  setAttribute = t.identifier("setAttribute");
  hasOwnProperty = t.identifier("hasOwnProperty");
  string = t.stringLiteral("string");
  length = t.identifier("length");
  ArrayClass = t.identifier("Array");
  StringClass = t.identifier("String");
  NodeClass = t.identifier("Node");
  zero = t.numericLiteral(0);
  one = t.numericLiteral(1);

  text = (string) ->
    t.callExpression(t.memberExpression(document, createTextNode), [string])

  append = (node, child, returnPartial) ->
    call = t.callExpression(t.memberExpression(node, appendChild), [child])
    return call if returnPartial
    t.expressionStatement(call)

  declare = (name, value) ->
    t.variableDeclaration("let", [t.variableDeclarator(name, value)])

  toEventName = (name) ->
    name.slice(2).replace(/^(.)/, ($1) -> $1.toLowerCase())

  setAttr = (elem, name, value) ->
    t.expressionStatement(t.callExpression(t.memberExpression(elem, setAttribute), [name, value]))

  setAttrExpr = (path, elem, name, value) ->
    if (name.startsWith("on"))
      return t.expressionStatement(t.callExpression(t.memberExpression(elem, t.identifier("addEventListener")), [t.stringLiteral(toEventName(name)), value]))
    switch name
      when "style"
        t.expressionStatement(
          t.callExpression(t.identifier("r.wrap"), [
            t.arrowFunctionExpression([], t.callExpression(t.identifier("r.assign"), [t.memberExpression(elem, t.identifier(name)), value]))
          ])
        )
      when "class"
        arg = path.scope.generateUidIdentifier("classNames");
        iter = path.scope.generateUidIdentifier("className");
        t.expressionStatement(
          t.callExpression(t.identifier("r.wrap"), [
            t.arrowFunctionExpression(
              [],
              t.blockStatement([
                declare(arg, value),
                t.forInStatement(
                  iter,
                  arg,
                  t.ifStatement(
                    t.callExpression(t.memberExpression(arg, hasOwnProperty), [iter]),
                    t.expressionStatement(t.callExpression(t.memberExpression(elem, t.identifier("classList.toggle")), [iter, t.memberExpression(arg, iter, true)]))
                  )
                )
              ])
            )
          ])
        )
      when "ref"
        t.expressionStatement(t.assignmentExpression("=", value, elem))
      else
        t.expressionStatement(
          t.callExpression(t.identifier("r.wrap"), [
            t.arrowFunctionExpression([], t.callExpression(t.memberExpression(elem, setAttribute), [t.stringLiteral(name), value]))
          ])
        )

  generateHTMLNode = (path, jsx, opts) ->
    if t.isJSXElement(jsx)
      name = path.scope.generateUidIdentifier("elem")
      tagName = jsx.openingElement.name.name
      elems = []

      if tagName isnt tagName.toLowerCase()
        spreads = []
        props = []
        for attribute in jsx.openingElement.attributes
          if t.isJSXSpreadAttribute(attribute)
            spreads.push(attribute.argument)
          else
            value = attribute.value
            if t.isJSXExpressionContainer(value)
              props.push(t.objectProperty(t.identifier(attribute.name.name), value.expression))
            else
              props.push(t.objectProperty(t.identifier(attribute.name.name), value))

        children = []
        for child in jsx.children.length
          child = generateHTMLNode(path, child, opts);
          continue if child is null
          if child.id
            children.push(t.callExpression(t.arrowFunctionExpression([], t.blockStatement([...child.elems, t.returnStatement(child.id)])), []))
          else children.push(t.callExpression(child.elems[0], []))
        if children.length
          props.push(t.objectProperty(t.identifier("children"), t.arrayExpression(children)))

        decl = t.callExpression(
          t.identifier(tagName),
          if spreads.length then [t.callExpression(t.identifier("r.assign"), [t.objectExpression(props), ...spreads])] else [t.objectExpression(props)]
        )

        return { id: null, elems: [t.arrowFunctionExpression([], decl)] }

      namespace = null;
      for attribute in jsx.openingElement.attributes
        if t.isJSXSpreadAttribute(attribute)
          arg = path.scope.generateUidIdentifier("attrs")
          iter = path.scope.generateUidIdentifier("attr")
          elems.push(declare(arg, attribute.argument));
          elems.push(
            t.forInStatement(
              iter,
              arg,
              t.ifStatement(t.callExpression(t.memberExpression(arg, hasOwnProperty), [iter]), setAttr(name, iter, t.memberExpression(arg, iter, true)))
            )
          )
        else
          if attribute.name.name is "namespace"
            namespace = attribute.value
            continue

          value = attribute.value;
          if t.isJSXExpressionContainer(value)
            elems.push(setAttrExpr(path, name, attribute.name.name, value.expression))
          else
            elems.push(setAttr(name, t.stringLiteral(attribute.name.name), value))

      if namespace
        call = t.callExpression(t.memberExpression(document, createElementNS), [namespace, t.stringLiteral(tagName)])
      else
        call = t.callExpression(t.memberExpression(document, createElement), [t.stringLiteral(tagName)])

      decl = t.variableDeclaration("const", [t.variableDeclarator(name, call)])
      elems.unshift(decl)

      for child in jsx.children
        child = generateHTMLNode(path, child, opts)
        continue if child is null
        if child.id
          elems.push(...child.elems)
          elems.push(append(name, child.id))
        else
          elems.push(t.expressionStatement(t.callExpression(t.identifier("r.insert"), [name, child.elems[0]])))

      return { id: name, elems: elems }
    else if t.isJSXText(jsx)
      return null if opts.noWhitespaceOnly and /^\s*$/.test(jsx.value)
      return { id: text(t.stringLiteral(jsx.value)), elems: [] }
    else if t.isJSXExpressionContainer(jsx)
      return { elems: [t.arrowFunctionExpression([], jsx.expression)] }
    else
      return { id: null, elems: [jsx] }

  return {
    name: "ast-transform",
    visitor:
      JSXElement: (path, { opts }) ->
        result = generateHTMLNode(path, path.node, opts);
        path.replaceWithMultiple(result.elems.concat(t.expressionStatement(result.id)))
  }

