const _tmpl$4 = document.createElement("template");

_tmpl$4.innerHTML = "<div><!--8--><!--10--><!--11--></div>";

const _tmpl$3 = document.createElement("template");

_tmpl$3.innerHTML = "<div></div>";

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

  props.ref && props.ref(_el$2);
  r.insert(_el$2, props.name, null, _el$4);
  r.insert(_el$5, props.children);
  return _el$;
}();

const someProps = {
  some: 'stuff',
  more: 'things'
};

const template = props => {
  let childRef;
  return function () {
    const _el$6 = _tmpl$4.content.firstChild.cloneNode(true),
          _el$8 = _el$6.firstChild,
          _el$10 = _el$8.nextSibling,
          _el$11 = _el$10.nextSibling;

    r.insert(_el$6, Child(Object.assign({
      name: 'John'
    }, props, {
      ref: r$ => childRef = r$,
      children: [_tmpl$2.content.firstChild.cloneNode(true)]
    })), null, _el$8);
    r.insert(_el$6, r.createComponent(Child, Object.assign({
      name: 'Jason'
    }, Object.keys(props).reduce((m$, k$) => m$[k$] = () => props[k$], {}), {
      ref: props.ref,
      children: [(() => {
        const _el$9 = _tmpl$3.content.firstChild.cloneNode(true);

        r.insert(_el$9, state.content);
        return _el$9;
      })()]
    }), [...Object.keys(props)]), null, _el$10);
    r.insert(_el$6, Context.Consumer({
      children: [context => context]
    }), null, _el$11);
    return _el$6;
  }();
};

const template2 = r.createComponent(Child, {
  name: 'Jake',
  dynamic: () => state.data,
  handleClick: clickHandler
}, ["dynamic"]);