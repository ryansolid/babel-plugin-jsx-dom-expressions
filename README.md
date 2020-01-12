# Babel Plugin JSX DOM Expressions

[![Build Status](https://img.shields.io/travis/com/ryansolid/babel-plugin-jsx-dom-expressions.svg?style=flat)](https://travis-ci.com/ryansolid/babel-plugin-jsx-dom-expressions)
[![Coverage Status](https://img.shields.io/coveralls/github/ryansolid/babel-plugin-jsx-dom-expressions.svg?style=flat)](https://coveralls.io/github/ryansolid/babel-plugin-jsx-dom-expressions?branch=master)
[![NPM Version](https://img.shields.io/npm/v/babel-plugin-jsx-dom-expressions.svg?style=flat)](https://www.npmjs.com/package/babel-plugin-jsx-dom-expressions)
![](https://img.shields.io/david/ryansolid/babel-plugin-jsx-dom-expressions.svg?style=flat)
![](https://img.shields.io/npm/dt/babel-plugin-jsx-dom-expressions.svg?style=flat)
[![Gitter](https://img.shields.io/gitter/room/dom-expressions/community)](https://gitter.im/dom-expressions/community)

This package is a JSX compiler built for [DOM Expressions](https://github.com/ryansolid/dom-expressions) to provide a general JSX to DOM transformation for reactive libraries that do fine grained change detection. This package aims to convert JSX statements to native DOM statements and wrap JSX expressions with functions that can be implemented with the library of your choice. Sort of like a JSX to Hyperscript for fine change detection.

## Features

This plugin treats all lowercase tags as html elements and mixed cased tags as Custom Functions. This enables breaking up your view into components. This library supports Web Component Custom Elements spec. Support for common camelcase event handlers like React, dom safe attributes like class and for, a simple ref property, and parsing of objects for style, and classList properties.

In general JSX Attribute Expressions are treated as properties by default, with exception of hyphenated(-) ones that will always be set as attributes on the DOM element. Plain string attributes(Non expression, no {}) will be treated as attributes.

This library uses a heuristic whether to dynamic wrap expressions based on if they contain function calls or property access. Simple literals and variable expressions won't be wrapped.

## Example

```jsx
const view = ({ item }) => {
  const itemId = item.id;
  <tr class={ itemId === selected() ? 'danger' : '' }>
    <td class="col-md-1">{ itemId }</td>
    <td class="col-md-4">
      <a onclick={e => select(item, e)}>{ item.label }</a>
    </td>
    <td class="col-md-1"><a onclick={e => del(item, e)}>
      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
    </a></td>
    <td class="col-md-6"></td>
  </tr>
}
```
Compiles to:

```jsx
import { insert as _$insert } from "dom";
import { wrap as _$wrap } from "dom";

const _tmpl$ = document.createElement("template");
_tmpl$.innerHTML = `<tr><td class="col-md-1"></td><td class="col-md-4"><a></a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`;

const view = ({ item }) => {
  const itemId = item.id;
  return function() {
    const _el$ = _tmpl$.content.firstChild.cloneNode(true),
          _el$2 = _el$.firstChild,
          _el$3 = _el$2.nextSibling,
          _el$4 = _el$3.firstChild,
          _el$5 = _el$3.nextSibling,
          _el$6 = _el$5.firstChild;
    _$wrap(() => _el$.className = itemId === selected() ? 'danger' : '');
    _$insert(_el$2, itemId);
    _el$4.onclick = e => select(item, e);
    _$insert(_el$4, () => item.label);
    _el$6.onclick = e => del(item, e);
    return _el$;
  }();
}
```

The use of cloneNode improves repeat insert performance and precompilation reduces the number of references to the minimal traversal path. This is a basic example which doesn't leverage event delegation or any of the more advanced features described below.

## Example Implementations

* [Solid](https://github.com/ryansolid/solid): A declarative JavaScript library for building user interfaces.
* [ko-jsx](https://github.com/ryansolid/ko-jsx): Knockout JS with JSX rendering.
* [mobx-jsx](https://github.com/ryansolid/mobx-jsx): Ever wondered how much more performant MobX is without React? A lot.

## Plugin Options

### moduleName (required)

The name of the runtime module to import the methods from.

### generate

The output mode of the compiler. Can be "dom"(default), "ssr", or "hydrate". "dom" is standard output. "ssr" is for server side rendering that is hydrateable. And "hydrate" is for the client that hydrates the previously server rendered markup.s

### delegateEvents

Boolean to indicate whether to enable automatic event delegation on camelCase.

### wrapConditionals

Boolean indicates whether smart conditional detection should be used. This optimizes simple boolean expressions and ternaries in JSX.

### contextToCustomElements

Boolean indicates whether to set current render context on Custom Elements and slots. Useful for seemless Context API with Web Components.

### builtIns

Array of Component exports from module, that aren't included by default with the library. This plugin will automatically import them if it comes across them in the JSX.

## Special Binding

### ref

This binding will assign the variable you pass to it with the DOM element.

### forwardRef

This binding takes a function callback and calls it with the ref. Useful for moving refs out Components or doing Custom Bindings.

```jsx
const Child = props => <div forwardRef={props.ref} />

const Parent = () => {
  let ref;
  return <Child ref={ref} />
}
```

### on(eventName) / model

These will be treated as event handlers expecting a function. All lowercase are considered directly bound events(Level 1) and camelCase for delegated. The syntax and usage for delegation is still experimental. The model which can be the same node or closest ancestor is passed to delegated events as second argument.

```jsx
<ul>
  { list().map(item => <li model={item.id} onClick={handler} />) }
</ul>
```

This delegation solution works with Web Components and the Shadow DOM as well if the events are composed. That limits the list to custom events and most UA UI events like onClick, onKeyUp, onKeyDown, onDblClick, onInput, onMouseDown, onMouseUp, etc..

Important:
* To allow for casing to work all custom events should follow the all lowercase convention of native events. If you want to use different event convention (or use Level 3 Events "addEventListener") use the events binding.

* Event delegates aren't cleaned up automatically off Document. If you will be completely unmounting the library and wish to remove the handlers from the current page use `clearDelegatedEvents`.

### classList

This takes an object and assigns all the keys as classes which are truthy.
```jsx
<div classList={{ selected: isSelected(), editing: isEditing() }} />
```
### events

Generic event method for Level 3 "addEventListener" events. Experimental.
```jsx
<div events={{ "Weird-Event": e => alert(e.detail) }} />
```

### ... (spreads)

Spreads let you pass multiple props at once:

```jsx
<div {...props} />
```

Keep in mind given the independent nature of binding updates there is no guarantee of order using spreads at this time. It's under consideration.

## Components

Components are just Capital Cased tags. Instead of wrapping with computation dynamic props will just be getter accessors. * Remember property access triggers so don't destructure outside of computations unless you intend the content to be static.

```jsx
const MyComp = props => {
  const staticProp = props.other;
  return <>
    <div>{ props.param }</div>
    <div>{ staticProp }</div>
  </>
};

<MyComp param={ dynamic() } other={ static } />
```

Components may have children. This is available as props.children. It may be a node, a function, or a string, or an array of the aforementioned. Non-expression children like DOM nodes are set to evaluate lazily (upon access by default).

## Fragments

This plugin also supports JSX Fragments with `<></>` notation. These will be compiled to arrays. The fragment syntax provides the convenience of being able to use the template syntax to wrap expressions.

## SVG

There is basic SVG support with this library. Most element attributes should work but no support for namespaces yet.

## Acknowledgements

The concept of using JSX to DOM instead of html strings and context based binding usually found in these libraries was inspired greatly by [Surplus](https://github.com/adamhaile/surplus).
