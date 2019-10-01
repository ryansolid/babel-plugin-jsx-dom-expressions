import SyntaxJSX from "@babel/plugin-syntax-jsx";
import { addNamed } from "@babel/helper-module-imports";
import { Attributes, NonComposedEvents, SVGElements } from "dom-expressions";
import VoidElements from "./VoidElements";

export default babel => {
  const { types: t } = babel;
  let moduleName = "dom",
    generate = "dom",
    delegateEvents = true,
    builtIns = [],
    alwaysWrap = false,
    alwaysCreateComponents = false,
    contextToCustomElements = false;

  function checkParens(jsx, path) {
    const e = path.hub.file.code.slice(jsx.start + 1, jsx.end - 1).trim();
    return e[0] === "(" && e[e.length - 1] === ")";
  }

  function registerImportMethod(path, name) {
    const imports =
      path.scope.getProgramParent().data.imports ||
      (path.scope.getProgramParent().data.imports = new Set());
    if (!imports.has(name)) {
      addNamed(path, name, moduleName, { nameHint: `_$${name}` });
      imports.add(name);
    }
  }

  function registerTemplate(path, results) {
    let decl;
    if (results.template.length) {
      const templates =
        path.scope.getProgramParent().data.templates ||
        (path.scope.getProgramParent().data.templates = []);
      let templateDef, templateId;
      if (
        (templateDef = templates.find(t => t.template === results.template))
      ) {
        templateId = templateDef.id;
      } else {
        templateId = path.scope.generateUidIdentifier("tmpl$");
        templates.push({ id: templateId, template: results.template });
      }
      if (generate === "hydrate" || generate === "ssr") registerImportMethod(path, "getNextElement");
      decl = t.variableDeclarator(
        results.id,
        generate === "hydrate" || generate === "ssr"
          ? t.callExpression(t.identifier("_$getNextElement"), [templateId])
          : t.callExpression(
              t.memberExpression(
                t.memberExpression(
                  t.memberExpression(templateId, t.identifier("content")),
                  t.identifier("firstChild")
                ),
                t.identifier("cloneNode")
              ),
              [t.booleanLiteral(true)]
            )
      );
    }
    results.decl.unshift(decl);
    results.decl = t.variableDeclaration("const", results.decl);
  }

  function toEventName(name) {
    return name.slice(2).toLowerCase();
  }

  function getTagName(tag) {
    if (t.isJSXMemberExpression(tag.openingElement.name)) {
      return `${tag.openingElement.name.object.name}.${tag.openingElement.name.property.name}`;
    } else if (t.isJSXIdentifier(tag.openingElement.name)) {
      return tag.openingElement.name.name;
    }
  }

  function setAttr(path, elem, name, value, isSVG) {
    if (name === "style") {
      return t.callExpression(
        t.memberExpression(t.identifier("Object"), t.identifier("assign")),
        [t.memberExpression(elem, t.identifier(name)), value]
      );
    }

    if (name === "classList") {
      registerImportMethod(path, "classList");
      return t.callExpression(t.identifier("_$classList"), [elem, value]);
    }

    let isAttribute = isSVG || name.indexOf("-") > -1,
      attribute = Attributes[name];
    if (attribute)
      if (attribute.type === "attribute") isAttribute = true;
      else name = attribute.alias;

    if (isAttribute)
      return t.callExpression(
        t.memberExpression(elem, t.identifier("setAttribute")),
        [t.stringLiteral(name), value]
      );
    return t.assignmentExpression(
      "=",
      t.memberExpression(elem, t.identifier(name)),
      value
    );
  }

  function setAttrExpr(path, elem, name, value, isSVG) {
    registerImportMethod(path, "wrap");
    return t.expressionStatement(
      t.callExpression(t.identifier("_$wrap"), [
        t.arrowFunctionExpression([], setAttr(path, elem, name, value, isSVG))
      ])
    );
  }

  function createPlaceholder(path, results, tempPath, i, char) {
    const exprId = path.scope.generateUidIdentifier("el$");
    let contentId;
    results.template += `<!--${char}-->`;
    if (generate === "hydrate" && char === "/") {
      registerImportMethod(path, "getNextMarker");
      contentId = path.scope.generateUidIdentifier("co$");
      results.decl.push(
        t.variableDeclarator(
          t.arrayPattern([exprId, contentId]),
          t.callExpression(t.identifier("_$getNextMarker"), [
            t.memberExpression(
              t.identifier(tempPath),
              t.identifier("nextSibling")
            )
          ])
        )
      );
    } else
      results.decl.push(
        t.variableDeclarator(
          exprId,
          t.memberExpression(
            t.identifier(tempPath),
            t.identifier(i === 0 ? "firstChild" : "nextSibling")
          )
        )
      );
    return [exprId, contentId];
  }

  function nextChild(children, index) {
    return (
      children[index + 1] &&
      (children[index + 1].id || nextChild(children, index + 1))
    );
  }

  function trimWhitespace(text) {
    return text.replace(/\n\s*/g, "").replace(/\s+/g, " ");
  }

  function checkLength(children) {
    let i = 0;
    children.forEach(child => {
      !(
        t.isJSXExpressionContainer(child) &&
        t.isJSXEmptyExpression(child.expression)
      ) &&
        (!t.isJSXText(child) || !/^\s*$/.test(child.value)) &&
        i++;
    });
    return i > 1;
  }

  // remove unnecessary JSX Text nodes
  function filterChildren(children, loose) {
    return children.filter(
      child =>
        !(
          t.isJSXExpressionContainer(child) &&
          t.isJSXEmptyExpression(child.expression)
        ) &&
        (!t.isJSXText(child) ||
          (loose ? !/^\n\s*$/.test(child.value) : !/^\s*$/.test(child.value)))
    );
  }

  function transformComponentChildren(path, children, opts) {
    const filteredChildren = filterChildren(children);
    if (!filteredChildren.length) return;
    let dynamic;

    let transformedChildren = filteredChildren.map(child => {
      if (t.isJSXText(child)) {
        return t.stringLiteral(trimWhitespace(child.value));
      } else {
        child = generateHTMLNode(path, child, opts);
        if (child.id) {
          registerTemplate(path, child);
          if (!child.exprs.length && child.decl.declarations.length === 1)
            return child.decl.declarations[0].init;
          else
            return t.callExpression(
              t.arrowFunctionExpression(
                [],
                t.blockStatement([
                  child.decl,
                  ...child.exprs,
                  t.returnStatement(child.id)
                ])
              ),
              []
            );
        }
        return child.exprs[0];
      }
    });

    if (filteredChildren.length === 1) {
      transformedChildren = transformedChildren[0];
      if (t.isJSXExpressionContainer(filteredChildren[0]))
        dynamic =
          !t.isFunction(filteredChildren[0].expression) &&
          (alwaysWrap || checkParens(filteredChildren[0], path));
      else {
        transformedChildren =
          t.isCallExpression(transformedChildren) &&
          !transformedChildren.arguments.length
            ? transformedChildren.callee
            : t.arrowFunctionExpression([], transformedChildren);
        dynamic = true;
      }
    } else {
      transformedChildren = t.arrowFunctionExpression(
        [],
        t.arrayExpression(transformedChildren)
      );
      dynamic = true;
    }
    return [transformedChildren, dynamic];
  }

  // reduce unnecessary refs
  function detectExpressions(children, index) {
    if (children[index - 1]) {
      if (
        t.isJSXExpressionContainer(children[index - 1]) &&
        !t.isJSXEmptyExpression(children[index - 1].expression)
      )
        return true;
      let tagName;
      if (
        t.isJSXElement(children[index - 1]) &&
        (tagName = getTagName(children[index - 1])) &&
        tagName.toLowerCase() !== tagName
      )
        return true;
    }
    for (let i = index; i < children.length; i++) {
      if (t.isJSXExpressionContainer(children[i])) {
        if (!t.isJSXEmptyExpression(children[i].expression)) return true;
      } else if (t.isJSXElement(children[i])) {
        const tagName = getTagName(children[i]);
        if (tagName.toLowerCase() !== tagName) return true;
        if (
          contextToCustomElements &&
          (tagName === "slot" || tagName.indexOf("-") > -1)
        )
          return true;
        if (
          children[i].openingElement.attributes.some(
            attr =>
              t.isJSXSpreadAttribute(attr) ||
              t.isJSXExpressionContainer(attr.value)
          )
        )
          return true;
        const nextChildren = filterChildren(children[i].children, true);
        if (nextChildren.length)
          if (detectExpressions(nextChildren, 0)) return true;
      }
    }
  }

  function generateComponent(path, jsx, opts) {
    let props = [],
      runningObject = [],
      exprs,
      tagName = getTagName(jsx),
      dynamicKeys = [];

    if (builtIns.indexOf(tagName) > -1) {
      registerImportMethod(path, tagName);
      tagName = `_$${tagName}`;
    }

    jsx.openingElement.attributes.forEach(attribute => {
      if (t.isJSXSpreadAttribute(attribute)) {
        if (runningObject.length) {
          props.push(t.objectExpression(runningObject));
          runningObject = [];
        }
        if (
          alwaysWrap ||
          (attribute.argument.extra && attribute.argument.extra.parenthesized)
        ) {
          const key = t.identifier("k$"),
            memo = t.identifier("m$");
          dynamicKeys.push(
            t.spreadElement(
              t.callExpression(
                t.memberExpression(
                  t.identifier("Object"),
                  t.identifier("keys")
                ),
                [attribute.argument]
              )
            )
          );
          props.push(
            t.callExpression(
              t.memberExpression(
                t.callExpression(
                  t.memberExpression(
                    t.identifier("Object"),
                    t.identifier("keys")
                  ),
                  [attribute.argument]
                ),
                t.identifier("reduce")
              ),
              [
                t.arrowFunctionExpression(
                  [memo, key],
                  t.sequenceExpression([
                    t.assignmentExpression(
                      "=",
                      t.memberExpression(memo, key, true),
                      t.arrowFunctionExpression(
                        [],
                        t.memberExpression(attribute.argument, key, true)
                      )
                    ),
                    memo
                  ])
                ),
                t.objectExpression([])
              ]
            )
          );
        } else props.push(attribute.argument);
      } else {
        const value = attribute.value || t.booleanLiteral(true);
        if (t.isJSXExpressionContainer(value))
          if (attribute.name.name === "ref") {
            runningObject.push(
              t.objectProperty(
                t.identifier("ref"),
                t.arrowFunctionExpression(
                  [t.identifier("r$")],
                  t.assignmentExpression(
                    "=",
                    value.expression,
                    t.identifier("r$")
                  )
                )
              )
            );
          } else if (attribute.name.name === "forwardRef") {
            runningObject.push(
              t.objectProperty(t.identifier("ref"), value.expression)
            );
          } else if (
            !t.isFunction(value.expression) &&
            (alwaysWrap || checkParens(value, path))
          ) {
            dynamicKeys.push(t.stringLiteral(attribute.name.name));
            runningObject.push(
              t.objectProperty(
                t.identifier(attribute.name.name),
                t.arrowFunctionExpression([], value.expression)
              )
            );
          } else
            runningObject.push(
              t.objectProperty(
                t.identifier(attribute.name.name),
                value.expression
              )
            );
        else
          runningObject.push(
            t.objectProperty(t.identifier(attribute.name.name), value)
          );
      }
    });

    const childResult = transformComponentChildren(path, jsx.children, opts);
    if (childResult && childResult[0]) {
      childResult[1] && dynamicKeys.push(t.stringLiteral("children"));
      runningObject.push(
        t.objectProperty(t.identifier("children"), childResult[0])
      );
    }
    props.push(t.objectExpression(runningObject));

    if (props.length > 1)
      props = [
        t.callExpression(
          t.memberExpression(t.identifier("Object"), t.identifier("assign")),
          props
        )
      ];

    if (alwaysCreateComponents || dynamicKeys.length) {
      registerImportMethod(path, "createComponent");
      exprs = [
        t.callExpression(t.identifier("_$createComponent"), [
          t.identifier(tagName),
          props[0],
          t.arrayExpression(dynamicKeys)
        ])
      ];
    } else exprs = [t.callExpression(t.identifier(tagName), props)];

    return { exprs, template: "", component: true };
  }

  function transformAttributes(path, jsx, results) {
    let elem = results.id;
    const spread = t.identifier("_$spread"),
      tagName = getTagName(jsx),
      isSVG = SVGElements.has(tagName);
    jsx.openingElement.attributes.forEach(attribute => {
      if (t.isJSXSpreadAttribute(attribute)) {
        registerImportMethod(path, "spread");
        if (
          alwaysWrap ||
          (attribute.argument.extra && attribute.argument.extra.parenthesized)
        ) {
          results.exprs.push(
            t.expressionStatement(
              t.callExpression(spread, [
                elem,
                t.arrowFunctionExpression([], attribute.argument),
                t.booleanLiteral(isSVG)
              ])
            )
          );
        } else
          results.exprs.push(
            t.expressionStatement(
              t.callExpression(spread, [
                elem,
                attribute.argument,
                t.booleanLiteral(isSVG)
              ])
            )
          );
        return;
      }

      let value = attribute.value,
        key = attribute.name.name;
      if (t.isJSXExpressionContainer(value)) {
        if (key === "ref") {
          results.exprs.unshift(
            t.expressionStatement(
              t.assignmentExpression("=", value.expression, elem)
            )
          );
        } else if (key === "forwardRef") {
          results.exprs.unshift(
            t.expressionStatement(
              t.logicalExpression(
                "&&",
                value.expression,
                t.callExpression(value.expression, [elem])
              )
            )
          );
        } else if (key.startsWith("on")) {
          const ev = toEventName(key);
          if (
            delegateEvents &&
            key !== key.toLowerCase() &&
            !NonComposedEvents.has(ev)
          ) {
            const events =
              path.scope.getProgramParent().data.events ||
              (path.scope.getProgramParent().data.events = new Set());
            events.add(ev);
            results.exprs.unshift(
              t.expressionStatement(
                t.assignmentExpression(
                  "=",
                  t.memberExpression(
                    t.identifier(elem.name),
                    t.identifier(`__${ev}`)
                  ),
                  value.expression
                )
              )
            );
          } else
            results.exprs.unshift(
              t.expressionStatement(
                t.assignmentExpression(
                  "=",
                  t.memberExpression(
                    t.identifier(elem.name),
                    t.identifier(`on${ev}`)
                  ),
                  value.expression
                )
              )
            );
        } else if (key === "events") {
          value.expression.properties.forEach(prop =>
            results.exprs.push(
              t.expressionStatement(
                t.callExpression(
                  t.memberExpression(elem, t.identifier("addEventListener")),
                  [t.stringLiteral(prop.key.name || prop.key.value), prop.value]
                )
              )
            )
          );
        } else if (!value || alwaysWrap || checkParens(value, path)) {
          results.exprs.push(
            setAttrExpr(path, elem, key, value.expression, isSVG)
          );
        } else {
          results.exprs.push(
            t.expressionStatement(
              setAttr(path, elem, key, value.expression, isSVG)
            )
          );
        }
      } else {
        results.template += ` ${key}`;
        results.template += value ? `="${value.value}"` : `=""`;
      }
    });
  }

  function transformChildren(path, jsx, opts, results) {
    let tempPath = results.id && results.id.name,
      i = 0;
    const jsxChildren = filterChildren(jsx.children, true),
      children = jsxChildren.map((jsxChild, index) =>
        generateHTMLNode(path, jsxChild, opts, {
          skipId: !results.id || !detectExpressions(jsxChildren, index)
        })
      );

    children.forEach((child, index) => {
      if (!child) return;
      results.template += child.template;
      if (child.id) {
        results.decl.push(
          t.variableDeclarator(
            child.id,
            t.memberExpression(
              t.identifier(tempPath),
              t.identifier(i === 0 ? "firstChild" : "nextSibling")
            )
          )
        );
        results.decl.push(...child.decl);
        results.exprs.push(...child.exprs);
        tempPath = child.id.name;
        i++;
      } else if (child.exprs.length) {
        registerImportMethod(path, "insert");
        if (generate === "hydrate") registerImportMethod(path, "hydration");
        const multi = checkLength(jsxChildren),
          markers = (generate === "ssr" || generate === "hydrate") && multi;
        // boxed by textNodes
        if (
          markers ||
          (t.isJSXText(jsxChildren[index - 1]) &&
            t.isJSXText(jsxChildren[index + 1]))
        ) {
          if (markers)
            tempPath = createPlaceholder(path, results, tempPath, i++, "#")[0]
              .name;
          const [exprId, contentId] = createPlaceholder(
            path,
            results,
            tempPath,
            i++,
            markers ? "/" : ""
          );
          const insertExpr = t.callExpression(
            t.identifier("_$insert"),
            contentId
              ? [results.id, child.exprs[0], exprId, contentId]
              : [results.id, child.exprs[0], exprId]
          );
          results.exprs.push(
            t.expressionStatement(
              contentId
                ? t.callExpression(t.identifier("_$hydration"), [
                    t.arrowFunctionExpression([], insertExpr),
                    results.id
                  ])
                : insertExpr
            )
          );
          tempPath = exprId.name;
        } else if (multi) {
          results.exprs.push(
            t.expressionStatement(
              t.callExpression(t.identifier("_$insert"), [
                results.id,
                child.exprs[0],
                nextChild(children, index) || t.nullLiteral()
              ])
            )
          );
        } else {
          const insertExpr = t.callExpression(
            t.identifier("_$insert"),
            generate === "hydrate"
              ? [
                  results.id,
                  child.exprs[0],
                  t.identifier("undefined"),
                  t.callExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.memberExpression(
                          t.identifier("Array"),
                          t.identifier("prototype")
                        ),
                        t.identifier("slice")
                      ),
                      t.identifier("call")
                    ),
                    [
                      t.memberExpression(
                        results.id,
                        t.identifier("childNodes")
                      ),
                      t.numericLiteral(0)
                    ]
                  )
                ]
              : [results.id, child.exprs[0]]
          );
          results.exprs.push(
            t.expressionStatement(
              generate === "hydrate"
                ? t.callExpression(t.identifier("_$hydration"), [
                    t.arrowFunctionExpression([], insertExpr),
                    results.id
                  ])
                : insertExpr
            )
          );
        }
      }
    });
  }

  function transformFragmentChildren(path, jsx, opts, results) {
    const jsxChildren = filterChildren(jsx.children, true),
      children = jsxChildren.map(child => {
        if (t.isJSXText(child)) {
          return t.stringLiteral(trimWhitespace(child.value));
        } else {
          child = generateHTMLNode(path, child, opts);
          if (child.id) {
            registerTemplate(path, child);
            if (!child.exprs.length && child.decl.declarations.length === 1)
              return child.decl.declarations[0].init;
            else
              return t.callExpression(
                t.arrowFunctionExpression(
                  [],
                  t.blockStatement([
                    child.decl,
                    ...child.exprs,
                    t.returnStatement(child.id)
                  ])
                ),
                []
              );
          }
          return child.exprs[0];
        }
      });
    results.exprs.push(t.arrayExpression(children));
  }

  function generateHTMLNode(path, jsx, opts, info = {}) {
    if (t.isJSXElement(jsx)) {
      let tagName = getTagName(jsx),
        voidTag = VoidElements.indexOf(tagName) > -1;
      if (tagName !== tagName.toLowerCase())
        return generateComponent(path, jsx, opts);
      let results = { template: `<${tagName}`, decl: [], exprs: [] };
      if (!info.skipId) results.id = path.scope.generateUidIdentifier("el$");
      transformAttributes(path, jsx, results);
      if (
        contextToCustomElements &&
        (tagName === "slot" || tagName.indexOf("-") > -1)
      ) {
        registerImportMethod(path, "currentContext");
        results.exprs.push(
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(results.id, t.identifier("_context")),
              t.callExpression(t.identifier("_$currentContext"), [])
            )
          )
        );
      }
      results.template += ">";
      if (!voidTag) {
        transformChildren(path, jsx, opts, results);
        results.template += `</${tagName}>`;
      }
      return results;
    } else if (t.isJSXFragment(jsx)) {
      let results = { template: "", decl: [], exprs: [] };
      transformFragmentChildren(path, jsx, opts, results);
      return results;
    } else if (t.isJSXText(jsx)) {
      const text = trimWhitespace(jsx.value);
      if (!text.length) return null;
      const results = { template: text, decl: [], exprs: [] };
      if (!info.skipId) results.id = path.scope.generateUidIdentifier("el$");
      return results;
    } else if (t.isJSXExpressionContainer(jsx)) {
      if (t.isJSXEmptyExpression(jsx.expression)) return null;
      if (
        t.isFunction(jsx.expression) ||
        (!alwaysWrap && !checkParens(jsx, path))
      )
        return { exprs: [jsx.expression], template: "" };
      return {
        exprs: [t.arrowFunctionExpression([], jsx.expression)],
        template: ""
      };
    }
  }

  return {
    name: "ast-transform",
    inherits: SyntaxJSX,
    visitor: {
      JSXElement: (path, { opts }) => {
        if ("moduleName" in opts) moduleName = opts.moduleName;
        if ("generate" in opts) generate = opts.generate;
        if ("delegateEvents" in opts) delegateEvents = opts.delegateEvents;
        if ("contextToCustomElements" in opts)
          contextToCustomElements = opts.contextToCustomElements;
        if ("alwaysWrap" in opts) alwaysWrap = opts.alwaysWrap;
        if ("alwaysCreateComponents" in opts)
          alwaysCreateComponents = opts.alwaysCreateComponents;
        if ("builtIns" in opts) builtIns = opts.builtIns;
        const result = generateHTMLNode(path, path.node, opts);
        if (result.id) {
          registerTemplate(path, result);
          if (!result.exprs.length && result.decl.declarations.length === 1)
            path.replaceWith(result.decl.declarations[0].init);
          else
            path.replaceWithMultiple(
              [result.decl].concat(
                result.exprs,
                t.returnStatement(result.id)
              )
            );
        } else path.replaceWith(result.exprs[0]);
      },
      JSXFragment: (path, { opts }) => {
        if ("moduleName" in opts) moduleName = opts.moduleName;
        if ("generate" in opts) generate = opts.generate;
        if ("delegateEvents" in opts) delegateEvents = opts.delegateEvents;
        if ("contextToCustomElements" in opts)
          contextToCustomElements = opts.contextToCustomElements;
        if ("alwaysWrap" in opts) alwaysWrap = opts.alwaysWrap;
        if ("alwaysCreateComponents" in opts)
          alwaysCreateComponents = opts.alwaysCreateComponents;
        if ("builtIns" in opts) builtIns = opts.builtIns;
        const result = generateHTMLNode(path, path.node, opts);
        path.replaceWith(result.exprs[0]);
      },
      Program: {
        exit: path => {
          if (path.scope.data.events) {
            registerImportMethod(path, "delegateEvents");
            path.node.body.push(
              t.expressionStatement(
                t.callExpression(t.identifier("_$delegateEvents"), [
                  t.arrayExpression(
                    Array.from(path.scope.data.events).map(e =>
                      t.stringLiteral(e)
                    )
                  )
                ])
              )
            );
          }
          if (path.scope.data.templates) {
            const declarators = path.scope.data.templates.map(template => {
              const tmpl = {
                cooked: template.template,
                raw: template.template
              };
              registerImportMethod(path, "template");
              return t.variableDeclarator(
                template.id,
                t.callExpression(t.identifier("_$template"), [
                  t.templateLiteral([t.templateElement(tmpl, true)], [])
                ])
              );
            });
            path.node.body.unshift(t.variableDeclaration("const", declarators));
          }
        }
      }
    }
  };
};
