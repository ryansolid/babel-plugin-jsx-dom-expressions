import nodeResolve from 'rollup-plugin-node-resolve';

const plugins = [nodeResolve()]

export default [{
  input: 'src/index.js',
  external: [
    '@babel/plugin-syntax-jsx'
  ],
  output: {
    file: 'lib/plugin.js',
    format: 'cjs'
  },
  plugins,
}, {
  input: 'src/runtime/index.js',
  output: [{
    file: 'lib/runtime.js',
    format: 'cjs',
    exports: 'named'
  }, {
    file: 'dist/runtime.js',
    format: 'es'
  }],
  plugins
}]