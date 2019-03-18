const _tmpl$2 = document.createElement("template");

_tmpl$2.innerHTML = "<div>First</div><div>Last</div>";

const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div>First</div><div>Last</div>";
const inserted = 'middle';

const multiStatic = _tmpl$.content.cloneNode(true);

const multiExpression = function () {
  const _el$2 = _tmpl$2.content.cloneNode(true),
        _el$3 = _el$2.firstChild,
        _el$4 = _el$2.insertBefore(document.createTextNode(""), _el$3.nextSibling);

  r.insert(_el$2, inserted, null, _el$4);
  return _el$2;
}();

const singleExpression = function () {
  const _el$5 = document.createDocumentFragment();

  r.insert(_el$5, inserted);
  return _el$5;
}();

const singleDynamic = function () {
  const _el$6 = document.createDocumentFragment(),
        _el$7 = _el$6.insertBefore(document.createTextNode(""), _el$6.firstChild);

  r.insert(_el$6, () => inserted, null, _el$7);
  return _el$6;
}();