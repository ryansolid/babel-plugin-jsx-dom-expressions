const _tmpl$4 = document.createElement("template");

_tmpl$4.innerHTML = "<span>Editing:</span><input type='text'/>";

const _tmpl$3 = document.createElement("template");

_tmpl$3.innerHTML = "<div>Do it!</div>";

const _tmpl$2 = document.createElement("template");

_tmpl$2.innerHTML = "<div>Hurray!</div>";

const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div></div><div></div>";
const list = [{
  id: 1,
  text: 'Shop for Groceries',
  completed: true
}, {
  id: 2,
  text: 'Go to Work',
  completed: false
}];
let editingId = 1;

const template = function () {
  const _el$ = document.createDocumentFragment(),
        _el$2 = _el$.insertBefore(document.createTextNode(""), _el$.firstChild);

  r.flow(_el$, "each", () => list, item => function () {
    const _el$3 = _tmpl$.content.cloneNode(true),
          _el$4 = _el$3.firstChild,
          _el$5 = _el$4.nextSibling,
          _el$6 = _el$3.insertBefore(document.createTextNode(""), _el$5.nextSibling);

    r.insert(_el$4, () => item.text);
    r.flow(_el$5, "when", () => item.completed, () => function () {
      const _el$7 = _tmpl$2.content.firstChild.cloneNode(true);

      return _el$7;
    }(), {
      fallback: () => function () {
        const _el$8 = _tmpl$3.content.firstChild.cloneNode(true);

        return _el$8;
      }()
    });
    r.flow(_el$3, "when", () => editingId === item.id, () => function () {
      const _el$9 = _tmpl$4.content.cloneNode(true);

      return _el$9;
    }(), {}, _el$6);
    return _el$3;
  }(), {
    afterRender: selectWhen(() => editingId, 'editing')
  }, _el$2);
  return _el$;
}();