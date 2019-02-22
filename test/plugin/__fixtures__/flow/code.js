const list = [
  {id: 1, text: 'Shop for Groceries', completed: true},
  {id: 2, text: 'Go to Work', completed: false}
];

let editingId = 1;

const template = (
  <$ each={list} afterRender={selectWhen(() => editingId, 'editing')}>{ item =>
    <>
      <div>{( item.text )}</div>
      <div>
        <$ when={item.completed}>
          <div>Hurray!</div>
        </$>
      </div>
      <$ when={editingId === item.id}>
        <span>Editting:</span>
        <input type='text' />
      </$>
    </>
  }</$>
)