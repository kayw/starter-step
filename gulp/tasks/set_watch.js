'use strict';
module.exports = function(gulp, plugins) {
    return function() {
        global.isWatching = true;
    };
};
