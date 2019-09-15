import { template as _$template } from "r-dom";
import { insert as _$insert } from "r-dom";

const _tmpl$ = _$template(`<span>Hello </span>`),
      _tmpl$2 = _$template(`<span> John</span>`),
      _tmpl$3 = _$template(`<span>Hello John</span>`),
      _tmpl$4 = _$template(`<span>Hello <!--#--><!--/--></span>`),
      _tmpl$5 = _$template(`<span><!--#--><!--/--> John</span>`),
      _tmpl$6 = _$template(`<span><!--#--><!--/--> <!--#--><!--/--></span>`),
      _tmpl$7 = _$template(`<span> <!--#--><!--/--> <!--#--><!--/--> </span>`),
      _tmpl$8 = _$template(`<span>Hello</span>`);

const name = 'Jake',
      greeting = 'Welcome';

const trailing = _tmpl$.content.firstChild.cloneNode(true);

const leading = _tmpl$2.content.firstChild.cloneNode(true);

const extraSpaces = _tmpl$3.content.firstChild.cloneNode(true);

const trailingExpr = function () {
  const _el$4 = _tmpl$4.content.firstChild.cloneNode(true),
        _el$5 = _el$4.firstChild,
        _el$6 = _el$5.nextSibling,
        _el$7 = _el$6.nextSibling;

  _$insert(_el$4, name, _el$7);

  return _el$4;
}();

const leadingExpr = function () {
  const _el$8 = _tmpl$5.content.firstChild.cloneNode(true),
        _el$10 = _el$8.firstChild,
        _el$11 = _el$10.nextSibling,
        _el$9 = _el$11.nextSibling;

  _$insert(_el$8, greeting, _el$11);

  return _el$8;
}();

const multiExpr = function () {
  const _el$12 = _tmpl$6.content.firstChild.cloneNode(true),
        _el$14 = _el$12.firstChild,
        _el$15 = _el$14.nextSibling,
        _el$13 = _el$15.nextSibling,
        _el$16 = _el$13.nextSibling,
        _el$17 = _el$16.nextSibling;

  _$insert(_el$12, greeting, _el$15);

  _$insert(_el$12, name, _el$17);

  return _el$12;
}();

const multiExprSpaced = function () {
  const _el$18 = _tmpl$7.content.firstChild.cloneNode(true),
        _el$19 = _el$18.firstChild,
        _el$22 = _el$19.nextSibling,
        _el$23 = _el$22.nextSibling,
        _el$20 = _el$23.nextSibling,
        _el$24 = _el$20.nextSibling,
        _el$25 = _el$24.nextSibling,
        _el$21 = _el$25.nextSibling;

  _$insert(_el$18, greeting, _el$23);

  _$insert(_el$18, name, _el$25);

  return _el$18;
}();

const multiLine = _tmpl$8.content.firstChild.cloneNode(true);

const multiLineTrailingSpace = _tmpl$3.content.firstChild.cloneNode(true);