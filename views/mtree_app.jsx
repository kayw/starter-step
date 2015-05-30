'use strict';
var React = require('react');
var MTree = require('../models/mtree.js');
var MTreeUI = require('./mtree_ui.jsx');
var treeStore = require('../stores/mtree_store.js');

module.exports = function (data, containerId) {
    var buildMTreeFromData = function() {
        var tree = new MTree({name: data.root_.text_, type: data.root_.type_, path: data.root_.relPath_ });
        for (var i = 0, len = data.root_.children_.length; i < len; i++) {
            var child = data.root_.children_[i];
            tree.insert(child.text_, child.type_, child.relPath_, tree.root_.id_);
        }
        tree.root_.setChildrenLoaded();
        return tree;
    };
    treeStore.setData(buildMTreeFromData());
    //treeStore.setData(new MTree(data));
    var container = document.getElementById(containerId || 'content');
    React.render(
        <MTreeUI />,
        container
    );
};
