'use strict';
var handleErrors = require('../util/handleErrors');

module.exports = function(gulp, plugins) {
    return function () {
        return gulp.src(['./public/*.css'])
        .pipe(plugins.csslint('./.csslintrc'))
        .on('error', handleErrors)
        .pipe(plugins.csslint.reporter());
    };
};
