/**
  Run clean build directory.
*/

'use strict';
var del = require('del');

module.exports = function(gulp, plugins) {
    return function () {
        del([
            'public/*'
        ]);
    };
};
