import { insert as _$insert } from "r-dom";

const _tmpl$ = document.createElement("template"),
      _tmpl$2 = document.createElement("template"),
      _tmpl$3 = document.createElement("template"),
      _tmpl$4 = document.createElement("template");

_tmpl$.innerHTML = "<div>First</div><div>Last</div>";
_tmpl$2.innerHTML = "<!---->";
_tmpl$3.innerHTML = "<div></div>";
_tmpl$4.innerHTML = "<div></div><!---->";
const inserted = 'middle';

const multiStatic = _tmpl$.content.cloneNode(true);

const multiExpression = function () {
  const _el$2 = _tmpl$.content.cloneNode(true),
        _el$3 = _el$2.firstChild,
        _el$4 = _el$3.nextSibling;

  _$insert(_el$2, inserted, undefined, _el$4);

  return _el$2;
}();

const singleExpression = function () {
  const _el$5 = document.createDocumentFragment();

  _$insert(_el$5, inserted);

  return _el$5;
}();

const singleDynamic = function () {
  const _el$6 = _tmpl$2.content.cloneNode(true),
        _el$7 = _el$6.firstChild;

  _$insert(_el$6, () => inserted, undefined, _el$7);

  return _el$6;
}();

const firstStatic = function () {
  const _el$8 = _tmpl$3.content.cloneNode(true),
        _el$9 = _el$8.firstChild;

  _$insert(_el$8, inserted, undefined, _el$9);

  return _el$8;
}();

const firstDynamic = function () {
  const _el$10 = _tmpl$3.content.cloneNode(true),
        _el$11 = _el$10.firstChild;

  _$insert(_el$10, () => inserted, undefined, _el$11);

  return _el$10;
}();

const firstComponent = function () {
  const _el$12 = _tmpl$3.content.cloneNode(true),
        _el$13 = _el$12.firstChild;

  _$insert(_el$12, Component({}), undefined, _el$13);

  return _el$12;
}();

const lastStatic = function () {
  const _el$14 = _tmpl$3.content.cloneNode(true),
        _el$15 = _el$14.firstChild;

  _$insert(_el$14, inserted, undefined, null);

  return _el$14;
}();

const lastDynamic = function () {
  const _el$16 = _tmpl$4.content.cloneNode(true),
        _el$17 = _el$16.firstChild,
        _el$18 = _el$17.nextSibling;

  _$insert(_el$16, () => inserted, undefined, _el$18);

  return _el$16;
}();

const lastComponent = function () {
  const _el$19 = _tmpl$4.content.cloneNode(true),
        _el$20 = _el$19.firstChild,
        _el$21 = _el$20.nextSibling;

  _$insert(_el$19, Component({}), undefined, _el$21);

  return _el$19;
}();