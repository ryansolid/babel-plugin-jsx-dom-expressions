const path = require('path')
const pluginTester = require('babel-plugin-tester');
const plugin = require('../../lib/plugin');

pluginTester({
  plugin,
  pluginOptions: {
    moduleName: 'r',
    delegateEvents: true
  },
  title: 'Convert JSX',
  fixtures: path.join(__dirname, '__fixtures__'),
  snapshot: true
});

