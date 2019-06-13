import { template as _$template } from "r-dom";
import { insert as _$insert } from "r-dom";

const _tmpl$ = _$template("<span></span>"),
      _tmpl$2 = _$template("<div>First</div><div>Last</div>"),
      _tmpl$3 = _$template("<!---->"),
      _tmpl$4 = _$template("<div></div>");

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
  const _el$7 = _tmpl$3.content.cloneNode(true),
        _el$8 = _el$7.firstChild;

  _$insert(_el$7, () => inserted, _el$8);

  return _el$7;
}();

const firstStatic = function () {
  const _el$9 = _tmpl$4.content.cloneNode(true),
        _el$10 = _el$9.firstChild;

  _$insert(_el$9, inserted, _el$10);

  return _el$9;
}();

const firstDynamic = function () {
  const _el$11 = _tmpl$4.content.cloneNode(true),
        _el$12 = _el$11.firstChild;

  _$insert(_el$11, () => inserted, _el$12);

  return _el$11;
}();

const firstComponent = function () {
  const _el$13 = _tmpl$4.content.cloneNode(true),
        _el$14 = _el$13.firstChild;

  _$insert(_el$13, Component({}), _el$14);

  return _el$13;
}();

const lastStatic = function () {
  const _el$15 = _tmpl$4.content.cloneNode(true),
        _el$16 = _el$15.firstChild;

  _$insert(_el$15, inserted, null);

  return _el$15;
}();

const lastDynamic = function () {
  const _el$17 = _tmpl$4.content.cloneNode(true),
        _el$18 = _el$17.firstChild;

  _$insert(_el$17, () => inserted, null);

  return _el$17;
}();

const lastComponent = function () {
  const _el$19 = _tmpl$4.content.cloneNode(true),
        _el$20 = _el$19.firstChild;

  _$insert(_el$19, Component({}), null);

  return _el$19;
}();