import { insert as _$insert } from "r-dom";

const _tmpl$ = document.createElement("template"),
      _tmpl$2 = document.createElement("template"),
      _tmpl$3 = document.createElement("template");

_tmpl$.innerHTML = "<div>First</div><div>Last</div>";
_tmpl$2.innerHTML = "<!---->";
_tmpl$3.innerHTML = "<div></div><!---->";
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

const lastDynamic = function () {
  const _el$8 = _tmpl$3.content.cloneNode(true),
        _el$9 = _el$8.firstChild,
        _el$10 = _el$9.nextSibling;

  _$insert(_el$8, () => inserted, undefined, _el$10);

  return _el$8;
}();

const lastComponent = function () {
  const _el$11 = _tmpl$3.content.cloneNode(true),
        _el$12 = _el$11.firstChild,
        _el$13 = _el$12.nextSibling;

  _$insert(_el$11, Component({}), undefined, _el$13);

  return _el$11;
}();