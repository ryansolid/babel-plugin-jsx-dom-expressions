const Child = props => (
  <>
    <div>Hello {props.name}</div>
    <div>{props.children}</div>
  </>
);

const someProps = {some: 'stuff', more: 'things'}

const template = (
  <div>
    <Child name='John' {...someProps}>
      <div>From Parent</div>
    </Child>
  </div>
)