import { template as _$template } from "r-dom";
import { getNextMarker as _$getNextMarker } from "r-dom";
import { insert as _$insert } from "r-dom";
import { getNextElement as _$getNextElement } from "r-dom";
import { runHydrationEvents as _$runHydrationEvents } from "r-dom";

const _tmpl$ = _$template(`<span>Hello </span>`),
  _tmpl$2 = _$template(`<span> John</span>`),
  _tmpl$3 = _$template(`<span>Hello John</span>`),
  _tmpl$4 = _$template(`<span>Hello <!--#--><!--/--></span>`),
  _tmpl$5 = _$template(`<span><!--#--><!--/--> John</span>`),
  _tmpl$6 = _$template(`<span><!--#--><!--/--> <!--#--><!--/--></span>`),
  _tmpl$7 = _$template(`<span> <!--#--><!--/--> <!--#--><!--/--> </span>`),
  _tmpl$8 = _$template(`<span>Hello</span>`),
  _tmpl$9 = _$template(`<span>&nbsp;&lt;Hi&gt;&nbsp;</span>`);

const trailing = (function() {
  const _el$ = _$getNextElement(_tmpl$);

  _$runHydrationEvents(_el$.getAttribute("_hk"));

  return _el$;
})();

const leading = (function() {
  const _el$2 = _$getNextElement(_tmpl$2);

  _$runHydrationEvents(_el$2.getAttribute("_hk"));

  return _el$2;
})();
/* prettier-ignore */

const extraSpaces = function () {
  const _el$3 = _$getNextElement(_tmpl$3);

  _$runHydrationEvents(_el$3.getAttribute("_hk"));

  return _el$3;
}();

const trailingExpr = (function() {
  const _el$4 = _$getNextElement(_tmpl$4),
    _el$5 = _el$4.firstChild,
    _el$6 = _el$5.nextSibling,
    [_el$7, _co$] = _$getNextMarker(_el$6.nextSibling);

  _$insert(_el$4, name, _el$7, _co$);

  _$runHydrationEvents(_el$4.getAttribute("_hk"));

  return _el$4;
})();

const leadingExpr = (function() {
  const _el$8 = _$getNextElement(_tmpl$5),
    _el$10 = _el$8.firstChild,
    [_el$11, _co$2] = _$getNextMarker(_el$10.nextSibling),
    _el$9 = _el$11.nextSibling;

  _$insert(_el$8, greeting, _el$11, _co$2);

  _$runHydrationEvents(_el$8.getAttribute("_hk"));

  return _el$8;
})();
/* prettier-ignore */

const multiExpr = function () {
  const _el$12 = _$getNextElement(_tmpl$6),
        _el$14 = _el$12.firstChild,
        [_el$15, _co$3] = _$getNextMarker(_el$14.nextSibling),
        _el$13 = _el$15.nextSibling,
        _el$16 = _el$13.nextSibling,
        [_el$17, _co$4] = _$getNextMarker(_el$16.nextSibling);

  _$insert(_el$12, greeting, _el$15, _co$3);

  _$insert(_el$12, name, _el$17, _co$4);

  _$runHydrationEvents(_el$12.getAttribute("_hk"));

  return _el$12;
}();
/* prettier-ignore */

const multiExprSpaced = function () {
  const _el$18 = _$getNextElement(_tmpl$7),
        _el$19 = _el$18.firstChild,
        _el$22 = _el$19.nextSibling,
        [_el$23, _co$5] = _$getNextMarker(_el$22.nextSibling),
        _el$20 = _el$23.nextSibling,
        _el$24 = _el$20.nextSibling,
        [_el$25, _co$6] = _$getNextMarker(_el$24.nextSibling),
        _el$21 = _el$25.nextSibling;

  _$insert(_el$18, greeting, _el$23, _co$5);

  _$insert(_el$18, name, _el$25, _co$6);

  _$runHydrationEvents(_el$18.getAttribute("_hk"));

  return _el$18;
}();
/* prettier-ignore */

const multiLine = function () {
  const _el$26 = _$getNextElement(_tmpl$8);

  _$runHydrationEvents(_el$26.getAttribute("_hk"));

  return _el$26;
}();
/* prettier-ignore */

const multiLineTrailingSpace = function () {
  const _el$27 = _$getNextElement(_tmpl$3);

  _$runHydrationEvents(_el$27.getAttribute("_hk"));

  return _el$27;
}();
/* prettier-ignore */

const escape = function () {
  const _el$28 = _$getNextElement(_tmpl$9);

  _$runHydrationEvents(_el$28.getAttribute("_hk"));

  return _el$28;
}();
