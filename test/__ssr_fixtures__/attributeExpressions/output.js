import { template as _$template } from "r-dom";
import { wrap as _$wrap } from "r-dom";
import { getNextElement as _$getNextElement } from "r-dom";
import { classList as _$classList } from "r-dom";
import { spread as _$spread } from "r-dom";

const _tmpl$ = _$template(
    `<div id="main"><h1 disabled=""><a href="/">Welcome</a></h1></div>`
  ),
  _tmpl$2 = _$template(`<div><div></div><div></div></div>`);

const template = (function() {
  const _el$ = _$getNextElement(_tmpl$, true),
    _el$2 = _el$.firstChild,
    _el$3 = _el$2.firstChild;

  _$spread(_el$, results, false, true);

  _$classList(_el$, {
    selected: selected
  });

  Object.assign(_el$.style, {
    color
  });

  _$spread(_el$2, () => results(), false, true);

  link = _el$3;

  _$wrap((_p$ = {}) => {
    const _v$ = welcoming(),
      _v$2 = {
        selected: selected()
      },
      _v$3 = _p$._v$2;

    _v$ !== _p$._v$ && (_el$2.title = _p$._v$ = _v$);
    Object.assign(_el$2.style, {
      backgroundColor: color()
    });
    _v$2 !== _p$._v$2 && _$classList(_el$2, (_p$._v$2 = _v$2), _v$3);
    return _p$;
  });

  return _el$;
})();

const template2 = (function() {
  const _el$4 = _$getNextElement(_tmpl$2, true),
    _el$5 = _el$4.firstChild,
    _el$6 = _el$5.nextSibling;

  _el$5.textContent = rowId;
  _el$6.textContent = row.label;
  const _el$7 = _el$6.firstChild;

  _$wrap(() => (_el$7.data = row.label));

  return _el$4;
})();
