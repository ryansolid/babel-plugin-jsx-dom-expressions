const _tmpl$3 = document.createElement("template");

_tmpl$3.innerHTML = "<div><!--8--><!--9--></div>";

const _tmpl$2 = document.createElement("template");

_tmpl$2.innerHTML = "<div>From Parent</div>";

const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<div>Hello <!--4--></div><div></div>";

const Child = props => function () {
  const _el$ = _tmpl$.content.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.firstChild,
        _el$4 = _el$3.nextSibling,
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
  const _el$6 = _tmpl$3.content.firstChild.cloneNode(true),
        _el$8 = _el$6.firstChild,
        _el$9 = _el$8.nextSibling;

  r.insert(_el$6, Child(Object.assign({
    name: 'John'
  }, someProps, {
    children: [(() => {
      const _el$7 = _tmpl$2.content.firstChild.cloneNode(true);

      return _el$7;
    })()]
  })), null, _el$8);
  r.insert(_el$6, Context.Consumer({
    children: [context => context]
  }), null, _el$9);
  return _el$6;
}();

const template2 = Child({
  name: 'Jake',
  dynamic: someValue
});