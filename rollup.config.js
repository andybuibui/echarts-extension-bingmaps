import path from 'node:path';
import chalk from 'chalk';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import { name, version, author } from './package.json';
import fs from 'node:fs';

const resolve = (p) => path.resolve(__dirname, p);
function getLicense() {
  const license = fs.readFileSync(path.resolve(__dirname, './LICENSE'), { encoding: 'utf-8' });
  const content = `${name} \n@version ${version}\n@author ${author}\n\n${license}`;
  return `/*!\n * ${content.replace(/\*\//g, '* /').split('\n').join('\n * ')}\n */`;
}

const outputConfigs = {
  esm: {
    file: resolve(`dist/${name}.esm.js`),
    format: 'es',
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs',
  },
  umd: {
    file: resolve(`dist/${name}.js`),
    format: 'umd',
  },
  mumd: {
    file: resolve(`dist/${name}.min.js`),
    format: 'umd',
  },
};

console.log(chalk.bgCyan(`🚩 Building ${version} ... `));

const packageConfigs = Object.keys(outputConfigs).reduce(
  (prev, format) => {
    const output = {
      ...outputConfigs[format],
      externalLiveBindings: false,
      interop: 'esModule',
      globals: {
        echarts: 'echarts',
      },
      validate: true,
      banner: getLicense(),
    };
    const plugins = [
      json(),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
      }),
    ];
    if (output.format === 'umd') {
      output.name = 'echarts.bingmap';
      output.sourcemap = true;
    }
    if (format === 'mumd') {
      plugins.push(
        terser({
          module: /^esm/.test(format),
          compress: {
            ecma: 2015,
            pure_getters: true,
            pure_funcs: ['console.log'],
          },
          safari10: true,
          ie8: false,
        }),
      );
    }

    return prev.concat({
      input: resolve('index.js'),
      external: ['echarts'],
      plugins: [...plugins],
      output,
      treeshake: {
        moduleSideEffects: false,
      },
    });
  },
  [],
);
export default packageConfigs;
