const _tmpl$9 = document.createElement("template");

_tmpl$9.innerHTML = "<span>Hello John</span>";

const _tmpl$8 = document.createElement("template");

_tmpl$8.innerHTML = "<span>Hello</span>";

const _tmpl$7 = document.createElement("template");

_tmpl$7.innerHTML = "<span> <!--15--> <!--17--> </span>";

const _tmpl$6 = document.createElement("template");

_tmpl$6.innerHTML = "<span><!--10--> <!--12--></span>";

const _tmpl$5 = document.createElement("template");

_tmpl$5.innerHTML = "<span><!--8--> John</span>";

const _tmpl$4 = document.createElement("template");

_tmpl$4.innerHTML = "<span>Hello <!--6--></span>";

const _tmpl$3 = document.createElement("template");

_tmpl$3.innerHTML = "<span>Hello John</span>";

const _tmpl$2 = document.createElement("template");

_tmpl$2.innerHTML = "<span> John</span>";

const _tmpl$ = document.createElement("template");

_tmpl$.innerHTML = "<span>Hello </span>";
const name = 'Jake',
      greeting = 'Welcome';

const trailing = _tmpl$.content.firstChild.cloneNode(true);

const leading = _tmpl$2.content.firstChild.cloneNode(true);

const extraSpaces = _tmpl$3.content.firstChild.cloneNode(true);

const trailingExpr = function () {
  const _el$4 = _tmpl$4.content.firstChild.cloneNode(true),
        _el$5 = _el$4.firstChild,
        _el$6 = _el$5.nextSibling;

  r.insert(_el$4, name, null, _el$6);
  return _el$4;
}();

const leadingExpr = function () {
  const _el$7 = _tmpl$5.content.firstChild.cloneNode(true),
        _el$8 = _el$7.firstChild;

  r.insert(_el$7, greeting, null, _el$8);
  return _el$7;
}();

const multiExpr = function () {
  const _el$9 = _tmpl$6.content.firstChild.cloneNode(true),
        _el$10 = _el$9.firstChild,
        _el$11 = _el$10.nextSibling,
        _el$12 = _el$11.nextSibling;

  r.insert(_el$9, greeting, null, _el$10);
  r.insert(_el$9, name, null, _el$12);
  return _el$9;
}();

const multiExprSpaced = function () {
  const _el$13 = _tmpl$7.content.firstChild.cloneNode(true),
        _el$14 = _el$13.firstChild,
        _el$15 = _el$14.nextSibling,
        _el$16 = _el$15.nextSibling,
        _el$17 = _el$16.nextSibling;

  r.insert(_el$13, greeting, null, _el$15);
  r.insert(_el$13, name, null, _el$17);
  return _el$13;
}();

const multiLine = _tmpl$8.content.firstChild.cloneNode(true);

const multiLineTrailingSpace = _tmpl$9.content.firstChild.cloneNode(true);