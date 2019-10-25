import { template as _$template } from "r-dom";
import { wrap as _$wrap } from "r-dom";
import { spread as _$spread } from "r-dom";
import { classList as _$classList } from "r-dom";

const _tmpl$ = _$template(`<div id="main"><h1 disabled=""><a>Welcome</a></h1></div>`),
      _tmpl$2 = _$template(`<div><div></div><div></div></div>`);

const template = function () {
  const _el$ = _tmpl$.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.firstChild;

  _$classList(_el$, {
    selected: selected
  });

  Object.assign(_el$.style, {
    color
  });

  _$spread(_el$2, () => results, false);

  link = _el$3;

  _el$3.setAttribute("href", "/");

  _$wrap(() => {
    _el$2.title = welcoming();
    Object.assign(_el$2.style, {
      backgroundColor: color()
    });

    _$classList(_el$2, {
      selected: selected()
    });
  });

  return _el$;
}();

const template2 = function () {
  const _el$4 = _tmpl$2.cloneNode(true),
        _el$5 = _el$4.firstChild,
        _el$6 = _el$5.nextSibling;

  _el$5.textContent = rowId;

  _$wrap(() => _el$6.firstChild ? _el$6.firstChild.data = row.label : _el$6.textContent = row.label);

  return _el$4;
}();