/**
 * Compile less/css and output into build.
 */

var gulp = require('gulp');
var changed = require('gulp-changed');
var less = require('gulp-less')
var handleErrors = require('../util/handleErrors');
var prefix = require('gulp-autoprefixer');

gulp.task('copy-less', function(){
  var dest = './build';

  return gulp.src('client/less/app.less')
    .pipe(changed(dest)) // Ignore unchanged files
    .pipe(less())
    // Add vendor prefixes
    .pipe(prefix())
    .on('error', handleErrors)
    .pipe(gulp.dest(dest));
});
