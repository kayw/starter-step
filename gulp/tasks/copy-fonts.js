/**
 * Copy fonts output into build.
 */

var gulp = require('gulp');
var changed = require('gulp-changed');
var handleErrors = require('../util/handleErrors');

module.exports = function(gulp, plugins) {
    return function() {
        var dest = './public/fonts';

        var files = [
            'bower_components/octicons/octicons/octicons.{svg,woff,ttf,eot}'//no space after , !!!
        ];

        return gulp.src(files)
        // Ignore unchanged files
        .pipe(changed(dest))
        .on('error', handleErrors)
        .pipe(gulp.dest(dest));
    };
};
