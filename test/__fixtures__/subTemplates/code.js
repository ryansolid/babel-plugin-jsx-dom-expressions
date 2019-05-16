const Child = props => (
  <>
    <div forwardRef={props.ref}>Hello {props.name}</div>
    <div>{props.children}</div>
  </>
);

const someProps = {some: 'stuff', more: 'things'}

const template = props => {
  let childRef;
  return (
    <div>
      <Child name='John' {...props} ref={childRef}>
        <div>From Parent</div>
      </Child>
      <Child name='Jason' {...(props)} forwardRef={props.ref}>
        {/* Comment Node */}
        <div>{state.content}</div>
      </Child>
      <Context.Consumer>{ context =>
        context
      }</Context.Consumer>
    </div>
  );
}

const template2 = (
  <Child name='Jake' dynamic={( state.data )} handleClick={ clickHandler } />
)

const template3 = (
  <Child>
    <div />
    <div />
    <div />
  </Child>
)

const template4 = (
  <Child>{() =>
    <div />
  }</Child>
)