module.exports = {
  inputSourceMap: true,
  sourceMap: true,
  ignore: ['node_modules'],
  presets: [
    [
      '@babel/env',
      {
        debug: false,
        loose: true,
        modules: false,
        targets: {
          browsers: '> 1%, not dead',
          node: process.versions.node,
        },
        corejs: 3,
        useBuiltIns: 'usage',
      },
    ],
    ['@babel/preset-typescript', { jsxPragma: 'h' }],
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'h',
        pragmaFrag: 'Fragment',
      },
    ],
  ],
};
