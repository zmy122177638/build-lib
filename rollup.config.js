import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'
import merge from 'lodash.merge'
import path from 'path'
import pkg from './package.json'

const extensions = ['.js', '.ts']
const pathResolve = function (...args) {
  return path.resolve(__dirname, ...args)
}
// 打包任务的个性化配置
const jobs = {
  esm: {
    output: {
      format: 'esm',
      file: pathResolve(pkg.module),
    },
  },
  umd: {
    output: {
      format: 'umd',
      file: pathResolve(pkg.main),
    },
  },
  min: {
    output: {
      format: 'umd',
      file: pathResolve(pkg.main.replace(/(.\w+)$/, '.min$1')),
    },
    plugins: [uglify()],
  },
}

// 从环境变量获取打包特征
const mergeConfig = jobs[process.env.NODE_ENV || 'esm']

export default merge(
  {
    input: 'packages/utils/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'umd',
      name: 'mocc-utils',
    },
    plugins: [
      resolve({
        extensions,
        modulesOnly: true,
      }),
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfig: './tsconfig.json',
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
      }),
    ],
  },
  mergeConfig,
)
