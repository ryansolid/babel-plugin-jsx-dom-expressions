const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div id='main'><h1>\n      Welcome\n    </h1></div>";
const welcoming = 'Welcome';
const selected = true;
const color = 'red';

const template = function () {
  const _el$ = _tmpl$.content.firstChild.cloneNode(true),
        _el$2 = _el$.firstChild;

  r.wrap(() => {
    let classNames = {
      selected: selected
    };
    let classKeys = Object.keys(classNames);

    for (let i = 0; i < classKeys.length; i++) _el$.classList.toggle(classKeys[i], classNames[classKeys[i]]);
  });
  r.wrap(() => _el$2.title = welcoming);
  r.wrap(() => Object.assign(_el$2.style, {
    backgroundColor: color
  }));
  return _el$;
}();