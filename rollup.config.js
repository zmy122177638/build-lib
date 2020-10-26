import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
export default {
  input: 'packages/utils/index.ts',
  output: {
    file: 'lib/utils.js',
    format: 'umd',
    name: '@anles/utils',
  },
  plugins: [
    resolve(),
    typescript(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}
