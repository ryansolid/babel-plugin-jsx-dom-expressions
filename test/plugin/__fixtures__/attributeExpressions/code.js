const welcoming = 'Welcome';
const selected = true;
const color = 'red';

const template = (
  <div id="main" classList={({selected: selected})}>
    <h1
      title={( welcoming )}
      style={({backgroundColor: color})}
    >
      Welcome
    </h1>
  </div>
);
