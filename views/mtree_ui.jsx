'use strict';

var React = require('react');
var cx = require('classnames');

var treeStore = require('../stores/mtree_store.js');
var toggleActor = require('../actions/toggle_action.js');
var watchActor = require('../actions/watch_action.js');

var MTreeUINode = React.createClass({
    render: function() {

        var thisNode = this.props.data;
        var childNodes = thisNode.children_.map(function(child,idx) {
            if (child.isVisible_) {
                return(
                        <MTreeUINode key={child.id_}
                            data={child}
                            onSelect={this.props.onSelect}
                        />
                );
            }
        }.bind(this)
            );

            var liCls = cx({
                'mtree-node': true,
                'mtree-leaf': thisNode.type_ === 'file',
                'mtree-loading': thisNode.isLoading_ ,
                'mtree-open': thisNode.type_ === 'folder' && !thisNode.isLoading_ && thisNode.isOpen_,
                'mtree-closed': thisNode.type_ === 'folder' && !thisNode.isLoading_ && !thisNode.isOpen_,
                'mtree-animated': thisNode.isEmerged_ || thisNode.isModified_,
                'mtree-emerge': thisNode.isEmerged_,
                'mtree-modified': thisNode.isModified_
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

    getInitialState: function() {
        return { selected: false };
    },
    onCollapse: function(ev) {
        toggleActor.clickFolder(this.props.data);
        ev.preventDefault();
        ev.stopPropagation();
    },
    onSelect: function(ev) {
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
