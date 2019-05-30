import { insert as _$insert } from "r-dom";

const _tmpl$ = document.createElement("template"),
      _tmpl$2 = document.createElement("template"),
      _tmpl$3 = document.createElement("template"),
      _tmpl$4 = document.createElement("template"),
      _tmpl$5 = document.createElement("template"),
      _tmpl$6 = document.createElement("template");

_tmpl$.innerHTML = "<span>Hello </span>";
_tmpl$2.innerHTML = "<span> John</span>";
_tmpl$3.innerHTML = "<span>Hello John</span>";
_tmpl$4.innerHTML = "<span> </span>";
_tmpl$5.innerHTML = "<span> <!----> <!----> </span>";
_tmpl$6.innerHTML = "<span>Hello</span>";
const name = 'Jake',
      greeting = 'Welcome';

const trailing = _tmpl$.content.firstChild.cloneNode(true);

const leading = _tmpl$2.content.firstChild.cloneNode(true);

const extraSpaces = _tmpl$3.content.firstChild.cloneNode(true);

const trailingExpr = function () {
  const _el$4 = _tmpl$.content.firstChild.cloneNode(true),
        _el$5 = _el$4.firstChild;

  _$insert(_el$4, name, null);

  return _el$4;
}();

const leadingExpr = function () {
  const _el$6 = _tmpl$2.content.firstChild.cloneNode(true),
        _el$7 = _el$6.firstChild;

  _$insert(_el$6, greeting, _el$7);

  return _el$6;
}();

const multiExpr = function () {
  const _el$8 = _tmpl$4.content.firstChild.cloneNode(true),
        _el$9 = _el$8.firstChild;

  _$insert(_el$8, greeting, _el$9);

  _$insert(_el$8, name, null);

  return _el$8;
}();

const multiExprSpaced = function () {
  const _el$10 = _tmpl$5.content.firstChild.cloneNode(true),
        _el$11 = _el$10.firstChild,
        _el$14 = _el$11.nextSibling,
        _el$12 = _el$14.nextSibling,
        _el$15 = _el$12.nextSibling,
        _el$13 = _el$15.nextSibling;

  _$insert(_el$10, greeting, _el$14);

  _$insert(_el$10, name, _el$15);

  return _el$10;
}();

const multiLine = _tmpl$6.content.firstChild.cloneNode(true);

const multiLineTrailingSpace = _tmpl$3.content.firstChild.cloneNode(true);