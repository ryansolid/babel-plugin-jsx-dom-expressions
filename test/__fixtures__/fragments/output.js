import { insert as _$insert } from "r-dom";

const _tmpl$ = document.createElement("template"),
      _tmpl$2 = document.createElement("template"),
      _tmpl$3 = document.createElement("template");

_tmpl$.innerHTML = "<div>First</div><div>Last</div>";
_tmpl$2.innerHTML = "<div>First</div><div>Last</div>";
_tmpl$3.innerHTML = "<!--7-->";
const inserted = 'middle';

const multiStatic = _tmpl$.content.cloneNode(true);

const multiExpression = function () {
  const _el$2 = _tmpl$2.content.cloneNode(true),
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
  const _el$6 = _tmpl$3.content.cloneNode(true),
        _el$7 = _el$6.firstChild;

  _$insert(_el$6, () => inserted, undefined, _el$7);

  return _el$6;
}();