const template = (
  <div id="main">
    <button onclick={() => console.log('bound')}>
      Click Bound
    </button>
    <button onClick={() => console.log('delegated')}>
      Click Delegated
    </button>
    <button events={{click: () => console.log('listener'), "CAPS-ev": () => console.log('custom')}}>
      Click Listener
    </button>
  </div>
);