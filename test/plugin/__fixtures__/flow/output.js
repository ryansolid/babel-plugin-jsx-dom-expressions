const _tmpl$6 = document.createElement("template");

_tmpl$6.innerHTML = "<style></style><div class='isolated'>In a Portal</div>";

const _tmpl$5 = document.createElement("template");

_tmpl$5.innerHTML = "<div>Loading...</div>";

const _tmpl$4 = document.createElement("template");

_tmpl$4.innerHTML = "<div></div>";

const _tmpl$3 = document.createElement("template");

_tmpl$3.innerHTML = "<span>Editing:</span><input type='text'/>";

const _tmpl$2 = document.createElement("template");

_tmpl$2.innerHTML = "<div>Do it!</div>";

const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div></div><div></div><!--6-->";
const list = [{
  id: 1,
  text: 'Shop for Groceries',
  completed: true
}, {
  id: 2,
  text: 'Go to Work',
  completed: false
}];
const state = {
  loading: true
};
let editingId = 1;

const template = function () {
  const _el$ = document.createDocumentFragment(),
        _el$2 = _el$.insertBefore(document.createTextNode(""), _el$.firstChild);

  r.flow(_el$, "each", () => list, item => function () {
    const _el$3 = _tmpl$.content.cloneNode(true),
          _el$4 = _el$3.firstChild,
          _el$5 = _el$4.nextSibling,
          _el$6 = _el$5.nextSibling;

    r.insert(_el$4, () => item.text);
    r.flow(_el$5, "when", () => item.completed, () => "Hurray!", {
      fallback: () => _tmpl$2.content.firstChild.cloneNode(true)
    });
    r.flow(_el$3, "when", () => editingId === item.id, () => _tmpl$3.content.cloneNode(true), {}, _el$6);
    return _el$3;
  }(), {
    afterRender: selectWhen(() => editingId, 'editing')
  }, _el$2);
  return _el$;
}();

const template2 = function () {
  const _el$9 = document.createDocumentFragment(),
        _el$10 = _el$9.insertBefore(document.createTextNode(""), _el$9.firstChild);

  r.flow(_el$9, "suspend", () => state.loading, () => function () {
    const _el$11 = _tmpl$4.content.firstChild.cloneNode(true);

    r.insert(_el$11, state.asyncContent);
    return _el$11;
  }(), {
    fallback: () => _tmpl$5.content.firstChild.cloneNode(true)
  }, _el$10);
  return _el$9;
}();

const template3 = function () {
  const _el$13 = document.createDocumentFragment(),
        _el$14 = _el$13.insertBefore(document.createTextNode(""), _el$13.firstChild);

  r.flow(_el$13, "portal", () => null, () => function () {
    const _el$15 = _tmpl$6.content.cloneNode(true),
          _el$16 = _el$15.firstChild;

    r.insert(_el$16, '.isolated { color: red; }');
    return _el$15;
  }(), {
    useShadow: true
  }, _el$14);
  return _el$13;
}();