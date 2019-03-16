const list = [
  {id: 1, text: 'Shop for Groceries', completed: true},
  {id: 2, text: 'Go to Work', completed: false}
];

const state = { loading: true };

let editingId = 1;

const template = (
  <$ each={list} afterRender={selectWhen(() => editingId, 'editing')}>{ item =>
    <>
      <div>{( item.text )}</div>
      <div>
        <$ when={item.completed} fallback={<div>Do it!</div>}>
          <div>Hurray!</div>
        </$>
      </div>
      <$ when={editingId === item.id}>
        <span>Editing:</span>
        <input type='text' />
      </$>
    </>
  }</$>
);

const template2 = (
  <$ suspend={state.loading} fallback={<div>Loading...</div>}>
    <div>{state.asyncContent}</div>
  </$>
);