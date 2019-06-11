import { template as _$template } from "r-dom";
import { insert as _$insert } from "r-dom";

const _tmpl$ = _$template("<span></span>"),
      _tmpl$2 = _$template("<div>First</div><div>Last</div>"),
      _tmpl$3 = _$template("<div></div>");

const inserted = 'middle';

const Component = () => _tmpl$.content.firstChild.cloneNode(true);

const multiStatic = _tmpl$2.content.cloneNode(true);

const multiExpression = function () {
  const _el$3 = _tmpl$2.content.cloneNode(true),
        _el$4 = _el$3.firstChild,
        _el$5 = _el$4.nextSibling;

  _$insert(_el$3, inserted, _el$5);

  return _el$3;
}();

const singleExpression = function () {
  const _el$6 = document.createDocumentFragment();

  _$insert(_el$6, inserted);

  return _el$6;
}();

const singleDynamic = function () {
  const _el$7 = document.createDocumentFragment();

  _$insert(_el$7, () => inserted);

  return _el$7;
}();

const firstStatic = function () {
  const _el$8 = _tmpl$3.content.cloneNode(true),
        _el$9 = _el$8.firstChild;

  _$insert(_el$8, inserted, _el$9);

  return _el$8;
}();

const firstDynamic = function () {
  const _el$10 = _tmpl$3.content.cloneNode(true),
        _el$11 = _el$10.firstChild;

  _$insert(_el$10, () => inserted, _el$11);

  return _el$10;
}();

const firstComponent = function () {
  const _el$12 = _tmpl$3.content.cloneNode(true),
        _el$13 = _el$12.firstChild;

  _$insert(_el$12, Component({}), _el$13);

  return _el$12;
}();

const lastStatic = function () {
  const _el$14 = _tmpl$3.content.cloneNode(true),
        _el$15 = _el$14.firstChild;

  _$insert(_el$14, inserted, null);

  return _el$14;
}();

const lastDynamic = function () {
  const _el$16 = _tmpl$3.content.cloneNode(true),
        _el$17 = _el$16.firstChild;

  _$insert(_el$16, () => inserted, null);

  return _el$16;
}();

const lastComponent = function () {
  const _el$18 = _tmpl$3.content.cloneNode(true),
        _el$19 = _el$18.firstChild;

  _$insert(_el$18, Component({}), null);

  return _el$18;
}();