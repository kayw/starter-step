/** @jsx DOM */
//http://www.gumtree.com/devteam/2014-12-12-creating-a-treeview-using-reactjs.html
//http://codepen.io/anon/pen/Ftkln?editors=011
//
//http://jsfiddle.net/xx8mw/83/
var TreeView = React.createClass({
    getInitialState: function() {
        return {data: {}};
    },
    componentDidMount: function() {
        this.setState({data: this.props.data});
    },
    onNodeSelect: function(node) {
        var selectNode = this.state.selectedNode;
        if (selectNode && selectNode.isMounted() ) {
           selectNode.setState({selected: false}); 
        }
        this.setState({selectedNode: node});
        node.setState({selected: true});
        if (this.props.onNodeSelect) {
            this.props.onNodeSelect(node);
        }
    },
    render: function() {
        return (
            <div className="tree-panel panel-default">
                <div className="panel-body">
                    <ul className="ui-tree">
                        <TreeNode key={this.props.data.id}
                            data={this.props.data}
                            onNodeSelect={this.onNodeSelect} />
                    </ul>
                </div>
            </div>
        );
    }
});
var TreeNode = React.createClass({
    getInitialState: function() {
        return { 
            children: [],
            selected: false
        };
    },
    onChildToggle: function(ev) {
        if (this.props.data.children) {
            var toggled = this.state.children && this.state.children.length;
            if (toggled) {
                this.setState({children: null});//for memory gc consideration??
            }
            else {//untoggled
                childlist = this.props.data.children;
                this.setState({children: childlist});
            }
        }
        ev.preventDefault();
        ev.stopPropagation();
    },
    onNodeSelect: function(ev) {
        if (this.props.onNodeSelect) {
            this.props.onNodeSelect(this);
        }
        ev.preventDefault();
        ev.stopPropagation();
    },
    render: function() {
        if (!this.state.children) {
            this.state.children = [];
        }
        var classNames = React.addons.classSet({
            'has-children': (this.props.data.children ? true : false),
            'open': (this.state.children.length ? true : false),
            'closed': (this.state.children ? false : true),
            'selected': (this.state.selected ? true : false)
        });
        return (
            <li ref="node" className={classNames}
                onClick={this.onChildToggle}>
                <a data-id={this.props.data.id} onClick={this.onNodeSelect}>
                    {this.props.data.name}
                </a>
                <ul>
                    {this.state.children.map(function(child) {
                        return <TreeNode key={child.id} data={child} />;
                    }.bind(this))
                    }
                </ul>
            </li>
        );
    }
});

// improve
// https://github.com/pqx/react-ui-tree
