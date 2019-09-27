const template = (
  <svg width="400" height="180">
    <rect
      x="50"
      y="20"
      rx="20"
      ry="20"
      width="150"
      height="150"
      style="fill:red;stroke:black;stroke-width:5;opacity:0.5"
    />
  </svg>
);

const template2 = (
  <svg width="400" height="180">
    <rect
      x={( state.x )}
      y={( state.y )}
      rx="20"
      ry="20"
      width="150"
      height="150"
      style={({
        fill: 'red',
        stroke: 'black',
        'stroke-width': 5,
        opacity: 0.5
      })}
    />
  </svg>
);

const template3 = (
  <svg width="400" height="180">
    <rect
      {...props}
    />
  </svg>
);