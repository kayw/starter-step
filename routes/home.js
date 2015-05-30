'use strict';
var express = require('express');
var fs = require('fs');
var g = require('../utils/globals.js');
var treeStore = require('../stores/mtree_store.js');
var MTree = require('../models/mtree.js');

var router = express.Router();
var servedDir = g.ModulesDir();

router.get('/', function(req, res, next) {
    var tree = new MTree({name: 'Modules', type: 'folder' });
    var fileNodes = [];
    fs.readdir(servedDir, function(err, files) {
        g.onFileEnumerated(err, files,servedDir, fileNodes);
        fileNodes.forEach(function(elem) {
            tree.insert(elem.name, elem.type, elem.path, tree.root_.id_);
        });
        tree.root_.setChildrenLoaded();
        treeStore.setData(tree);
        var data = {
            title: 'modules tree app'
        };
        res.render('html', {data : data});
    });
});

module.exports = router;
