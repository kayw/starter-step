'use strict';

var mtreeConst = require('../constants/mtree_const.js');
var ToggleTypes = mtreeConst.ToggleStateTypes;
var AnimationTypes = mtreeConst.AnimationTypes;
function MTreeNode(id, data) {
    this.id_ = id;
    this.text_ = data.name || 'Root';
    this.type_ = data.type || 'file';
    this.relPath_ = data.path || ''; // relative to the toplevel module path
    this.children_ = [];

    this.toggleState_ = ToggleTypes.TOGGLE_CLOSE;
    this.animateState_ = AnimationTypes.ANIMATE_NONE;
    this.childrenLoaded_ = false;
}

MTreeNode.prototype.getChildrenLoaded = function() {
    return this.childrenLoaded_;
};

MTreeNode.prototype.setChildrenLoaded = function() {
    this.childrenLoaded_ = true;
};

function MTree(data) {
    this.cnt_ = 0;
    this.root_ = new MTreeNode(this.cnt_++, data);
    this.root_.toggleState_ = ToggleTypes.TOGGLE_OPEN;
    this.pathIndexes_ = {};
    this.pathIndexes_[this.root_.relPath_] = this.root_.id_;
    this.idIndexes_ = {};
    this.idIndexes_[this.root_.id_] = this.root_;
}

var proto = MTree.prototype;

proto.getNodeByPath = function(path) {
    if (path in this.pathIndexes_) {
        var id = this.pathIndexes_[path];
        return this.getNodeById(id);
    }
    return null;
};

proto.getNodeById = function(id) {
    if (id in this.idIndexes_) {
        return this.idIndexes_[id];
    }
    else {
        return null;
    }
};

proto.getNodeIdByPath = function(path) {
    var id = null;
    if (path in this.pathIndexes_) {
        id = this.pathIndexes_[path];
    }
    return id;
};

proto.insert = function(name,  type, path, parentId) {
    var node = new MTreeNode(this.cnt_++ , {
        name: name,
        path: path,
        type: type
    });
    var parentNode = this.idIndexes_[parentId];
    if (parentNode) {
        parentNode.children_.push(node);
    }
    this.idIndexes_[node.id_] = node;
    this.pathIndexes_[node.relPath_] = node.id_;
    return node;
};

proto.update = function(name, type, path) {
    var node = this.getNodeByPath(path);
    if (node) {
        node.text = name;
        node.type = type;
    }
    return node;
};

proto.remove = function(path, parentPath) {
    var currNode = this.getNodeByPath(path);
    var removed = false;
    if (currNode) {
        currNode.children_.forEach(function(elem) {
            this.remove(elem.path_, currNode.path_); 
        });
        var parentNode = this.getNodeByPath(parentPath);
        for (var i = parentNode.children_.length; i--;) {
            if (currNode === parentNode.children_[i]) {
                parentNode.children_.splice(i, 1);
                delete this.idIndexes_[currNode.id_];
                delete this.pathIndexes_[currNode.relPath_];
                removed = true;
                break;
            }
        }
    }
    return removed;
};

module.exports = MTree;
