'use strict';

var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        RECEIVE_MODIFIED_MESSAGE: null,
        RECEIVE_REMOVE_MESSAGE: null,
        RECEIVE_CREATED_MESSAGE: null,
        CLOSE_FOLDER: null,
        OPEN_FOLDER: null,
        LOADING_FOLDER_CHILDREN: null
    }),
    
    PayLoadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    })
};
