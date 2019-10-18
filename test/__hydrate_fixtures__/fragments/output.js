import { template as _$template } from "r-dom";
import { getNextElement as _$getNextElement } from "r-dom";

const _tmpl$ = _$template(`<div>First</div>`),
      _tmpl$2 = _$template(`<div>Last</div>`),
      _tmpl$3 = _$template(`<div></div>`);

const multiStatic = [_$getNextElement(_tmpl$), _$getNextElement(_tmpl$2)];
const multiExpression = [_$getNextElement(_tmpl$), inserted, _$getNextElement(_tmpl$2)];
const singleExpression = [inserted];
const singleDynamic = [() => inserted()];
const firstStatic = [inserted, _$getNextElement(_tmpl$3)];
const firstDynamic = [() => inserted(), _$getNextElement(_tmpl$3)];
const firstComponent = [Component({}), _$getNextElement(_tmpl$3)];
const lastStatic = [_$getNextElement(_tmpl$3), inserted];
const lastDynamic = [_$getNextElement(_tmpl$3), () => inserted()];
const lastComponent = [_$getNextElement(_tmpl$3), Component({})];