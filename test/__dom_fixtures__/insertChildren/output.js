'use strict';

var _dom = require('dom');

const _tmpl$ = (0, _dom.template)(`<div></div>`),
  _tmpl$2 = (0, _dom.template)(`<module></module>`);

var child = _tmpl$.cloneNode(true);

var template = (0, _dom.createComponent)(Module, {
  children: child,
});

var template2 = (function() {
  var _el$2 = _tmpl$2.cloneNode(true);

  (0, _dom.insert)(_el$2, child);
  return _el$2;
})();
