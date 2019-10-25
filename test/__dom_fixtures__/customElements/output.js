import { template as _$template } from "r-dom";
import { wrap as _$wrap } from "r-dom";
import { currentContext as _$currentContext } from "r-dom";

const _tmpl$ = _$template(`<my-element></my-element>`),
      _tmpl$2 = _$template(`<my-element><header slot="head">Title</header></my-element>`),
      _tmpl$3 = _$template(`<slot name="head"></slot>`);

const template = function () {
  const _el$ = _tmpl$.cloneNode(true);

  _el$.setAttribute("some-attr", name);

  _el$.someProp = data;
  _el$._context = _$currentContext();
  return _el$;
}();

const template2 = function () {
  const _el$2 = _tmpl$.cloneNode(true);

  _el$2._context = _$currentContext();

  _$wrap(() => {
    _el$2.setAttribute("some-attr", state.name);

    _el$2.someProp = state.data;
  });

  return _el$2;
}();

const template3 = function () {
  const _el$3 = _tmpl$2.cloneNode(true);

  _el$3._context = _$currentContext();
  return _el$3;
}();

const template4 = [(() => {
  const _el$4 = _tmpl$3.cloneNode(true);

  _el$4._context = _$currentContext();
  return _el$4;
})()];