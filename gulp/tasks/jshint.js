'use strict';
var handleErrors = require('../util/handleErrors');
var jshintStylish = require('jshint-stylish');

module.exports = function(gulp, plugins) {
    return function () {
        //return gulp.src(['**/*.js', '**/*.jsx', '!/node_modules{,/**}', '!/bower_componts{,/**}', 'server.js'])
        return gulp.src(['./**/mtree.js', '**/*.jsx', '!node_modules', '!node_modules/**', '!bower_componts', 'server.js'])
        .pipe(plugins.jshint('./.jshintrc'))
        .on('error', handleErrors)
        .pipe(plugins.jshint.reporter(jshintStylish));
    };
};
