/*
  Watch for changes in the sass, images, and html directories and run respective task.
  The browserify task already watches for changes in the client code.
  NOTE: The browserify gulp task already handles js recompiling with watchify
  so we don't need to watch it here.
*/
'use strict';

module.exports = function(gulp, plugins){
   return function() {
       gulp.watch('styles/**', ['style']);
       gulp.watch('client/fonts/**', ['copy-fonts']);
       gulp.watch('client/images/**', ['copy-images']);
       gulp.watch('server/**/*', ['copy-server']);
   };
};
