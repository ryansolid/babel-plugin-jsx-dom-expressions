import { template as _$template } from "r-dom";

const _tmpl$ = _$template(`<div>First</div>`),
      _tmpl$2 = _$template(`<div>Last</div>`),
      _tmpl$3 = _$template(`<div></div>`);

const multiStatic = [_tmpl$.content.firstChild.cloneNode(true), _tmpl$2.content.firstChild.cloneNode(true)];
const multiExpression = [_tmpl$.content.firstChild.cloneNode(true), inserted, _tmpl$2.content.firstChild.cloneNode(true)];
const singleExpression = [inserted];
const singleDynamic = [() => inserted()];
const firstStatic = [inserted, _tmpl$3.content.firstChild.cloneNode(true)];
const firstDynamic = [() => inserted(), _tmpl$3.content.firstChild.cloneNode(true)];
const firstComponent = [Component({}), _tmpl$3.content.firstChild.cloneNode(true)];
const lastStatic = [_tmpl$3.content.firstChild.cloneNode(true), inserted];
const lastDynamic = [_tmpl$3.content.firstChild.cloneNode(true), () => inserted()];
const lastComponent = [_tmpl$3.content.firstChild.cloneNode(true), Component({})];