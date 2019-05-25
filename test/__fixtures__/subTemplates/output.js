import { createComponent as _$createComponent } from "r-dom";
import { insert as _$insert } from "r-dom";

const _tmpl$ = document.createElement("template"),
      _tmpl$2 = document.createElement("template"),
      _tmpl$3 = document.createElement("template"),
      _tmpl$4 = document.createElement("template"),
      _tmpl$5 = document.createElement("template");

_tmpl$.innerHTML = "<div>Hello </div><div></div>";
_tmpl$2.innerHTML = "<div>From Parent</div>";
_tmpl$3.innerHTML = "<div></div>";
_tmpl$4.innerHTML = "<div><!----><!----></div>";
_tmpl$5.innerHTML = "<div></div><div></div><div></div>";

const Child = props => function () {
  const _el$ = _tmpl$.content.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.firstChild,
        _el$4 = _el$2.nextSibling;

  props.ref && props.ref(_el$2);

  _$insert(_el$2, props.name, undefined, null);

  _$insert(_el$4, props.children);

  return _el$;
}();

const someProps = {
  some: 'stuff',
  more: 'things'
};

const template = props => {
  let childRef;
  return function () {
    const _el$5 = _tmpl$4.content.firstChild.cloneNode(true),
          _el$8 = _el$5.firstChild,
          _el$9 = _el$8.nextSibling;

    _$insert(_el$5, Child(Object.assign({
      name: 'John'
    }, props, {
      ref: r$ => childRef = r$,
      children: _tmpl$2.content.firstChild.cloneNode(true)
    })), undefined, _el$8);

    _$insert(_el$5, _$createComponent(Child, Object.assign({
      name: 'Jason'
    }, Object.keys(props).reduce((m$, k$) => m$[k$] = () => props[k$], {}), {
      ref: props.ref,
      children: (() => {
        const _el$7 = _tmpl$3.content.firstChild.cloneNode(true);

        _$insert(_el$7, state.content);

        return _el$7;
      })()
    }), [...Object.keys(props)]), undefined, _el$9);

    _$insert(_el$5, Context.Consumer({
      children: context => context
    }), undefined, null);

    return _el$5;
  }();
};

const template2 = _$createComponent(Child, {
  name: 'Jake',
  dynamic: () => state.data,
  handleClick: clickHandler
}, ["dynamic"]);

const template3 = Child({
  children: _tmpl$5.content.cloneNode(true)
});
const template4 = Child({
  children: () => _tmpl$3.content.firstChild.cloneNode(true)
});

const template5 = _$createComponent(Child, {
  children: () => dynamicValue
}, ["children"]);