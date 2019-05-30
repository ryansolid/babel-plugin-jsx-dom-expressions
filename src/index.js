import SyntaxJSX from '@babel/plugin-syntax-jsx';
import { addNamed } from "@babel/helper-module-imports";
import { Attributes, NonComposedEvents } from 'dom-expressions';
import VoidElements from './VoidElements';

export default (babel) => {
  const { types: t } = babel;
  let moduleName = 'dom',
    contextToCustomElements = true,
    delegateEvents = true;

  function checkParens(jsx, path) {
    const e = path.hub.file.code.slice(jsx.start+1,jsx.end-1).trim();
    return e[0] === '(' && e[e.length - 1]=== ')';
  }

  function registerImportMethod(path, name) {
    const imports = path.scope.getProgramParent().data.imports || (path.scope.getProgramParent().data.imports = new Set());
    if (!imports.has(name)) {
      addNamed(path, name, moduleName, { nameHint: `_$${name}` });
      imports.add(name);
    }
  }

  function registerTemplate(path, results, isFragment) {
    let decl;
    if (results.template.length) {
      const templates = path.scope.getProgramParent().data.templates || (path.scope.getProgramParent().data.templates = []);
      let templateDef, templateId;
      if (templateDef = templates.find(t => t.template === results.template)) {
        templateId = templateDef.id;
      } else {
        templateId = path.scope.generateUidIdentifier("tmpl$");
        templates.push({id: templateId, template: results.template});
      }
      decl = t.variableDeclarator(
        results.id,
        t.callExpression(
          isFragment ? t.memberExpression(
              t.memberExpression(templateId, t.identifier('content')),
              t.identifier('cloneNode')
            ) : t.memberExpression(
              t.memberExpression(
                t.memberExpression(templateId, t.identifier('content')),
                t.identifier('firstChild')
              ),
              t.identifier('cloneNode')
            )
          ,
          [t.booleanLiteral(true)]
        )
      );
    } else {
      decl = t.variableDeclarator(results.id, t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createDocumentFragment')), []));
    }
    results.decl.unshift(decl);
    results.decl = t.variableDeclaration("const", results.decl);
  }

  function toEventName(name) { return name.slice(2).toLowerCase(); }

  function getTagName(tag) {
    if(t.isJSXMemberExpression(tag.openingElement.name)) {
      return `${tag.openingElement.name.object.name}.${tag.openingElement.name.property.name}`
    } else if (t.isJSXIdentifier(tag.openingElement.name)) {
      return tag.openingElement.name.name;
    }
  }

  function setAttr(path, elem, name, value) {
    if (name === 'style') {
      return t.callExpression(
        t.memberExpression(t.identifier("Object"), t.identifier('assign')),
        [t.memberExpression(elem, t.identifier(name)), value]
      );
    }

    if (name === 'classList') {
      registerImportMethod(path, 'classList');
      return t.callExpression(
        t.identifier('_$classList'),
        [elem, value]
      );
    }

    let isAttribute = name.indexOf('-') > -1,
      attribute = Attributes[name];
    if (attribute)
      if (attribute.type === 'attribute')
        isAttribute = true;
      else name = attribute.alias;

    if (isAttribute)
      return t.callExpression(t.memberExpression(elem, t.identifier("setAttribute")), [t.stringLiteral(name), value]);
    return t.assignmentExpression('=', t.memberExpression(elem, t.identifier(name)), value);
  }

  function setAttrExpr(path, elem, name, value) {
    registerImportMethod(path, 'wrap');
    return t.expressionStatement(t.callExpression(
      t.identifier("_$wrap"),
      [t.arrowFunctionExpression([], setAttr(path, elem, name, value))]
    ));
  }

  function createPlaceholder(path, results, tempPath, i) {
    const exprId = path.scope.generateUidIdentifier("el$");
    results.template += `<!---->`;
    results.decl.push(t.variableDeclarator(exprId, t.memberExpression(t.identifier(tempPath), t.identifier(i === 0 ? 'firstChild': 'nextSibling'))));
    return exprId;
  }

  function trimWhitespace(text) {
    return text.replace(/\n\s*/g, '').replace(/\s+/g, ' ');
  }

  function checkLength(children) {
    let i = 0;
    children.forEach(child => {
      !(t.isJSXExpressionContainer(child) && t.isJSXEmptyExpression(child.expression))
      && (!t.isJSXText(child) || !/^\s*$/.test(child.value)) && i++;
    });
    return i > 1;
  }

  // remove unnecessary JSX Text nodes
  function filterChildren(children, loose) {
    return children.filter(child =>
      !(t.isJSXExpressionContainer(child) && t.isJSXEmptyExpression(child.expression))
      && (!t.isJSXText(child) || (loose ? !/^\n\s*$/.test(child.value) : !/^\s*$/.test(child.value)))
    );
  }

  function transformComponentChildren(path, children, opts) {
    const filteredChildren = filterChildren(children);
    if (!filteredChildren.length) return;
    let child, dynamic;
    if (filteredChildren.length === 1) {
      if (t.isJSXExpressionContainer(filteredChildren[0])) dynamic = checkParens(filteredChildren[0], path)
      child = filteredChildren[0]
    } else child = t.JSXFragment(t.JSXOpeningFragment(), t.JSXClosingFragment(), children);

    child = generateHTMLNode(path, child, opts);
    if (child == null) return;
    if (child.id) {
      registerTemplate(path, child, filteredChildren.length !== 1);
      if (!child.exprs.length && child.decl.declarations.length === 1)
        return [child.decl.declarations[0].init];
      else return [t.callExpression(t.arrowFunctionExpression([], t.blockStatement([child.decl, ...child.exprs, t.returnStatement(child.id)])), [])];
    }
    return [child.exprs[0], dynamic];
  }

  // reduce unnecessary refs
  function detectExpressions(children, index) {
    if (children[index-1]) {
      if (t.isJSXExpressionContainer(children[index-1]) && !t.isJSXEmptyExpression(children[index-1].expression)) return true;
      let tagName;
      if (t.isJSXElement(children[index-1]) && (tagName = getTagName(children[index - 1])) && tagName.toLowerCase() !== tagName) return true;
    }
    for (let i = index; i < children.length; i++) {
      if (t.isJSXExpressionContainer(children[i])) {
        if (!t.isJSXEmptyExpression(children[i].expression)) return true;
      }
      else if (t.isJSXElement(children[i])) {
        const tagName = getTagName(children[i]);
        if (tagName.toLowerCase() !== tagName) return true;
        if (contextToCustomElements && (tagName === 'slot' || tagName.indexOf('-') > -1)) return true;
        if (children[i].openingElement.attributes.some(attr => t.isJSXSpreadAttribute(attr) || t.isJSXExpressionContainer(attr.value))) return true;
        const nextChildren = filterChildren(children[i].children, true);
        if (nextChildren.length)
          if (detectExpressions(nextChildren, 0)) return true;
      }
    }
  }

  function generateFlow(jsx) {
    const flow = {},
      flowOptions = [];
    let children = filterChildren(jsx.children), render;

    if (t.isJSXExpressionContainer(children[0])) render = children[0].expression;
    else if (children.length > 1) {
      children = [t.JSXFragment(t.JSXOpeningFragment(), t.JSXClosingFragment(), jsx.children)];
    } else if (t.isJSXText(children[0])) children[0] = t.stringLiteral(trimWhitespace(children[0].value));
    if (!render) render = t.arrowFunctionExpression([], children[0]);

    jsx.openingElement.attributes.forEach(attribute => {
      const name = attribute.name.name;
      if (!flow.type && (name === 'each' || name === 'when' || name === 'suspend' || name === 'portal' || name === 'provide')) {
        flow.type = name;
        flow.condition = attribute.value ? t.arrowFunctionExpression([], attribute.value.expression) : t.nullLiteral();
        flow.render = render;
      }
      if (name === 'afterRender' || name === 'useShadow' || name === 'value')
        flowOptions.push(t.objectProperty(t.identifier(name), attribute.value.expression));
      if (name === 'fallback')
        flowOptions.push(t.objectProperty(t.identifier(name), t.arrowFunctionExpression([], attribute.value.expression)));
    });
    flow.options = t.objectExpression(flowOptions);
  	return { flow, template: '', exprs: [] };
  }

  function generateComponent(path, jsx, opts) {
    let props = [],
      runningObject = [],
      exprs,
      dynamic = [];

    jsx.openingElement.attributes.forEach(attribute => {
      if (t.isJSXSpreadAttribute(attribute)) {
        if (runningObject.length) {
          props.push(t.objectExpression(runningObject));
          runningObject = [];
        }
        if (attribute.argument.extra && attribute.argument.extra.parenthesized) {
          const key = t.identifier('k$'),
            memo = t.identifier('m$');
          dynamic.push(t.spreadElement(t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('keys')), [attribute.argument])));
          props.push(
            t.callExpression(t.memberExpression(t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('keys')), [attribute.argument]), t.identifier('reduce')), [
              t.arrowFunctionExpression([memo, key],
              	t.assignmentExpression('=',
              	t.memberExpression(memo, key, true),
              	t.arrowFunctionExpression([], t.memberExpression(attribute.argument,key, true))
              )),
              t.objectExpression([])
            ])
          );
        } else props.push(attribute.argument);
      } else {
        const value = attribute.value;
        if (t.isJSXExpressionContainer(value))
          if (attribute.name.name === 'ref') {
            runningObject.push(t.objectProperty(
              t.identifier('ref'),
              t.arrowFunctionExpression([t.identifier('r$')], t.assignmentExpression('=', value.expression, t.identifier('r$')))
            ));
          } else if (attribute.name.name === 'forwardRef') {
            runningObject.push(t.objectProperty(t.identifier('ref'), value.expression));
          } else if (checkParens(value, path)) {
            dynamic.push(t.stringLiteral(attribute.name.name));
            runningObject.push(t.objectProperty(t.identifier(attribute.name.name), t.arrowFunctionExpression([], value.expression)));
          } else runningObject.push(t.objectProperty(t.identifier(attribute.name.name), value.expression));
        else
          runningObject.push(t.objectProperty(t.identifier(attribute.name.name), value));
      }
    });

    const childResult = transformComponentChildren(path, jsx.children, opts);
    if (childResult && childResult[0]) {
      childResult[1] && dynamic.push(t.stringLiteral('children'))
      runningObject.push(t.objectProperty(t.identifier("children"), childResult[0]));
    }
    props.push(t.objectExpression(runningObject));

    if (props.length > 1)
      props = [t.callExpression(t.memberExpression(t.identifier("Object"), t.identifier("assign")), props)];

    if (dynamic.length) {
      registerImportMethod(path, 'createComponent');
      exprs = [t.callExpression(t.identifier("_$createComponent"), [
        t.identifier(getTagName(jsx)), props[0], t.arrayExpression(dynamic)
      ])];
    } else exprs = [t.callExpression(t.identifier(getTagName(jsx)), props)];
    return { exprs, template: '', component: true }
  }

  function transformAttributes(path, jsx, results) {
    let elem = results.id;
    const spread = t.identifier('_$spread');
    jsx.openingElement.attributes.forEach(attribute => {
      if (t.isJSXSpreadAttribute(attribute)) {
        registerImportMethod(path, 'spread');
        if (attribute.argument.extra && attribute.argument.extra.parenthesized) {
          results.exprs.push(
            t.expressionStatement(t.callExpression(spread, [elem, t.arrowFunctionExpression([], attribute.argument)]))
          );
        } else results.exprs.push(t.expressionStatement(t.callExpression(spread, [elem, attribute.argument])));
        return;
      }

      let value = attribute.value,
        key = attribute.name.name;
      if (t.isJSXExpressionContainer(value)) {
        if (key === 'ref') {
          results.exprs.unshift(t.expressionStatement(t.assignmentExpression("=", value.expression, elem)));
        } else if (key === 'forwardRef') {
          results.exprs.unshift(t.expressionStatement(t.logicalExpression('&&', value.expression, t.callExpression(value.expression, [elem]))));
        } else if (key.startsWith("on")) {
          const ev = toEventName(key);
          if (delegateEvents && key !== key.toLowerCase() && !NonComposedEvents.has(ev)) {
            const events = path.scope.getProgramParent().data.events || (path.scope.getProgramParent().data.events = new Set());
            events.add(ev);
            results.exprs.unshift(t.expressionStatement(t.assignmentExpression('=', t.memberExpression(t.identifier(elem.name), t.identifier(`__${ev}`)), value.expression)));
          } else results.exprs.unshift(t.expressionStatement(t.assignmentExpression('=', t.memberExpression(t.identifier(elem.name), t.identifier(`on${ev}`)), value.expression)));
        } else if (key === 'events') {
          value.expression.properties.forEach(prop =>
          	results.exprs.push(t.expressionStatement(t.callExpression(t.memberExpression(elem, t.identifier('addEventListener')), [t.stringLiteral(prop.key.name || prop.key.value), prop.value])))
          );
        } else if (key.startsWith('$')) {
          results.exprs.unshift(t.expressionStatement(t.callExpression(t.identifier(key.slice(1)), [elem, t.arrowFunctionExpression([], value.expression)])));
        } else if (!value || checkParens(value, path)) {
          results.exprs.push(setAttrExpr(path, elem, key, value.expression));
        } else {
          results.exprs.push(t.expressionStatement(setAttr(path, elem, key, value.expression)));
        }
      } else {
        results.template += ` ${key}`;
        if (value) results.template += `='${value.value}'`;
      }
    });
  }

  function transformChildren(path, jsx, opts, results) {
    let tempPath = results.id && results.id.name,
      i = 0;
    const jsxChildren = filterChildren(jsx.children, true),
      children = jsxChildren.map(
        (jsxChild, index) => generateHTMLNode(path, jsxChild, opts, {skipId: !results.id || !detectExpressions(jsxChildren, index)})
      );

    jsxChildren.forEach((jsxChild, index) => {
      const child = children[index];
      if (!child) return;
      results.template += child.template;
      if (child.id) {
        results.decl.push(
          t.variableDeclarator(child.id, t.memberExpression(t.identifier(tempPath), t.identifier(i === 0 ? 'firstChild': 'nextSibling')))
        );
        results.decl.push(...child.decl);
        results.exprs.push(...child.exprs);
        tempPath = child.id.name;
        i++;
      } else if (child.exprs.length) {
        registerImportMethod(path, 'insert');
        const parenthesized = checkParens(jsxChild, path);
        // JSX parent and last dynamic || adjacent dynamic nodes || boxed by textNodes
        if ((t.isJSXFragment(jsx) && (parenthesized || child.component) && index + 1 === children.length)
          || ((parenthesized || child.component) && children[index + 1] && !children[index + 1].id && (checkParens(jsxChildren[index + 1], path) || children[index + 1].component || children[index + 1].flow))
          || (t.isJSXText(jsxChildren[index - 1]) && t.isJSXText(jsxChildren[index + 1]))
        ) {
          let exprId = createPlaceholder(path, results, tempPath, i);
          results.exprs.push(t.expressionStatement(t.callExpression(t.identifier("_$insert"), [results.id, child.exprs[0], exprId])));
          tempPath = exprId.name;
          i++;
        } else if (checkLength(jsxChildren)) {
          results.exprs.push(t.expressionStatement(t.callExpression(t.identifier("_$insert"), [results.id, child.exprs[0], (children[index + 1] && children[index + 1].id) || t.nullLiteral()])));
        } else results.exprs.push(t.expressionStatement(t.callExpression(t.identifier("_$insert"), [results.id, child.exprs[0]])));
      } else if (child.flow) {
        registerImportMethod(path, child.flow.type);
        const multi = checkLength(jsxChildren);
        // last dynamic || adjacent dynamic or expression nodes || boxed by textNodes
        // TODO: unify parsing of dynamic parsing
        if (index + 1 === children.length && multi
          || (children[index + 1] && !children[index + 1].id && (checkParens(jsxChildren[index + 1], path) || children[index + 1].component || children[index + 1].flow))
          || (t.isJSXText(jsxChildren[index - 1]) && t.isJSXText(jsxChildren[index + 1]))
        ) {
          let exprId = createPlaceholder(path, results, tempPath, i);
          results.exprs.push(t.expressionStatement(t.callExpression(t.identifier("_$"+child.flow.type), [results.id, child.flow.condition, child.flow.render, child.flow.options, exprId])));
          tempPath = exprId.name;
          i++;
        } else if (multi) {
          results.exprs.push(t.expressionStatement(t.callExpression(t.identifier("_$"+child.flow.type), [results.id, child.flow.condition, child.flow.render, child.flow.options, children[index + 1].id])));
        } else results.exprs.push(t.expressionStatement(t.callExpression(t.identifier("_$"+child.flow.type), [results.id, child.flow.condition, child.flow.render, child.flow.options])));
      }
    });
  }

  function generateHTMLNode(path, jsx, opts, info = {}) {
    if (t.isJSXElement(jsx)) {
      let tagName = getTagName(jsx),
        voidTag = VoidElements.indexOf(tagName) > -1;
      if (tagName === '$') return generateFlow(jsx);
      if (tagName !== tagName.toLowerCase()) return generateComponent(path, jsx, opts);
      let results = { template: `<${tagName}`, decl: [], exprs: [] };
      if (!info.skipId) results.id = path.scope.generateUidIdentifier("el$");
      transformAttributes(path, jsx, results);
      if (contextToCustomElements && (tagName === 'slot' || tagName.indexOf('-') > -1)) {
        registerImportMethod(path, 'currentContext');
        results.exprs.push(t.expressionStatement(t.assignmentExpression(
          '=',
          t.memberExpression(results.id, t.identifier('_context')),
          t.callExpression(t.identifier('_$currentContext'), [])
        )))
      }
      if (!voidTag) {
        results.template += '>';
        transformChildren(path, jsx, opts, results);
        results.template += `</${tagName}>`;
      } else results.template += '/>';
      return results;
    } else if (t.isJSXFragment(jsx)) {
      let results = { template: '', decl: [], exprs: [] };
      if (!info.skipId) results.id = path.scope.generateUidIdentifier("el$");
      transformChildren(path, jsx, opts, results);
      return results;
    } else if (t.isJSXText(jsx)) {
      const text = trimWhitespace(jsx.value);
      if (!text.length) return null;
      const results = { template: text, decl: [], exprs: [] };
      if (!info.skipId) results.id = path.scope.generateUidIdentifier("el$")
      return results;
    } else if (t.isJSXExpressionContainer(jsx)) {
      if (t.isJSXEmptyExpression(jsx.expression)) return null;
      if (!checkParens(jsx, path)) return { exprs: [jsx.expression], template: '' }
      return { exprs: [t.arrowFunctionExpression([], jsx.expression)], template: '' }
    }
  }

  return {
    name: "ast-transform",
    inherits: SyntaxJSX,
    visitor: {
      JSXElement: (path, { opts }) => {
        if ('moduleName' in opts) moduleName = opts.moduleName;
        if ('delegateEvents' in opts) delegateEvents = opts.delegateEvents;
        if ('contextToCustomElements' in opts) contextToCustomElements = opts.contextToCustomElements;
        const result = generateHTMLNode(path, path.node, opts);
        if (result.flow) {
          const id = path.scope.generateUidIdentifier("el$"),
            markerId = path.scope.generateUidIdentifier("el$");
          registerImportMethod(path, result.flow.type);
          path.replaceWithMultiple([
          	t.variableDeclaration("const", [
        	    t.variableDeclarator(id, t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createDocumentFragment')), [])),
              t.variableDeclarator(markerId,
                t.callExpression(t.memberExpression(id, t.identifier('insertBefore')), [
                  t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createTextNode')), [t.stringLiteral('')]),
                  t.memberExpression(id, t.identifier('firstChild'))
                ])
              )
      		  ]),
            t.expressionStatement(t.callExpression(t.identifier("_$"+result.flow.type), [id, result.flow.condition, result.flow.render, result.flow.options, markerId])),
            t.expressionStatement(id)
          ])
          return;
        }
        if (result.id) {
          registerTemplate(path, result);
          if (!result.exprs.length && result.decl.declarations.length === 1)
            path.replaceWith(result.decl.declarations[0].init)
          else path.replaceWithMultiple([result.decl].concat(result.exprs, t.expressionStatement(result.id)));
        } else path.replaceWith(result.exprs[0]);
      },
      JSXFragment: (path, { opts }) => {
        if ('moduleName' in opts) moduleName = opts.moduleName;
        if ('delegateEvents' in opts) delegateEvents = opts.delegateEvents;
        if ('contextToCustomElements' in opts) contextToCustomElements = opts.contextToCustomElements;
        const result = generateHTMLNode(path, path.node, opts);
        registerTemplate(path, result, true);
        if (!result.exprs.length && result.decl.declarations.length === 1)
          path.replaceWith(result.decl.declarations[0].init)
        else path.replaceWithMultiple([result.decl].concat(result.exprs, t.expressionStatement(result.id)));
      },
      Program: {
        exit: (path) => {
          if (path.scope.data.events) {
            registerImportMethod(path, 'delegateEvents');
            path.node.body.push(
              t.expressionStatement(t.callExpression(
                t.identifier("_$delegateEvents"),
                [t.arrayExpression(Array.from(path.scope.data.events).map(e => t.stringLiteral(e)))]
              ))
            );
          }
          if (path.scope.data.templates) {
            const declarators = path.scope.data.templates.map(template =>
              t.variableDeclarator(template.id, t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createElement')), [t.stringLiteral('template')]))
            )
            const assignments = path.scope.data.templates.map(template =>
              t.expressionStatement(t.assignmentExpression('=', t.memberExpression(template.id, t.identifier('innerHTML')), t.stringLiteral(template.template)))
            )
            path.node.body.unshift(
              t.variableDeclaration("const", declarators),
              ...assignments
            );
          }
        }
      }
    }
  }
}