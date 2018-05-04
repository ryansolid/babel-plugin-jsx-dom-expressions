# Babel Plugin JSX DOM Expressions

This package is to provide a general JSX to DOM transformation for reactive libraries that do fine grained change detection.  These libraries rely on concepts like Observables and Signals rather than Lifecycle functions and the Virtual DOM.  Standard JSX transformers are not helpful to these libraries as they need to evaluate their expressions in isolation to avoid re-rendering unnecessary parts of the DOM. This package aims to convert JSX statements to native DOM statements and wrap JSX expressions with functions that can be implemented with the library of your choice. Sort of like a JSX to Hyperscript for fine change detection.

This plugin would allow you to take a library like KnockoutJS or MobX and use them independent of their current render systems using a small library to render pure DOM expressions. So instead of the data-bind's or managing shouldComponentUpdate, you use simple JSX to leverage the fine grain computation like libraries are capable of.  The idea is this completely replaces the DOM interaction. So while you could write a data-bind, you wouldn't.  This approach is still relatively new but has been proven to be very performant (See SurplusJS on JS-Frameworks-Benchmark)

## Features

This plugin treats all lowercase tags as html elements and mixed cased tags as Custom Functions. This enables breaking up your view into functional components. This library supports Web Compoenent Custom Elements spec. Support for common camelcase event handlers like React, dom safe attributes like class and for, a simple ref property, and parsing of objects for style, and classList properties. Support for JSX fragment elements.

## API

To write a runtime you create an object with the following methods:

### wrapExpr(accessor, fn) : void

This is called around all expressions. This is typically where you wrap the expression with a computation in the desired library and handle any value preparsing. Call fn with the resolved value. This is required.

### sanitize(value) : value

This called whenever a value is going to be assigned to a element property. It lets you clean up the value (like remove nested observables etc..) before you pass it to element. This is optional.

## Work in Progress

This is still early in the works. I'm still consolidating what methods should be helpers or end user provided. My goal here is to better understand and generalize this approach to provide non Virtual DOM alternatives to developing web applications.  In a sense when React hit the scene it brought with it tools and approaches that were light years ahead of the competition but also prematurely dismissed other approaches that were more optimized in other ways. I hope being able to leverage JSX evens the playing ground a bit.

An interesting area here is that unlike VDOM libraries controlling re-rendering parts of the tree is much more of a concern, so I'm looking to see if control flow as a JSX abstraction is more beneficial here. Naked ternary operators and map functions work fine in the simple case but are incredibly inefficient once you are drawing something of significance. Memoization of mapping functions and conditionals is a must and since caching the inputs is necessary in these libraries, the input source needs to be evaluated separately from the templated DOM expressions it maps to. While this can exist in user land for each library something as simple as a <Map> component might allow library writers to abstract that away. While this introduces a DSL it doesn't have to be a heavy one. My thinking is that a single component could handle mapping and conditionals. You still have all the it's javascript benefits.

I'm mostly focusing early on where I can make the biggest conceptual gain so the plugin lacks in a few key places most noticeably limited support for SVG. I intend to get a few working examples up of library wrapper implementations. I've been validating with my own library but I am probably going to start with Knockoutjs since it's a prime candidate to demonstrate whether such an approach is a universal game changer for these types of libraries. This approach really attacks their fundamental weakness while leveraging their strengths.

## Acknowledgements

The JSX to DOM basis is built on top of babel-plugin-jsx-to-dom. The concept of using JSX to DOM instead of html strings and context based binding usually found in these libraries was inspired greatly by SurplusJS. If you want to use a library today that employs a further optimized version of these techniques you should check it out.

