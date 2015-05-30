'use strict';

var fluxConstants = require('../constants/flux_const.js');
var appDispatcher = require('../dispatcher');

var PayLoadSources = fluxConstants.PayLoadSources;
var ActionTypes = fluxConstants.ActionTypes; 

module.exports = {
    clickFolder: function(folderNode) {
        if (!folderNode) {
            return;
        }
        var action = {
        };
        if (folderNode.getChildrenLoaded() === false) { // if there is no children nodes in current folder, load the data
            action.type = ActionTypes.LOADING_FOLDER_CHILDREN;
            action.folderNode = folderNode;
        }
        else {
            // if all the children nodes are hidden, we show them otherwise hide the node
            // otherwise show/hide the loaded children
            action.type =  ActionTypes.TOGGLE_FOLDER;
            action.folderId = folderNode.id_;
        }
        var payload = {
            source: PayLoadSources.VIEW_ACTION,
            action: action
        };
        appDispatcher.dispatch(payload);
    },
};
