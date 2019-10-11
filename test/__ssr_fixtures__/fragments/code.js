const inserted = 'middle';

const Component = () => <span />

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

const firstStatic = (
  <>{inserted}<div/></>
);

const firstDynamic = (
  <>{(inserted)}<div/></>
);

const firstComponent = (
  <><Component /><div/></>
);

const lastStatic = (
  <><div/>{inserted}</>
);

const lastDynamic = (
  <><div/>{(inserted)}</>
);

const lastComponent = (
  <><div/><Component /></>
);