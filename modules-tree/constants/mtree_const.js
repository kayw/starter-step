'use strict';

var keyMirror = require('keymirror');

module.exports = {
    AnimationTypes: keyMirror({
        ANIMATE_NONE: null,
        ANIMATE_EMERGE: null,
        ANIMATE_MODIFIED: null
    }),
    
    ToggleStateTypes: keyMirror({
        TOGGLE_NONE: null,
        TOGGLE_OPEN: null,
        TOGGLE_LOADING: null,
        TOGGLE_CLOSE: null
    })
};
