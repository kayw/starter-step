'use strict';

var Dispatcher = require('flux').Dispatcher;
var appDispatcher = new Dispatcher();

//todo remove this
var mtreeConstants = require('../constants/mtree_const.js');
var PayLoadSources = mtreeConstants.PayLoadSources;

appDispatcher.handleViewAction = function(action) {//ajax response todo
    var payload = {
        source: PayLoadSources.VIEW_ACTION,
        action: action
    };
    appDispatcher.dispatch(payload);
};

module.exports = appDispatcher;
