import { template as _$template } from "r-dom";
import { createComponent as _$createComponent } from "r-dom";
import { wrap as _$wrap } from "r-dom";
import { getNextElement as _$getNextElement } from "r-dom";
import { runHydrationEvents as _$runHydrationEvents } from "r-dom";

const _tmpl$ = _$template(`<div>First</div>`),
  _tmpl$2 = _$template(`<div>Last</div>`),
  _tmpl$3 = _$template(`<div></div>`);

const multiStatic = [
  (() => {
    const _el$ = _$getNextElement(_tmpl$);

    _$runHydrationEvents(_el$.getAttribute("_hk"));

    return _el$;
  })(),
  (() => {
    const _el$2 = _$getNextElement(_tmpl$2);

    _$runHydrationEvents(_el$2.getAttribute("_hk"));

    return _el$2;
  })()
];
const multiExpression = [
  (() => {
    const _el$3 = _$getNextElement(_tmpl$);

    _$runHydrationEvents(_el$3.getAttribute("_hk"));

    return _el$3;
  })(),
  inserted,
  (() => {
    const _el$4 = _$getNextElement(_tmpl$2);

    _$runHydrationEvents(_el$4.getAttribute("_hk"));

    return _el$4;
  })(),
  "After"
];
const multiDynamic = [
  (() => {
    const _el$5 = _$getNextElement(_tmpl$);

    _$wrap(() => (_el$5.id = state.first));

    _$runHydrationEvents(_el$5.getAttribute("_hk"));

    return _el$5;
  })(),
  () => state.inserted,
  (() => {
    const _el$6 = _$getNextElement(_tmpl$2);

    _$wrap(() => (_el$6.id = state.last));

    _$runHydrationEvents(_el$6.getAttribute("_hk"));

    return _el$6;
  })(),
  "After"
];
const singleExpression = [inserted];
const singleDynamic = [() => inserted()];
const firstStatic = [
  inserted,
  (() => {
    const _el$7 = _$getNextElement(_tmpl$3);

    _$runHydrationEvents(_el$7.getAttribute("_hk"));

    return _el$7;
  })()
];
const firstDynamic = [
  () => inserted(),
  (() => {
    const _el$8 = _$getNextElement(_tmpl$3);

    _$runHydrationEvents(_el$8.getAttribute("_hk"));

    return _el$8;
  })()
];
const firstComponent = [
  _$createComponent(Component, {}),
  (() => {
    const _el$9 = _$getNextElement(_tmpl$3);

    _$runHydrationEvents(_el$9.getAttribute("_hk"));

    return _el$9;
  })()
];
const lastStatic = [
  (() => {
    const _el$10 = _$getNextElement(_tmpl$3);

    _$runHydrationEvents(_el$10.getAttribute("_hk"));

    return _el$10;
  })(),
  inserted
];
const lastDynamic = [
  (() => {
    const _el$11 = _$getNextElement(_tmpl$3);

    _$runHydrationEvents(_el$11.getAttribute("_hk"));

    return _el$11;
  })(),
  () => inserted()
];
const lastComponent = [
  (() => {
    const _el$12 = _$getNextElement(_tmpl$3);

    _$runHydrationEvents(_el$12.getAttribute("_hk"));

    return _el$12;
  })(),
  _$createComponent(Component, {})
];
