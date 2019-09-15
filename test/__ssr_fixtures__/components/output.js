import { template as _$template } from "r-dom";
import { For as _$For } from "r-dom";
import { createComponent as _$createComponent } from "r-dom";
import { insert as _$insert } from "r-dom";

const _tmpl$ = _$template(`<div>Hello <!--#--><!--/--></div>`),
      _tmpl$2 = _$template(`<div></div>`),
      _tmpl$3 = _$template(`<div>From Parent</div>`),
      _tmpl$4 = _$template(`<div><!--#--><!--/--><!--#--><!--/--><!--#--><!--/--></div>`);

const Child = props => [(() => {
  const _el$ = _tmpl$.content.firstChild.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.nextSibling,
        _el$4 = _el$3.nextSibling;

  props.ref && props.ref(_el$);

  _$insert(_el$, props.name, _el$4);

  return _el$;
})(), (() => {
  const _el$5 = _tmpl$2.content.firstChild.cloneNode(true);

  _$insert(_el$5, props.children);

  return _el$5;
})()];

const Consumer = props => props.children();

const someProps = {
  some: 'stuff',
  more: 'things'
};

const template = props => {
  let childRef;
  return function () {
    const _el$6 = _tmpl$4.content.firstChild.cloneNode(true),
          _el$9 = _el$6.firstChild,
          _el$10 = _el$9.nextSibling,
          _el$11 = _el$10.nextSibling,
          _el$12 = _el$11.nextSibling,
          _el$13 = _el$12.nextSibling,
          _el$14 = _el$13.nextSibling;

    _$insert(_el$6, _$createComponent(Child, Object.assign({
      name: 'John'
    }, props, {
      ref: r$ => childRef = r$,
      booleanProperty: true,
      children: () => _tmpl$3.content.firstChild.cloneNode(true)
    }), ["children"]), _el$10);

    _$insert(_el$6, _$createComponent(Child, Object.assign({
      name: 'Jason'
    }, Object.keys(props).reduce((m$, k$) => (m$[k$] = () => props[k$], m$), {}), {
      ref: props.ref,
      children: () => {
        const _el$8 = _tmpl$2.content.firstChild.cloneNode(true);

        _$insert(_el$8, state.content);

        return _el$8;
      }
    }), [...Object.keys(props), "children"]), _el$12);

    _$insert(_el$6, Context.Consumer({
      children: context => context
    }), _el$14);

    return _el$6;
  }();
};

const template2 = _$createComponent(Child, {
  name: 'Jake',
  dynamic: () => state.data,
  handleClick: clickHandler
}, ["dynamic"]);

const template3 = _$createComponent(Child, {
  children: () => [_tmpl$2.content.firstChild.cloneNode(true), _tmpl$2.content.firstChild.cloneNode(true), _tmpl$2.content.firstChild.cloneNode(true)]
}, ["children"]);

const template4 = Child({
  children: () => _tmpl$2.content.firstChild.cloneNode(true)
});

const template5 = _$createComponent(Child, {
  children: () => dynamicValue
}, ["children"]); // builtIns


const template6 = _$createComponent(_$For, {
  each: () => list,
  children: item => item
}, ["each"]);