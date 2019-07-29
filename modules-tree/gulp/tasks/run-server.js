/*
  Watch for changes in the mock API server and reload the node server.
*/

var handleErrors = require('../util/handleErrors');
var gulp = require('gulp'),
  //nodemon = require('gulp-nodemon');
  shell = require('gulp-shell');

gulp.task('run-server', function() {

  return gulp.src('')
    .pipe(shell([
      'node ./build/server/app.js'
    ]))
    .on('error', handleErrors);
});
