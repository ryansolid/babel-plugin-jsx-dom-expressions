const template1 = <div>{simple}</div>;

const template2 = <div>{state.dynamic}</div>;

const template3 = <div>{simple ? good : bad}</div>;

const template4 = <div>{state.dynamic ? good : bad}</div>;

const template5 = <div>{state.dynamic && good}</div>;

const template6 = (
  <div>{state.count > 5 ? (state.dynamic ? best : good) : bad}</div>
);

const template7 = <div>{state.dynamic && state.something && good}</div>;

const template8 = <div>{(state.dynamic && good) || bad}</div>;

const template9 = <Comp render={state.dynamic ? good : bad} />;

const template10 = <Comp render={state.dynamic && good} />;
