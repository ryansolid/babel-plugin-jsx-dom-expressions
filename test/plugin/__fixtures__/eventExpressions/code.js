const template = (
  <div id="main">
    <button onclick={() => console.log('native')}>
      Click Native
    </button>
    <button onClick={() => console.log('delegated')}>
      Click Delegated
    </button>
  </div>
);