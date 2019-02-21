const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div id='main'><h1>Welcome</h1></div>";

const template = function () {
  const _el$ = _tmpl$.content.firstChild.cloneNode(true);

  return _el$;
}();