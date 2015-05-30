'use strict';
var _ = require('lodash');

var appDispatcher = require('../dispatcher');

var fluxConstants = require('../constants/flux_const.js');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = fluxConstants.ActionTypes; 

var mtreeConst = require('../constants/mtree_const.js');
var ToggleTypes = mtreeConst.ToggleStateTypes;
var AnimationTypes = mtreeConst.AnimationTypes;

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
            var node = tree.insert(node.name, node.type, node.path, parentId);
            node.animateState_ = AnimationTypes.ANIMATE_EMERGE;
            exist = true;
        }
        return exist;
    },

    onNodeModified : function(node) {
        var updated = false;
        var updatedNode = tree.update(node.name, node.type, node.path);
        if (updatedNode) {
            updatedNode.animateState_ = AnimationTypes.ANIMATE_MODIFIED;
            updated = true;
        }
        return updated;
    },
    onNodeRemove : function(node) {
        var removed = tree.remove(node.path, node.parentPath);
        return removed;
    },
    onToggleFolder : function(folderId) {
        var folder = tree.getNodeById(folderId);
        // if all the children nodes are hidden, show them otherwise hide
        if (folder.toggleState_ == ToggleTypes.TOGGLE_OPEN) {
            folder.toggleState_ = ToggleTypes.TOGGLE_CLOSE;
        } 
        else if (folder.toggleState_ == ToggleTypes.TOGGLE_CLOSE) {
            folder.toggleState_ = ToggleTypes.TOGGLE_OPEN;
        }
    },
    onFolderChildrenLoaded : function(err, res) {
        if (res.ok) {
            var parentPath = res.body.parentPath;
            var parentId = tree.getNodeIdByPath(parentPath);
            var parent = tree.getNodeById(parentId);
            parent.toggleState_ = ToggleTypes.TOGGLE_OPEN;
            res.body.children.forEach(function(elem) {
                tree.insert(elem.name, elem.type, elem.path, parentId);
            });
            parent.setChildrenLoaded();
            treeStore.emitChange();
        }
        else {
            console.log('error happend in get folder:' + res.text);
        }
    },
    onFolderChildrenLoading : function(folderNode) {
        request.get('/folder/' + folderNode.relPath_).end(this.onFolderChildrenLoaded);
        //for simplicity fire & process respone in the store not in another action
        folderNode.toggleState_ = ToggleTypes.TOGGLE_LOADING;
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
        case ActionTypes.RECEIVE_CREATED_MESSAGE:
            needEmit = treeStore.onNodeCreated(payload.action.node);
            break;

        case ActionTypes.RECEIVE_REMOVE_MESSAGE:
            needEmit = treeStore.onNodeRemove(payload.action.node);
            break;

        case ActionTypes.RECEIVE_MODIFIED_MESSAGE:
            needEmit = treeStore.onNodeModified(payload.action.node);
            console.log("RECEIVE_MODIFIED_MESSAGE:", payload.action.node.name);
            break;

        case ActionTypes.TOGGLE_FOLDER:
            treeStore.onToggleFolder(payload.action.folderId);
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
