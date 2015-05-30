/*
  Optimize images from client and output into build.
*/

var changed    = require('gulp-changed');
var gulp       = require('gulp');
var imagemin   = require('gulp-imagemin');
var handleErrors = require('../util/handleErrors');

gulp.task('copy-images', function() {
  var dest = './build/images';

  return gulp.src('./client/images/**')
    .pipe(changed(dest)) // Ignore unchanged files
    .pipe(imagemin()) // Optimize
    .on('error', handleErrors)
    .pipe(gulp.dest(dest));
});
