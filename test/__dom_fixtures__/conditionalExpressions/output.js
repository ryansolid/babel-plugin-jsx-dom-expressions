import { template as _$template } from "r-dom";
import { createComponent as _$createComponent } from "r-dom";
import { wrapCondition as _$wrapCondition } from "r-dom";
import { insert as _$insert } from "r-dom";

const _tmpl$ = _$template(`<div></div>`);

const template1 = function () {
  const _el$ = _tmpl$.cloneNode(true);

  _$insert(_el$, simple);

  return _el$;
}();

const template2 = function () {
  const _el$2 = _tmpl$.cloneNode(true);

  _$insert(_el$2, () => state.dynamic);

  return _el$2;
}();

const template3 = function () {
  const _el$3 = _tmpl$.cloneNode(true);

  _$insert(_el$3, simple ? good : bad);

  return _el$3;
}();

const template4 = function () {
  const _el$4 = _tmpl$.cloneNode(true);

  _$insert(_el$4, (() => {
    const _c$ = _$wrapCondition(() => state.dynamic);

    return () => _c$() ? good : bad;
  })());

  return _el$4;
}();

const template5 = function () {
  const _el$5 = _tmpl$.cloneNode(true);

  _$insert(_el$5, (() => {
    const _c$ = _$wrapCondition(() => state.dynamic);

    return () => _c$() && good;
  })());

  return _el$5;
}();

const template6 = function () {
  const _el$6 = _tmpl$.cloneNode(true);

  _$insert(_el$6, (() => {
    const _c$ = _$wrapCondition(() => state.count > 5);

    return () => _c$() ? (() => {
      const _c$ = _$wrapCondition(() => state.dynamic);

      return _c$() ? best : good;
    })() : bad;
  })());

  return _el$6;
}();

const template7 = function () {
  const _el$7 = _tmpl$.cloneNode(true);

  _$insert(_el$7, (() => {
    const _c$ = _$wrapCondition(() => state.dynamic && state.something);

    return () => _c$() && good;
  })());

  return _el$7;
}();

const template8 = function () {
  const _el$8 = _tmpl$.cloneNode(true);

  _$insert(_el$8, (() => {
    const _c$ = _$wrapCondition(() => state.dynamic);

    return () => _c$() && good || bad;
  })());

  return _el$8;
}();

const template9 = _$createComponent(Comp, {
  render: (() => {
    const _c$ = _$wrapCondition(() => state.dynamic);

    return () => _c$() ? good : bad;
  })()
}, ["render"]);

const template10 = _$createComponent(Comp, {
  render: (() => {
    const _c$ = _$wrapCondition(() => state.dynamic);

    return () => _c$() && good;
  })()
}, ["render"]);