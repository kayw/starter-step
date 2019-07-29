'use strict';

var handleErrors = require('../util/handleErrors');

module.exports = function(gulp, plugins) {
    return function () {
        var dest = './public';
        return gulp.src('./styles/app.scss')
        .pipe(plugins.changed(dest)) // Ignore unchanged files
        .pipe(plugins.sass({
            outputStyle: plugins.util.env.production ? 'compressed' : 'expanded'//,
            //includePaths: ['./src/scss'].concat(bourbon)
        }))
        .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gulp.dest(dest))
        .on('error', handleErrors)
        .pipe(plugins.notify({message: 'Style task completed'}));
    };
};
