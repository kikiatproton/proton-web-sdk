import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const version = '1.0.0';
export default {
  input: 'src/main.js',
  output: {
    file:
      process.env.NODE_ENV === 'prod'
        ? `dist/proton-web-sdk-${version}.js`
        : `dist/proton-web-sdk-dev.js`,
    format: 'iife',
  },
  plugins: [
    peerDepsExternal(),
    json(),
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
    }),
    resolve({ preferBuiltins: true, mainFields: ['browser'] }),
    babel({ babelHelpers: 'bundled' }),
    commonjs(),
    //terser(),
  ],
};
