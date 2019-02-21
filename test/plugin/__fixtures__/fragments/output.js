const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div>First</div><div>Last</div>";
const inserted = 'middle';

const template = function () {
  const _el$ = _tmpl$.content.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$.insertBefore(document.createTextNode(""), _el$2.nextSibling);

  r.insert(_el$, inserted, null, _el$3);
  return _el$;
}();