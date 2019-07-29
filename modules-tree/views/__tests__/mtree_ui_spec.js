'use strict';
jest.dontMock('../../stores/mtree_store.js');
jest.dontMock('../mtree_ui.jsx');

describe('MTreeUI spec', function() {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;
    var MTreeConst = require('../../constants/mtree_const.js'); 
    var ToggleTypes = MTreeConst.ToggleStateTypes;
    var AnimationTypes = MTreeConst.AnimationTypes;
    var MTreeUI;
    var MTreeStore;
    beforeEach(function() {
        MTreeUI = require('../mtree_ui.jsx'); 
        MTreeStore = require('../../stores/mtree_store.js');
    });

    it('empty root', function() {
         var tree = {
             cnt_: 0,
             root_: {
             }
         };
         MTreeStore.setData(tree);
         var mtreeui = TestUtils.renderIntoDocument(
            <MTreeUI />);
         var treePanel = TestUtils.findRenderedDOMComponentWithClass(mtreeui, 'mtree-ui-panel');
         expect(treePanel.getDOMNode().textContent).toEqual('');
    });

    it('root with 2 different toggle animate state children', function() {
        var tree = {
            cnt_: 3,
            root_: {
                id_: 0, 
                type_: 'folder',
                text_: 'R',
                toggleState_: ToggleTypes.TOGGLE_OPEN,
                animateState_: AnimationTypes.ANIMATE_NONE,
                children_: [{
                    id_: 1, 
                    type_: 'folder',
                    text_: 'N1',
                    toggleState_: ToggleTypes.TOGGLE_CLOSE,
                    animateState_: AnimationTypes.ANIMATE_EMERGE
                }, {
                    id_: 2, 
                    type_: 'file',
                    text_: 'N2',
                    toggleState_: ToggleTypes.TOGGLE_CLOSE,
                    animateState_: AnimationTypes.ANIMATE_MODIFIED
                }]
            }
        };
        MTreeStore.setData(tree);
        var mtreeui = TestUtils.renderIntoDocument(<MTreeUI />);
        var folderTypeNodes = TestUtils.scryRenderedDOMComponentsWithClass(mtreeui, 'mtree-folder');
        var emergedNodes = TestUtils.scryRenderedDOMComponentsWithClass(mtreeui,'mtree-emerge');
        var openedNodes = TestUtils.scryRenderedDOMComponentsWithClass(mtreeui, 'mtree-open');
        expect(folderTypeNodes.length).toEqual(2);
        expect(emergedNodes.length).toEqual(1);
        expect(openedNodes.length).toEqual(1);
    });
});
