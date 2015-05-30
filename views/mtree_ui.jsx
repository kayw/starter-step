'use strict';

var React = require('react');
var cx = require('classnames');

var treeStore = require('../stores/mtree_store.js');
var toggleActor = require('../actions/toggle_action.js');
var watchActor = require('../actions/watch_action.js');
var mtreeConst = require('../constants/mtree_const.js');
var ToggleTypes = mtreeConst.ToggleStateTypes;
var AnimationTypes = mtreeConst.AnimationTypes;

var MTreeUINode = React.createClass({
    render: function() {
        var thisNode = this.props.data;
        //console.log("rendering node:" + thisNode.text_);
        var childNodes = null;
        if (thisNode.toggleState_ === ToggleTypes.TOGGLE_OPEN) {
            childNodes = thisNode.children_.map(function(child,idx) {
                return (
                    <MTreeUINode key={child.id_}
                        data={child}
                        onSelect={this.props.onSelect}
                    />
                );
            }.bind(this));
        }

        var liCls = cx({
            'mtree-node': true,
            'mtree-leaf': thisNode.type_ === 'file',
            'mtree-loading': thisNode.toggleState_ === ToggleTypes.TOGGLE_LOADING,
            'mtree-open': thisNode.type_ === 'folder' && thisNode.toggleState_ === ToggleTypes.TOGGLE_OPEN,
            'mtree-closed': thisNode.type_ === 'folder' && thisNode.toggleState_ === ToggleTypes.TOGGLE_CLOSE,
            'mtree-animated': thisNode.animateState_ !== AnimationTypes.ANIMATE_NONE,
            'mtree-emerge': thisNode.animateState_ === AnimationTypes.ANIMATE_EMERGE,
            'mtree-modified': thisNode.animateState_ === AnimationTypes.ANIMATE_MODIFIED
        });

        var anchorCls = cx({
            'mtree-anchor': true,
            'mtree-selected': this.state.selected
        });
        var typeCls = cx({
            'mtree-icon': true,
            'mtree-folder': thisNode.type_ === 'folder',
            'mtree-file': thisNode.type_ === 'file'
        });
        return  (
            <ul className="mtree-ui-ul mtree-children">
                <li id={thisNode.id_} className={liCls}>
                    <i className="mtree-icon mtree-ocl" onClick={this.onCollapse}></i>
                    <a className={anchorCls} onClick={this.onSelect}>
                        <i className={typeCls}></i>
                        {thisNode.text_}
                    </a>
                    { childNodes }
                </li>
            </ul>
        );
    },

    componentWillUpdate: function() {
        console.log("componentWillUpdate");
    },
    componentDidUpdate: function() {
        console.log("componentDidUpdate");
    },
    getInitialState: function() {
        return { selected: false };
    },
    onCollapse: function(ev) {
        toggleActor.clickFolder(this.props.data);
        ev.preventDefault();
        ev.stopPropagation();
    },
    onSelect: function(ev) {
        this.props.data.animateState_ = AnimationTypes.ANIMATE_NONE;
        if (this.props.onSelect) {
            this.props.onSelect(this);
        }
        ev.preventDefault();
        ev.stopPropagation();
    }
});

function getState() {
    return {
        root: treeStore.getRootNode()
    };
}

var MTreeUI = React.createClass({
    render : function() {
        return (
            <div className="mtree-ui-panel mtree-default">
                    <MTreeUINode key={this.state.root.id_}
                        data={this.state.root}
                        onSelect={this.onSelect}
                    />
            </div>
        );
    },
    onSelect : function(node) {
        if (this.state.selectedNode &&  this.state.selectedNode.isMounted()) {
            this.state.selectedNode.setState({selected: false}); 
        }
        this.setState({selectedNode: node});
        node.setState({selected: true});
    },
    getInitialState: function() {
        return getState();
    },
    onChange : function() {
        this.setState(getState());
    },
    componentDidMount : function() {
        watchActor.initSocketListener();
        treeStore.addListener('change', this.onChange);
    },
    componentWillUnmount : function() {
        treeStore.removeListener('change', this.onChange);
    }
});

module.exports = MTreeUI;
