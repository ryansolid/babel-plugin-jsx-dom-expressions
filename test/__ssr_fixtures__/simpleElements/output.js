import { template as _$template } from "r-dom";
import { getNextElement as _$getNextElement } from "r-dom";

const _tmpl$ = _$template(`<div id="main"><h1>Welcome</h1><label>Edit:</label><input id="entry" type="text"></div>`);

const template = function () {
  const _el$ = _$getNextElement(_tmpl$),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.nextSibling;

  _el$3.htmlFor = "entry";
  return _el$;
}();