'use strict';
jest.dontMock('../mtree.js');

describe('mtree model spec', function() {
    var MTree = require('../mtree.js');
    var cmtree = new MTree({name: 'a'});
    it('insert new node', function() {
        cmtree.insert('b', '', 'bpath', cmtree.root_.id_);
        expect(cmtree.getNodeById(1).text_).toEqual('b');
    });

    it('update b node', function() {
        cmtree.update('bu', 'file', 'bpath');
        expect(cmtree.getNodeByPath('bpath').text_).toEqual('bu');
    });

    it('remove b node & its children', function() {
        cmtree.insert('c', '', 'cpath', cmtree.root_.id_);
        cmtree.insert('b1', '', 'b1path', 1);
        cmtree.insert('b2', '', 'b2path', 1);
        cmtree.remove('bpath', '');
        expect(cmtree.root_.children_.length).toEqual(1);
        expect(cmtree.root_.children_[0].text_).toEqual('c');
    });
});
