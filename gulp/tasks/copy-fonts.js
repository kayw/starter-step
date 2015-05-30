/*
  Move fonts from client and output into build.
*/

var changed    = require('gulp-changed');
var gulp       = require('gulp');
var handleErrors = require('../util/handleErrors');

gulp.task('copy-fonts', function() {
  var dest = './build/fonts';

  return gulp.src('./client/fonts/**')
    .pipe(changed(dest)) // Ignore unchanged files
    .on('error', handleErrors)
    .pipe(gulp.dest(dest));
});
