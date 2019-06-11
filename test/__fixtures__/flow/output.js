import { template as _$template } from "r-dom";
import { switchWhen as _$switchWhen } from "r-dom";
import { provide as _$provide } from "r-dom";
import { portal as _$portal } from "r-dom";
import { suspend as _$suspend } from "r-dom";
import { when as _$when } from "r-dom";
import { insert as _$insert } from "r-dom";
import { each as _$each } from "r-dom";

const _tmpl$ = _$template("<div></div><div></div>"),
      _tmpl$2 = _$template("<div>Do it!</div>"),
      _tmpl$3 = _$template("<span>Editing:</span> <input type='text'/>"),
      _tmpl$4 = _$template("<div></div>"),
      _tmpl$5 = _$template("<div>Loading...</div>"),
      _tmpl$6 = _$template("<style></style><div class='isolated'>In a Portal</div>"),
      _tmpl$7 = _$template("<div>Route not Found</div>"),
      _tmpl$8 = _$template("<p>Content</p>");

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
          _el$5 = _el$4.nextSibling;

    _$insert(_el$4, () => item.text);

    _$when(_el$5, () => item.completed, () => "Hurray!", {
      fallback: () => _tmpl$2.content.firstChild.cloneNode(true)
    });

    _$when(_el$3, () => editingId === item.id, () => _tmpl$3.content.cloneNode(true), {}, null);

    return _el$3;
  }(), {
    afterRender: selectWhen(() => editingId, 'editing')
  }, _el$2);

  return _el$;
}();

const template2 = function () {
  const _el$8 = document.createDocumentFragment(),
        _el$9 = _el$8.insertBefore(document.createTextNode(""), _el$8.firstChild);

  _$suspend(_el$8, () => state.loading, () => function () {
    const _el$10 = _tmpl$4.content.cloneNode(true),
          _el$11 = _el$10.firstChild;

    _$insert(_el$11, state.asyncContent);

    _$suspend(_el$10, null, () => AsyncChild({}), {
      fallback: () => _tmpl$5.content.firstChild.cloneNode(true)
    }, null);

    return _el$10;
  }(), {
    fallback: () => _tmpl$5.content.firstChild.cloneNode(true)
  }, _el$9);

  return _el$8;
}();

const template3 = function () {
  const _el$14 = document.createDocumentFragment(),
        _el$15 = _el$14.insertBefore(document.createTextNode(""), _el$14.firstChild);

  _$portal(_el$14, null, () => function () {
    const _el$16 = _tmpl$6.content.cloneNode(true),
          _el$17 = _el$16.firstChild;

    _$insert(_el$17, '.isolated { color: red; }');

    return _el$16;
  }(), {
    useShadow: true
  }, _el$15);

  return _el$14;
}();

const template4 = function () {
  const _el$18 = document.createDocumentFragment(),
        _el$19 = _el$18.insertBefore(document.createTextNode(""), _el$18.firstChild);

  _$provide(_el$18, () => ThemeContext, () => Child({}), {
    value: 'dark'
  }, _el$19);

  return _el$18;
}();

const template5 = function () {
  const _el$20 = document.createDocumentFragment(),
        _el$21 = _el$20.insertBefore(document.createTextNode(""), _el$20.firstChild);

  _$switchWhen(_el$20, [{
    condition: () => state.route === 'home',
    render: () => Home({}),
    options: {}
  }, {
    condition: () => state.route === 'profile',
    render: () => Profile({}),
    options: {}
  }, {
    condition: () => state.route === 'settings',
    render: () => Settings({}),
    options: {
      afterRender: node => node && node.focus()
    }
  }], null, {
    fallback: () => _tmpl$7.content.firstChild.cloneNode(true)
  }, _el$21);

  return _el$20;
}();

const StaticChild = () => _tmpl$4.content.firstChild.cloneNode(true);

const template6 = function () {
  const _el$24 = _tmpl$4.content.firstChild.cloneNode(true);

  _$insert(_el$24, StaticChild({}), null);

  _$when(_el$24, () => condition, () => _tmpl$8.content.firstChild.cloneNode(true), {}, null);

  return _el$24;
}();