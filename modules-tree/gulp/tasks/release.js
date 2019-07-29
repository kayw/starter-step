'use strict';
var handleErrors = require('../util/handleErrors');

module.exports = function(gulp, plugins) {
    return function() {
        gulp.src(['public/*.js'])
            .pipe(plugins.uglify())
            .on('error', handleErrors)
            .pipe(plugins.rename({suffix: '.min'}))
            .pipe(gulp.dest('public'));
         gulp.src(['public/*.css'])
            .pipe(plugins.minifyCss())
            .on('error', handleErrors)
            .pipe(plugins.rename({suffix: '.min'}))
            .pipe(gulp.dest('public'));
    };
};
