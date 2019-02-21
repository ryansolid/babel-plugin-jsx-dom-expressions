const list = [
  {text: 'Shop for Groceries', completed: true},
  {text: 'Go to Work', completed: false}
];

const template = (
  <$ each={list}>{ item =>
    <>
      <div>{( item.text )}</div>
      <$ when={item.completed}>
        <div>Hurray!</div>
      </$>
    </>
  }</$>
)