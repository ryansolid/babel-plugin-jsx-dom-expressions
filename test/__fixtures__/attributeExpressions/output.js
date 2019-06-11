import { template as _$template } from "r-dom";
import { wrap as _$wrap } from "r-dom";
import { spread as _$spread } from "r-dom";
import { classList as _$classList } from "r-dom";

const _tmpl$ = _$template("<div id='main'><h1><a>Welcome</a></h1></div>");

const welcoming = 'Welcome';
const selected = true;
const color = 'red';
const props = {
  some: 'stuff',
  no: 'thing'
};

const binding = (el, accessor) => el.custom = accessor();

let link;

const template = function () {
  const _el$ = _tmpl$.content.firstChild.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.firstChild;

  custom(_el$, () => binding);

  _$classList(_el$, {
    selected: selected
  });

  Object.assign(_el$.style, {
    color
  });

  _$spread(_el$2, () => props);

  _$spread(_el$2, results);

  _$wrap(() => _el$2.title = welcoming);

  _$wrap(() => Object.assign(_el$2.style, {
    backgroundColor: color
  }));

  _$wrap(() => _$classList(_el$2, {
    selected: selected
  }));

  link = _el$3;

  _el$3.setAttribute("href", '/');

  return _el$;
}();