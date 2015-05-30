'use strict';

var mtreeConstants = require('../constants/mtree_const.js');
var appDispatcher = require('../dispatcher');

var PayLoadSources = mtreeConstants.PayLoadSources;
var ActionTypes = mtreeConstants.ActionTypes; 

module.exports = {
    clickFolder: function(folderNode) {
        if (!folderNode) {
            return;
        }
        var action = {
        };
        if (folderNode.children_.length === 0) { // if there is no children nodes in current folder, load the data
            action.type = ActionTypes.LOADING_FOLDER_CHILDREN;
            action.folderNode = folderNode;
        }
        else {
            // if all the children nodes are hidden, we show them otherwise hide the node
            action.type = folderNode.hasVisibleChild() ? ActionTypes.CLOSE_FOLDER : ActionTypes.OPEN_FOLDER;
            action.folderId = folderNode.id_;
        }
        var payload = {
            source: PayLoadSources.VIEW_ACTION,
            action: action
        };
        appDispatcher.dispatch(payload);
    },
};
