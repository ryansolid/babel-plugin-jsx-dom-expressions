const _tmpl$2 = document.createElement("template");

_tmpl$2.innerHTML = "<div>Hurray!</div>";

const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div></div>";
const list = [{
  text: 'Shop for Groceries',
  completed: true
}, {
  text: 'Go to Work',
  completed: false
}];

const template = function () {
  const _el$ = document.createDocumentFragment(),
        _el$2 = _el$.insertBefore(document.createTextNode(""), _el$.firstChild);

  r.flow(_el$, "each", () => list, item => function () {
    const _el$3 = _tmpl$.content.cloneNode(true),
          _el$4 = _el$3.firstChild,
          _el$5 = _el$3.insertBefore(document.createTextNode(""), _el$4.nextSibling);

    r.insert(_el$4, () => item.text);
    r.flow(_el$3, "when", () => item.completed, () => function () {
      const _el$6 = _tmpl$2.content.firstChild.cloneNode(true);

      return _el$6;
    }(), null, _el$5);
    return _el$3;
  }(), null, _el$2);
  return _el$;
}();