const welcoming = 'Welcome';
const selected = true;
const color = 'red';
const props = {some: 'stuff', no: 'thing'}
const binding = (el, accessor) => el.custom = accessor();

let link;

const template = (
  <div id="main" classList={({ selected: selected })} $custom={binding}>
    <h1
      {...props}
      title={( welcoming )}
      style={({ backgroundColor: color })}
    >
      <a href={'/'} ref={link}>Welcome</a>
    </h1>
  </div>
);
