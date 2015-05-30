/**
 * Copy less/css and output into build.
 */

var gulp = require('gulp');
var changed = require('gulp-changed');
var handleErrors = require('../util/handleErrors');

gulp.task('copy-bower-files', function(){
  var dest = './build/bower_components';

  var files = [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/font-awesome/css/font-awesome.css'
  ];

  return gulp.src(files)
      .pipe(changed(dest)) // Ignore unchanged files
      .on('error', handleErrors)
      .pipe(gulp.dest(dest));
});
