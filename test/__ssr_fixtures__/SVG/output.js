import { template as _$template } from "r-dom";
import { createComponent as _$createComponent } from "r-dom";
import { spread as _$spread } from "r-dom";
import { wrap as _$wrap } from "r-dom";
import { getNextElement as _$getNextElement } from "r-dom";

const _tmpl$ = _$template(
    `<svg width="400" height="180"><rect stroke-width="2" x="50" y="20" rx="20" ry="20" width="150" height="150" style="fill:red;stroke:black;stroke-width:5;opacity:0.5"></rect></svg>`
  ),
  _tmpl$2 = _$template(
    `<svg width="400" height="180"><rect rx="20" ry="20" width="150" height="150"></rect></svg>`
  ),
  _tmpl$3 = _$template(`<svg width="400" height="180"><rect></rect></svg>`),
  _tmpl$4 = _$template(
    `<svg><rect x="50" y="20" width="150" height="150"></rect></svg>`,
    true
  );

const template = _$getNextElement(_tmpl$, true);

const template2 = (function() {
  const _el$2 = _$getNextElement(_tmpl$2, true),
    _el$3 = _el$2.firstChild;

  _$wrap((_p$ = {}) => {
    const _v$ = state.name,
      _v$2 = state.width,
      _v$3 = state.x,
      _v$4 = state.y;
    _v$ !== _p$._v$ && _el$3.setAttribute("class", (_p$._v$ = _v$));
    _v$2 !== _p$._v$2 && _el$3.setAttribute("stroke-width", (_p$._v$2 = _v$2));
    _v$3 !== _p$._v$3 && _el$3.setAttribute("x", (_p$._v$3 = _v$3));
    _v$4 !== _p$._v$4 && _el$3.setAttribute("y", (_p$._v$4 = _v$4));
    Object.assign(_el$3.style, {
      fill: "red",
      stroke: "black",
      "stroke-width": props.stroke,
      opacity: 0.5
    });
    return _p$;
  });

  return _el$2;
})();

const template3 = (function() {
  const _el$4 = _$getNextElement(_tmpl$3, true),
    _el$5 = _el$4.firstChild;

  _$spread(_el$5, props, true, false);

  return _el$4;
})();

const template4 = _$getNextElement(_tmpl$4, true);

const template5 = [_$getNextElement(_tmpl$4, true)];

const template6 = _$createComponent(
  Component,
  {
    children: () => _$getNextElement(_tmpl$4, true)
  },
  ["children"]
);
