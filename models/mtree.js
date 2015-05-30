'use strict';

function MTreeNode(id, data) {
    this.id_ = id;
    this.text_ = data.name || 'Root';
    this.type_ = data.type || 'file';
    this.relPath_ = data.path || ''; // relative path modules
    this.children_ = [];

    this.isEmerged_ = false;// can be useful for view animation todo
    this.isModified_ = false;

    this.isVisible_ = true;
    this.isOpen_ = false;
    this.isLoading_ = false;
}

MTreeNode.prototype.hasVisibleChild = function() {
    return this.children_.some(function(elem) {
        return elem.isVisible_;
    });
};

function MTree(data) {
    this.cnt_ = 0;
    this.root_ = new MTreeNode(this.cnt_++, data);
    this.root_.isOpen_ = true;
    this.pathIndexes_ = {};
    this.pathIndexes_[this.root_.relPath_] = this.root_.id_;
    this.idIndexes_ = {};
    this.idIndexes_[this.root_.id_] = this.root_;
    //this.pathIndexes_ = {this.root_.relPath_ : this.root_.id_ };
    //this.idIndexes_ = { this.root_.id_ : this.root_};
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

proto.insert = function(name, parentId, type, path, emerged) {
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
    node.isEmerged_ = emerged || false;
};

proto.update = function(name, type, path) {
    var exist = false;
    var node = this.getNodeByPath(path);
    if (node) {
        node.text = name;
        node.type = type;
        node.isModified_ = true;
        exist = true;
    }
    return exist;
};

proto.remove = function(path, parentPath) {
    var currNode = this.getNodeByPath(path);
    var removed = false;
    if (currNode) {
        currNode.children_.forEach(function(elem) {
            this.remove(elem.path_, currNode.path_); //todo debug
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

proto.getNodeIdByPath = function(path) {
    var id = null;
    if (path in this.pathIndexes_) {
        id = this.pathIndexes_[path];
    }
    return id;
};

module.exports = MTree;
