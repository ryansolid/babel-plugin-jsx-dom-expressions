import { wrap as _$wrap } from "r-dom";
import { currentContext as _$currentContext } from "r-dom";

const _tmpl$ = document.createElement("template"),
      _tmpl$2 = document.createElement("template"),
      _tmpl$3 = document.createElement("template");

_tmpl$.innerHTML = "<my-element></my-element>";
_tmpl$2.innerHTML = "<my-element></my-element>";
_tmpl$3.innerHTML = "<my-element><header slot='head'>Title</header></my-element>";

const template = function () {
  const _el$ = _tmpl$.content.firstChild.cloneNode(true);

  _el$.setAttribute("some-attr", state.name);

  _el$.someProp = state.data;
  _el$._context = _$currentContext();
  return _el$;
}();

const template2 = function () {
  const _el$2 = _tmpl$2.content.firstChild.cloneNode(true);

  _$wrap(() => _el$2.setAttribute("some-attr", state.name));

  _$wrap(() => _el$2.someProp = state.data);

  _el$2._context = _$currentContext();
  return _el$2;
}();

const template3 = function () {
  const _el$3 = _tmpl$3.content.firstChild.cloneNode(true);

  _el$3._context = _$currentContext();
  return _el$3;
}();