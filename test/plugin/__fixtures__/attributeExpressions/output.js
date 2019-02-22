const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div id='main'><h1><a>Welcome</a></h1></div>";
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
  r.wrap(() => {
    let classNames = {
      selected: selected
    };
    let classKeys = Object.keys(classNames);

    for (let i = 0; i < classKeys.length; i++) _el$.classList.toggle(classKeys[i], classNames[classKeys[i]]);
  });
  r.spread(_el$2, () => props);
  r.wrap(() => _el$2.title = welcoming);
  r.wrap(() => Object.assign(_el$2.style, {
    backgroundColor: color
  }));
  link = _el$3;

  _el$3.setAttribute("href", '/');

  return _el$;
}();