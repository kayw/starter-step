// https://github.com/gajus/react-css-modules/issues/66
require('babel-polyfill');
// for use with karma-webpack-with-fast-source-maps
const __karmaWebpackManifest__ = []; // eslint-disable-line
function inManifest(path) {
 return ~__karmaWebpackManifest__.indexOf(path);
}

// require all `__tests__/*-spec.js`
const testsContext = require.context('../', true, /__tests__\/.*-spec\.js$/)

// only run tests that have changed after the first pass.
const runnable = testsContext.keys().filter(inManifest)
;(runnable.length ? runnable : testsContext.keys()).forEach(testsContext)
