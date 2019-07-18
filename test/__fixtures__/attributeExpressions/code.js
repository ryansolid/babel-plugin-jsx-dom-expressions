const welcoming = 'Welcome';
const selected = true;
const color = 'red';
const props = {some: 'stuff', no: 'thing'}

let link;

const template = (
  <div id="main" classList={{ selected: selected }} style={{ color }}>
    <h1
      {...(props)}
      {...results}
      title={( welcoming )}
      style={({ backgroundColor: color })}
      classList={({ selected: selected })}
    >
      <a href={'/'} ref={link}>Welcome</a>
    </h1>
  </div>
);
