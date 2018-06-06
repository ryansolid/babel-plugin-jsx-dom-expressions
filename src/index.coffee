import SyntaxJSX from '@babel/plugin-syntax-jsx'
import Attributes from './Attributes'

export { createRuntime } from './createRuntime'

export default (babel) ->
  { types: t } = babel

  document = t.identifier("document");
  createElement = t.identifier("createElement");
  createElementNS = t.identifier("createElementNS");
  createFragment = t.identifier("createDocumentFragment");
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
  moduleName = 'r'

  text = (string) ->
    t.callExpression(t.memberExpression(document, createTextNode), [string])

  append = (node, child) ->
    call = t.callExpression(t.memberExpression(node, appendChild), [child])
    t.expressionStatement(call)

  declare = (name, value) ->
    t.variableDeclaration("let", [t.variableDeclarator(name, value)])

  toEventName = (name) ->
    name.slice(2).replace(/^(.)/, ($1) -> $1.toLowerCase())

  setAttr = (elem, name, value) ->
    isAttribute = name.indexOf('-') > -1
    if attribute = Attributes[name]
      if attribute.type is 'attribute'
        isAttribute = true
      else name = attribute.alias

    if isAttribute
      t.callExpression(t.memberExpression(elem, setAttribute), [t.stringLiteral(name), value])
    else
      t.assignmentExpression('=', t.memberExpression(elem, t.identifier(name)), value)

  setAttrExpr = (path, elem, name, value) ->
    if value.leadingComments
      break for c, i in value.leadingComments when c.value.indexOf('@skip') > -1
      if i < value.leadingComments.length
        value.leadingComments.splice(i, 1);
        return t.expressionStatement(setAttr(elem, name, value));

    if (name.startsWith("on"))
      return t.expressionStatement(t.callExpression(t.identifier("#{moduleName}.addEventListener"), [elem, t.stringLiteral(toEventName(name)), value]))

    switch name
      when "style"
        t.expressionStatement(
          t.callExpression(t.identifier("#{moduleName}.wrap"), [
            t.arrowFunctionExpression([], value)
            t.arrowFunctionExpression([t.identifier('value')], t.callExpression(t.identifier("#{moduleName}.assign"), [t.memberExpression(elem, t.identifier(name)), t.identifier('value')]))
          ])
        )
      when 'classList'
        iter = t.identifier("className");
        t.expressionStatement(
          t.callExpression(t.identifier("#{moduleName}.wrap"), [
            t.arrowFunctionExpression([], value)
            t.arrowFunctionExpression(
              [t.identifier('value')],
              t.blockStatement([
                t.forInStatement(
                  declare(iter),
                  t.identifier('value'),
                  t.ifStatement(
                    t.callExpression(t.memberExpression(t.identifier('value'), hasOwnProperty), [iter]),
                    t.expressionStatement(t.callExpression(t.memberExpression(elem, t.identifier("classList.toggle")), [iter, t.memberExpression(t.identifier('value'), iter, true)]))
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
          t.callExpression(t.identifier("#{moduleName}.wrap"), [
            t.arrowFunctionExpression([], value)
            t.arrowFunctionExpression([t.identifier('value')], setAttr(elem, name, t.identifier('value')))
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
        for child in jsx.children
          child = generateHTMLNode(path, child, opts);
          continue if child is null
          if child.id
            children.push(t.callExpression(t.arrowFunctionExpression([], t.blockStatement([...child.elems, t.returnStatement(child.id)])), []))
          else children.push(t.callExpression(child.elems[0], []))
        if children.length
          props.push(t.objectProperty(t.identifier("children"), t.arrayExpression(children)))

        unless spreads.length
          elems = t.callExpression(t.identifier(tagName), [t.objectExpression(props)])
        else
          propsId = path.scope.generateUidIdentifier("props")
          elems.push(declare(propsId, t.objectExpression(props)))
          elems.push(t.expressionStatement(t.callExpression(t.identifier("#{moduleName}.assign"), [propsId, ...spreads])))
          elems.push(t.returnStatement(t.callExpression(t.identifier(tagName),[propsId])))
          elems = t.blockStatement(elems)

        return { id: null, elems: [t.arrowFunctionExpression([], elems)] }

      namespace = null;
      nativeExtension = undefined;
      for attribute in jsx.openingElement.attributes
        if t.isJSXSpreadAttribute(attribute)
          elems.push(
            t.expressionStatement(t.callExpression(t.identifier("#{moduleName}.spread"), [name, t.arrowFunctionExpression([], attribute.argument)]))
          )
        else
          if attribute.name.name is "namespace"
            namespace = attribute.value
            continue

          if attribute.name.name is 'is'
            nativeExtension = attribute.value
            continue

          value = attribute.value;
          if t.isJSXExpressionContainer(value)
            elems.push(setAttrExpr(path, name, attribute.name.name, value.expression))
          else
            elems.push(t.expressionStatement(setAttr(name, attribute.name.name, value)))

      if namespace
        call = t.callExpression(t.memberExpression(document, createElementNS), [namespace, t.stringLiteral(tagName)])
      else if nativeExtension
        call = t.callExpression(t.memberExpression(document, createElement), [t.stringLiteral(tagName), t.objectExpression([t.objectProperty(t.identifier('is'), nativeExtension)])])
      else
        call = t.callExpression(t.memberExpression(document, createElement), [t.stringLiteral(tagName)])

      decl = t.variableDeclaration("const", [t.variableDeclarator(name, call)])
      elems.unshift(decl)

      childExpressions = []
      for child in jsx.children
        child = generateHTMLNode(path, child, opts)
        continue if child is null
        if child.id
          elems.push(...child.elems)
          elems.push(append(name, child.id))
        else
          elems.push(t.expressionStatement(t.callExpression(t.identifier("#{moduleName}.insert#{if jsx.children.length > 1 then 'M' else ''}"), [name, child.elems[0]])))

      return { id: name, elems: elems }
    else if t.isJSXFragment(jsx)
      name = path.scope.generateUidIdentifier("elem")
      elems = []

      call = t.callExpression(t.memberExpression(document, createFragment), [])

      decl = t.variableDeclaration("const", [t.variableDeclarator(name, call)])
      elems.unshift(decl)

      for child in jsx.children
        child = generateHTMLNode(path, child, opts)
        continue if child is null
        if child.id
          elems.push(...child.elems)
          elems.push(append(name, child.id))
        else
          elems.push(t.expressionStatement(t.callExpression(t.identifier("#{moduleName}.insert#{if jsx.children.length > 1 then 'M' else ''}"), [name, child.elems[0]])))

      return { id: name, elems: elems }
    else if t.isJSXText(jsx)
      return null if not opts.allowWhitespaceOnly and /^\s*$/.test(jsx.value)
      return { id: text(t.stringLiteral(jsx.value)), elems: [] }
    else if t.isJSXExpressionContainer(jsx)
      if jsx.expression.leadingComments
        break for c, i in jsx.expression.leadingComments when c.value.indexOf('@skip') > -1
        if i < jsx.expression.leadingComments.length
          jsx.expression.leadingComments.splice(i, 1)
          return { elems: [jsx.expression] }

      return { elems: [t.arrowFunctionExpression([], jsx.expression)] }
    else
      return { id: null, elems: [jsx] }

  return {
    name: "ast-transform",
    inherits: SyntaxJSX
    visitor:
      JSXElement: (path, { opts }) ->
        moduleName = opts.moduleName if opts.moduleName
        result = generateHTMLNode(path, path.node, opts)
        if result.id
          path.replaceWithMultiple(result.elems.concat(t.expressionStatement(result.id)));
        else
          path.replaceWith(t.callExpression(result.elems[0], []));
        return
      JSXFragment: (path, { opts }) ->
        moduleName = opts.moduleName if opts.moduleName
        result = generateHTMLNode(path, path.node, opts)
        path.replaceWithMultiple(result.elems.concat(t.expressionStatement(result.id)))
        return
  }

