/*
  Move HTML files out of client and into build.
*/

var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');

gulp.task('copy-html', function() {
  var dest = './build';

  return gulp.src('client/index.html')
    .on('error', handleErrors)
    .pipe(gulp.dest(dest));
});

