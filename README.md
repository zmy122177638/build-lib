# 手把手教你如何 rollup 打包 ts 工具库

## 新建项目及工具库结构

```cmd
  mkdir -p build-lib build-lib/packages/utils/modules
```

## 初始化 npm，创建工具库文件

- [node.js](https://nodejs.org/zh-cn/)
- [npm](https://www.npmjs.cn/)

进入 build-lib 项目根目录 `cd build-lib`

初始化 package.json 文件 `npm init -y`

utils/modules 文件下创建 `format.ts`

```javascript
/** 时间格式化 */
export function formatDate(date: any, format: string = 'YYYY-MM-DD HH:mm:ss') {
  if (!(date instanceof Date)) {
    date = new Date(date)
    if (isNaN(date)) {
      console.error('时间格式错误')
      return ''
    }
  }

  var z = {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  }
  return format.replace(/(Y+|M+|D+|H+|m+|s+)/g, (v: string) => {
    return String((v.length > 1 ? '0' : '') + (z as any)[v.slice(-1)]).slice(-(v.length > 2 ? v.length : 2))
  })
}

/** 金钱格式化 */
export function formatNumber(value: number | string, precision = 2, seperator: string = '') {
  if (!value) return 0
  const numStr = typeof value === 'string' ? value.replace(/,/g, '') : `${value || ''}`
  const arr = numStr.split('.')
  let strInt = arr[0]
  let strFractional = arr[1] || ''
  if (seperator) {
    strInt = strInt.replace(/\d{1,3}(?=(\d{3})+$)/g, `$&${seperator}`)
  }
  precision = Math.max(0, precision)
  if (strFractional.length > precision) {
    strFractional = strFractional.substr(0, precision)
  }
  if (strFractional.length > 0) {
    strFractional = strFractional.replace(/0+$/, '')
  }
  if (strFractional.length > 0) {
    return `${strInt}.${strFractional}`
  }
  return strInt
}
```

在 utils 文件下创建`index.ts`

```js
/** 导出模块所有方法 */
// export * from "./modules/format"
/** 指定导出方法 */
export { formatDate, formatNumber } from './modules/format'

import { formatDate } from './modules/format'

export function testBuildTarget() {
  const testconstOfVar = 'YYYY-MM-DD'
  return () => formatDate(new Date(), testconstOfVar)
}
```

## 安装 rollup 及配置 rollup.config.js

- [rollup](https://www.rollupjs.com/guide/introduction/#%E6%A6%82%E8%BF%B0overview)
- [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)

安装 `npm i -D rollup rollup-plugin-node-resolve`

根目录下创建`rollup.config.js`

```javascript
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
export default {
  // 入口
  input: 'packages/utils/index.ts',
  output: {
    // 打包后文件
    file: 'dist/utils.js',
    // 编译格式 commonjs umd amd
    format: 'umd',
    name: '@anles/utils',
  },
  plugins: [resolve()],
}
```

安装配置完成之后，我们就可以打包了, 修改`package.json`

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build:utils": "rollup -c",
  "start": "rollup -w -c"
}
```

> 运行`npm run build:utils`,

> 我们遇到了错误,原来 rollup 并不支持直接打包 ts 文件的，我们需要一个插件[rollup-plugin-typescript2](https://www.npmjs.com/package/rollup-plugin-typescript2)

## 支持 Typescript

- [rollup-plugin-typescript2](https://www.npmjs.com/package/rollup-plugin-typescript2)

安装 `npm i -D typescript rollup-plugin-typescript2`

在`rollup.config.js`文件中添加插件

```javascript
import typescript from "rollup-plugin-typescript2";
// 在plugins中添加typescript插件以便支持ts打包js
{
  plugins: [
    typescript()
  ],
}
```

支持 ts 了，我们需要配置 ts 的一些规则，记得我们安装了 typescript 包，这个时候就要用到它了，运行`npx tsc --init`,会自动创建[tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)文件，npx 是运行 node_modules 内置包的命令，tsc 是 typescript 的命令.

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "esnext",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "esnext",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    "declarationDir": "lib/types",
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                     /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  },
  "include": [
    "packages/**/*.ts",
    "packages/**/*.js",
    "rollup.config.js",
    ".eslintrc.js",
    "lib/**.js",
    "lib/**.ts",
  ],
  "exclude": [
    "node_modules"
  ]
}
```

这个时候我们再运行`npm run build:utils`，打包成功了，惊喜吧。打开构建的源码，发现语法并没有转译为我们想要的 es5 的版本，毕竟像箭头函数，reset 参数、扩展符在兼容上面并不是很友好，随着发展，这些东西以后可能并不需要转，但是对于现在来说，它是必须的。那提到语法转换，自然是少不了我们的[Babel](https://babeljs.io/)兄弟，下面就让我们来配置它。

## Babel

[Babel](https://babeljs.io/) 是一个工具链，主要用于在当前和较旧的浏览器或环境中将 ECMAScript 2015+代码转换为 JavaScript 的向后兼容版本

- 转换语法
- 目标环境中缺少的 Polyfill 功能（通过@ babel / polyfill）
- 源代码转换（codemods）

了解了 babel，接下我们就要开始为`build-lib`来使用它。

- 安装`npm i -D rollup-plugin-babel @babel/core @babel/preset-env`
- 由于我们需要支持 Typescript, 我们还需要安装`npm i -D @babel/preset-typescript`

新建`.babelrc.json`

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-typescript"]
}
```

在`rollup.config.js`文件中添加插件

```javascript
import babel from "rollup-plugin-babel";
// 在plugins中添加typescript插件以便支持ts打包js
{
  plugins: [
    babel({
      // 过滤文件
      exclude: "node_modules/**",
    })
  ],
}
```

新建 `.browserslistrc`文件，根据浏览器以及系统版本来自动适配 Babel 的 polyfill，用来语法兼容。

```
ie >= 11
Firefox >= 3.5
chrome  >= 35
opera >= 11.5
```

大功告成，这个时候我们就可以再次打包，然后检查语法是否能根据`.browserslistrc`文件自动适配。

> 然而发现了问题，设置了却无法自动适配, 原来我们在设置了`@babel/preset-typescript`插件后 babel 会以`tsconfig.json`的配置为准,但是打包的编译格式决定权却在于`rollup.config.js`内的**format**字段，所以得出以下方案

> 在 javascript 文件打包时
>
> - 根据`rollup.config.js`内的**output.format**字段去更改编译格式
> - 根据`.browserslistrc`内的版本判断去更改语法版本

> 在 typescript 文件打包时
>
> - 根据`rollup.config.js`内的**output.format**字段去更改编译格式
> - 根据`tsconfig.json`内的**target**字段去更改语法版本

## Eslint、prettier

支持代码的类型校验、语法校验，以及代码格式化

- [eslint](https://eslint.org)
- [prettier](https://prettier.io/docs/en/index.html)

1. 安装依赖

```cmd
# 安装 eslint 套件
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 安装 prettier 套件
npm i -D prettier eslint-config-prettier eslint-plugin-prettier
```

2. 新建`eslintrc.js`

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
```

3. 新建`.prettierrc`

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "endOfLine": "auto",
  "quoteProps": "as-needed",
  "trailingComma": "all"
}
```

4. vscode 安装`prettier`、`eslint`,配置保存自动格式化
   1. 在 vscode 的 setting.json 文件中添加
   ```json
   "editor.formatOnSave": true, //　每次保存自动格式化
   ```
   2. vscode 中设置 prettier 是无效的，所以我们可以在电脑的根目录下(`.ssh同级目录`)设置全局`.prettierrc`配置文件, 当项目根目录没有此类文件时，会自动使用全局配置的文件

## husky、lint-staged

- [husky](https://www.npmjs.com/package/husky)  可以防止使用 Git hooks 的一些不好的 commit 或者 push
- [lint-staged](https://www.npmjs.com/package/lint-staged) 是一个在 git 暂存文件上运行命令的工具。

安装 `npm i -D husky lint-staged`

修改`package.json`

```json
"scripts": {
  "lint": "eslint packages --ext .ts,.js"
},
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.{ts,js}": [
    "eslint --fix",
    "git add"
  ]
}
```
## 压缩、配置scripts
- [rimraf](https://www.npmjs.com/package/rimraf) 文件删除工具，用于每次编译前清空 lib 目录
- [npm-run-all](https://www.npmjs.com/package/npm-run-all) npm 命令并行执行工具
- [rollup-plugin-uglify](https://www.npmjs.com/package/rollup-plugin-uglify) uglify js 压缩工具（rollup 版）
- [lodash.merge](https://www.npmjs.com/package/lodash.merge) 配置合并工具
1. 安装依赖
```cmd
npm i -D rimraf npm-run-all rollup-plugin-uglify lodash.merge
```
2. 修改`rollup.config.js`
```js
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
      name: '@anles/utils',
    },
    plugins: [
      resolve({
        extensions,
        modulesOnly: true,
      }),
      typescript({
        useTsconfigDeclarationDir: true,
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
      }),
    ],
  },
  mergeConfig,
)
```
3. `package.json`添加命令
```json
"main": "lib/index.umd.js",
"module": "lib/index.esm.js",
"module": "lib/types/index.d.js",
"scripts": {
  "lint": "eslint 'src/**/*.{js,ts}'",
  "dev": "rollup -w -c --environment NODE_ENV:esm",
  "build:esm": "rollup -c --environment NODE_ENV:esm",
  "build:umd": "rollup -c --environment NODE_ENV:umd",
  "build:min": "rollup -c --environment NODE_ENV:min",
  "build": "rimraf lib/* && run-p build:esm build:umd build:min"
},
```
运行`npm run build`会同时执行三个子编译任务，分别是：
- build:esm - 编译出符合 esm 规范的可执行文件，供 Vue、React 等采用 esmodule 规范进行模块化打包的项目使用
- build:umd - 编译出符合 umd 规范的可执行文件，供 jQuery、Vue、NodeJS 等项目使用
- build:min - 编译出符合 umd 规范的压缩的可执行文件

## 发布npm


## 参考文献

- [基于 TypeScript + Babel + Rollup 搭建 ts 开发环境](https://segmentfault.com/a/1190000021695864)
- [在 Typescript 项目中，如何优雅的使用 ESLint 和 Prettier](https://segmentfault.com/a/1190000019661168)
