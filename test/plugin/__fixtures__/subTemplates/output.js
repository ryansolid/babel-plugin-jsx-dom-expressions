const _tmpl$3 = document.createElement("template");

_tmpl$3.innerHTML = "<div></div>";

const _tmpl$2 = document.createElement("template");

_tmpl$2.innerHTML = "<div>From Parent</div>";

const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div>Hello </div><div></div>";

const Child = props => function () {
  const _el$ = _tmpl$.content.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.firstChild,
        _el$4 = _el$2.insertBefore(document.createTextNode(""), _el$3.nextSibling),
        _el$5 = _el$2.nextSibling;

  r.insert(_el$2, props.name, null, _el$4);
  r.insert(_el$5, props.children);
  return _el$;
}();

const someProps = {
  some: 'stuff',
  more: 'things'
};

const template = function () {
  const _el$6 = _tmpl$3.content.firstChild.cloneNode(true);

  r.insert(_el$6, Child(Object.assign({
    name: 'John'
  }, someProps, {
    children: [(() => {
      const _el$7 = _tmpl$2.content.firstChild.cloneNode(true);

      return _el$7;
    })()]
  })));
  return _el$6;
}();