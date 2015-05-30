'use strict';
var _ = require('lodash');

var appDispatcher = require('../dispatcher');
var mtreeConstants = require('../constants/mtree_const.js');

var EventEmitter = require('events').EventEmitter;
var ActionTypes = mtreeConstants.ActionTypes; 
var request = require('superagent');

var tree = {};

var treeStore = _.extend({}, EventEmitter.prototype, {
    getRootNode: function() {
        return tree.root_;
    },
    getData : function() { 
        return tree; 
    },
    setData : function(t) { 
        tree = t;
    },
    onNodeCreated : function(node) {
        var parentId = tree.getNodeIdByPath(node.parentPath);
        var exist = false;
        if (parentId >= 0) {
            tree.insert(node.name, parentId, node.type, node.path, true);
            exist = true;
        }
        return exist;
    },

    onNodeModified : function(node) {
        var updated = tree.update(node.name, node.type, node.path);
        return updated;
    },
    onNodeRemove : function(node) {
        var removed = tree.remove(node.path, node.parentPath);
        return removed;
    },
    onOpenFolder : function(folderId) {
        var folder = tree.getNodeById(folderId);
        folder.children_.forEach(function(elem) {
            elem.isVisible_ = true;
        });
        folder.isOpen_ = true;
    },
    onCloseFolder : function(folderId) {
        var folder = tree.getNodeById(folderId);
        folder.children_.forEach(function(elem) {
            elem.isVisible_ = false;
        });
        folder.isOpen_ = false;
    },
    onFolderChildrenLoaded : function(err, res) {
        if (res.ok) {
            var parentPath = res.body.parentPath;
            var parentId = tree.getNodeIdByPath(parentPath);
            var parent = tree.getNodeById(parentId);
            var children = res.body.children;
            parent.isLoading_ = false;
            parent.isOpen_ = true;
            children.forEach(function(elem) {
                tree.insert(elem.name, parentId, elem.type, elem.path);
            });
            treeStore.emitChange();
        }
        else {
            console.log('error happend in get folder:' + res.text);
        }
    },
    onFolderChildrenLoading : function(folderNode) {
        request.get('/folder/' + folderNode.relPath_).end(this.onFolderChildrenLoaded);
        folderNode.isLoading_ = true;
        folderNode.isOpen_ = false;
    },
    addListener : function(eventName, callback) {
        this.on(eventName, callback);
    },
    emitChange : function() {
        this.emit('change');
    }
});

appDispatcher.register(function(payload) {
    var needEmit = false;
    switch (payload.action.type) {
        //case 'SEND_EMERGE_MESSAGE':
        case ActionTypes.RECEIVE_CREATED_MESSAGE:
            needEmit = treeStore.onNodeCreated(payload.action.node);
            break;

        case ActionTypes.RECEIVE_REMOVE_MESSAGE:
            needEmit = treeStore.onNodeRemove(payload.action.node);
            break;

        case ActionTypes.RECEIVE_MODIFIED_MESSAGE:
            needEmit = treeStore.onNodeModified(payload.action.node);
            break;

        case ActionTypes.OPEN_FOLDER:
            treeStore.onOpenFolder(payload.action.folderId);
            needEmit = true;
            break;

        case ActionTypes.CLOSE_FOLDER:
            treeStore.onCloseFolder(payload.action.folderId);
            needEmit = true;
            break;

        case ActionTypes.LOADING_FOLDER_CHILDREN:
            treeStore.onFolderChildrenLoading(payload.action.folderNode);
            needEmit = true;
            break;

        default:
            break;
    }
    if (needEmit) {
        treeStore.emitChange();
    }
});

module.exports = treeStore;
