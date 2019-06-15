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
          Hurray!
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
    <$ suspend fallback={<div>Loading...</div>}>
      <AsyncChild />
    </$>
  </$>
);

const template3 = (
  <$ portal useShadow={true}>
    <style>{'.isolated { color: red; }'}</style>
    <div class='isolated'>In a Portal</div>
  </$>
);

const template4 = (
  <$ provide={ThemeContext} value={'dark'}>
    <Child />
  </$>
)

const template5 = (
  <$ switch fallback={<div>Route not Found</div>}>
    <$ when={state.route === 'home'}><Home /></$>
    <$ when={state.route === 'profile'}><Profile /></$>
    <$ when={state.route === 'settings'} afterRender={node => node && node.focus()}><Settings /></$>
  </$>
)

const StaticChild = () => <div />
const template6 = (
  <div>
    <StaticChild />
    <$ when={condition}><p>Content</p></$>
  </div>
)

const template7 = (
  <div>
    <$ when={condition1}><p>Content1</p></$>
    <$ when={condition2}><p>Content2</p></$>
  </div>
)