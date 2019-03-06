const inserted = 'middle';

const multiStatic = (
  <>
    <div>First</div>
    <div>Last</div>
  </>
);

const multiExpression = (
  <>
    <div>First</div>
    {inserted}
    <div>Last</div>
  </>
);

const singleExpression = (
  <>{inserted}</>
);

const singleDynamic = (
  <>{(inserted)}</>
);