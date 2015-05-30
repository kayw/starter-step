'use strict';
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

function getTask(task) {
    return require('./tasks/' + task)(gulp, plugins);
}
gulp.task('setWatch', getTask('set_watch'));
gulp.task('browserify', getTask('browserify'));
gulp.task('style', getTask('style'));
gulp.task('build', [
  'browserify',
  //'copy-bower-files',
  //'copy-fontawesome-fonts',
  //'copy-bootstrap-fonts',
  //'copy-html',
  //'copy-images',
  'style'
]);
gulp.task('browserSync', ['build'], getTask('browser_sync'));
gulp.task('watch', ['setWatch', 'browserSync'], getTask('watch'));
gulp.task('jshint', getTask('jshint'));
gulp.task('csslint', getTask('csslint'));
gulp.task('lint', ['jshint', 'csslint']);
gulp.task('release', ['build'], getTask('release'));
gulp.task('default', ['watch']);
gulp.task('clean', getTask('clean'));
