/**
 * Copy mock API files to build directory.
 */

var gulp = require('gulp');
var changed = require('gulp-changed');
var handleErrors = require('../util/handleErrors');

gulp.task('copy-server', function(){
  var dest = './build/server/';

  return gulp.src('./server/**/*')
    .pipe(changed(dest)) // Ignore unchanged files
    .on('error', handleErrors)
    .pipe(gulp.dest(dest));
});
