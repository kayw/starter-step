'use strict';
var path = require('path');
var fs = require('fs');


module.exports = {
    ModulesDir: function() {
        return path.resolve(__dirname, '..');
    },

    onFileEnumerated: function(err, files, dir, fileNodes) {
        if (err) {
            console.log('exception in reading '+ dir + ' with err:', err);
            throw err;
        }
        var compareFiles = function(left, right) {
            var leftFull = path.resolve(dir, left);
            var rightFull = path.resolve(dir, right);
            var isLeftDir = fs.statSync(leftFull).isDirectory();// fixme replaced with async stat
            var isRightDir = fs.statSync(rightFull).isDirectory();
            if (isLeftDir && !isRightDir) {
                return -1;
            }
            if (!isLeftDir && isRightDir) {
                return 1;
            }
            return left.localeCompare(right);
        }.bind(this);
        files.sort(compareFiles).forEach(function(f) {
            try {
                var fullPath = path.resolve(dir, f);
                var s = fs.statSync(fullPath);
                var relPath = path.relative(this.ModulesDir(), fullPath);
                if (s.isDirectory()) {
                    fileNodes.push({
                        name: f,
                        type: 'folder',
                        path: relPath
                    });
                }
                else {
                    fileNodes.push({
                        name: f,
                        path: relPath,
                        type: 'file'
                    });
                }
            } catch(e) {
                console.log(e);
            }

        }.bind(this));
    }
};
