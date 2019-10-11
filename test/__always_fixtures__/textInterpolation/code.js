const name = 'Jake',
  greeting = 'Welcome';

const trailing = <span>Hello </span>;
const leading = <span> John</span>;
const extraSpaces = <span>Hello   John</span>;

const trailingExpr = <span>Hello {name}</span>;
const leadingExpr = <span>{greeting} John</span>;

const multiExpr = <span>{greeting} {name}</span>;
const multiExprSpaced = <span> {greeting} {name} </span>;

const multiLine = <span>

  Hello

</span>

const multiLineTrailingSpace = <span>
  Hello 
  John
</span>

const escape = <span>
  &nbsp;&lt;Hi&gt;&nbsp;
</span>