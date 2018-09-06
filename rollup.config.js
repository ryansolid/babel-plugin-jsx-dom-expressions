import nodeResolve from 'rollup-plugin-node-resolve';

const plugins = [nodeResolve()]

export default [{
  input: 'src/index.js',
  external: [
    '@babel/plugin-syntax-jsx'
  ],
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    exports: 'named'
  },
  plugins,
}, {
  input: 'src/createRuntime/index.js',
  output: {
    file: 'dist/createRuntime.js',
    format: 'es'
  },
  plugins
}]