import { template as _$template } from "r-dom";
import { createComponent as _$createComponent } from "r-dom";
import { insert as _$insert } from "r-dom";

const _tmpl$ = _$template("<div>Hello </div><div></div>"),
      _tmpl$2 = _$template("<div>From Parent</div>"),
      _tmpl$3 = _$template("<div></div>"),
      _tmpl$4 = _$template("<div></div><div></div><div></div>");

const Child = props => function () {
  const _el$ = _tmpl$.content.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.firstChild,
        _el$4 = _el$2.nextSibling;

  props.ref && props.ref(_el$2);

  _$insert(_el$2, props.name, null);

  _$insert(_el$4, props.children);

  return _el$;
}();

const Consumer = props => props.children();

const someProps = {
  some: 'stuff',
  more: 'things'
};

const template = props => {
  let childRef;
  return function () {
    const _el$5 = _tmpl$3.content.firstChild.cloneNode(true);

    _$insert(_el$5, _$createComponent(Child, Object.assign({
      name: 'John'
    }, props, {
      ref: r$ => childRef = r$,
      children: () => _tmpl$2.content.firstChild.cloneNode(true)
    }), ["children"]), null);

    _$insert(_el$5, _$createComponent(Child, Object.assign({
      name: 'Jason'
    }, Object.keys(props).reduce((m$, k$) => m$[k$] = () => props[k$], {}), {
      ref: props.ref,
      children: () => {
        const _el$7 = _tmpl$3.content.firstChild.cloneNode(true);

        _$insert(_el$7, state.content);

        return _el$7;
      }
    }), [...Object.keys(props), "children"]), null);

    _$insert(_el$5, Consumer({
      children: context => context
    }), null);

    return _el$5;
  }();
};

const template2 = _$createComponent(Child, {
  name: 'Jake',
  dynamic: () => state.data,
  handleClick: clickHandler
}, ["dynamic"]);

const template3 = _$createComponent(Child, {
  children: () => _tmpl$4.content.cloneNode(true)
}, ["children"]);

const template4 = Child({
  children: () => _tmpl$3.content.firstChild.cloneNode(true)
});

const template5 = _$createComponent(Child, {
  children: () => dynamicValue
}, ["children"]);