import { template as _$template } from "r-dom";
import { getNextElement as _$getNextElement } from "r-dom";

const _tmpl$ = _$template(`<span></span>`),
      _tmpl$2 = _$template(`<div>First</div>`),
      _tmpl$3 = _$template(`<div>Last</div>`),
      _tmpl$4 = _$template(`<div></div>`);

const inserted = 'middle';

const Component = () => _$getNextElement(_tmpl$);

const multiStatic = [_$getNextElement(_tmpl$2), _$getNextElement(_tmpl$3)];
const multiExpression = [_$getNextElement(_tmpl$2), inserted, _$getNextElement(_tmpl$3)];
const singleExpression = [inserted];
const singleDynamic = [() => inserted];
const firstStatic = [inserted, _$getNextElement(_tmpl$4)];
const firstDynamic = [() => inserted, _$getNextElement(_tmpl$4)];
const firstComponent = [Component({}), _$getNextElement(_tmpl$4)];
const lastStatic = [_$getNextElement(_tmpl$4), inserted];
const lastDynamic = [_$getNextElement(_tmpl$4), () => inserted];
const lastComponent = [_$getNextElement(_tmpl$4), Component({})];