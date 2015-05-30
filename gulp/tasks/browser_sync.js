/**
  Refresh browser when build directory is updated.
*/
'use strict';
var browserSync = require('browser-sync');

module.exports = function(gulp, plugins) {
   return function() {
       browserSync.init(['public/**'], {
           server: {
               baseDir: 'public'
           }
       });
   };
};
