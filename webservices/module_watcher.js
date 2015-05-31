'use strict';
var chokidr = require('chokidar');
var path = require('path');
var fs = require('fs');
var g = require('../utils/globals.js');
var conf = require('../config');

var watcherActor = require('../actions/watch_action.js');

module.exports = function(wsio) {
    var servedDir = g.ModulesDir();
        
    var watcher = chokidr.watch(servedDir, {
        ignored: conf['ignored-watch-directory'],
        persistent: true
    });

    watcher.on('add', handlePathAdd)
        .on('addDir', handlePathAdd)
        .on('change', handlePathModify)
        .on('unlink', handlePathRemove)
        .on('unlinkDir', handlePathRemove)
        .on('error', function(error) { 
            console.log('error happend in module watcher', error); 
        });

    function handlePathAdd(p) {
        var type = fs.statSync(p).isDirectory() ? 'folder' : 'file';
        handlePathEvent(p, 'add', type);
    }
   
    function handlePathModify(p) {
        handlePathEvent(p, 'modified');
    }
   
    function handlePathRemove(p) {
        handlePathEvent(p, 'remove');
    }

    function handlePathEvent(p, eventType, fsType) {
        var f = path.basename(p);
        var relPath = path.relative(servedDir, p);
        var parentRelPath = path.dirname(relPath); 
        if (parentRelPath == '.') {
            parentRelPath = '';
        }
        watcherActor.notifyClientChanges(wsio, eventType, {
            name: f,
            type: fsType,
            path: relPath,
            parentPath: parentRelPath
        });
    }
    //watcher.close();
};
