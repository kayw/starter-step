'use strict';
var rename = require('rename'),
    handleErrors = require('../util/handleErrors');

module.exports = function(gulp, plugins) {
    return function() {
        gulp.src(['public/*.js'])
            .pipe(plugins.uglify())//options todo
            .on('error', handleErrors)
            .pipe(rename({suffix: '.min'}))
            .on('error', handleErrors)
            .pipe(gulp.dest('public'));
         gulp.src(['public/*.css'])
            .pipe(plugins.minifyCss())
            .on('error', handleErrors)
            .pipe(rename({suffix: '.min'}))
            .on('error', handleErrors)
            .pipe(gulp.dest('public'));
    };
};
