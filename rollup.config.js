import nodeResolve from 'rollup-plugin-node-resolve';

const plugins = [nodeResolve()]

export default {
  input: 'src/index.js',
  external: [
    '@babel/plugin-syntax-jsx'
  ],
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  plugins,
}