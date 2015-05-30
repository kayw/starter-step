'use strict';

var fluxConstants = require('../constants/flux_const.js');
var appDispatcher = require('../dispatcher');

var PayLoadSources = fluxConstants.PayLoadSources;
var ActionTypes = fluxConstants.ActionTypes; 

appDispatcher.dispatch = appDispatcher.dispatch.bind(appDispatcher);

module.exports = {
    notifyClientChanges: function(socket, changeType, ownerInfo) {
        var changedInfo = {
            type: changeType,
            node: ownerInfo
        };
        socket.emit('change', changedInfo);
    },
    initSocketListener: function() {
        var ioconn = io.connect();
        ioconn.on('connect', function(socketio) {
            var socket = socketio || ioconn;
            socket.on('change', function(changedInfo) {
                setTimeout(function() {
                    appDispatcher.dispatch({
                        source: PayLoadSources.SERVER_ACTION,
                        action: { type: ActionTypes.CLEAR_PREVIOUS_MESSAGE }
                    });
                }, 1);
                var action = {
                    node: changedInfo.node
                };
                switch (changedInfo.type) {
                    case 'add':
                        action.type = ActionTypes.RECEIVE_CREATED_MESSAGE;
                        break;
                    case 'remove':
                        action.type = ActionTypes.RECEIVE_REMOVE_MESSAGE;
                        break;
                    case 'modified':
                        action.type = ActionTypes.RECEIVE_MODIFIED_MESSAGE;
                        break;
                    default:
                        break;
                }
                var payload = {
                    source: PayLoadSources.SERVER_ACTION,
                    action: action
                };
                setTimeout(function() {
                    appDispatcher.dispatch(payload);
                }, 1);// execute in new context to prevent from dispatch in the middle of dispatch  
            });
        });
    }
};
