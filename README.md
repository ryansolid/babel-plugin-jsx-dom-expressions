# Babel Plugin JSX DOM Expressions

This package is to provide a general JSX to DOM transformation for reactive libraries that do fine grained change detection.  These libraries rely on concepts like Observables and Signals rather than Lifecycle functions and the Virtual DOM.  Standard JSX transformers are not helpful to these libraries as they need to evaluate their expressions in isolation to avoid re-rendering unnecessary parts of the DOM. This package aims to convert JSX statements to native DOM statements and wrap JSX expressions with functions that can be implemented with the library of your choice. Sort of like a JSX to Hyperscript for fine change detection.

This plugin would allow you to take a library like KnockoutJS or MobX and use them independent of their current render systems using a small library to render pure DOM expressions. So instead of the data-bind's or managing shouldComponentUpdate, you use simple JSX to leverage the fine grain computation like libraries are capable of.

## Features

This plugin treats all lowercase tags as html elements and mixed cased tags as Custom Functions. This enables breaking up your view into functional components. This library supports Web Component Custom Elements spec. Support for common camelcase event handlers like React, dom safe attributes like class and for, a simple ref property, and parsing of objects for style, and classList properties.

In general JSX Attribute Expressions are treated as properties by default, with exception of hyphenated(-) ones that will always be set as attributes on the DOM element.

**With version 0.2.0 the API has changed where dynamic expressions that are to be wrapped are represented by {( )}.**

## Example

```jsx
const view = ({ item }) =>
  <tr class={( item.id === selected ? 'danger' : '' )}>
    <td class="col-md-1">{ item.id }</td>
    <td class="col-md-4">
      <a onclick={e => select(item, e)}>{( item.label )}</a>
    </td>
    <td class="col-md-1"><a onclick={e => del(item, e)}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
    <td class="col-md-6"></td>
  </tr>
```
Compiles to:

```jsx
const _tmpl$ = document.createElement("template");
_tmpl$.innerHTML = "<tr><td class='col-md-1'></td><td class='col-md-4'><a></a></td><td class='col-md-1'><a><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td></tr>";
const view = ({ item }) =>
  function() {
    const _el$ = _tmpl$.content.firstChild.cloneNode(true),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.firstChild,
      _el$5 = _el$3.nextSibling,
      _el$6 = _el$5.firstChild;
    r.wrap(() => _el$.className = item.id === selected ? 'danger' : '');
    r.insert(_el$2, item.id);
    r.addEventListener(_el$4, "click", e => select(item, e));
    r.insert(_el$4, () => item.label);
    r.addEventListener(_el$6, "click", e => del(item, e));
    return _el$;
  }()
```
The use of cloneNode improves repeat insert performance and precompilation reduces the number of references to the minimal traversal path. This is a basic example which doesn't leverage event delegation or any of the more advanced features described below.

## Example Implementations
* [ko-jsx](https://github.com/ryansolid/ko-jsx): Knockout JS with JSX rendering.
* [mobx-jsx](https://github.com/ryansolid/mobx-jsx): Ever wondered how much more performant MobX is without React? A lot.
* [Solid](https://github.com/ryansolid/solid): A declarative JavaScript library for building user interfaces.

## Plugin Options

### moduleName
The name of the runtime the compiler will output. Defaults to 'r'.

## Runtime API

To write a runtime you pass an object with the following methods to the createRuntime method:

### wrap(fn) : void

This is called around all expressions. This is typically where you wrap the expression with a computation in the desired library and handle any value preparsing. Your wrap method is expected to call fn with the previously evaluated value if the arity is 1 to allow for reducing computations.

### root(fn) : any

This indicates a new disposable context. The fn should be provided a dispose method that can be called to free all computations in the context.

### sample(fn) : any

A method that causes dependencies within not to be tracked.

### cleanup(fn) : void

This method should register a cleanup method to be called when the context is released.

## Special Binding

### ref

This binding will assign the variable you pass to it with the DOM element

### model / action

These bindings will assign the variable you pass to it as the data model for the DOM element. It is used for event delegation as 2nd and 3rd arguments. The syntax and usage of these is still experimental.

### on____

These will be treated as event handlers expecting a function. If the arity of the function is greater than 1, the event handler will attempt to look up a data model property and optional action on the target element or parents to pass to the handler function. This allows out of the box event delegation.

### $____

Custom directives are written with a $ prefix. Their signature is:
```js
function(element, valueAccessor) {}
```
where valueAccessor is function wrapping the expression.

### classList

This takes an object and assigns all the keys as classes which are truthy.

### ... (spreads)

Keep in mind given the independent nature of binding updates there is no guarentee of order using spreads at this time. It's under consideration.

## Control Flow

Loops and conditionals are handled by a special JSX tag `<$></$>`. The reason to use a tag instead of just data.map comes from the fact that it isn't just a map function in fine grain. It requires creating nested contexts and memoizing values. Even with custom methods the injection can never be as optimized as giving a special helper and I found I was re-writing pretty much identical code in all implementations. Currently there is support for 2 props on this component 'each' and 'when'. Where the argument is the list to iterate or the condition. The Child is a function (render prop).

```jsx
<ul>
  <$ each={ state.users }>{
    user => <li>
      <div>{( user.firstName )}</div>
      <$ when={ user.stars > 100 }>{
        () => <div>Verified</div>
      }</$>
    </li>
  }</$>
</ul>
```

## Work in Progress

This is still early in the works. I'm still consolidating what methods should be helpers or end user provided. My goal here is to better understand and generalize this approach to provide non Virtual DOM alternatives to developing web applications.  In a sense when React hit the scene it brought with it tools and approaches that were light years ahead of the competition but also prematurely dismissed other approaches that were more optimized in other ways. I hope being able to leverage JSX evens the playing field a bit.

I'm mostly focusing early on where I can make the biggest conceptual gain so the plugin lacks in a few key places most noticeably lack of support for SVG. I intend to get a few working examples up of library wrapper implementations.

## Acknowledgements

The concept of using JSX to DOM instead of html strings and context based binding usually found in these libraries was inspired greatly by [Surplus](https://github.com/adamhaile/surplus).

