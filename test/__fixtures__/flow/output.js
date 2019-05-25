import { provide as _$provide } from "r-dom";
import { portal as _$portal } from "r-dom";
import { suspend as _$suspend } from "r-dom";
import { when as _$when } from "r-dom";
import { insert as _$insert } from "r-dom";
import { each as _$each } from "r-dom";

const _tmpl$ = document.createElement("template"),
      _tmpl$2 = document.createElement("template"),
      _tmpl$3 = document.createElement("template"),
      _tmpl$4 = document.createElement("template"),
      _tmpl$5 = document.createElement("template"),
      _tmpl$6 = document.createElement("template"),
      _tmpl$7 = document.createElement("template");

_tmpl$.innerHTML = "<div></div><div></div><!--6-->";
_tmpl$2.innerHTML = "<div>Do it!</div>";
_tmpl$3.innerHTML = "<span>Editing:</span> <input type='text'/>";
_tmpl$4.innerHTML = "<div></div><!--13-->";
_tmpl$5.innerHTML = "<div>Loading...</div>";
_tmpl$6.innerHTML = "<div>Loading...</div>";
_tmpl$7.innerHTML = "<style></style><div class='isolated'>In a Portal</div>";
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

  _$each(_el$, () => list, item => function () {
    const _el$3 = _tmpl$.content.cloneNode(true),
          _el$4 = _el$3.firstChild,
          _el$5 = _el$4.nextSibling,
          _el$6 = _el$5.nextSibling;

    _$insert(_el$4, () => item.text);

    _$when(_el$5, () => item.completed, () => "Hurray!", {
      fallback: () => _tmpl$2.content.firstChild.cloneNode(true)
    });

    _$when(_el$3, () => editingId === item.id, () => _tmpl$3.content.cloneNode(true), {}, _el$6);

    return _el$3;
  }(), {
    afterRender: selectWhen(() => editingId, 'editing')
  }, _el$2);

  return _el$;
}();

const template2 = function () {
  const _el$9 = document.createDocumentFragment(),
        _el$10 = _el$9.insertBefore(document.createTextNode(""), _el$9.firstChild);

  _$suspend(_el$9, () => state.loading, () => function () {
    const _el$11 = _tmpl$4.content.cloneNode(true),
          _el$12 = _el$11.firstChild,
          _el$13 = _el$12.nextSibling;

    _$insert(_el$12, state.asyncContent);

    _$suspend(_el$11, null, () => AsyncChild({}), {
      fallback: () => _tmpl$5.content.firstChild.cloneNode(true)
    }, _el$13);

    return _el$11;
  }(), {
    fallback: () => _tmpl$6.content.firstChild.cloneNode(true)
  }, _el$10);

  return _el$9;
}();

const template3 = function () {
  const _el$16 = document.createDocumentFragment(),
        _el$17 = _el$16.insertBefore(document.createTextNode(""), _el$16.firstChild);

  _$portal(_el$16, null, () => function () {
    const _el$18 = _tmpl$7.content.cloneNode(true),
          _el$19 = _el$18.firstChild;

    _$insert(_el$19, '.isolated { color: red; }');

    return _el$18;
  }(), {
    useShadow: true
  }, _el$17);

  return _el$16;
}();

const template4 = function () {
  const _el$20 = document.createDocumentFragment(),
        _el$21 = _el$20.insertBefore(document.createTextNode(""), _el$20.firstChild);

  _$provide(_el$20, () => ThemeContext, () => Child({}), {
    value: 'dark'
  }, _el$21);

  return _el$20;
}();