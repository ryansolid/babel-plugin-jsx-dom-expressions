import SyntaxJSX from '@babel/plugin-syntax-jsx';
import Attributes from './Attributes';
import VoidElements from './VoidElements';
import NonComposedEvents from './NonComposedEvents';

export default (babel) => {
  const { types: t } = babel;
  let moduleName = 'r',
    delegateEvents = true;

  function checkParens(jsx, path) {
    const e = path.hub.file.code.slice(jsx.start+1,jsx.end-1).trim();
    return e[0] === '(' && e[e.length - 1]=== ')';
  }

  function declare(name, value) {
    return t.variableDeclaration("let", [t.variableDeclarator(name, value)])
  }

  function toEventName(name) { return name.slice(2).toLowerCase(); }

  function getTagName(tag) {
    if(t.isJSXMemberExpression(tag.openingElement.name)) {
      return `${tag.openingElement.name.object.name}.${tag.openingElement.name.property.name}`
    } else if (t.isJSXIdentifier(tag.openingElement.name)) {
      return tag.openingElement.name.name;
    }
  }

  function setAttr(elem, name, value) {
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

  function setAttrExpr(elem, name, value) {
    const content = (function() {
      switch (name) {
        case 'style':
          return [t.arrowFunctionExpression([], t.callExpression(t.identifier("Object.assign"), [t.memberExpression(elem, t.identifier(name)), value]))];
        case 'classList':
          const iter = t.identifier('i'),
          list = t.identifier('classNames'),
          keys = t.identifier('classKeys');
          return [
            t.arrowFunctionExpression([], t.blockStatement([
              declare(list, value),
              declare(keys, t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('keys')), [list])),
              t.forStatement(
                declare(iter, t.numericLiteral(0)),
                t.binaryExpression('<', iter, t.memberExpression(keys, t.identifier('length'))),
                t.updateExpression('++', iter),
                t.expressionStatement(t.callExpression(t.memberExpression(elem, t.identifier("classList.toggle")), [
                  t.memberExpression(keys, iter, true),
                  t.memberExpression(list, t.memberExpression(keys, iter, true), true)
                ]))
              )
            ]))
          ];
        default:
          return [t.arrowFunctionExpression([], setAttr(elem, name, value))];
      }
    })();

    return t.expressionStatement(t.callExpression(t.identifier(`${moduleName}.wrap`), content));
  }

  function createTemplate(path, results, isFragment) {
    const templateId = path.scope.generateUidIdentifier("tmpl$"),
      decl = t.variableDeclarator(results.id, t.callExpression(t.memberExpression(templateId, t.identifier(isFragment ? 'content.cloneNode' : 'content.firstChild.cloneNode')), [t.booleanLiteral(true)])),
      program = path.findParent(t => t.isProgram()).node;
    program.body.unshift(
      t.variableDeclaration("const", [
        t.variableDeclarator(templateId, t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createElement')), [t.stringLiteral('template')]))
      ]),
      t.expressionStatement(t.assignmentExpression('=', t.memberExpression(templateId, t.identifier('innerHTML')), t.stringLiteral(results.template)))
    );
    results.decl.unshift(decl);
    results.decl = t.variableDeclaration("const", results.decl);
  }

  function createPlaceholder(path, results, tempPath, i) {
    const exprId = path.scope.generateUidIdentifier("el$");
    results.decl.push(
      t.variableDeclarator(exprId,
        t.callExpression(t.memberExpression(results.id, t.identifier('insertBefore')), [
          t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createTextNode')), [t.stringLiteral('')]),
          t.memberExpression(t.identifier(tempPath), t.identifier(i === 0 ? 'firstChild': 'nextSibling'))
        ])
      )
    );
    return exprId;
  }

  function trimWhitespace(text) {
    return text.split('\n').map((t, i) => {
      if (/^\s*$/.test(t)) return '';
      if (i === 0) return t.replace(/\s+/g, ' ');
      return t
        .replace(/^\s+/g, '')
        .replace(/\s+/g, ' ');
    }).join('');
  }

  function checkLength(children) {
    let i = 0;
    children.forEach(child => {
      if (!t.isJSXText(child) || !/^\s*$/.test(child.value)) i++;
    });
    return i > 1;
  }

  // remove unnecessary JSX Text nodes
  function filterChildren(children) {
    return children.filter(child => !t.isJSXText(child) || !/^\s*$/.test(child.value))
  }

  // reduce unnecessary refs
  function detectExpressions(jsx, index) {
    for (let i = index; i < jsx.children.length; i++) {
      if (t.isJSXExpressionContainer(jsx.children[i])) return true;
      if (t.isJSXElement(jsx.children[i])) {
        const tagName = getTagName(jsx.children[i]);
        if (tagName.toLowerCase() !== tagName) return true;
        if (jsx.children[i].openingElement.attributes.some(attr => t.isJSXSpreadAttribute(attr) || t.isJSXExpressionContainer(attr.value))) return true;
        if (jsx.children[i].children.length)
          if (detectExpressions(jsx.children[i], 0)) return true;
      }
    }
  }

  function generateFlow(jsx) {
    const flow = { afterRender: t.nullLiteral() };
    let children = filterChildren(jsx.children), render;

    if (t.isJSXExpressionContainer(children[0])) render = children[0].expression;
    else if (children.length > 1) {
      children = [t.JSXFragment(t.JSXOpeningFragment(), t.JSXClosingFragment(), children)];
    }
    if (!render) render = t.arrowFunctionExpression([], children[0]);

    jsx.openingElement.attributes.forEach(attribute => {
      const name = attribute.name.name;
      if (!flow.type && (name === 'each' || name === 'when')) {
        flow.type = t.stringLiteral(name);
        flow.condition = t.arrowFunctionExpression([], attribute.value.expression);
        flow.render = render;
      }
      if (name === 'afterRender') flow.afterRender = attribute.value.expression;
    });
  	return { flow, template: '', exprs: [] };
  }

  function generateComponent(path, jsx, opts) {
    let props = [],
      runningObject = [],
      children = [];

    jsx.openingElement.attributes.forEach(attribute => {
      if (t.isJSXSpreadAttribute(attribute)) {
        if (runningObject.length) {
          props.push(t.objectExpression(runningObject));
          runningObject = [];
        }
        props.push(attribute.argument);
      } else {
        const value = attribute.value;
        if (t.isJSXExpressionContainer(value))
          runningObject.push(t.objectProperty(t.identifier(attribute.name.name), value.expression));
        else
          runningObject.push(t.objectProperty(t.identifier(attribute.name.name), value));
      }
    });

    jsx.children.forEach(child => {
      child = generateHTMLNode(path, child, opts);
      if (child == null) return;
      if (child.id) {
        createTemplate(path, child);
        children.push(t.callExpression(t.arrowFunctionExpression([], t.blockStatement([child.decl, ...child.exprs, t.returnStatement(child.id)])), []));
      } else children.push(child.exprs[0]);
    });

    if (children.length)
      runningObject.push(t.objectProperty(t.identifier("children"), t.arrayExpression(children)));

    if (runningObject.length)
      props.push(t.objectExpression(runningObject));

    if (props.length > 1)
      props = [t.callExpression(t.identifier("Object.assign"), props)];

    return { exprs: [t.callExpression(t.identifier(getTagName(jsx)), props)], template: '' }
  }

  function transformAttributes(path, jsx, results) {
    let elem = results.id;
    jsx.openingElement.attributes.forEach(attribute => {
      if (t.isJSXSpreadAttribute(attribute)) {
        return results.exprs.push(
          t.expressionStatement(t.callExpression(t.identifier(`${moduleName}.spread`), [elem, t.arrowFunctionExpression([], attribute.argument)]))
        );
      }

      let value = attribute.value,
        key = attribute.name.name;
      if (t.isJSXExpressionContainer(value)) {
        if (key === 'ref') {
          results.exprs.unshift(t.expressionStatement(t.assignmentExpression("=", value.expression, elem)));
        } else if (key.startsWith("on")) {
          const ev = toEventName(key);
          if (delegateEvents && key !== key.toLowerCase() && !NonComposedEvents.has(ev)) {
            const events = path.scope.getProgramParent().data.events || (path.scope.getProgramParent().data.events = new Set());
            events.add(ev);
            results.exprs.unshift(t.expressionStatement(t.assignmentExpression('=', t.identifier(`${elem.name}.__${ev}`), value.expression)));
          } else results.exprs.unshift(t.expressionStatement(t.assignmentExpression('=', t.identifier(`${elem.name}.on${ev}`), value.expression)));
        } else if (key.startsWith('$')) {
          results.exprs.unshift(t.expressionStatement(t.callExpression(t.identifier(key.slice(1)), [elem, t.arrowFunctionExpression([], value.expression)])));
        } else if (!value || checkParens(value, path)) {
          results.exprs.push(setAttrExpr(elem, key, value.expression));
        } else {
          results.exprs.push(t.expressionStatement(setAttr(elem, key, value.expression)));
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
    jsx.children.forEach((child, index) => {
      child = generateHTMLNode(path, child, opts, {skipId: !results.id || !detectExpressions(jsx, index)});
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
        if (checkLength(jsx.children)) {
          let exprId = createPlaceholder(path, results, tempPath, i);
          results.exprs.push(t.expressionStatement(t.callExpression(t.identifier(`${moduleName}.insert`), [results.id, child.exprs[0], t.nullLiteral(), exprId])));
          tempPath = exprId.name;
          i++;
        } else results.exprs.push(t.expressionStatement(t.callExpression(t.identifier(`${moduleName}.insert`), [results.id, child.exprs[0]])));
      } else if (child.flow) {
        if (t.isJSXFragment(jsx) || checkLength(jsx.children)) {
          let exprId = createPlaceholder(path, results, tempPath, i);
          results.exprs.push(t.expressionStatement(t.callExpression(t.identifier(`${moduleName}.flow`), [results.id, child.flow.type, child.flow.condition, child.flow.render, child.flow.afterRender, exprId])));
          tempPath = exprId.name;
          i++;
        } else results.exprs.push(t.expressionStatement(t.callExpression(t.identifier(`${moduleName}.flow`), [results.id, child.flow.type, child.flow.condition, child.flow.render, child.flow.afterRender])));
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
      if (/^\s*$/.test(jsx.value)) return null;
      let results = { template: trimWhitespace(jsx.value), decl: [], exprs: [] };
      if (!info.skipId) results.id = path.scope.generateUidIdentifier("el$")
      return results;
    } else if (t.isJSXExpressionContainer(jsx)) {
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
        const result = generateHTMLNode(path, path.node, opts);
        if (result.flow) {
          const id = path.scope.generateUidIdentifier("el$"),
          	markerId = path.scope.generateUidIdentifier("el$");
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
            t.expressionStatement(t.callExpression(t.identifier(`${moduleName}.flow`), [id, result.flow.type, result.flow.condition, result.flow.render, result.flow.afterRender, markerId])),
            t.expressionStatement(id)
          ])
          return;
        }
        if (result.id) {
          createTemplate(path, result);
          path.replaceWithMultiple([result.decl].concat(result.exprs, t.expressionStatement(result.id)));
        } else path.replaceWith(result.exprs[0]);
      },
      JSXFragment: (path, { opts }) => {
        if ('moduleName' in opts) moduleName = opts.moduleName;
        if ('delegateEvents' in opts) delegateEvents = opts.delegateEvents;
        const result = generateHTMLNode(path, path.node, opts);
        createTemplate(path, result, true);
        path.replaceWithMultiple([result.decl].concat(result.exprs, t.expressionStatement(result.id)));
      },
      Program: {
        exit: (path) => {
          if (path.scope.data.events) {
            path.node.body.push(
              t.expressionStatement(t.callExpression(
                t.identifier(`${moduleName}.delegateEvents`),
                [t.arrayExpression(Array.from(path.scope.data.events).map(e => t.stringLiteral(e)))]
              ))
            );
          }
        }
      }
    }
  }
}