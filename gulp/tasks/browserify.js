/** browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

'use strict';
var browserify   = require('browserify');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');


module.exports = function(gulp, plugins) {
   return function() {
       var dest = './public';

       var bundler = browserify({
           // Required watchify args
           cache: {}, packageCache: {}, fullPaths: true,
           // Specify the entry point of your app
           entries: ['./views/mtree_app.jsx'],
           standalone: 'MTreeApp',
           // Add file extentions to make optional in your requires
           extensions: ['.jsx'],
           // Enable source maps.
           debug: true
       });

       var bundle = function() {
           // Log when bundling starts
           bundleLogger.start();

           return bundler
           .bundle()
           // Report compile errors
           .on('error', handleErrors)
           // Use vinyl-source-stream to make the
           // stream gulp compatible. Specifiy the
           // desired output filename here.
           .pipe(source('bundle.js'))
           // Specify the output destination
           .pipe(gulp.dest(dest))
           // Log when bundling completes!
           .on('end', bundleLogger.end);
       };

       if(global.isWatching) {
           bundler = watchify(bundler);
           // Rebundle with watchify on changes.
           bundler.on('update', bundle);
       }

       return bundle();
   };
};
