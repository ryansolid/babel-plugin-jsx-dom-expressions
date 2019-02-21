const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div id='main'><button>\n      Click Native\n    </button><button>\n      Click Delegated\n    </button></div>";

const template = function () {
  const _el$ = _tmpl$.content.firstChild.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.nextSibling;

  _el$2.onclick = () => console.log('native');

  _el$3.__click = () => console.log('delegated');

  return _el$;
}();

r.delegateEvents(["click"]);