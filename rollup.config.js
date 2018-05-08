import coffee2 from 'rollup-plugin-coffee2';
import nodeResolve from 'rollup-plugin-node-resolve';

const plugins = [
  coffee2(),
  nodeResolve({ extensions: ['.js', '.coffee'] })
]

export default [{
  input: 'src/index.coffee',
  external: [
    '@babel/plugin-syntax-jsx'
  ],
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  plugins,
}, {
  input: 'src/createRuntime/index.coffee',
  output: [{
    file: 'lib/createRuntime.js',
    format: 'cjs'
  }, {
    file: 'dist/createRuntime.js',
    format: 'es'
  }],
  plugins
}]