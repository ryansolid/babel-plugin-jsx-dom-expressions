import { template as _$template } from "r-dom";
import { getNextElement as _$getNextElement } from "r-dom";

const _tmpl$ = _$template(
  `<div id="main"><button>Click Bound</button><button>Click Delegated</button><button>Click Listener</button></div>`
);

const template = _$getNextElement(_tmpl$, true);
