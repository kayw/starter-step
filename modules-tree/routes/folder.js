'use strict';
var express = require('express');
var fs = require('fs');
var path = require('path');
var g = require('../utils/globals.js');
var router = express.Router();

router.get('/:folder*', function(req, res, next) {
    var resp = {
        parentPath: req.originalUrl.substr(req.baseUrl.length+1),//req.params.folder,
        children: []
    };
    var p = path.join(g.ModulesDir(), resp.parentPath);
    fs.readdir(p, function(err, files) {
        g.onFileEnumerated(err, files, p, resp.children);
        res.json(resp);
    });
});

module.exports = router;
