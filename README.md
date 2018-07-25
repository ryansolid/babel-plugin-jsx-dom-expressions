# Babel Plugin JSX DOM Expressions

This package is to provide a general JSX to DOM transformation for reactive libraries that do fine grained change detection.  These libraries rely on concepts like Observables and Signals rather than Lifecycle functions and the Virtual DOM.  Standard JSX transformers are not helpful to these libraries as they need to evaluate their expressions in isolation to avoid re-rendering unnecessary parts of the DOM. This package aims to convert JSX statements to native DOM statements and wrap JSX expressions with functions that can be implemented with the library of your choice. Sort of like a JSX to Hyperscript for fine change detection.

This plugin would allow you to take a library like KnockoutJS or MobX and use them independent of their current render systems using a small library to render pure DOM expressions. So instead of the data-bind's or managing shouldComponentUpdate, you use simple JSX to leverage the fine grain computation like libraries are capable of.  The idea is this completely replaces the DOM interaction. So while you could write a data-bind, you wouldn't.  This approach is still relatively new but has been proven to be very performant (See SurplusJS on JS-Frameworks-Benchmark)

## Features

This plugin treats all lowercase tags as html elements and mixed cased tags as Custom Functions. This enables breaking up your view into functional components. This library supports Web Compoenent Custom Elements spec. Support for common camelcase event handlers like React, dom safe attributes like class and for, a simple ref property, and parsing of objects for style, and classList properties. Support for JSX fragment elements.

## Example Implementations
* [ko-jsx](https://github.com/ryansolid/ko-jsx): Knockout JS with JSX rendering.
* [mobx-jsx](https://github.com/ryansolid/mobx-jsx): Ever wondered how much more performant MobX is without React?
* [solid-js](https://github.com/ryansolid/solid-js): A declarative JavaScript library for building user interfaces.

## Plugin Options

### moduleName
The name of the runtime the compiler will output. Defaults to 'r'.

### allowWhitespaceOnly
By default the plugin skips expressions that are only white space. You can set this to true if you wish it not to skip.

## Runtime API

To write a runtime you pass an object with the following methods to the createRuntime method:

### wrap(valueAccessor, element, isAttr, fn) : void

This is called around all expressions. This is typically where you wrap the expression with a computation in the desired library and handle any value preparsing. Call fn with the resolved value and element.

## Special Binding

### ref

This binding will assign the variable you pass to it with the DOM element

### on...

These will be treated as event handlers expecting a function.

### fn

This takes a custom method that passes the element as a parameter. You can add as many as you want.

### classList

This takes an object and assigns all the keys which are truthy.

### ... (spreads)

Keep in mind given the independent nature of binding updates there is no guarentee of order using spreads at this time. It's definitely an area for improvement.

## Experimental Features

In order to optimize certain situations the compiler supports pragma comments.

### @static

This skips calling the wrap handler. Keep in mind if the element is in a parent expression it may unintentionally trigger it.

## Work in Progress

This is still early in the works. I'm still consolidating what methods should be helpers or end user provided. My goal here is to better understand and generalize this approach to provide non Virtual DOM alternatives to developing web applications.  In a sense when React hit the scene it brought with it tools and approaches that were light years ahead of the competition but also prematurely dismissed other approaches that were more optimized in other ways. I hope being able to leverage JSX evens the playing field a bit.

I'm mostly focusing early on where I can make the biggest conceptual gain so the plugin lacks in a few key places most noticeably limited support for SVG. I intend to get a few working examples up of library wrapper implementations.

TODOS:

* Multi-nested Fragments
* Better Boolean Attribute handling
* Spreads to preserve overrides

## Acknowledgements

The JSX to DOM basis is built on top of babel-plugin-jsx-to-dom. The concept of using JSX to DOM instead of html strings and context based binding usually found in these libraries was inspired greatly by [Surplus](https://github.com/adamhaile/surplus). If you want to use a library today that employs a further optimized version of these techniques you should check it out.

